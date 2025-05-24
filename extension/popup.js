const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', async () => {
  await loadCurrentStatus();
  await loadStats();

  document.getElementById('scan-now').addEventListener('click', scanCurrentSite);
  document.getElementById('report-issue').addEventListener('click', reportIssue);
  document.getElementById('scan-manual-url').addEventListener('click', scanManualURL);

  const goWebsiteBtn = document.getElementById('go-website');
  if (goWebsiteBtn) {
    goWebsiteBtn.addEventListener('click', () => {
      if (chrome && chrome.tabs) {
        chrome.tabs.create({ url: 'http://localhost:3000/' });
      } else {
        alert('Unable to open tab. "tabs" permission might be missing.');
      }
    });
  }
});

function showConfidenceBar(confidence, isPhishing) {
  const container = document.getElementById("confidence-bar-container");
  const bar = document.getElementById("confidence-bar");

  container.style.display = "block";
  const percent = Math.round(confidence * 100);
  bar.style.width = percent + "%";
  bar.style.backgroundColor = isPhishing ? "#d32f2f" : "#2e7d32";
  bar.title = isPhishing
    ? `${percent}% confidence this is phishing`
    : `${percent}% confidence this is safe`;
}
async function loadCurrentStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      updateStatus('No active tab', 'loading');
      return;
    }

    document.getElementById('current-url').textContent = tab.url;

    const scanData = await chrome.storage.local.get(`scan_${tab.id}`);

    if (scanData[`scan_${tab.id}`]) {
      const data = scanData[`scan_${tab.id}`];
      const confidence = data.result.confidence;

      if (data.result.is_phishing) {
        updateStatus(
          `⚠️ Phishing Detected (${(confidence * 100).toFixed(1)}% confidence)`,
          'danger'
        );
        showConfidenceBar(confidence, true);
      } else {
        updateStatus(
          `✅ Site appears safe (${((1 - confidence) * 100).toFixed(1)}% confidence safe)`,
          'safe'
        );
        showConfidenceBar(1 - confidence, false);
      }
    } else {
      updateStatus('🔍 Not yet scanned', 'loading');
    }

  } catch (error) {
    console.error('Error loading current status:', error);
    updateStatus('Error checking status', 'loading');
  }
}

async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    const stats = await response.json();

    document.getElementById('total-scans').textContent = stats.total_scans;
    document.getElementById('threats-blocked').textContent = stats.phishing_detected;
    document.getElementById('safe-sites').textContent = stats.safe_scans;

  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

function updateStatus(message, type) {
  const statusDiv = document.getElementById('current-status');
  statusDiv.innerHTML = `<strong>${message}</strong>`;
  statusDiv.className = `status status-${type}`;
}

async function scanCurrentSite() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url) {
      alert('No active tab to scan');
      return;
    }

    updateStatus('🔍 Scanning...', 'loading');

    const response = await fetch(`${API_BASE}/scan-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: tab.url })
    });

    const result = await response.json();

    await chrome.storage.local.set({
      [`scan_${tab.id}`]: {
        url: tab.url,
        result: result,
        timestamp: Date.now()
      }
    });

    if (result.is_phishing) {
      updateStatus(
        `⚠️ Phishing Detected (${(result.confidence * 100).toFixed(1)}% confidence)`,
        'danger'
      );
      showConfidenceBar(result.confidence, true);
    } else {
      updateStatus(
        `✅ Site appears safe (${((1 - result.confidence) * 100).toFixed(1)}% confidence safe)`,
        'safe'
      );
      showConfidenceBar(1 - result.confidence, false);
    }

    await loadStats();

  } catch (error) {
    console.error('Error scanning site:', error);
    updateStatus('❌ Scan failed', 'loading');
  }
}

async function scanManualURL() {
  const urlInput = document.getElementById('manual-url');
  const resultBox = document.getElementById('manual-scan-result');
  const url = urlInput.value.trim();

  if (!url) {
    resultBox.textContent = '⚠️ Please enter a URL to scan.';
    resultBox.style.color = 'orange';
    return;
  }

  resultBox.textContent = '🔄 Scanning...';
  resultBox.style.color = '#555';

  try {
    const response = await fetch(`${API_BASE}/scan-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const result = await response.json();

    if (result.is_phishing) {
      resultBox.textContent = `⚠️ Phishing Detected (${(result.confidence * 100).toFixed(1)}% confidence)`;
      resultBox.style.color = 'red';
      showConfidenceBar(result.confidence, true);
    } else {
      resultBox.textContent = `✅ Safe (${((1 - result.confidence) * 100).toFixed(1)}% confidence)`;
      resultBox.style.color = 'green';
      showConfidenceBar(1 - result.confidence, false);
    }

  } catch (error) {
    console.error('Error scanning manual URL:', error);
    resultBox.textContent = '❌ Failed to scan. Please try again.';
    resultBox.style.color = 'gray';
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.display = 'inline-block';
  toast.style.padding = '10px 20px';
  toast.style.borderRadius = '6px';
  toast.style.margin = '10px auto';
  toast.style.fontSize = '14px';
  toast.style.color = '#fff';
  toast.style.backgroundColor =
    type === 'success' ? '#4caf50' :
    type === 'error' ? '#f44336' :
    type === 'warning' ? '#ff9800' :
    '#333';

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s';
    toast.style.opacity = '0';
    setTimeout(() => container.removeChild(toast), 400);
  }, 3000);
}

function reportIssue() {
  alert('Report feature coming soon! For now, you can contact the developers.');
}
