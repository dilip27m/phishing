from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import re
# Make sure to import urlunparse for your remove_slug function
from urllib.parse import urlparse, urlunparse

import joblib

app = Flask(__name__)
CORS(app)

# --- Load Your ML Model and Vectorizer ---
XGB_MODEL_FILENAME = 'xgb_model.pkl'
TFIDF_VECTORIZER_FILENAME = 'tfidf_vectorizer.pkl'

phishing_model = None
tfidf_vectorizer = None
ml_components_loaded = False # Flag to check if models loaded successfully

try:
    phishing_model = joblib.load(XGB_MODEL_FILENAME)
    print(f"✅ Successfully loaded ML model: {XGB_MODEL_FILENAME}")
except FileNotFoundError:
    print(f"🚨 WARNING: Model file '{XGB_MODEL_FILENAME}' not found. API will not use ML for prediction.")
    phishing_model = None # Ensure it's None
except Exception as e:
    print(f"🚨 ERROR loading ML model '{XGB_MODEL_FILENAME}': {e}")
    phishing_model = None # Ensure it's None

try:
    tfidf_vectorizer = joblib.load(TFIDF_VECTORIZER_FILENAME)
    print(f"✅ Successfully loaded TF-IDF vectorizer: {TFIDF_VECTORIZER_FILENAME}")
except FileNotFoundError:
    print(f"🚨 WARNING: TF-IDF vectorizer file '{TFIDF_VECTORIZER_FILENAME}' not found. ML prediction will fail.")
    tfidf_vectorizer = None # Ensure it's None
except Exception as e:
    print(f"🚨 ERROR loading TF-IDF vectorizer '{TFIDF_VECTORIZER_FILENAME}': {e}")
    tfidf_vectorizer = None # Ensure it's None

if phishing_model and tfidf_vectorizer:
    ml_components_loaded = True


# --- YOUR remove_slug FUNCTION (as provided) ---
def remove_slug(url_string):
    """Keeps only the first path segment of the URL and removes query/fragment."""
    try:
        parsed = urlparse(url_string)
        path = parsed.path if parsed.path else "/"
        path_segments = [seg for seg in path.split('/') if seg]

        if len(path_segments) > 0:
            base_path_segments = path_segments[:1] # Keeps only the first segment
            base_path = '/' + '/'.join(base_path_segments)
            if not base_path_segments:
                base_path = '/'
        elif path == "/" or not path:
            base_path = '/'
        else:
            base_path = path

        cleaned_url = urlunparse((
            parsed.scheme,
            parsed.netloc,
            base_path,
            '',  # params
            '',  # query
            ''   # fragment
        ))
        print(f"remove_slug: Original='{url_string}', Cleaned='{cleaned_url}'")
        return cleaned_url
    except Exception as e:
        print(f"Error in remove_slug for '{url_string}': {e}. Returning original URL.")
        return url_string


# --- Feature Extraction Function using TF-IDF ---
def extract_features_for_ml(url_string):
    if not tfidf_vectorizer:
        raise ValueError("TF-IDF vectorizer is not loaded. Cannot extract features.")
    processed_url = remove_slug(url_string)
    url_features = tfidf_vectorizer.transform([processed_url])
    return url_features


@app.route('/')
def home():
    return """
    <h1>Phishing Detection API (ML Powered - XGBoost + TF-IDF)</h1>
    <p>Available endpoints:</p>
    <ul>
        <li><a href="/api/test">/api/test</a> - Test endpoint</li>
        <li><a href="/api/stats">/api/stats</a> - Get scan statistics</li>
        <li>POST /api/scan-url - Scan a URL (use Postman/curl)</li>
        <li><a href="/api/recent">/api/recent</a> - Get recent scans</li>
    </ul>
    """

def init_db():
    conn = sqlite3.connect('phishing_stats.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL,
            is_phishing INTEGER NOT NULL,
            confidence REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/scan-url', methods=['POST'])
def scan_url():
    try:
        data = request.get_json()
        url_to_scan_original = data.get('url') # Use a distinct variable for the original URL

        if not url_to_scan_original:
            return jsonify({'error': 'URL is required'}), 400

        is_phishing_final = 0
        confidence_final = 0.0
        message = "URL analysis pending."
        rule_triggered = False # General flag for any rule that makes a final decision

        # --- RULE 1: Whitelist phishtank.org ---
        # This rule should take highest precedence.
        try:
            parsed_original = urlparse(url_to_scan_original.lower())
            if parsed_original.hostname == 'phishtank.org' or \
               (parsed_original.hostname and parsed_original.hostname.endswith('.phishtank.org')):
                is_phishing_final = 0 # Safe
                confidence_final = 0.01 # Very low phishing probability (high safe confidence)
                message = "URL whitelisted (phishtank.org)."
                rule_triggered = True
                print(f"Rule Triggered: URL '{url_to_scan_original}' is from phishtank.org. Marked as safe.")
        except Exception as e:
            print(f"Error during phishtank.org whitelist check for '{url_to_scan_original}': {e}")
            # Continue, as this rule might not apply or failed on a malformed URL

        # --- RULE 2: HTTP is Phishing (only if not whitelisted) ---
        if not rule_triggered and url_to_scan_original.lower().startswith("http://"):
            is_phishing_final = 1 # Phishing
            confidence_final = 0.90 # Assign high phishing probability for HTTP rule
            message = "Detected as phishing due to insecure HTTP."
            rule_triggered = True
            print(f"Rule Triggered: URL '{url_to_scan_original}' uses HTTP. Marked as phishing.")

        # --- ML Prediction (only if no rule has already made a final decision) ---
        if not rule_triggered and ml_components_loaded:
            try:
                features = extract_features_for_ml(url_to_scan_original)
                
                prediction_proba = phishing_model.predict_proba(features)
                ml_confidence_score = float(prediction_proba[0][1])

                PHISHING_THRESHOLD = 0.5 # Using the 0.5 threshold from your provided app.py
                ml_is_phishing = 1 if ml_confidence_score >= PHISHING_THRESHOLD else 0
                
                is_phishing_final = ml_is_phishing
                confidence_final = ml_confidence_score 
                
                if ml_is_phishing == 1:
                    message = f"Detected as phishing by ML model."
                else:
                    message = f"Classified as safe by ML model."
                print(f"ML Prediction for original URL '{url_to_scan_original}': Phishing={bool(ml_is_phishing)}, Confidence={ml_confidence_score:.4f}")

            except ValueError as ve:
                print(f"🚨 Error during feature extraction for '{url_to_scan_original}': {ve}")
                message = f"ML Error: {ve}. Defaulting to safe."
                # is_phishing_final, confidence_final remain 0, 0.0
            except Exception as e:
                print(f"🚨 Error during ML prediction for '{url_to_scan_original}': {e}")
                message = f"Error in ML prediction: {e}. Defaulting to safe."
                # is_phishing_final, confidence_final remain 0, 0.0
        
        elif not rule_triggered and not ml_components_loaded:
            missing_msg_parts = ["model" if not phishing_model else None, "vectorizer" if not tfidf_vectorizer else None]
            missing_msg_parts = [comp for comp in missing_msg_parts if comp]
            print(f"ML component(s) ({', '.join(missing_msg_parts)}) not available for '{url_to_scan_original}'. Using basic fallback.")
            is_phishing_final = 1 if "login-update-secure" in url_to_scan_original.lower() else 0 
            confidence_final = 0.75 if is_phishing_final else 0.1
            message = f"Fallback: Basic check (ML {', '.join(missing_msg_parts)} unavailable)"
        
        conn = sqlite3.connect('phishing_stats.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO scans (url, is_phishing, confidence) VALUES (?, ?, ?)',
            (url_to_scan_original, is_phishing_final, confidence_final)
        )
        conn.commit()
        conn.close()

        return jsonify({
            'url': url_to_scan_original,
            'is_phishing': bool(is_phishing_final),
            'confidence': confidence_final,
            'risk_level': 'HIGH' if confidence_final > 0.7 else ('MEDIUM' if confidence_final > 0.4 else 'LOW'),
            'message': message
        })

    except Exception as e:
        print(f"🚨 Error in /api/scan-url: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        conn = sqlite3.connect('phishing_stats.db')
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM scans')
        total_scans = cursor.fetchone()[0]
        cursor.execute('SELECT COUNT(*) FROM scans WHERE is_phishing = 1')
        phishing_detected = cursor.fetchone()[0]
        conn.close()
        return jsonify({
            'total_scans': total_scans,
            'phishing_detected': phishing_detected,
            'safe_scans': total_scans - phishing_detected
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test', methods=['GET'])
def test():
    model_status = "Loaded" if phishing_model else "Not Loaded"
    vectorizer_status = "Loaded" if tfidf_vectorizer else "Not Loaded"
    overall_ml_status = "Ready" if ml_components_loaded else "Problem with loading components"
    return jsonify({
        'message': 'Backend is working!',
        'status': 'success',
        'ml_model_status': model_status,
        'tfidf_vectorizer_status': vectorizer_status,
        'overall_ml_components_loaded': ml_components_loaded
    })
    
@app.route('/api/recent', methods=['GET'])
def get_recent_scans():
    try:
        conn = sqlite3.connect('phishing_stats.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, url, is_phishing, confidence, timestamp
            FROM scans
            ORDER BY timestamp DESC
            LIMIT 20
        ''')
        rows = cursor.fetchall()
        conn.close()
        scans = [{'id': row[0], 'url': row[1], 'is_phishing': bool(row[2]),
                  'confidence': row[3], 'timestamp': row[4]} for row in rows]
        return jsonify({'scans': scans})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    print("🚀 Flask backend starting...")
    if not ml_components_loaded:
        print("⚠️ CAUTION: ML components (model and/or vectorizer) failed to load. Fallback will be used.")
    print("📡 API available at: http://localhost:5000")
    app.run(debug=True, port=5000)