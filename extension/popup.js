// Wayback get URL api: https://archive.org/wayback/available?url=imcpwn.com

function archive(url) {

    var request = new XMLHttpRequest();
    request.open('GET', "https://web.archive.org/save/" + url);
    request.send();

    request.onreadystatechange = function(event) {
        var xhr = event.target;

        if (xhr.readyState === 4 && xhr.status === 200) {
            renderStatus("Archived: " + url);
        } else {
            renderStatus("Error: Unable to archive: " + url);
        }
    };
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function archiveCurrentPage() {
    getCurrentTabUrl(function(callback) {
        archive(callback);
    });
}

function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var url = tabs[0].url;

        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('bookmarksButton').onclick = function() {
        archiveBookmarks();
    };
    document.getElementById('currentPageButton').onclick = function() {
        archiveCurrentPage();
    };
});
