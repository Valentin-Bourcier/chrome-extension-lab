console.log("Background script started");
let currentTabId = -1;
let timestamp = Date.now();
let popupShown = false;
let timer: any;

/**
 * Injects the content script in current tab.
 */
const setTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];
        if (tab && tab.id) {
            currentTabId = tab.id;
            console.log("Changing tab to: " + currentTabId);

            if (tab.pendingUrl?.startsWith("http") || tab.url?.startsWith("http")) {
                chrome.scripting.executeScript({
                    target: { tabId: currentTabId, allFrames: true },
                    files: ["contentscript.js"]
                });
                chrome.scripting.insertCSS({
                    target: { tabId: currentTabId, allFrames: true },
                    files: ["assets/contentscript.css"]
                });
            }

            // If precedently opened, close the popup.
            chrome.runtime.sendMessage({ show: false, tab: currentTabId });
            timestamp = Date.now();
            popupShown = false;
        }
    });
};

/**
 * Updates last user action timestamp sent by the injected content script.
 */
const tabMessageListener = async (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
) => {
    if (sender.tab && sender.tab.id) {
        console.log("Message received from: " + sender.tab.id);
        if (sender.tab.id === currentTabId && request.timestamp) {
            console.log("Setting up timestamp to: " + new Date(request.timestamp));
            timestamp = request.timestamp;
        }
        sendResponse(sender.tab.id);
    }
};

/**
 * Sends a show/hide command to the content script when the last
 * user action timestamp is older than 10s.
 */
const activityTimerCallback = (user: any) => () => {
    if (currentTabId > 0 && !popupShown && Date.now() - timestamp > 10_000) {
        console.log("Current tab inactive: " + currentTabId);
        chrome.tabs.sendMessage(currentTabId, {
            show: true,
            user: user
        });
        popupShown = true;
    }
};

/**
 * Start or stop listening events depending on the current user.
 */
const startOrStopWithUser = (user: any) => {
    if (user && user.firstname && user.lastname) {
        chrome.tabs.onActivated.addListener(() => setTab());
        chrome.runtime.onMessage.addListener(tabMessageListener);
        timer = setInterval(activityTimerCallback(user), 500);
    } else {
        chrome.tabs.onActivated.removeListener(() => setTab());
        chrome.runtime.onMessage.removeListener(tabMessageListener);
        clearInterval(timer);
    }
};

/**
 * We start to look on updates only if a user is logged on.
 */
chrome.storage.sync.get(["user"], (result) => {
    startOrStopWithUser(result["user"]);
});
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes["user"].newValue) {
        startOrStopWithUser(changes["user"].newValue);
    }
});
