chrome.storage.local.get(['blockedUrl', 'blockedEndTime'], function(data) {
  const { blockedUrl, blockedEndTime } = data;
  const currentUrl = window.location.href;

  if (blockedUrl && blockedEndTime && currentUrl !== blockedUrl) {
    const currentTime = new Date().getTime();
    if (currentTime < blockedEndTime) {
      const timeLeftMs = blockedEndTime - currentTime;
      const minutesLeft = Math.floor(timeLeftMs / (1000 * 60));
      // Redirect to a dummy page or show a message
      document.documentElement.innerHTML = `
        <style>
          @keyframes neonEffect {
            0% { text-shadow: 0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 8px #00f, 0 0 10px #00f, 0 0 12px #00f, 0 0 14px #00f, 0 0 16px #00f; }
            100% { text-shadow: none; }
          }
          body {
            background-color: #000;
            color: #fff;
            font-family: 'Roboto', sans-serif;
            animation: neonEffect 1.5s infinite alternate;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .neon-circle {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background-color: transparent;
            border: 5px solid #00f;
            box-shadow: 0 0 20px #00f, 0 0 40px #00f, 0 0 60px #00f, 0 0 80px #00f, 0 0 100px #00f, 0 0 120px #00f, 0 0 140px #00f, 0 0 160px #00f;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }
          .message {
            font-size: 20px;
            text-align: center;
          }
          .time-left {
            font-size: 16px;
            margin-top: 10px;
            color: #00f; /* Changed the color to blue */
            animation: glow 1.5s infinite alternate;
          }
          @keyframes glow {
            0% { text-shadow: 0 0 2px #00f, 0 0 4px #00f, 0 0 6px #00f; }
            100% { text-shadow: none; }
          }
        </style>
        <div class="neon-circle">
          <div class="message">
            Get back to work!
          </div>
          <div class="time-left">
             ${minutesLeft} minutes left
          </div>
        </div>
      `;
    } else {
      // Clear the blocked site and end time from storage
      chrome.storage.local.remove(['blockedUrl', 'blockedEndTime']);
    }
  }
});
