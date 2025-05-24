
const API_BASE = 'http://localhost:5000/api';


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
  
    if (tab.url.startsWith('http://') || tab.url.startsWith('https://')) {
      await scanCurrentUrl(tab.url, tabId);
    }
  }
});


async function scanCurrentUrl(url, tabId) {
  try {
    console.log('🔍 Scanning URL:', url);
    
    const response = await fetch(`${API_BASE}/scan-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Scan result:', result);
    
 
    await chrome.storage.local.set({
      [`scan_${tabId}`]: {
        url: url,
        result: result,
        timestamp: Date.now()
      }
    });

   
    if (result.is_phishing) {
      
      chrome.action.setBadgeText({
        text: '!',
        tabId: tabId
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#FF0000',
        tabId: tabId
      });
      
      
      chrome.tabs.sendMessage(tabId, {
        action: 'showWarning',
        data: result
      }).catch(err => console.log('Could not send message to content script'));
      
    } else {
     
      chrome.action.setBadgeText({
        text: '✓',
        tabId: tabId
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#4CAF50',
        tabId: tabId
      });
    }

  } catch (error) {
    console.error('❌ Error scanning URL:', error);
    
    
    chrome.action.setBadgeText({
      text: '?',
      tabId: tabId
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#757575',
      tabId: tabId
    });
  }
}


chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`scan_${tabId}`);
});
