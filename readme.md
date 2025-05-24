# PhishShield AI: Phishing Detection System

## 1. Overview

PhishShield AI is a multi-component system designed to detect phishing URLs. It consists of:
1.  A **Python Flask Backend** that serves an API for URL scanning, using a pre-trained XGBoost model and TF-IDF vectorizer.
2.  A **Google Chrome Extension** that automatically scans URLs as the user browses and can be used for manual scans via its popup.
3.  A **Next.js Web Dashboard** that provides an interface for scanning URLs, viewing analytics, and learning about phishing.

The system aims to identify potentially malicious URLs by processing them, applying rules, and feeding them to a machine learning model.

## 2. Key Components

*   **Backend (Flask - `app.py`):**
    *   API endpoints for URL scanning (`/api/scan-url`), statistics (`/api/stats`), recent scans (`/api/recent`), and testing (`/api/test`).
    *   Loads `xgb_model.pkl` (XGBoost model) and `tfidf_vectorizer.pkl` (TF-IDF vectorizer).
    *   Applies URL preprocessing (your `remove_slug` function).
    *   Stores scan results in an SQLite database (`phishing_stats.db`).
*   **Chrome Extension:**
    *   `manifest.json`: Defines extension properties, permissions (activeTab, storage, tabs), background script, content script, and popup.
    *   `background.js`: (Assumed, as not provided in the last dump, but typically handles tab events and calls the backend).
    *   `content.js`: (Assumed, typically injects warnings/UI into web pages based on messages from `background.js`).
    *   `popup.html` & `popup.js`: Provides the UI for the browser action, allowing users to see current site status, scan the current site, manually scan a URL, and view basic stats.
*   **Frontend (Next.js - `src/` directory):**
    *   `src/app/page.tsx`: The main landing page of the web dashboard.
    *   `src/app/dashboard/page.tsx`: Displays analytics, including stats and recent scans fetched from the backend.
    *   `src/components/Scanner.tsx`: A component on the dashboard for users to manually input and scan URLs via the backend.
    *   Other components for UI, education, and displaying data.
*   **Machine Learning Models:**
    *   `xgb_model.pkl`: The trained XGBoost classifier.
    *   `tfidf_vectorizer.pkl`: The trained TF-IDF vectorizer for converting processed URLs into numerical features.
*   **Database:**
    *   `phishing_stats.db`: An SQLite database to log all scan attempts and their results.

## 3. Execution Flow & Connections

There are three main ways a URL scan is initiated and processed:

### Flow A: Chrome Extension - Automatic Scan (Based on typical extension behavior)

*This flow assumes a `background.js` similar to what was discussed previously, using `tabs.onUpdated` or `webNavigation` events.*

1.  **User Navigation:** User navigates to a new URL in Chrome.
2.  **Extension Event (`background.js`):**
    *   An event listener (e.g., `chrome.tabs.onUpdated` waiting for `status === 'complete'`, or a `chrome.webNavigation` event) in `background.js` captures the new URL.
3.  **API Call (`background.js` -> `app.py`):**
    *   `background.js` makes an asynchronous `fetch` request (POST) to the backend endpoint: `http://localhost:5000/api/scan-url`.
    *   The request body contains `{"url": "THE_USER_VISITED_URL"}`.
4.  **Backend Processing (`app.py` - `/api/scan-url` route):**
    *   The `scan_url()` function in `app.py` receives the request.
    *   `url_to_scan_original` stores the raw URL.
    *   **Rule 1: HTTP is Phishing:**
        *   If not whitelisted (`!rule_triggered`), the `url_to_scan_original` is checked if it starts with `http://`.
        *   If true, it's marked as **phishing** (`is_phishing_final = 1`, `confidence_final = 0.90`). `rule_triggered` is set.
    *   **ML Prediction (if no rule triggered and models loaded):**
        *   If `!rule_triggered` and `ml_components_loaded` is true:
            *   `extract_features_for_ml(url_to_scan_original)` is called.
            *   Inside `extract_features_for_ml`:
                *   `processed_url = remove_slug(url_to_scan_original)`: Your `remove_slug` function is called. This function parses the URL, attempts to keep only the first path segment (e.g., `scheme://netloc/segment1`), and removes query/fragment parameters by using `urlunparse` with empty strings for those parts. The `print` statement inside `remove_slug` shows the original vs. cleaned URL.
                *   `url_features = tfidf_vectorizer.transform([processed_url])`: The `processed_url` (output from `remove_slug`) is vectorized by the loaded TF-IDF model.
            *   `prediction_proba = phishing_model.predict_proba(features)`: The XGBoost model predicts probabilities.
            *   `ml_confidence_score = float(prediction_proba[0][1])`: The probability of being phishing.
            *   `PHISHING_THRESHOLD = 0.5`: The result is compared against this threshold. `ml_is_phishing = 1` if `ml_confidence_score >= 0.5`.
            *   `is_phishing_final` and `confidence_final` are updated with the ML model's results.
    *   **Fallback (if no rule triggered and ML not loaded):** A basic string check is performed.
    *   **Database Logging:** The `url_to_scan_original`, `is_phishing_final`, and `confidence_final` are inserted into the `scans` table in `phishing_stats.db`.
    *   **JSON Response:** A JSON object containing the original URL, final phishing status, final confidence, risk level, and a message is returned to `background.js`.
5.  **Extension UI Update (`background.js` and `content.js`):**
    *   `background.js` receives the JSON response.
    *   It updates the browser action badge (e.g., red "!" for phishing, green "✓" for safe).
    *   It likely stores the result in `chrome.storage.local` for the popup.
    *   If phishing, it sends a message to `content.js`.
    *   `content.js` (if messaged) would typically inject a warning overlay onto the current webpage.

### Flow B: Chrome Extension - Popup Interaction (`popup.js`)

1.  **User Clicks Extension Icon:** `popup.html` is displayed, and `popup.js` executes.
2.  **Load Current Status (`popup.js`):**
    *   Queries for the active tab's URL.
    *   Attempts to load any previously stored scan result for this tab from `chrome.storage.local.get(\`scan_\${tab.id}\`)`.
    *   Updates the "Current Status" section of the popup.
3.  **Load Stats (`popup.js`):**
    *   Makes a `fetch` GET request to `http://localhost:5000/api/stats`.
    *   `app.py`'s `/api/stats` route queries `phishing_stats.db` and returns total scans, phishing detected, etc.
    *   `popup.js` updates the stats display.
4.  **"Scan Now" Button Click (`popup.js`):**
    *   Gets the current active tab's URL.
    *   Makes a `fetch` POST request to `http://localhost:5000/api/scan-url` with the URL (similar to Flow A, step 3).
    *   The backend processes it (Flow A, step 4).
    *   `popup.js` receives the response and updates its UI (status, confidence bar).
    *   `background.js` might also be involved in updating the badge if the scan was re-triggered.
5.  **"Scan URL" (Manual Input) Button Click (`popup.js`):**
    *   Gets the URL from the `manual-url` input field.
    *   Makes a `fetch` POST request to `http://localhost:5000/api/scan-url` with this custom URL.
    *   Backend processes it (Flow A, step 4).
    *   `popup.js` receives the response and updates the `manual-scan-result` paragraph.

### Flow C: Web Dashboard Interaction (Next.js Frontend)

1.  **User Accesses Dashboard:** User navigates to the Next.js application in their browser (e.g., `http://localhost:3000`).
2.  **Page Load (e.g., `src/app/dashboard/page.tsx`):**
    *   The `DashboardPage` component mounts.
    *   `useEffect` hook fetches data from `http://localhost:5000/api/stats`.
    *   The state (`stats`) is updated, and child components like `PieChartComponent` and `StatCard` re-render with this data.
    *   The `RecentScans` component fetches data from `http://localhost:5000/api/recent`.
    *   `app.py`'s `/api/recent` route queries the last 20 scans from `phishing_stats.db` and returns them.
3.  **User Uses Scanner on Dashboard (`src/components/Scanner.tsx`):**
    *   User types a URL into the input field and clicks "Scan".
    *   `handleScan` function in `Scanner.tsx` is triggered.
    *   Makes an asynchronous `fetch` POST request to `http://localhost:5000/api/scan-url` with the entered URL.
    *   Backend processes it (Flow A, step 4).
    *   `Scanner.tsx` receives the JSON response, updates its state (`scanResult`), and re-renders to show the outcome (Safe/Phishing, confidence, explanation).

## 4. File Breakdown (Key Files)

### Backend (`app.py`)

*   **Purpose:** Core API server for phishing detection.
*   **Key Functions:**
    *   **Flask App Initialization:** Sets up Flask, CORS.
    *   **Model Loading (at startup):**
        *   Loads `xgb_model.pkl` into `phishing_model`.
        *   Loads `tfidf_vectorizer.pkl` into `tfidf_vectorizer`.
        *   Sets `ml_components_loaded` flag.
    *   **`remove_slug(url_string)`:**
        *   **Input:** Raw URL string.
        *   **Processing:** Parses the URL. Splits the path by `/`. Keeps only the first path segment (if any). Reconstructs the URL using `urlunparse`, which removes query parameters and fragments.
        *   **Output:** A "cleaned" URL string (e.g., `scheme://netloc/first_path_segment`).
    *   **`extract_features_for_ml(url_string)`:**
        *   Calls `remove_slug()` on the input `url_string`.
        *   Transforms the `processed_url` (output of `remove_slug`) using `tfidf_vectorizer.transform()`.
        *   Returns the TF-IDF feature vector.
    *   **`@app.route('/api/scan-url', methods=['POST'])`:**
        *   Receives a URL in JSON payload.
        *   Applies phishtank whitelist and HTTP rules.
        *   If no rule makes a decision and models are loaded, calls `extract_features_for_ml()` and then `phishing_model.predict_proba()`.
        *   Uses a `PHISHING_THRESHOLD` of 0.5 for ML decision.
        *   Logs the scan to `phishing_stats.db`.
        *   Returns a JSON response with phishing status, confidence, etc.
    *   **`@app.route('/api/stats', methods=['GET'])`:** Queries database for overall statistics.
    *   **`@app.route('/api/test', methods=['GET'])`:** Simple test endpoint, also shows model loading status.
    *   **`@app.route('/api/recent', methods=['GET'])`:** Fetches the last 20 scan records from the database.
    *   **`init_db()`:** Creates the `scans` table in `phishing_stats.db` if it doesn't exist.
*   **Connections:**
    *   Called by `background.js` (Chrome Extension) for automatic/popup scans.
    *   Called by `popup.js` (Chrome Extension) for manual popup scans.
    *   Called by `Scanner.tsx`, `DashboardPage.tsx`, `RecentScans.tsx` (Next.js Frontend).
    *   Reads `.pkl` model files.
    *   Reads/writes `phishing_stats.db`.

### Chrome Extension Files

*   **`manifest.json`:**
    *   **Purpose:** Configuration file for the Chrome extension.
    *   **Details:** Defines `manifest_version`, name, version, description. Specifies `permissions` needed ("activeTab", "storage", "tabs"). `host_permissions` set to `<all_urls>` allowing it to run on all websites. Declares `background.js` as the service worker, `content.js` to be injected into all pages, and `popup.html` as the browser action popup.
*   **`popup.html`:**
    *   **Purpose:** Defines the HTML structure for the extension's popup window.
    *   **Details:** Includes sections for current site status, confidence bar (visual), overall stats (total scans, threats, safe), buttons for "Scan Now" and "Report Issue", and an input field for manually scanning a custom URL with a "Scan URL" button. Also has a "Go to Dashboard" button.
*   **`popup.js`:** (Assumed based on `popup.html`)
    *   **Purpose:** Handles the logic and interactivity of `popup.html`.
    *   **Key Functions (Expected):**
        *   `DOMContentLoaded` listener to initialize:
            *   `loadCurrentStatus()`: Gets active tab, fetches stored scan data from `chrome.storage.local`, updates UI.
            *   `loadStats()`: Fetches data from backend `/api/stats`, updates UI.
        *   Event listener for "Scan Now": Gets active tab URL, calls backend `/api/scan-url`, updates UI.
        *   Event listener for "Scan URL" (manual): Gets URL from input, calls backend `/api/scan-url`, updates UI.
        *   Event listener for "Go to Dashboard": Opens the Next.js dashboard URL.
    *   **Connections:** Interacts with `chrome.tabs`, `chrome.storage.local`, and makes API calls to `app.py`.
*   **`background.js`:** (Functionality assumed based on common patterns and previous discussions)
    *   **Purpose:** Runs in the background, listens for browser events.
    *   **Key Functions (Expected):**
        *   Listener for tab updates (e.g., `chrome.tabs.onUpdated` or `chrome.webNavigation`).
        *   `scanCurrentUrl()` (or similar): Called on tab updates. Makes `fetch` POST request to `app.py`'s `/api/scan-url`.
        *   Handles response from backend: Updates `chrome.action.setBadgeText()`, `chrome.action.setBadgeBackgroundColor()`, stores result in `chrome.storage.local`, and sends a message to `content.js` if phishing.
    *   **Connections:** Listens to Chrome events, calls `app.py`, updates extension UI (badge), messages `content.js`, uses `chrome.storage`.
*   **`content.js`:** (Functionality assumed based on common patterns and previous discussions)
    *   **Purpose:** Injected into web pages to modify their content, typically for displaying warnings.
    *   **Key Functions (Expected):**
        *   `chrome.runtime.onMessage.addListener()`: Listens for messages from `background.js`.
        *   `showPhishingWarning()`: If a "showWarning" message is received, dynamically creates and injects a full-page HTML overlay warning the user. Handles "Go Back" and "Continue Anyway" buttons on the overlay.
    *   **Connections:** Receives messages from `background.js`, manipulates the DOM of the viewed webpage.

### Frontend (Next.js - Key Files)

*   **`src/app/page.tsx` (Main Landing Page):**
    *   **Purpose:** Serves as the main entry point for the web dashboard.
    *   **Details:** Renders various informational and interactive components like `Navbar`, `Hero`, `Scanner`, `Analytics`, `Education`, `Footer`, etc.
*   **`src/app/dashboard/page.tsx`:**
    *   **Purpose:** Displays a dedicated analytics dashboard.
    *   **Key Logic:**
        *   Uses `useEffect` to fetch overall statistics from `app.py`'s `/api/stats` endpoint when the component mounts.
        *   Renders `StatCard` components with these stats.
        *   Renders `PieChartComponent` (which also fetches stats, potentially with a date range).
        *   Renders `RecentScans` component.
    *   **Connections:** Fetches data from `app.py` (`/api/stats`).
*   **`src/components/Scanner.tsx`:**
    *   **Purpose:** Provides a UI element for users to input a URL and get it scanned.
    *   **Key Logic:**
        *   Maintains state for the input URL (`url`), scanning status (`isScanning`), and `scanResult`.
        *   `handleScan()`: When the scan button is clicked, it makes a `fetch` POST request to `app.py`'s `/api/scan-url` with the entered URL.
        *   Updates `scanResult` state based on the backend's response, which then re-renders the UI to show if the URL is safe/phishing, confidence, etc.
    *   **Connections:** Makes API calls to `app.py` (`/api/scan-url`).
*   **`src/components/Analytics/RecentScans.tsx`:**
    *   **Purpose:** Displays a table of recently scanned URLs.
    *   **Key Logic:**
        *   Uses `useEffect` to fetch data from `app.py`'s `/api/recent` endpoint.
        *   Renders a table displaying the URL, timestamp, status, and confidence for each scan.
    *   **Connections:** Fetches data from `app.py` (`/api/recent`).
*   **`src/components/Analytics/PieChartComponent.tsx`, `BarChartComponent.tsx`, `LineChartComponent.tsx`:**
    *   **Purpose:** Visual representation of scan data. `PieChartComponent` fetches data from `/api/stats` (possibly with a `days` parameter for filtering). The Bar and Line charts currently use hardcoded data for display but illustrate how other analytics could be visualized.
*   **Other UI Components (`Hero.tsx`, `Education.tsx`, etc.):** Primarily for static content display and user education on the web dashboard.

### Other Files

*   **`requirements.txt`:** Lists Python dependencies for the backend (Flask, Flask-CORS, joblib, scikit-learn, xgboost).
*   **`package.json` & `package-lock.json`:** Define Node.js dependencies for the Next.js frontend (Next, React, Lucide icons, Recharts, TailwindCSS, etc.).
*   **`tailwind.config.ts`, `postcss.config.js` (implied by Tailwind):** Configuration for TailwindCSS.
*   **`tsconfig.json`:** TypeScript configuration for the Next.js project.

## 5. Data Flow Summary

1.  **User Action (Extension or Web Dashboard):** Initiates a URL scan.
2.  **Request to Backend:**
    *   Chrome Extension (`background.js` or `popup.js`) -> `app.py:/api/scan-url`
    *   Next.js Frontend (e.g., `Scanner.tsx`) -> `app.py:/api/scan-url`
3.  **Backend Processing (`app.py`):**
    *   URL received.
    *   Whitelist/HTTP rules applied.
    *   If no rule hits, `remove_slug()` called for preprocessing.
    *   `tfidf_vectorizer` converts processed URL to features.
    *   `phishing_model` predicts.
    *   Result logged to `phishing_stats.db`.
    *   JSON response sent.
4.  **Response Handling:**
    *   **Extension:** `background.js`/`popup.js` receives response, updates badge/popup UI, `content.js` may show overlay.
    *   **Frontend:** Next.js component receives response, updates component's UI.
5.  **Stats/Recent Data (Dashboard):**
    *   Next.js components (`DashboardPage.tsx`, `RecentScans.tsx`, `PieChartComponent.tsx`) fetch data from `/api/stats` or `/api/recent`.
    *   `app.py` queries `phishing_stats.db` and returns data.
    *   Dashboard UI is updated.

This provides a comprehensive view of how your system's components interact. The effectiveness of the phishing detection hinges on the quality of the ML models and the consistency of the URL preprocessing (`remove_slug`) between training and prediction.