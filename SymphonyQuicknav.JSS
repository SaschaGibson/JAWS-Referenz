; Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 11.0.xx

include "HJConst.jsh"
include "HJGlobal.jsh"
include "common.jsm"
include "Word QuickNav.jsm"
include "Symphony.jsm"
include "SymphonyQuickNav.jsh"

globals
	int gSymphonyQuickNavKeysOn

const
moveToPrior = 0,
moveToNext = 1

void function AutoFinishEvent()
NavigationModeToggle( false )
EndFunction

int function QuickNavKeysOn()
	return gSymphonyQuickNavKeysOn
EndFunction

void function NavigationModeToggle( int mode, int announceChange )
if ( mode == gSymphonyQuickNavKeysOn ) then
return;
EndIf

if ( mode ) then
SetQuickKeyNavigationMode (true)
TrapKeys ( true, false )
let gSymphonyQuickNavKeysOn = true
if ( announceChange ) then
SayUsingVoice(vctx_message, cmsgNavigationModeOn_L, ot_status)
EndIf
return
EndIf

; turn off
SetQuickKeyNavigationMode (false)
TrapKeys (false)
let gSymphonyQuickNavKeysOn = false
if ( announceChange ) then
SayUsingVoice(vctx_message, cmsgNavigationModeOff_L, ot_status)
EndIf
EndFunction

Script NavigationModeToggle()
NavigationModeToggle( ! gSymphonyQuickNavKeysOn, true )
EndScript

int function IsEditingKey( int nKey )
;SayInteger( nKey, 16 )
;returns true for all alphanumeric and punctuation keys, plus Backspace, Enter, space and their shifted equivalents.
var
	int nMaskedKey
;nMaskedKey allows us to compare nKey while ignoring if shift is part of the key combo
let nMaskedKey = nKey & 0xff1fffff
return
	(nMaskedKey>key_escape && nMaskedKey<key_tab)
	|| (nMaskedKey>key_tab && nMaskedKey<key_enter)
	|| (nMaskedKey>key_control && nMaskedKey<key_LeftShift)
	|| (nMaskedKey>key_leftShift && nMaskedKey<key_RightShift)
	|| (nKey>kiLeftShiftExclaim && nKey<=kiLeftShiftQuestion)
	|| nMaskedKey==key_spacebar
	|| nMaskedKey == key_delete
	|| (nKey>kiCtrlC && nKey<kiRightAltSlash)
EndFunction

int Function PreProcessKeyPressedEvent(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
var
	int bStopProcessing
;SayInteger( nKey, 16)
;SayString( strKeyName )
;SayInteger( nIsBrailleKey )
;SayInteger( nIsScriptKey )
let bStopProcessing = PreProcessKeyPressedEvent( nKey, strKeyName, nIsBrailleKey, nIsScriptKey )
if !bStopProcessing
&& gSymphonyQuickNavKeysOn
&& ! nIsScriptKey
&& ! IsEditingKey( nKey ) then
	SimulateKey(strKeyName)
	return true
EndIf
return bStopProcessing
EndFunction

script MoveToNextHeading(int nLevel)
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToHeading( moveToNext, nLevel ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, headings) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToPriorHeading(int nLevel)
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToHeading( moveToPrior, nLevel ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, headings) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToNextBookmark()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToLink( moveToNext ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, bookmarks ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToPriorBookmark()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToLink( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, bookmarks ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToNextList()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToList( moveToNext ) ) then
		SayMessage( ot_error, FormatString( cmsgNoMoreElements, lists ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToPriorList()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToList( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, lists ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToNextListItem()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToListItem( moveToNext ) ) then
		SayMessage( ot_error, FormatString( cmsgNoMoreElements, listItems ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToPriorListItem()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToListItem( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, listItems ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToNextTable()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToTable( moveToNext ) ) then
		SayMessage( ot_error, FormatString( cmsgNoMoreElements, tables ) )
EndIf
endScript

script MoveToPriorTable()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToTable( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, tables ) )
EndIf
endScript

script MoveToNextParagraph()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToParagraph( moveToNext ) ) then
		SayMessage( ot_error, FormatString( cmsgNoMoreElements, paragraphs ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayParagraph()
	EndIf
endScript

script MoveToPriorParagraph()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToParagraph( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, paragraphs ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayParagraph()
	EndIf
endScript

script MoveToNextMisspelled()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToMisspelled( moveToNext ) ) then
		SayMessage( ot_error, FormatString( cmsgNoMoreElements, spellingErrors ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

script MoveToPriorMisspelled()
if SayAllInProgress() then
;	let gbRestartSayAll = true
EndIf

var object o
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.MoveToMisspelled( moveToPrior ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, spellingErrors ) )
	return
EndIf

	if !SayAllInProgress() then
		Delay( 2 )
SayLine()
	EndIf
endScript

void function MoveToItem( string paragraphAndOffset )
var object o, int paragraph, int offset
let o = GetObject ("FSDomNodeSymphony.Script")

let paragraph = StringToInt(
StringSegment ( paragraphAndOffset, ":", 1 )
);

let offset = StringToInt(
StringSegment ( paragraphAndOffset, ":", 2 )
);

o.MoveToItem( paragraph, offset );
EndFunction

int function SelectALinkDialog()
var object o, string listText, string listIndexes
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.GetListOfLinks( stringref( listText ), stringref( listIndexes ) ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, bookmarks ) )
	return true
EndIf

var int quickNavKeysOn
let quickNavKeysOn =QuickNavKeysOn();
NavigationModeToggle( false, false );

var handle hwnd, int objectID, int childID
let hwnd = GetFocus( objectID, childID )

var int index
let index = DlgSelectItemInList (listText, SelectALinkDialogName, false, 1, "", -1)

NavigationModeToggle( quickNavKeysOn, false );

if ( index < 1 ) then
return true
EndIf

WaitForFocusToMoveTo( hwnd, objectID, childID, 1000 )
MoveToItem(
StringSegment( listIndexes, list_item_separator, index )
);

Delay( 2 )
SayLine()
return true
EndFunction

Script SelectATable()
var object o, string listText, string listIndexes
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.GetListOfTables( stringref( listText ), stringref( listIndexes ) ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, tables ) )
	return
EndIf

var int quickNavKeysOn
let quickNavKeysOn =QuickNavKeysOn();
NavigationModeToggle( false, false );

var handle hwnd, int objectID, int childID
let hwnd = GetFocus( objectID, childID )

var int index
let index = DlgSelectItemInList (listText, cmsgSelectATable, false, 1, "", -1)

NavigationModeToggle( quickNavKeysOn, false );

if ( index < 1 ) then
return
EndIf

WaitForFocusToMoveTo( hwnd, objectID, childID, 1000 )
MoveToItem(
StringSegment( listIndexes, list_item_separator, index )
);
EndScript

int function SelectAHeadingDialog()
var object o, string listText, string listIndexes
let o = GetObject ("FSDomNodeSymphony.Script")

if ( ! o.GetListOfHeadings( stringref( listText ), stringref( listIndexes ) ) ) then
	SayMessage( ot_error, FormatString( cmsgNoMoreElements, headings ) )
	return
EndIf

var int quickNavKeysOn
let quickNavKeysOn =QuickNavKeysOn();
NavigationModeToggle( false, false );

var handle hwnd, int objectID, int childID
let hwnd = GetFocus( objectID, childID )

var int index
let index = DlgSelectItemInList (listText, msgSelectAHeading, false, 1, "", -1)

NavigationModeToggle( quickNavKeysOn, false );

if ( index < 1 ) then
return
EndIf

WaitForFocusToMoveTo( hwnd, objectID, childID, 1000 )
MoveToItem(
StringSegment( listIndexes, list_item_separator, index )
);

Delay( 2 )
SayLine()
return true
EndFunction

Script SelectAHeading()
SelectAHeadingDialog()
EndScript
