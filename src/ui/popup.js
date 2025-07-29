// ELEMENTS
const goodresults = document.getElementById("results-container-good");
const badresults = document.getElementById("results-container-bad");
const badresultcount = document.getElementById("result-count");
const error = document.getElementById("error-container");

// BUTTONS
const buttons = document.getElementsByTagName("button");
const checkButton = document.getElementById("check-password-button");
const closeButton = document.getElementById("close-button");

// Add an event listener to all buttons
// Check what id the button has to determine the action to perform

// Send background stored data to HIPB API
checkButton.onclick = async function () {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.id) {
    return;
  }

  try {
    const res = await chrome.tabs.sendMessage(tab.id, {
      action: "checkPassword",
    });

    if (res.response === "NO_PASSWORD") {
      error.classList.remove("invisible");
    } else {
      error.classList.add("invisible");

      if (res.response === "COMPROMISED") {
        goodresults.classList.add("hidden");
        badresultcount.innerText = `${res.count} instances found!`;
        badresults.classList.remove("hidden");
      } else if (res.response === "NOT_COMPROMISED") {
        badresults.classList.add("hidden");
        goodresults.classList.remove("hidden");
      }
    }
  } catch (error) {
    console.error(
      "Error sending message to content script:",
      chrome.runtime.lastError?.message || error
    );
  }
};

// Close pop-up
closeButton.onclick = function () {
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, (tabs) => {
    const tab = tabs[0];
    chrome.tabs.sendMessage(tab.id, { action: "closeUI" });
  });
};
