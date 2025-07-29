// If the button is clicked, inject the ui
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["/src/content/content.js"],
  });

  const res = await chrome.tabs.sendMessage(tab.id, { action: "injectUI" });
});

// If the extension is opened then listen for password input
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "PASSWORD_INPUT") {
    var API_URL = `https://api.pwnedpasswords.com/range/${msg.data.slice(
      0,
      5
    )}`;
    var results = async () => {
      try {
        var response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Reponse status: ${response.status}`);
        }
        var text = await response.text();
        var found = text.split("\n").find((line) => {
          const [returnedSuffix] = line.split(":");
          return returnedSuffix === msg.data.slice(5);
        });
        if (found) {
          let [_, c] = found.split(":");
          let count = parseInt(c);
          return count;
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    results().then((pwn_count) => {
      sendResponse({ response: pwn_count });
    });
    return true;
  }
});
