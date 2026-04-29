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
