let requestInProgress = false;
let chatService = "";
let conversationId = "";

window.chrome.webview.addEventListener('message', event => {
    onHostMessage(event.data);
});

function onHostMessage(message) {
    if (message.id == "ps_chatresponse") {
        removeWaitIndicatorFromChatLog();
        appendResponseToChatLog(message.data);
        requestInProgress = false;
    }
}
function onChatLink(service) {
    chatService = service;
    for (const description of document.querySelectorAll(".chat-description")) {
        if (description.dataset.service == chatService) {
            conversationId = description.dataset.conversation;
        }
        else {
            description.style.display = "none";
        }
    }
    document.getElementById('block-links').style.display = "none";
    document.getElementById('block-chat').style.display = "flex";
    document.getElementById('chat-input').focus();
}
function onChatKeydown(event) {
    const ENTER_KEYCODE = 13;
    if (event.keyCode === ENTER_KEYCODE && !event.shiftKey) {
        event.preventDefault();
        askquestion();
    }
}
function askquestion() {
    let question = document.getElementById('chat-input').value;
    if (!question || requestInProgress) {
        return;
    }
    requestInProgress = true;
    appendQuestionToChatLog(question);
    appendWaitIndicatorToChatLog();
    sendQuestionToHost(question);
    clearChatInput();
}
function appendQuestionToChatLog(text) {
    let questionElement = document.createElement('h2');
    questionElement.innerText = text;
    questionElement.className = "chat-question";
    appendElementToChatLog(questionElement);
}
function appendWaitIndicatorToChatLog() {
    let waitIndicator = document.createElement('div');
    waitIndicator.className = "chat-waitindicator";
    let loadingDots = document.createElement('div');
    loadingDots.className = "loading-dots"
    waitIndicator.appendChild(loadingDots);
    appendElementToChatLog(waitIndicator);
}
function sendQuestionToHost(question) {
    let data = {
        prompt: question,
        service: chatService,
        conversation: conversationId,
    };
    let request = {
        id: "ps_chatrequest",
        data: JSON.stringify(data),
    };
    window.chrome.webview.postMessage(request);
}
function clearChatInput() {
    document.getElementById('chat-input').value = '';
}
function removeWaitIndicatorFromChatLog() {
    let waitIndicator = document.querySelector('#chat-log > .chat-waitindicator');
    if (waitIndicator.parentNode) {
        waitIndicator.parentNode.removeChild(waitIndicator);
    }
}
function appendResponseToChatLog(text) {
    let responseElement = document.createElement('p');
    responseElement.innerText = text;
    responseElement.className = "chat-response";
    appendElementToChatLog(responseElement);
}
function appendElementToChatLog(element) {
    element.style.opacity = 0;
    document.getElementById('chat-log').appendChild(element);
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    fadeInElement(element);
}
function fadeInElement(element) {
    let opacity = 0;
    let intervalID = setInterval(function () {
        if (opacity < 1) {
            opacity = opacity + 0.2
            element.style.opacity = opacity;
        } else {
            clearInterval(intervalID);
        }
    }, 50);
}
function toggleCollapsible() {
    var content = document.getElementById("collapsibleContent");
    var button = document.getElementById("collapsibleButton");
    var icon = document.getElementById("collapsibleIcon");

    var isExpanded = !(button.getAttribute('aria-expanded') === 'true');
    button.setAttribute('aria-expanded', isExpanded);
    content.style.display = isExpanded ? 'block' : "none";
    icon.textContent = isExpanded ? "-" : "+";
}