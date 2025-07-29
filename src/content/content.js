chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "injectUI") {
    if (window.self === window.top && !document.getElementById("securepass")) {
      const div = document.createElement("div");
      div.id = "securepass";

      Object.assign(div.style, {
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: "9999999",
        width: "350px",
        height: "158px",
      });

      const shadow = div.attachShadow({ mode: "closed" });
      const iframe = document.createElement("iframe");

      iframe.id = "securepass-iframe";
      iframe.src = chrome.runtime.getURL("src/ui/popup.html");
      shadow.appendChild(iframe);

      Object.assign(iframe.style, {
        position: "relative",
        border: "none",
        margin: "0",
        width: "100%",
        height: "100%",
      });

      document.body.appendChild(div);
      sendResponse({ response: "extension injected!" });
    }
  } else if (msg.action == "closeUI") {
    const box = document.getElementById("securepass");
    if (box) {
      box.remove();
    }
  } else if (msg.action == "checkPassword") {
    const target = document.querySelectorAll('input[type="password"]');
    const extension = document.getElementById("securepass");
    if (target.length == 0 || target[0].value === "") {
      // send response to raise error
      sendResponse({ response: "NO_PASSWORD" });
    } else {
      extension.style.height = "270px";
      // Send password to background.js
      const pwn_count = async () => {
        const res = await chrome.runtime.sendMessage({
          type: "PASSWORD_INPUT",
          data: sha1(target[0].value).toUpperCase(),
        });
        return res;
      };

      pwn_count().then((res) => {
        // log response out
        if (res.response > 0) {
          sendResponse({ response: "COMPROMISED", count: res.response });
        } else {
          sendResponse({
            response: "NOT_COMPROMISED",
            count: res.response,
          });
        }
      });
    }
    return true;
  }
});
