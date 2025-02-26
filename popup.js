document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveTab");
    const linksList = document.getElementById("linksList");

    // Load saved tabs
    chrome.storage.local.get("savedLinks", (data) => {
        if (data.savedLinks) {
            data.savedLinks.forEach(addLinkToUI);
        }
    });

    // Save the current tab
    saveButton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            const newLink = { title: tab.title, url: tab.url };

            chrome.storage.local.get("savedLinks", (data) => {
                const savedLinks = data.savedLinks || [];
                savedLinks.push(newLink);

                chrome.storage.local.set({ savedLinks }, () => {
                    addLinkToUI(newLink);
                });
            });
        });
    });

    // Add link to UI
    function addLinkToUI(link) {
        const listItem = document.createElement("li");

        const linkElement = document.createElement("a");
        linkElement.href = link.url;
        linkElement.textContent = link.title;
        linkElement.target = "_blank";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "❌";
        deleteButton.addEventListener("click", () => {
            removeLink(link, listItem);
        });

        listItem.appendChild(linkElement);
        listItem.appendChild(deleteButton);
        linksList.appendChild(listItem);
    }

    // Remove link from storage and UI
    function removeLink(link, listItem) {
        chrome.storage.local.get("savedLinks", (data) => {
            let savedLinks = data.savedLinks || [];
            savedLinks = savedLinks.filter(l => l.url !== link.url);

            chrome.storage.local.set({ savedLinks }, () => {
                listItem.remove();
            });
        });
    }
});
