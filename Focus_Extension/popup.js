// Listen for the block sites button click event
document.getElementById('blockSitesBtn').addEventListener('click', function() {
  const urlInput = document.getElementById('urlInput').value;
  const timeInput = parseInt(document.getElementById('timeInput').value);

  if (!urlInput || isNaN(timeInput) || timeInput <= 0) {
    document.getElementById('status').innerHTML = 'Please enter a valid URL and time.';
    return;
  }

  const currentTime = new Date().getTime();
  const blockedEndTime = currentTime + (timeInput * 60 * 1000);

  chrome.storage.local.get('whitelistedUrls', function(data) {
    let whitelistedUrls = data.whitelistedUrls || [];

    // Extract the base domain from the entered URL
    const baseDomain = new URL(urlInput).hostname;

    // Check if the base domain or any of its subdomains are already in the whitelist
    const existingUrls = whitelistedUrls.filter(url => {
      const urlDomain = new URL(url).hostname;
      return urlDomain === baseDomain || urlDomain.endsWith('.' + baseDomain);
    });

    // If no matching URLs found, add the base domain to the whitelist
    if (existingUrls.length === 0) {
      whitelistedUrls.push(baseDomain);
    }

    chrome.storage.local.set({ 'blockedUrl': urlInput, 'blockedEndTime': blockedEndTime, 'whitelistedUrls': whitelistedUrls });

    // Display a success message
    document.getElementById('status').innerHTML = `Sites will be blocked for ${timeInput} minutes, except ${urlInput}.`;

    // Clear whitelisted URLs after timeout
    setTimeout(() => {
      chrome.storage.local.remove('whitelistedUrls');
    }, timeInput * 60 * 1000);
  });
});

// Function to cancel the timeout
document.getElementById('cancelTimeoutBtn').addEventListener('click', function() {
  chrome.storage.local.remove(['blockedUrl', 'blockedEndTime', 'whitelistedUrls'], function() {
    document.getElementById('status').innerHTML = 'Timeout cancelled.';
  });
});

// Function to update the time left continuously
function updateTimeLeft() {
  setInterval(function() {
    chrome.storage.local.get(['blockedEndTime'], function(data) {
      const blockedEndTime = data.blockedEndTime;
      if (blockedEndTime) {
        const currentTime = new Date().getTime();
        const timeLeft = Math.max(0, Math.floor((blockedEndTime - currentTime) / 1000)); // Calculate time left in seconds

        // Display time left on the screen
        document.getElementById('timeLeft').innerText = `Time left: ${formatTime(timeLeft)}`;
      }
    });
  }, 1000); // Update every second
}

// Function to format time in seconds to display in minutes and seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes} minute(s) ${remainingSeconds} second(s)`;
}

// Call the updateTimeLeft function to start updating the time left
updateTimeLeft();
