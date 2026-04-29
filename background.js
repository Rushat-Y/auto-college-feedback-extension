chrome.commands.onCommand.addListener(async (command) => {
    if (command === "auto-fill-form") {
        chrome.storage.local.get({ shortcutEnabled: true }, async (data) => {
            if (!data.shortcutEnabled) return;
            
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                
                if (tab && tab.id) {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                }
            } catch (error) {
                console.error("Failed to inject script via shortcut: ", error);
            }
        });
    }
});
