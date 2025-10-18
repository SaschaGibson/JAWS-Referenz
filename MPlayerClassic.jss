; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 9 Media Player Classic script file
; developed by ST
; Be careful in naming and changing the names of the scripts. They are used in hot key help. See the script for the hot key help.

Include "Common.jsm"
Include "hjconst.jsh"
Include "MPlayerClassic.jsm"
Include "MPlayerClassic.jsh"

Void Function AutoStartEvent ()
  If GlobalMPlayerFirstTime == 0 then
    let GlobalMPlayerFirstTime = 1
    SayFormattedMessage (OT_HELP, MSG_StartUpMessage_L, MSG_StartUpMessage_S)
  EndIf ; DefaultFirstTime == 0
  AutoStartEvent ()
EndFunction

Void Function SayHighLightedText (handle hwnd, string buffer)
  If GetWindowTypeCode (hWnd) == WT_STATIC then
    If GlobalAnnounceTime && StringContainsChars (Buffer, "0123456789:") then
      SayMessage (OT_SCREEN_MESSAGE, Buffer)
    EndIf
    If StringContainsChars (Buffer, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") && GlobalAction != Buffer then
      let GlobalAction = Buffer
      SayMessage (OT_SCREEN_MESSAGE, Buffer)
    EndIf
    Return
  EndIf
  If GetControlID (hWnd) == DescriptionID then
    Return
  EndIf
  SayHighLightedText (hwnd, buffer)
EndFunction

Script HotKeyHelp()
var
	Int NumKeys,
	Int i,
	String KeyName,
	String ScriptName,
	String Section
if TouchNavigationHotKeys() then
	return
endIf
If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
let Section = IniReadSectionKeys (CommonKeys, GetActiveConfiguration () + ".jkm" )
let NumKeys = StringSegmentCount (Section, "|")
While i < NumKeys
	let i = i + 1
	let KeyName = StringSegment (Section, "|", i)
	let ScriptName = GetScriptAssignedTo (KeyName)
	SayMessage (OT_USER_BUFFER, FormatString (MSG_HelpLine, KeyName, StringMixedCaseToMultiword (ScriptName)))
EndWhile
SayMessage (OT_USER_BUFFER, "\n")
SayMessage (OT_USER_BUFFER, MSG_CloseMessage)
EndScript

Script ToggleTimeAnnouncing ()
  If GlobalAnnounceTime == TRUE then
    let GlobalAnnounceTime = FALSE
    SayMessage (OT_STATUS, MSG_AnnouncingOff_L, MSG_AnnouncingOff_S)
  Else
    let GlobalAnnounceTime = TRUE
    SayMessage (OT_STATUS, MSG_AnnouncingOn_L, MSG_AnnouncingOn_S)
  EndIf
EndScript

Int Function SayActionUnit (int Unit)
var
  Int cControlID

  let cControlID = GetControlID (GetFocus ())
  If (! IsPCCursor ()) || UserBufferIsActive () then
    Return (FALSE)
  EndIf
  Delay (1)
  If StringContains (GetWindowName (GetRealWindow (GetFocus ())), "Media Player Classic") then
    SayMessage (OT_JAWS_MESSAGE, GetScriptAssignedTo (GetCurrentScriptKeyName ()))
    Return (TRUE)
  EndIf
  Return (FALSE)
EndFunction

Script Rewind ()
  ;TypeCurrentScriptKey ()
  PriorWord ()
  If Not SayActionUnit (Unit_Word_Prior) then
    SayWord ()
  EndIf
EndScript

Script FastForward ()
  ;TypeCurrentScriptKey ()
  NextWord ()
  If Not SayActionUnit (Unit_Word_Next) then
    SayWord ()
  EndIf
EndScript

Script IncreaseVolume ()
  ;TypeCurrentScriptKey ()
  PriorLine ()
  If Not SayActionUnit (Unit_Line_Prior) then
    SayLineUnit(Unit_Line_Prior, TRUE)
  EndIf
EndScript

Script DecreaseVolume ()
  ;TypeCurrentScriptKey ()
  NextLine ()
  If Not SayActionUnit (Unit_Line_Next) then
    SayLineUnit(Unit_Line_Next, TRUE)
  EndIf
EndScript

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue,int bIsFocusObject)
  If GetControlID (hWnd) == OpenFileNameID then
    Return
  EndIf
  ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
EndFunction



Script ScreenSensitiveHelp ()
var
  String Name,
  Handle hWnd,
  Int TheTypeCode,
  Int cControlID

  If UserBufferIsActive () then
    UserBufferDeactivate()
  EndIf
  let hWnd = GetFocus ()
  let cControlID = GetControlID (hWnd)
  let Name = GetWindowName (hWnd)
  let TheTypeCode = GetWindowSubTypeCode (hWnd)
  ; Open file dialogue
  If cControlID == OKButtonID then
    SayMessage (OT_USER_BUFFER, MSG_OKButtonHelp)
  ElIf cControlID == CancelButtonID then
    SayMessage (OT_USER_BUFFER, MSG_CancelButtonHelp)
  ElIf cControlID == OpenFileNameID then
    If Name == WN_OpenComboName then	; Open file
      SayMessage (OT_USER_BUFFER, MSG_OpenFileHelp)
    ElIf Name == WN_DubComboName then
      SayMessage (OT_USER_BUFFER, MSG_DubFileHelp)
    ; Select video and audio card
    ElIf Name == WN_VideoComboName then
      SayMessage (OT_USER_BUFFER, MSG_VideoDeviceHelp)
    ElIf Name == WN_AudioComboName then
      SayMessage (OT_USER_BUFFER, MSG_AudioDeviceHelp)
    EndIf
  ; open file dialogue box
  ElIf cControlID == OpenFileBrowseID then
    SayMessage (OT_USER_BUFFER, MSG_BrowseOpenFile)
  ElIf cControlID == DubFileBrowseID then
    SayMessage (OT_USER_BUFFER, MSG_BrowseDubFile)
  ElIf cControlID == AddToPlayListID then
    SayMessage (OT_USER_BUFFER, MSG_AddToPlayList)
  ; the dialogue to select the audio video devices and country and TV standards (Open device).
  ElIf cControlID == CountrySelectionID then
    SayMessage (OT_USER_Buffer, MSG_CountrySelectionHelp)
  ; Properties of the clip dialogue (Properties).
  ElIf cControlID == PropertiesTabID then
    SayMessage (OT_USER_BUFFER, MSG_PropertiesTabHelp)
  ElIf cControlID == ClipNameID then
    If Name == WN_TimeName then
      SayMessage (OT_USER_BUFFER, MSG_TimeHelp)
    Else ; empty name
      SayMessage (OT_USER_BUFFER, MSG_ClipNameHelp)
    EndIf
  ElIf cControlID == ClipID then
    If Name == WN_ClipReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_ClipHelp)
    ElIf Name == WN_TypeReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_TypeHelp)
    EndIf
  ElIf cControlID == AuthorID then
    If Name == WN_AuthorReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_AuthorHelp)
    ElIf Name == WN_SizeReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_SizeHelp)
    EndIf
  ElIf cControlID == CopyrightID then
    If Name == WN_CopyrightReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_CopyrightHelp)
    ElIf Name == WN_MediaLengthReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_MediaLengthHelp)
    ElIf Name == WN_FrameName then
      SayMessage (OT_USER_BUFFER, MSG_FrameGoHelp)
    EndIf
  ElIf cControlID == RatingID then
    If Name == WN_RatingReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_RatingHelp)
    ElIf Name == WN_VideoSizeReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_VideoSizeHelp)
    EndIf
  ElIf cControlID == LocationID then
    If Name == WN_LocationReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_LocationHelp)
    ElIf Name == WN_CreatedReadOnlyName then
      SayMessage (OT_USER_BUFFER, MSG_CreatedHelp)
    EndIf
  ElIf cControlID == DescriptionID then
    let hWnd = FindWindowWithClassAndId (GetRealWindow (hWnd), TabClassName, PropertiesTabID)
    If hWnd then
      If SendMessage (hWnd, TCM_GETCURSEL, 0, 0) == 1 then
        SayMessage (OT_USER_BUFFER, MSG_AudioHelp)
      Else
        SayMessage (OT_USER_BUFFER, MSG_DescriptionHelp)
      EndIf
    EndIf
  ; go to dialogue
  ElIf cControlID ==  TimeGoButtonID then
    SayMessage (OT_USER_BUFFER, MSG_TimeGoButtonHelp)
  ElIf cControlID ==  FrameGoButtonID then
    SayMessage (OT_USER_BUFFER, MSG_FrameGoButtonHelp)





  Else
    PerformScript ScreenSensitiveHelp()
    Return
  EndIf
  If TheTypeCode == WT_READONLYEDIT then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp22_L, cmsgScreenSensitiveHelp22_S)
  ElIf TheTypeCode == WT_CHECKBOX then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp33_L, cmsgScreenSensitiveHelp33_S)
  ElIf TheTypeCode == WT_BUTTON then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp14_L, cmsgScreenSensitiveHelp14_S)
  ElIf TheTypeCode == WT_EDITCOMBO then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp50_L, cmsgScreenSensitiveHelp50_S)
  ElIf TheTypeCode == WT_COMBOBOX then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp15_L, cmsgScreenSensitiveHelp15_S)
  ElIf TheTypeCode == WT_TABCONTROL then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp38_L, cmsgScreenSensitiveHelp38_S)
  ElIf TheTypeCode == WT_EDIT then
    SayFormattedMessage (OT_USER_BUFFER, cmsgScreenSensitiveHelp16_L, cmsgScreenSensitiveHelp16_S)
  EndIf
  SayMessage (OT_USER_BUFFER, "\n")
  SayMessage (OT_USER_BUFFER, MSG_CloseMessage)
EndScript

int Function HandleCustomWindows (handle hWnd)
var
  Handle hWindow,
  Int cControlID,
  int iSubtype

  ;HjDialogs should always use older WindowTypeAndText code,
  ;So that on Windows 9X PositionInGroup info never misreports items
  If InHjDialog () then
    SayWindowTypeAndText (hWnd)
    let iSubtype = GetWindowSubtypeCode (hWnd)
    ;Announce tree item parent node:
    If iSubtype == wt_TreeView || iSubtype == wt_TreeViewItem then
      If GetTreeViewLevel() > 0 then
        SayUsingVoice(vctx_message,tvGetItemText(hWnd, tvGetParent(hWnd,tvGetSelection(hWnd))),ot_position)
      EndIf
    EndIf
    ;For input edit boxes:
    If iSubtype == WT_MULTILINE_EDIT then
      SayWindow (hWnd, TRUE)
    EndIf
    Return (TRUE)
  EndIf
  let cControlID = GetControlID (hWnd)
  If cControlID == DescriptionID then
    let hWindow = FindWindowWithClassAndId (GetRealWindow (hWnd), TabClassName, PropertiesTabID)
    If SendMessage (hWindow, TCM_GETCURSEL, 0, 0) == 1 then
      SayLine ()
    Else
      SayWindowTypeAndText (hWnd)
    EndIf
    Return (TRUE)
  EndIf
  Return (FALSE)
EndFunction

Script ScriptFileName ()
  ScriptAndAppNames(StringSegment (GetScriptFileName (TRUE), ".", 1))
EndScript

