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


# --- YOUR remove_slug FUNCTION ---
def remove_slug(url_string): # Changed parameter name for consistency
    """Removes the last segment (slug) from the URL's path and query/fragment."""
    try:
        parsed = urlparse(url_string)
        # Ensure path is not None and handle leading/trailing slashes consistently
        path = parsed.path if parsed.path else "/"
        # Split path into segments, filtering out empty strings that arise from multiple slashes or leading/trailing slashes
        path_segments = [seg for seg in path.split('/') if seg]

        if len(path_segments) > 0:
            # Remove the last segment
            base_path_segments = path_segments[:-1]
            # Reconstruct the path, ensuring it starts with a '/'
            base_path = '/' + '/'.join(base_path_segments)
            # If base_path is just '/', make sure it is exactly that (not '//' if base_path_segments was empty)
            if not base_path_segments: # If all segments were removed (e.g. path was "/slug")
                base_path = '/'
            # Optionally, ensure it ends with a slash if it's not just the root
            # This depends on how your TF-IDF was trained (with or without trailing slashes on paths)
            # For now, let's keep it as is from your logic (might not have trailing /)
            # Example: /foo/bar -> /foo. If you want /foo/, add:
            # elif base_path != '/': base_path += '/'


        elif path == "/" or not path: # Root path or empty path
            base_path = '/'
        else: # This case should ideally not be reached if logic above is sound
            base_path = path # Fallback to original path if something unexpected

        # Rebuild the URL without the slug AND without query parameters or fragments
        cleaned_url = urlunparse((
            parsed.scheme,
            parsed.netloc,
            base_path,
            '',  # params (always empty for http/https)
            '',  # query (REMOVED by your function)
            ''   # fragment (REMOVED by your function)
        ))
        print(f"remove_slug: Original='{url_string}', Cleaned='{cleaned_url}'")
        return cleaned_url
    except Exception as e:
        print(f"Error in remove_slug for '{url_string}': {e}. Returning original URL.")
        return url_string # Fallback to original URL on error


# --- Feature Extraction Function using TF-IDF ---
def extract_features_for_ml(url_string):
    """
    First applies remove_slug, then transforms the modified URL string
    into TF-IDF features using the loaded vectorizer.
    """
    if not tfidf_vectorizer:
        raise ValueError("TF-IDF vectorizer is not loaded. Cannot extract features.")

    # --- STEP 1: Apply your remove_slug function ---
    processed_url = remove_slug(url_string)

    # --- STEP 2: Vectorize the processed URL ---
    # The vectorizer expects an iterable of strings.
    # For a single URL, pass it as a list containing one string.
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
        url_to_scan = data.get('url')

        if not url_to_scan:
            return jsonify({'error': 'URL is required'}), 400

        is_phishing_result = 0
        confidence_score = 0.0
        message = "URL appears safe (default or ML error)"

        if ml_components_loaded: # Check if models were loaded successfully
            try:
                # 1. Extract features using TF-IDF (this now includes remove_slug)
                features = extract_features_for_ml(url_to_scan)
                
                prediction_proba = phishing_model.predict_proba(features)
                confidence_score = float(prediction_proba[0][1])
                PHISHING_THRESHOLD = 0.5
                is_phishing_result = 1 if confidence_score >= PHISHING_THRESHOLD else 0
                
                message = f"Detected by ML model (XGBoost + TF-IDF)"
                print(f"ML Prediction for original URL '{url_to_scan}': Phishing={bool(is_phishing_result)}, Confidence={confidence_score:.4f}")

            except ValueError as ve: # Catch specific error from extract_features_for_ml if vectorizer not loaded
                print(f"🚨 Error during feature extraction for '{url_to_scan}': {ve}")
                message = f"ML Error: {ve}. Defaulting."
            except Exception as e:
                print(f"🚨 Error during ML prediction for '{url_to_scan}': {e}")
                message = f"Error in ML prediction: {e}. Defaulting."
        else:
            # Fallback if ML model or vectorizer is not loaded
            missing_msg_parts = []
            if not phishing_model: missing_msg_parts.append("model")
            if not tfidf_vectorizer: missing_msg_parts.append("vectorizer")
            
            print(f"ML component(s) ({', '.join(missing_msg_parts)}) not available. Using basic rule-based check for {url_to_scan}.")
            is_phishing_result = 1 if "login-update-secure" in url_to_scan.lower() else 0 
            confidence_score = 0.75 if is_phishing_result else 0.1
            message = f"Fallback: Basic check (ML {', '.join(missing_msg_parts)} unavailable)"

        conn = sqlite3.connect('phishing_stats.db')
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO scans (url, is_phishing, confidence) VALUES (?, ?, ?)',
            (url_to_scan, is_phishing_result, confidence_score)
        )
        conn.commit()
        conn.close()

        return jsonify({
            'url': url_to_scan,
            'is_phishing': bool(is_phishing_result),
            'confidence': confidence_score,
            'risk_level': 'HIGH' if confidence_score > 0.7 else ('MEDIUM' if confidence_score > 0.4 else 'LOW'),
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

if __name__ == '__main__':
    init_db()
    print("🚀 Flask backend starting...")
    if not ml_components_loaded:
        print("⚠️ CAUTION: ML components (model and/or vectorizer) failed to load. Fallback will be used.")
    print("📡 API available at: http://localhost:5000")
    app.run(debug=True, port=5000)