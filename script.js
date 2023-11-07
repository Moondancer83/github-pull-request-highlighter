// ==UserScript==
// @name         GitHub PullRequest Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight GitHub PRs by their status
// @author       Moondancer83
// @match        https://github.com/**/pulls
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        console.log("GitHub PullRequest Highlighter");
        setTimeout(() => run(), 1000);
    }, false);

})();

function run() {
    const issues = getIssues();
    issues.forEach(issue => {
        const text = getStatusText(issue); // Review required, Approved, Draft
        setStyleForIssue(issue, text);
        setStyleForStatusBadge(issue, text);
        highlightOwner(issue);
    });
}

const DRAFT_COLOR = "rgb(246, 250, 245)"; //"lightgray";
const CHANGE_REQUEST_COLOR = "#fedddd";
const WAITING_COLOR = "lightyellow";
const APPROVED_COLOR = "rgb(244, 254, 239)"; //"darkseagreen";

function getIssues() {
    return document.querySelectorAll('[role="group"] div[data-turbo-frame="repo-content-turbo-frame"]');
}

function getIssue() {
    return document.querySelector('[role="group"] div[data-turbo-frame="repo-content-turbo-frame"]');
}

function getStatusBadge(issue) {
    return issue?.querySelector('.d-none:nth-of-type(2) a');
}

function getStatusText(issue) {
    return issue?.querySelector('.d-none:nth-of-type(2) a').innerText;
}

function setStyleForIssue(issue, status) {
    let color;
    switch (status) {
        case "Draft":
            color = DRAFT_COLOR;
            break;
        case "Changes requested":
            color = CHANGE_REQUEST_COLOR;
            break;
        case "Review required":
            color = WAITING_COLOR;
            break;
        case "Approved":
            color = APPROVED_COLOR;
            break;
        default:
            break;
    }

    console.log({issue, status, color});
    if (color) {
        issue.style.backgroundColor = color;
    }
}

function setStyleForStatusBadge(issue, status) {
    const badge = issue?.querySelector('.d-none:nth-of-type(2) a');

    let color = "black";

    switch (status) {
        case "Draft":
            color = "gray";
            break;
        case "Changes requested":
            color = "red";
            break;
        case "Review required":
            color = "orange";
            break;
        case "Approved":
            color = "green";
            break;
        default:
            break;
    }

    badge.style.borderWidth = "2px";
    badge.style.borderStyle = "solid";
    badge.style.borderColor = color;
    badge.style.borderRadius = "1em";
    badge.style.padding = "5px";
}

function highlightOwner(issue) {
    issue.querySelector("a.Link--muted").style.fontWeight = 800;
}
