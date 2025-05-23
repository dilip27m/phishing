from flask import Flask, request, jsonify

from flask_cors import CORS

import sqlite3
import datetime
import re
# urllib.parse.urlunparse is NOT needed by the new remove_slug.
from urllib.parse import urlparse

import joblib

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [ "http://localhost:3000", "chrome-extension://*"]}})


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
    phishing_model = None
except Exception as e:
    print(f"🚨 ERROR loading ML model '{XGB_MODEL_FILENAME}': {e}")
    phishing_model = None

try:
    tfidf_vectorizer = joblib.load(TFIDF_VECTORIZER_FILENAME)
    print(f"✅ Successfully loaded TF-IDF vectorizer: {TFIDF_VECTORIZER_FILENAME}")
except FileNotFoundError:
    print(f"🚨 WARNING: TF-IDF vectorizer file '{TFIDF_VECTORIZER_FILENAME}' not found. ML prediction will fail.")
    tfidf_vectorizer = None
except Exception as e:
    print(f"🚨 ERROR loading TF-IDF vectorizer '{TFIDF_VECTORIZER_FILENAME}': {e}")
    tfidf_vectorizer = None

if phishing_model and tfidf_vectorizer:
    ml_components_loaded = True


# --- YOUR NEW remove_slug/URL PREPROCESSING FUNCTION ---
def preprocess_url_for_ml(url_string): # Renamed for clarity of purpose
    """
    Keeps up to the first two path segments of a URL.
    Example: "https://www.hotstar.com/in/sports/cricket/rcb-vs-srh/..."
    becomes "https://www.hotstar.com/in/sports"
    """
    try:
        parsed = urlparse(url_string)
        
        # Ensure scheme and netloc are present, otherwise it's not a standard web URL
        if not parsed.scheme or not parsed.netloc:
            print(f"preprocess_url_for_ml: Non-standard URL '{url_string}', returning as is for TF-IDF.")
            return url_string # Or return an empty string/specific token if preferred for non-standard URLs

        path_segments = [seg for seg in parsed.path.strip('/').split('/') if seg] # Get non-empty path segments
        
        # Keep up to the first 2 segments
        if len(path_segments) >= 2:
            trimmed_path = '/' + '/'.join(path_segments[:2])
        elif len(path_segments) == 1:
            trimmed_path = '/' + path_segments[0]
        else: # No path segments or only '/'
            trimmed_path = '/' 
            if parsed.path == "" : # if original path was empty (e.g. http://domain.com)
                trimmed_path = "" # make processed path also empty for consistency if needed

        # Reconstruct the base URL: scheme://netloc/trimmed_path
        # If trimmed_path is just "/", scheme://netloc/ is fine.
        # If trimmed_path is empty (for http://domain.com), we want scheme://netloc
        base_url = f"{parsed.scheme}://{parsed.netloc}{trimmed_path if trimmed_path != '/' or (trimmed_path == '/' and path_segments) else ''}"
        
        # Handle case where original URL was just "http://domain.com" (no path, no trailing slash)
        # and trimmed_path became "", so base_url is "http://domain.com"
        # If original was "http://domain.com/", trimmed_path becomes "/", base_url is "http://domain.com/"
        if not path_segments and parsed.path == "": # Original URL was like "http://domain.com"
             base_url = f"{parsed.scheme}://{parsed.netloc}"


        print(f"preprocess_url_for_ml: Original='{url_string}', Processed='{base_url}'")
        return base_url
    except Exception as e:
        print(f"Error in preprocess_url_for_ml for '{url_string}': {e}. Returning original URL.")
        return url_string # Fallback


# --- Feature Extraction Function using TF-IDF ---
def extract_features_for_ml(url_string):
    """
    First applies preprocess_url_for_ml, then transforms the modified URL string
    into TF-IDF features using the loaded vectorizer.
    """
    if not tfidf_vectorizer:
        raise ValueError("TF-IDF vectorizer is not loaded. Cannot extract features.")

    # --- STEP 1: Apply your new URL preprocessing function ---
    processed_url = preprocess_url_for_ml(url_string)

    # --- STEP 2: Vectorize the processed URL ---
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
        url_to_scan_original = data.get('url')

        if not url_to_scan_original:
            return jsonify({'error': 'URL is required'}), 400

        is_phishing_final = 0
        confidence_final = 0.0 # This will store the probability (0.0 to 1.0)
        message = "URL analysis pending."
        rule_triggered_phishing = False

        # --- RULE 1: HTTP is Phishing ---
        if url_to_scan_original.lower().startswith("http://"):
            is_phishing_final = 1
            confidence_final = 0.90 # Assign high phishing probability for HTTP rule
            message = "Detected as phishing due to insecure HTTP."
            rule_triggered_phishing = True
            print(f"Rule Triggered: URL '{url_to_scan_original}' uses HTTP. Marked as phishing.")

        # --- ML Prediction (only if no rule has already flagged it as phishing) ---
        if not rule_triggered_phishing and ml_components_loaded:
            try:
                features = extract_features_for_ml(url_to_scan_original)
                
                prediction_proba = phishing_model.predict_proba(features)
                ml_phishing_probability = float(prediction_proba[0][1]) # This is the raw probability (0.0 to 1.0)

                # --- Phishing if probability > 0.6 (60%) ---
                # So, 0.6000 is safe, 0.6000001 is phishing
                PHISHING_THRESHOLD_ML = 0.6 
                ml_is_phishing = 1 if ml_phishing_probability > PHISHING_THRESHOLD_ML else 0
                
                is_phishing_final = ml_is_phishing
                confidence_final = ml_phishing_probability # Report ML's actual probability
                
                if ml_is_phishing == 1:
                    message = f"Detected as phishing by ML model (Probability > {PHISHING_THRESHOLD_ML*100}%)."
                else:
                    message = f"Classified as safe by ML model (Probability <= {PHISHING_THRESHOLD_ML*100}%)."
                # Print the original URL for correlation with preprocessing logs
                print(f"ML Prediction for original URL '{url_to_scan_original}': Phishing={bool(ml_is_phishing)}, Raw Probability={ml_phishing_probability:.6f}")

            except ValueError as ve:
                print(f"🚨 Error during feature extraction for '{url_to_scan_original}': {ve}")
                message = f"ML Error: {ve}. Defaulting to safe."
                # is_phishing_final, confidence_final remain 0, 0.0
            except Exception as e:
                print(f"🚨 Error during ML prediction for '{url_to_scan_original}': {e}")
                message = f"Error in ML prediction: {e}. Defaulting to safe."
                # is_phishing_final, confidence_final remain 0, 0.0
        
        elif not rule_triggered_phishing and not ml_components_loaded:
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
            (url_to_scan_original, is_phishing_final, confidence_final) # confidence_final is the probability
        )
        conn.commit()
        conn.close()

        return jsonify({
            'url': url_to_scan_original,
            'is_phishing': bool(is_phishing_final),
            'confidence': confidence_final, # This is the raw probability from ML or rule
            'risk_level': 'HIGH' if confidence_final > 0.7 else ('MEDIUM' if confidence_final > 0.4 else 'LOW'), # Risk level based on probability
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

        scans = [
            {
                'id': row[0],
                'url': row[1],
                'is_phishing': bool(row[2]),
                'confidence': row[3],
                'timestamp': row[4]
            }
            for row in rows
        ]

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