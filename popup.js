const toggle = document.getElementById('shortcut-toggle');

chrome.storage.local.get({ shortcutEnabled: true }, (data) => {
    toggle.checked = data.shortcutEnabled;
});

toggle.addEventListener('change', (e) => {
    chrome.storage.local.set({ shortcutEnabled: e.target.checked });
});

document.getElementById('fill').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && tab.id) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        }
    } catch (error) {
        console.error("Failed to inject script: ", error);
    }
});

document.getElementById('configure-shortcut').addEventListener('click', (e) => {
    e.preventDefault();
    if (navigator.userAgent.includes("Firefox")) {
        const link = document.getElementById('configure-shortcut');
        link.innerHTML = "Open 'about:addons' in a new tab<br>Click ⚙️ -> Manage Extension Shortcuts";
        link.style.color = "#2dd4bf";
        link.style.pointerEvents = "none";
    } else {
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
    }
});
