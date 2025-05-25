# 🛡️ PhishShield AI – Stop Phishing Before It Traps You!

## 🚨 What is Phishing?

Phishing is a trick used by cybercriminals to steal your personal details—like passwords, bank info, or OTPs—by pretending to be someone you trust. They might send fake links via email, SMS, or websites, hoping **you’ll give them the information yourself**.  
> **Remember**: Until you give them the details, they can’t do anything. Their only goal is to fool you into giving those details.

---

## 🌐 What is PhishShield AI?

**PhishShield AI** is a smart system that helps you detect fake or malicious links (phishing URLs) **before you click** or give away your data.

It works through:
1. 🧠 A Machine Learning backend (Python + Flask)  
2. 🌐 A Chrome Extension that scans websites as you browse  
3. 📊 A Web Dashboard to scan URLs manually and view analytics

---

## ⚙️ How It Works (In Simple Terms)

Whenever you visit or scan a link:
- 🔍 It checks if the link looks suspicious (like starting with `http://` or using known phishing tricks)
- 🤖 If needed, it runs the link through a trained **AI model** to predict whether it’s safe or phishing
- 💾 The results are stored in a local database
- 🚦 You get feedback with a risk score and warning badge (like red = phishing, green = safe)

---

## 🧩 What’s Inside?

### 📦 1. Backend (Python Flask)
- `/api/scan-url`: Main API to scan URLs
- Uses ML model (`xgb_model.pkl`) + text vectorizer (`tfidf_vectorizer.pkl`)
- Cleans and processes URLs before scanning
- Saves results in a local SQLite database

### 🧩 2. Chrome Extension
- Auto-scans pages as you browse
- Pop-up UI lets you:
  - See if the current site is safe
  - Manually scan other links
  - View phishing stats

### 🖥️ 3. Web Dashboard (Next.js)
- Home page to manually check URLs
- Dashboard shows:
  - Recent scans
  - Phishing detection stats
  - Educational content

---

## 🔄 How the Scan Happens

1. **User visits a site or enters a link**  
2. **Link is sent to the Flask backend**  
3. **Backend checks for obvious rules (like `http://`)**  
4. **If needed, AI model analyzes the URL**  
5. **Returns a result with phishing status + confidence score**  
6. **Frontend or extension shows the warning**

---

## 🧠 Why This Matters

Phishing is growing every day. People get tricked into giving out passwords, OTPs, or credit card details. This system gives **early warnings**, using a smart mix of rules + machine learning.

---

## 🚀 How to Run

### 1. Start the Flask Backend
```bash
cd backend
python app.py
```

### 2. Launch the Chrome Extension
- Load `chrome-extension/` folder into `chrome://extensions` (enable Developer Mode)

### 3. Run the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Tech Stack

- **Python** (Flask, XGBoost, TF-IDF)
- **JavaScript** (Chrome Extension)
- **Next.js** (React Frontend)
- **SQLite** (for logging scans)

---

## 🔐 Final Words

> “Phishing works only when you fall for it. Don’t give them a chance.”

PhishShield AI helps you stay safe by **detecting traps before you click**. Stay alert, stay secure!
