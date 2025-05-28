(() => {
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    function insertLarry(larryURL) {
        removeExistingLarry();
        const larryImage = document.createElement("img");
        larryImage.setAttribute("src", larryURL);
        larryImage.style.height = "100vh";
        larryImage.style.width = "100vw";
        larryImage.className = "larry-image";
        document.body.appendChild(larryImage);
    }

    function removeExistingLarry() {
        const existingLarry = document.querySelectorAll(".larry-image");
        for (const larry of existingLarry) {
            larry.remove();
        }
    }

    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "larry") {
            insertLarry(message.larryURL);
        } else if (message.command === "reset") {
            removeExistingLarry();
        }
    });
})();