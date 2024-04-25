chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'blockSites') {
      const { url, time } = message;
      const endTime = new Date().getTime() + time * 60 * 1000;
      chrome.storage.local.set({ blockedUrl: url, blockedEndTime: endTime }, function() {
        // Once storage is set, update the content scripts to reflect the changes
        chrome.tabs.query({}, function(tabs) {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, { action: 'updateBlockedSites', url, endTime });
          });
        });
      });
    }
  });
  