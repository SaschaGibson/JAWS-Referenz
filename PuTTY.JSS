include "hjconst.jsh";
include "common.jsm";

globals
	string putty_LastText
Script ScriptFileName()
	ScriptAndAppNames("PuTTY")
EndScript

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
	; We echo all new text using a timer  to handle the fact that PUTTY redraws the entire window on every change.
	; A timer allows us to compare the old screen contents with the new and only speak the changes.
	return TRUE
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
	if getWindowClass(getFocus()) == "PuTTY"
		ReadNewText()
	EndIf
	KeyPressedEvent(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

string function RemoveFirstLine(string text)
	var
		int newLinePos = StringContains(text,"\n")
	if newLinePos == 0
		return ""
	EndIf
	return StringChopLeft(text,newLinePos)
EndFunction

string function RemoveLastLine(string text)
	var int segmentCount = StringSegmentCount(text,"\n")
	if segmentCount == 1
		return ""
	EndIf
	var string finalSegment = StringSegment(text,"\n",segmentCount)
	return StringChopRight(text,StringLength(finalSegment))
EndFunction

int function AreChangesLimitedToBottomLine(string newText, string oldText)
	newText = RemoveLastLine(newText)
	oldText = RemoveLastLine(oldText)
	return newText == oldText
EndFunction

string function GetNewlyWrittenText(string newText, string oldText)
	if LevenshteinDistance(oldText,newText) < 3
		return "" ; prevent double echoing of characters that are typed
	EndIf
	if AreChangesLimitedToBottomLine(newText,oldText)
		stringTrimCommon(newText,oldText,1)
		return newText
	EndIf
	oldText = StringTrimTrailingBlanks(oldText)
	newText = StringTrimTrailingBlanks(newText)
	while oldText
		if StringStartsWith(newText,oldText)
			return StringDiff(newText,oldText)
		EndIf
		oldText = RemoveFirstLine(oldText)
	EndWhile
	return newText
EndFunction

Void function ScreenStabilizedEvent (handle hwnd)
	if (getWindowClass(getFocus()) != "PuTTY") then
		ScreenStabilizedEvent(hwnd);
		return
	EndIf
	readNewText();
	ScreenStabilizedEvent(hwnd);
EndFunction

Void Function readNewText ()
	var string text = GetTextInWindow (getFocus());
	text = RemoveFirstLine(text) ; Remove window title
	text = StringTrimTrailingBlanks(text)
	if text == putty_LastText
		return
	EndIf
	if GetScreenEcho() == ECHO_ALL
		Say(GetNewlyWrittenText(Text,putty_LastText),OT_NONHIGHLIGHTED_SCREEN_TEXT)
	EndIf
	putty_LastText = Text
EndFunction

