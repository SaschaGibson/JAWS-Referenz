// JavaScript source code
var currentDiv = 0;
var pendingTextLabel = "OCR in progress. Please wait for additional content.";
var urlParams;
var automatic = false;

function generateDiv() {
    var divFormat = "<div id=\"resultsChunk%d\" style=\"display: none;\"></div>";
    var divText = sprintf(divFormat, currentDiv);
    var newHTML = document.getElementById("resultsDiv").innerHTML + divText;
    document.getElementById("resultsDiv").innerHTML = newHTML;
}

function runOnce() {
    ocrDataDistributor = window.chrome.webview.hostObjects.sync.OcrDataDistributor;
    if (!ocrDataDistributor) {
        return;
    }

    parseURL();
    if (urlParams['pendingTextLabel']) {
        pendingTextLabel = urlParams['pendingTextLabel'];
    }
}

$(window).on("unload", function () {
    if (ocrDataDistributor)
        ocrDataDistributor.Unregister();
    ocrDataDistributor = null;
});

$(window).on("error", function (event) {
	window.chrome.webview.postMessage('Error: Line: ' + event.originalEvent.line + ' Message: ' + event.originalEvent.message);
});

$(document).ready(function () {
    // Parse out the desired string from the URL.
    var pendingContentDiv = document.getElementById("pendingContent");
    if (pendingContentDiv) {
        pendingContentDiv.innerHTML = pendingTextLabel;
        onDataAvailable();
    }
});

runOnce();

function onDataAvailable() {
    if (!ocrDataDistributor)
        return "Error: no data distributor";

    data = ocrDataDistributor.GetData();
    if (data) {
        generateDiv();
        var divToUse = sprintf("resultsChunk%d", currentDiv);
        var div = document.getElementById(divToUse);
        if (div) {
            div.innerHTML = data.toString();
            var elements = div.querySelectorAll('*');
            for(var index = 0; index < elements.length; index++)
            {
                elements[index].removeAttribute('color');
                elements[index].removeAttribute('bgcolor');
                elements[index].style.removeProperty("color");
                elements[index].style.removeProperty("background-color");
                if (elements[index].classList.contains("Box") || elements[index].classList.contains("Boxlistheight"))
                {
                    const attributesToRemove = ["clip", "height", "left", "right", "top", "width"];
                    const stylesPropertiesToRemove = ["border", "border-bottom", "border-color", "border-left", "border-image", "border-right", "border-style", "border-top", "border-width", "height", "left", "right", "top", "width"];
                    attributesToRemove.forEach((attribute) => {
                        elements[index].removeAttribute(attribute)
                    });
                    stylesPropertiesToRemove.forEach((styleProperty) => {
                        elements[index].style.removeProperty(styleProperty)
                    });
                }
            }
            div.style.display = "block";
            window.chrome.webview.postMessage('ChunkAdded');
        }
        data = null;
        currentDiv++;
    }
    return "Success";
}

function onDocumentComplete() {
    // Once we've been notified that all content has been received,
    // we can hide the pending content warning.
    var pendingContentDiv = document.getElementById("pendingContent");
    if (!pendingContentDiv) {
        return "Error: no pendingContent";
    }

    pendingContentDiv.style.display = "none";
    return "Success";
}

function parseURL() {
    urlParams = (function (a) {

        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1]);
        }
        return b;
    })(window.location.search.substr(1).split('&'));
}

function onCreateExternalLink()
{
    if (!ocrDataDistributor)
    {
        return "Error: No ocrDataDistributor";
    }

    var externalLinkElement = document.getElementById("externalLinkDiv");
    if(!externalLinkElement)
    {
        return "Error: No externalLinkDiv";
    }

    var resultsElement = document.getElementById("resultsDiv");

    var linkText = ocrDataDistributor.GetExternalLinkText();
    if(linkText && linkText.length > 0)
    {
        externalLinkElement.innerHTML = "<a href=\"#noop\" onClick=\"onExternalLinkClicked()\">" + linkText + "</a>";
        externalLinkElement.style.display = "block";

        if(resultsElement)
        {
            resultsElement.style.marginTop = "20px";
        }
    }
    else
    {
        externalLinkElement.innerHTML = "";
        externalLinkElement.style.display = "none";

        if(resultsElement)
        {
            resultsElement.style.marginTop = "0px";
        }
    }

    return "Success";
}

function onExternalLinkClicked()
{
    var resultsElement = document.getElementById("resultsDiv");
    if(!resultsElement)
    {
        return "Error: No resultsDiv";
    }

    ocrDataDistributor.ExternalLinkClicked(resultsElement.innerHTML, automatic);
    return "Success";
}

function onSetAutomatic()
{
    automatic = true;
    window.chrome.webview.postMessage('SetAutomatic');
    return "Success";
}

function onClearAutomatic()
{
    automatic = false;
    window.chrome.webview.postMessage('ClearAutomatic');
    return "Success";
}
