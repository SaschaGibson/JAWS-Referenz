/********************************************************************
   Copyright (C) 2014 Freedom Scientific, Inc .
*********************************************************************/
var searchObject = window.chrome.webview.hostObjects.sync.CommandsSearcher;
var jawsObject = window.chrome.webview.hostObjects.sync.JawsApi;
var lastSpokenCommandName = "";
var application = '', language = '', debugOn = '', applicationWindowHwnd = '', mainWindowHwnd = '', interchangeMapName = '', directoriesJson = '', filterRanks = '#', stopWordsListFile = '', quickNavigationKeysActive = 'false';
var msgSearchForAction = '', msgNoResults = '', msgNoResultsFragment = '';
var urlParams;
var lastSearchPhrase = "";
var product = "JAWS";
function runOnce() {
    if (searchObject) {
        parseURL();
        loadMessages();
        searchObject.SetApplicationToSearch(application, language, filterRanks, interchangeMapName, stopWordsListFile, product, directoriesJson);
    }
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

    if (urlParams['appName']) {
        application = urlParams['appName'];
    }
    if (urlParams['lang']) {
        language = urlParams['lang'];
    }
    if (urlParams['debugOn']) {
        debugOn = urlParams['debugOn'];
    }
    if (urlParams['mainWindowHwnd']) {
        mainWindowHwnd = urlParams['mainWindowHwnd'];
    }
    if (urlParams['applicationWindowHwnd']) {
        applicationWindowHwnd = urlParams['applicationWindowHwnd'];
    }
    if (urlParams['interchangeMapName']) {
        interchangeMapName = urlParams['interchangeMapName'];
    }
    if (urlParams['directoriesJson']) {
        directoriesJson = urlParams['directoriesJson'];
    }
    if (urlParams['msgSearchForAction']) {
        msgSearchForAction = urlParams['msgSearchForAction'];
    }
    if (urlParams['msgNoResults']) {
        msgNoResults = urlParams['msgNoResults'];
    }
    if (urlParams['filterRanks']) {
        filterRanks = urlParams['filterRanks'];
    }
    if (urlParams['stopWordsListFile']) {
        stopWordsListFile = urlParams['stopWordsListFile'];
    }
    if (urlParams['QuickNavigationKeysActive']) {
        quickNavigationKeysActive = urlParams['QuickNavigationKeysActive'];
    }
}
function loadMessages() {
    if (!msgSearchForAction)
        msgSearchForAction = "Search for an action:";
    if (!msgNoResults)
        msgNoResults = "No results.";
    msgNoResultsFragment = formNoResultsFragment();
    $(document).ready(function () {
        onDocumentReady();
    });
}

runOnce();

function onDocumentReady() {
    document.getElementById("inputPromptText").innerHTML = msgSearchForAction;
    if (debugOn) {
        document.getElementById("resultsDiv").innerHTML = window.location.search;
    }
    var keystrokeWatchTimer = 0;
    var typeWatch = function () {
        return function (callback, ms) {
            clearTimeout(keystrokeWatchTimer);
            keystrokeWatchTimer = setTimeout(callback, ms);
        }
    }();
    document.getElementById('search_phrase').onkeyup = function (e) {
        e = e || window.event;
        if (e.keyCode == 13) { //Enter key
            clearTimeout(keystrokeWatchTimer);
            onEnterAction();
        }
        else if (e.keyCode == 27) { //ESC key
            stopApplication();
        }

        typeWatch(function () {
            displayResult();
        }, 100);
    }
    setTimeout(function () { document.getElementById('search_phrase').focus(); }, 500);
}

function onEnterAction() {
    if ($('#resultsDiv').is(':empty')) {
        setNoResults(false); //Dont speak the top result.
    }
    if ($('#noResultsDiv').length) {
        $('#noResultsDiv').focus();
    }
    else if ($('#result1_commandlink').length) {
        $('#result1_commandlink').focus();
    }
}

function displayResult() {
    if (lastSearchPhrase == document.getElementById('search_phrase').value)
        return;
    lastSearchPhrase = document.getElementById('search_phrase').value;
    document.getElementById("resultsDiv").innerHTML = "";
    var results = "";
    if (searchObject) {
        var searchPhrase = document.getElementById('search_phrase').value;
        searchPhrase = $.trim(searchPhrase);
        if (!searchPhrase.length) {
            return;
        }
        results = searchObject.SearchCommands(searchPhrase, product);
        if (results == "") {
            setNoResults();
            return;
        }
    }
    try {
        var resultsObj = jQuery.parseJSON(results);
    }
    catch (e) {
        document.getElementById("resultsDiv").innerHTML = results;
    }

    // document.getElementById("timeTaken").innerHTML = resultsObj.time_taken_in_ms;
    var resultsArr = [];
    if (!resultsObj.results.length) {
        setNoResults();
        return;
    }
    var result_number = 1;
    var resultsArr = []
    $.each(resultsObj.results, function (i, result) {
        if (result.command_name != "" && result.keysAvailable) {
            resultsArr.push(formResultFragment(result_number, result));
            if (result_number == 1) {
                speakTopCommand(result.command_name);
            }
            result_number += 1;
        }
    });
    /* There were results but they have no command name or a key binding */
    if (result_number == 1) {
        setNoResults();
        return;
    }
    document.getElementById("resultsDiv").innerHTML = resultsArr.join("");
    /* Add a click handler.  Doing it immediately after formResultsFragment does not work. */
    result_number = 1;
    $.each(resultsObj.results, function (i, result) {
        if (result.command_name != "" && result.keysAvailable) {
            addClickEventOnLinks(result_number, result);
            result_number += 1;
        }
    });

	resultsLoaded(result_number - 1);
}
function formCommandNameFragment(result_number, result) {
    var command_name_fragment = '<h3 class="command_name"><a id="%s" title="%s" href="#">%s</a></h3>';
    var result_id = "result" + result_number;
    var anchor_id = result_id + '_commandlink';
    var anchor_title = formAnchorTitle(result);
    if (debugOn)
        anchor_title += ' ' + anchor_id;
    var displayCommandName = addKeystrokeToCommandName(result_number, result);
    var command_name_output = sprintf(command_name_fragment, anchor_id, anchor_title, displayCommandName);
    return command_name_output;
}

function addKeystrokeToCommandName(result_number, result) {

    if (!result.keystrokes.length && !result.layered_keystrokes.length && !result.braille_keystrokes.length && !result.touch_gestures.length)
        return '<span id="command_name_span">' + result.command_name + '</span>';
    var keystroke_name = '';
    var braillestroke_name = '';
    var touch_gesture_name = '';
    var braille_stroke_found = false;
    var keystroke_found = false;
    var quick_nav_keystroke_found = false;
    var touch_gestures_found = false;
    if (result.quick_navigation_keystrokes.length) {
        keystroke_name = result.quick_navigation_keystrokes[0];
        result.quick_navigation_keystrokes.splice(0, 1);
        keystroke_found = true;
        quick_nav_keystroke_found = true;
    }
    else if (result.keystrokes.length) {
        keystroke_name = result.keystrokes[0];
        result.keystrokes.splice(0, 1);
        keystroke_found = true;
    }
    else if (result.layered_keystrokes.length) {
        keystroke_name = result.layered_keystrokes[0];
        result.layered_keystrokes.splice(0, 1);
        keystroke_found = true;
    }
    if (result.braille_keystrokes.length) {
        braillestroke_name = result.braille_keystrokes[0];
        result.braille_keystrokes.splice(0, 1);
        braille_stroke_found = true;
    }
    if (result.touch_gestures.length) {
        touch_gesture_name = result.touch_gestures[0];
        result.touch_gestures.splice(0, 1);
        touch_gestures_found = true;
    }

    var hidden_full_stop = '<span id="visual_hide">.</span>';
    var key_span = '';
    var keystroke_span = '';
    var braillestroke_span = '';
    var touch_gestures_span = '';

    if (keystroke_found) {
        keystroke_span = '<span class="commandline_keystrokes_span"> ' + keystroke_name + '</span>';
        key_span += hidden_full_stop + keystroke_span;
    }
    if (braille_stroke_found) {
        braillestroke_span = '<span class="commandline_braillestrokes_span"> ' + braillestroke_name + '</span>'
        key_span += hidden_full_stop + braillestroke_span;
    }
    if (touch_gestures_found) {
        var result_id = "span" + "result" + result_number;
        var touch_gestures_anchor_id = result_id + '_touchgesturesstrokeslink';
        touch_gestures_span_format = '<span id="%s" title="%s"class="commandline_touch_gestures_span">%s</span>';
        var title = "Click To " + result.command_name;
        if (debugOn)
            title += touch_gestures_anchor_id;

        touch_gestures_span = sprintf(touch_gestures_span_format, touch_gestures_anchor_id, title, touch_gesture_name);
        key_span += hidden_full_stop + touch_gestures_span;
    }
    return '<span id="command_name_span">' + result.command_name + '</span>' + key_span;
}

function formDescriptionFragment(result_number, result) {
    var description_fragment = '<div class = "desc">%s</div>';
    var desc = result.description == "" ? result.synopsis : result.description;
    var description_output = sprintf(description_fragment, desc);
    return description_output;
}

function formKeystrokeFragment(result_number, result) {
    var keystrokes_fragment = '<div id="keystrokes_container">';
    var remaining_keystrokes = result.quick_navigation_keystrokes.concat(result.keystrokes, result.layered_keystrokes);
    for (var i = 0; i < remaining_keystrokes.length; i++) {
        if (!remaining_keystrokes[i].length) {
            continue;
        }
        var key_fragment = '<a class="keystrokes" id=%s title=%s href="#">%s</a>';
        var result_id = "result" + result_number;
        var anchor_id = result_id + '_keystrokelink';
        var anchor_title = formAnchorTitle(result);
        if (debugOn)
            anchor_title += ' ' + anchor_id;
        keystrokes_fragment += sprintf(key_fragment, anchor_id, anchor_title, remaining_keystrokes[i]);
    }

    keystrokes_fragment += '</div>';
    return keystrokes_fragment;

}

function formBrailleFragment(result_number, result) {

    if (!result.braille_keystrokes.length) {
        return "";
    }

    var braille_strokes_fragment = '<div id="braille_container">';

    for (var i = 0; i < result.braille_keystrokes.length; i++) {
        if (!result.braille_keystrokes[i].length) {
            continue;
        }
        var braille_key_fragment = '<a class="braillestrokes " id=%s title=%s href="#">%s</a></li>';
        var result_id = "result" + result_number;
        var anchor_id = result_id + '_braillestrokelink';
        var anchor_title = formAnchorTitle(result);
        if (debugOn)
            anchor_title += ' ' + anchor_id;
        braille_strokes_fragment += sprintf(braille_key_fragment, anchor_id, anchor_title, result.braille_keystrokes[i]);

    }
    braille_strokes_fragment += '</div>';
    return braille_strokes_fragment;
}
function formTouchGesturesFragment(result_number, result) {
    if (!result.touch_gestures.length) {
        return "";
    }
    var touch_gestures_fragment = '<div id="touch_gestures_container">';
    for (var i = 0; i < result.touch_gestures.length; i++) {
        if (!result.touch_gestures[i].length) {
            continue;
        }
        var touch_gesture_fragment_format = '<a class="touchgesturesstrokes" id=%s title=%s href="#">%s</a></li>';
        var result_id = "result" + result_number;
        var anchor_id = result_id + '_touchgesturesstrokeslink';
        var anchor_title = formAnchorTitle(result);
        if (debugOn)
            anchor_title += ' ' + anchor_id;

        touch_gestures_fragment += sprintf(touch_gesture_fragment_format, anchor_id, anchor_title, result.touch_gestures[i]);
    }
    touch_gestures_fragment += '</div>';
    return touch_gestures_fragment;
}
function formResultFragment(result_number, result) {
    var result_entry_fragment = '<div class="result" id="%s"> %s %s %s %s %s</div>';
    var result_id = "result" + result_number;
    var changed_result = result;
    //Form command name will remove the keystroke from the result that it added to the command name.
    var commandName = formCommandNameFragment(result_number, changed_result);
    var desc = formDescriptionFragment(result_number, changed_result);
    var keystroke = formKeystrokeFragment(result_number, changed_result);
    var braille_keystroke = formBrailleFragment(result_number, changed_result);
    var touch_gestures = formTouchGesturesFragment(result_number, changed_result);

    var result_output = sprintf(result_entry_fragment, result_id, commandName, desc, keystroke, braille_keystroke, touch_gestures);

    if (debugOn)
        result_output += formDebugFragment(result_number, result);

    return result_output;
}
function formNoResultsFragment() {
    var no_results_entry_fragment = '<div id="noResultsDiv" tabindex=1 class="noResults">%s</div>';
    return sprintf(no_results_entry_fragment, msgNoResults);
}
function addClickEventOnLinks(result_number, result) {
    var result_id = "result" + result_number;
    var command_anchor_id = '#' + result_id + '_commandlink';
    var keystroke_anchor_id = '#' + result_id + '_keystrokelink';
    var braille_keystroke_anchor_id = '#' + result_id + '_braillestrokelink';
    var touch_gesture_anchor_id = '#' + result_id + '_touchgesturesstrokeslink';
    var touch_gesture_span_anchor_id = '#' + 'span' + result_id + '_touchgesturesstrokeslink';
    var execute_script = function () {
        executeScript(result.script_name, result.application);
        stopApplication();
        return false;
    };
    var execute_touch_script = function () {
        executeScript(result.touch_gesture_script_name, result.application);
        stopApplication();
        return false;
    };
    $(command_anchor_id).on("click", execute_script);
    $(keystroke_anchor_id).on("click", execute_script);
    $(braille_keystroke_anchor_id).on("click", execute_script);
    $(touch_gesture_anchor_id).on("click", execute_touch_script);
    $(touch_gesture_span_anchor_id).on("click", execute_touch_script);

}
function executeScript(script_name, application) {
    if (applicationWindowHwnd && jawsObject && searchObject) {
		if (application == "ZoomTextDefault")
	        var endFunctionToRun = "\"script ExecuteZoomTextCommand(" + script_name + ")\"";
		else
	        var endFunctionToRun = "\"script " + script_name + "\"";
        var runFunctionFormat = "SetFocusToWindowAndScheduleFunction(%s,%s,10000,0,1)";
        var runFunction = sprintf(runFunctionFormat, applicationWindowHwnd, endFunctionToRun);
        jawsObject.RunFunction(runFunction);
    }
}
function setNoResults(SpeakTopCommand) {
    SpeakTopCommand = typeof SpeakTopCommand !== 'undefined' ? SpeakTopCommand : true;
    document.getElementById("resultsDiv").innerHTML = msgNoResultsFragment;
    if (SpeakTopCommand) {
        speakTopCommand(msgNoResults);
    }

    resultsLoaded(0);
}
function stopApplication() {
    if (searchObject && mainWindowHwnd) {
        if (mainWindowHwnd)
            searchObject.CloseWindow(mainWindowHwnd);
    }
}
function formAnchorTitle(result) {
    var achor_title_format = 'Click to %s';
    var anchor_title = sprintf(achor_title_format, result.command_name);
    return anchor_title;
}

function formDebugFragment(result_number, result) {
    var debug_entry_fragment = '<div class="debug" id=debug_result_%d>JSD name:%s <br> Script name %s <br> score %d <br> category %s <br> application %s <br>keystrokes %s <br> layered %s <br> braille %s <br> touch_gesture_script %s <br> touch_gestures %s</div>'
    var debug_result_output = sprintf(debug_entry_fragment, result_number, result.jsd_file_path, result.script_name, result.score, result.category, result.application, result.keystrokes, result.layered_keystrokes, result.braille_keystrokes, result.touch_gesture_script_name, result.touch_gestures);
    return debug_result_output;
}
function speakTopCommand(command_name) {
    if (jawsObject && lastSpokenCommandName != command_name) {
        lastSpokenCommandName = command_name;
        jawsObject.SayString(lastSpokenCommandName, true);

    }
}
function formActionURL(result, source, sourceContent) {
    var action_link_fragment = 'action.html&script=%s&appName=%s&sourceType=%s&sourceContent=%s';
    var action_link_output = sprintf(action_link_fragment, result.script_name, result.application, source, sourceContent);
    return action_link_output;
}
function clearResults() {
    displayResult();
}
function resultsLoaded(count) {
    if (lastSearchPhrase == "") {
        return;
    }
	let data = {
		search: lastSearchPhrase,
		count: count
	};
    let request = {
		id: "ResultsLoaded",
		data: JSON.stringify(data)
    };
    window.chrome.webview.postMessage(request);
}