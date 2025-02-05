document.getElementById("startTTS").addEventListener("click", () => {
  const selectedLanguage = document.getElementById('languageSelect').value;
  console.log('Sprache im Popup ausgewÃ¤hlt:', selectedLanguage);
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ["content.js"]
        }, () => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startTTS", language: selectedLanguage });
        });
    });
});

document.getElementById("playPauseTTS").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "playPauseTTS" });
    });
});

document.getElementById("prevTTS").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "prevTTS" });
    });
});

document.getElementById("nextTTS").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "nextTTS" });
    });
});

