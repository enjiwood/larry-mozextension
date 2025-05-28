const hidePage = `body > :not(.larry-image) {
                        display: none;
                    }`;

let isLarry = 0;

function listenForClicks() {
    document.addEventListener("click", (e) => {
        function larryURL() {
            return browser.runtime.getURL("../larry.jpg");
        }

        function larry(tabs) {
            browser.tabs.insertCSS({ code: hidePage }).then(() => {
                const url = larryURL();
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "larry",
                    larryURL: url,
                });
            });
        }

        function reset(tabs) {
            browser.tabs.removeCSS({ code: hidePage }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command:"reset",
                });
            });
        }

        function reportError(error) {
            console.error(`Could not larry: ${error}`);
        }

        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            return;
        }
        else {
            if (isLarry) {
                browser.tabs
                    .query({ active: true, currentWindow: true})
                    .then(reset)
                    .catch(reportError);
            } else {
                browser.tabs
                    .query({ active: true, currentWindow: true})
                    .then(larry)
                    .catch(reportError);
            }
            isLarry = !isLarry;
        }
    });
}

function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute larry content script: ${error.message}`);
}

browser.tabs
    .executeScript({ file: "../content_scripts/larry.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);