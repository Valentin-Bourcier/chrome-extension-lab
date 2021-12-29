/**
 * Sends to the background the last action timestamp.
 */
function updateBackground() {
    chrome.runtime.sendMessage({ timestamp: Date.now() }, async (response) => {
        if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
        }
        return response;
    });
}

function hidePopup() {
    const popup = document.getElementById("ext-popup");
    popup!.style.visibility = "hidden";
}

function showPopup(user: any) {
    const popup = document.getElementById("ext-popup");
    popup!.style.visibility = "visible";
    const message = document.getElementById("ext-popup--message");
    if (message) {
        message.innerHTML = `Are you lost <span>${user.firstname} ${user.lastname}</span> ?`;
    }
}

/**
 * Show/hide to the popup dependy on background messages.
 */
function listenBackground(request: any) {
    console.log("Message received from background: " + JSON.stringify(request));
    if (request.show && request.user) {
        showPopup(request.user);
    } else {
        hidePopup();
    }
}

/**
 * Main script.
 */
async function content() {
    console.log("Content script started");
    /**
     * Wiring messages with the background script.
     */
    document.addEventListener("keypress", updateBackground);
    document.addEventListener("mousemove", updateBackground);

    chrome.runtime.onMessage.addListener(listenBackground);

    /**
     * Downloading popup HTML sources.
     */
    console.log("Fetching HTML sources.");
    await fetch(chrome.runtime.getURL("assets/contentscript.html"))
        .then((r) => r.text())
        .then((html) => document.body.insertAdjacentHTML("beforeend", html));
    console.log("HTML sources loaded.");

    /**
     * Attaching listeners to the popup buttons.
     */
    const no = document.getElementById("ext-popup--button-no");
    no?.addEventListener("click", () => hidePopup());

    const yes = document.getElementById("ext-popup--button-yes");
    yes?.addEventListener("click", () => {
        window.open("https://help.nickelled.com/", "_blank");
        hidePopup();
    });
}
content();
