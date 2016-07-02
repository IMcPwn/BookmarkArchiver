/* BookmarkArchiver - Archive your bookmarks with archive.org
 * For the latest code and contact information visit: http://imcpwn.com

 * Copyright 2016 IMcPwn 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function archive(url) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://web.archive.org/save/" + url);
    request.send();

    request.onreadystatechange = function(event) {
        var xhr = event.target;

        if (xhr.readyState === 4 && xhr.status === 200) {
            appendResult("<b>Archived</b><br>" + "<a href='https://web.archive.org/web/*/" + url + "'target='_blank' rel='noreferrer'>" + url + "</a>");
        } else if (xhr.readyState === 4) {
            appendResult("<b>Error archiving</b>\n" + url);
        }
    };
}

/*
function getWayback(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', "https://archive.org/wayback/available?url=" + url);
    request.send();

    request.onreadystatechange = function(event) {
        var xhr = event.target;

        if (xhr.readyState === 4 && xhr.status === 200) {
            // Parse JSON and validate
        } else {
            callback(false);
        }
    };
}
*/

function clearResults() {
    document.getElementById('resultsMessage').innerHTML = ""
    document.getElementById('status').textContent = "";
}

function appendResult(statusText) {
    if (document.getElementById('resultsMessage').innerHTML == "") {
        document.getElementById('resultsMessage').innerHTML = "<h4>Results<br><hr></h4>";
    }
    var row = document.getElementById('status').insertRow(-1);
    row.innerHTML = statusText;
}

function saveIsChecked() {
    /* Leave always disabled until Save results to a new bookmark folder is functional
    if (document.getElementById('saveResult').checked) {
        return true;
    } else {
        return false;
    }
    */
    return false;
}

function archiveCurrentPage() {
    getCurrentTabUrl(function(bookmark) {
        archive(bookmark);
        if (saveIsChecked()) {
            createBookmark(bookmark.title, bookmark.url);
        }
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

function archiveBookmarks() {
    getBookmarks(function(bookmarks) {
        archiveBookmark(bookmarks);
    });
}

function archiveBookmark(bookmarks) {
    bookmarks.forEach(function(bookmark) {
        if (bookmark.url) {
            archive(bookmark.url);
            if (saveIsChecked()) {
                createBookmark(bookmark.title, bookmark.url);
            }
        }
        if (bookmark.children) {
            archiveBookmark(bookmark.children);
        }
    });
}

function getBookmarks(callback) {
    chrome.bookmarks.getTree(function(bookmarks) {
        callback(bookmarks);
    });
}

/*
function createBookmark(title, url, callback) {
    var d = new Date();
    var date = d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
    chrome.bookmarks.create({'parentId': "2", 'title': 'ArchivedBookmarks-' + date}, callback);
    chrome.bookmarks.create({'parentId': "2", 'title': title, 'url': url}, callback);
}
*/

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('bookmarksButton').onclick = function() {
        archiveBookmarks();
    };
    document.getElementById('currentPageButton').onclick = function() {
        archiveCurrentPage();
    };
    document.getElementById('clearResults').onclick = function() {
        clearResults();
    };
    document.getElementById('scrollBottom').onclick = function() {
        window.scrollTo(0, document.body.scrollHeight);
    };
    getCurrentTabUrl(function(bookmark) {
        document.getElementById('wayBackUrl').innerHTML = "<a href='https://web.archive.org/web/*/" + bookmark + "'target='_blank' rel='noreferrer'>View current page on Wayback Machine</a>";
    });
});