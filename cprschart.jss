Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants

globals
	int CoverVitalsID,
	int ODProcReasonForRequestID,
	int ODProcInpatientID,
	int ODProcOutpatientID,
	int ODCsltReasonForCsltID,
	int ODCsltInpatientID,
	int ODCsltOutpatientID,
	int PtCWADAllergiesID,
	int PtSelNotificationsID,
	int TemplateEditorBlankLinesID,
	int MedsInpatientID,
	int MedsOutPatientID,
	int ODMedsCommentsID,
	int ODMedsPriorityID,
	int NotesViewMenuID,
	int ConsultsByStatusStatusID,
	int ConsultActionCommentsID,
	int ConsultActionAlertID,
	int CurrentMenuContext

Const
	NoMenuContext = 0,
	NotesActionMenuContext = 1,
	NotesViewMenuContext = 2,
	ConsultsActionMenuContext = 3,
	ConsultsTrackingMenuContext = 4,
	ConsultsViewMenuContext = 5


;The component ID's vary from compile to compile, so constants aren't much help for identifying the components.
;Instead, we use the component's hierarchical position as an address to locate it as a descendant of the form.
;Finding addresses can be tricky.   Uncomment the SayString line below to test an address by tracing through the address resolution.
;If there are a lot of panels to wade through, it's easier to run CPRS with the Inspector that comes with MSAA developers kit.
;Get the focus on the control you want, and work with the parent/child/siblings buttons to see where they fit in the order.
;Note that MSAA Inspector treats "window" objects as parents of the corresponding "client" objects,
;while the "GetFirstChild" JAWS script routine considers them to be part of the ame object.  So, the addresses used here will be half as long
;as what you will find in MSAA land.
handle function GetHandleFromAddress(handle Parent, string Address)
	var
		int AddressIndex,
		string AddressPart,
		int TabsLeft,
		handle ControlAtAddress
	let AddressIndex = 1
	let AddressPart = StringSegment(Address, " ", AddressIndex)
	let ControlAtAddress = Parent
	while AddressPart != "" && ControlAtAddress != 0
		let TabsLeft = StringToInt(AddressPart) - 1
		let ControlAtAddress = GetFirstChild(ControlAtAddress)
		;SayString( "Control is " + GetWindowClass(ControlAtAddress) + GetWindowName(ControlAtAddress) + IntToString(TabsLeft) + " tabs left to go.")
		while TabsLeft > 0
			let TabsLeft = TabsLeft - 1
			let ControlAtAddress = GetNextWindow(ControlAtAddress)
			;SayString( "Control is " + GetWindowClass(ControlAtAddress) + GetWindowName(ControlAtAddress) + IntToString(TabsLeft) + " tabs left to go.")
		endwhile
		let AddressIndex = AddressIndex+1
		let AddressPart = StringSegment(Address, " ", AddressIndex)
	endwhile
	return ControlAtAddress
endFunction

handle function GetCurrentPageHandle()
	var
		handle ContainingWindow
	let ContainingWindow = GetRealWindow(GetFocus())
	if  GetWindowClass(ContainingWindow) == "TfrmFrame" then
		return GetHandleFromAddress(ContainingWindow, "1 1 1"); pnlPatientSelected, pnlPage, frmPage
	else
		return 0
	endif
endFunction

string function YankString(string S, string Except, int ByRef Yanked)
	let Yanked = SubString(S, 1, StringLength(Except)) == Except
	if Yanked then
		return SubString(S, StringLength(Except)+1, StringLength(S)-StringLength(Except))
	else
		return S
	endif
endFunction

string function StripControls( string KeyName, int ByRef Shifted, int ByRef Controlled, int ByRef Alted)
	var
		string S
	let S = KeyName
	let S = YankString(S, "LeftAlt+", Alted)
	if not Alted then
		let S = YankString(S, "RightAlt+", Alted)
	endif
	let S = YankString(S, "LeftControl+", Controlled)
	if not Controlled then
		let S = YankString(S, "RightControl+", Controlled)
	endif
	let S = YankString(S, "LeftShift+", Shifted)
	if not Shifted then
		let S = YankString(S, "RightShift+", Shifted)
	endif
	return S
endFunction

int function NewTextEventShouldBeSilent(handle hFocus, handle hwnd, string buffer, int nAttributes,
	int nTextColor, int nBackgroundColor, int nEcho, string sFrameName)
if GetWindowClass(hWnd) == "TORComboEdit" then
	return true
endif
return NewTextEventShouldBeSilent(hFocus, hwnd, buffer, nAttributes, nTextColor, nBackgroundColor, nEcho, sFrameName)
EndFunction


Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
	var
		string Class,
		int ID,
		handle ContainingWindow,
		handle CurrentPage,
		handle FormHandle
	;Populate component ID's
	if ReturningFromResearchItDialog () then
		return default::FocusChangedEvent (FocusWindow, PrevWindow)
	endIf
	Let ContainingWindow = GetRealWindow(FocusWindow)
	Let CurrentPage = GetCurrentPageHandle();
	if GetWindowClass(CurrentPage) == "TfrmCover" then
		if CoverVitalsID == 0 then
			let FormHandle = GetHandleFromAddress(CurrentPage, "1 1 2 1 2");pnlBase, pnlBottom, pnl_Not8, pnl_7, lst_7
			let CoverVitalsID = GetControlID(FormHandle)
		endif
	elif  GetWindowClass(CurrentPage) == "TfrmMeds" then
		if MedsInPatientID == 0 then
			let MedsInPatientID = GetControlID(GetHandleFromAddress(CurrentPage, "2 3")); pnlMedIn, lstMedsIn
 		endif
		if MedsOutPatientID == 0 then
			let MedsOutPatientID = GetControlID(GetHandleFromAddress(CurrentPage, "1 2")); pnlMedOut, lstMedsOut
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmODProc" then
		if ODProcReasonForRequestID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "16 1"); pnlReason, memReason
			let ODProcReasonForRequestID = GetControlID(FormHandle)
		endif
		if ODProcInpatientID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "12"); radInpatient
			let ODProcInpatientID = GetControlID(FormHandle)
		endif
		if ODProcOutpatientID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "11"); radOtpatient
			let ODProcOutpatientID = GetControlID(FormHandle)
		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmODCslt" then
		if ODCsltReasonForCsltID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "21 1"); pnlReason, memReason
			let ODCsltReasonForCsltID= GetControlID(FormHandle)
 		endif
		if ODCsltOutpatientID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 2"); gbInptOpt, radOutpatient
			let ODCsltOutpatientID = GetControlID(FormHandle)
		endif
		if ODCsltInpatientID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 1"); gbInptOpt, radInpatient
			let ODCsltInpatientID = GetControlID(FormHandle)
		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmPtCWAD" then
		if PtCWADAllergiesID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "5"); allergies
			let PtCWADAllergiesID = GetControlID(FormHandle)
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmPtSel" then
		if PtSelNotificationsID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1"); notification
			let PtSelNotificationsID = GetControlID(FormHandle)
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmTemplateEditor" then
		if TemplateEditorBlankLinesID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "4 3 1 1 11"); pnlTop, pnlRightTop, pnlProperties, gbProperties,edtGap
			let TemplateEditorBlankLinesID = GetControlID(FormHandle)
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmODMeds" then
		if ODMedsCommentsID == 0 then
			if GetHandleFromAddress(ContainingWindow, "1 1 9") == 0 then; make sure we are in Inpatient
				let FormHandle = GetHandleFromAddress(ContainingWindow, "1 1 7"); pnlFields, pnlBottom, memComment
				let ODMedsCommentsID = GetControlID(FormHandle)
			endif
		endif
		if ODMedsPriorityID == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 1 2 2"); pnlFields, pnlBottom, cboPriority, [Combo Edit]
			let ODMedsPriorityID = GetControlID(FormHandle)
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmConsultsByStatus" then
		if ConsultsByStatusStatusID  == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 4"); pnlBase,lstStatus
			let ConsultsByStatusStatusID = GetControlID(FormHandle)
 		endif
	elif  GetWindowClass(ContainingWindow) == "TfrmConsultAction" then
		if ConsultActionCommentsID  == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 1 2 3"); pnlBase,pnlOther,pnlComments,memComments
			let ConsultActionCommentsID = GetControlID(FormHandle)
		endif
		if ConsultActionAlertID  == 0 then
			let FormHandle = GetHandleFromAddress(ContainingWindow, "1 1 2 1 1"); pnlBase,pnlOther,pnlComments,pnlAlert,ckAlert
			let ConsultActionAlertID = GetControlID(FormHandle)
 		endif
	endif
	Let Class = GetWindowClass (FocusWindow)
	if Class == "TORListBox" then
		Let ID = GetControlID(FocusWindow)
		if ID == CoverVitalsID then  ;Vitals list box on cover sheet
			SayString("Vitals")
		elif ID == PtCWADAllergiesID then; Allergies list box on patient postings
			SayString("Allergies")
		elif ID == ConsultsByStatusStatusID then; Status list box on consults by status dialog
			SayString("Status")
			SayString(GetWindowType(FocusWindow)); JAWS occasionally finds the label, so don't speak it again!
			SayString(GetWindowText(FocusWindow, 0))
			return
		endif
	elif Class == "TCaptionRichEdit" then
		Let ID = GetControlID(FocusWindow)
		if ID == ODProcReasonForRequestID then ;Reason for request on OD Procs
			SayString("Reason for Request")
		endif
	elif Class == "TRichEdit" then
		Let ID = GetControlID(FocusWindow)
		if ID == ODCsltReasonForCsltID then ;Reason for request on OD Consult
			SayString("Reason for Request")
		endif
	elif Class == "TRadioButton" then
		Let ID = GetControlID(FocusWindow)
		if ID == ID == ODCsltOutpatientID || ODProcInpatientID || ID == ODProcOutpatientID || ID == ODCsltInpatientID then ;Radio buttons on OD Procs
			SayString("Patient will be seen as an ")
		endif
	elif Class == "TCaptionListView" then
		Let ID = GetControlID(FocusWindow)
		if ID == PtSelNotificationsID then ;Notification list on Patient select
			SayString("Notifications")
		endif
	elif Class == "TCaptionEdit" then
		Let ID = GetControlID(FocusWindow)
		if ID == TemplateEditorBlankLinesID then ;Number of blank lines on Template Editor
			SayString("Number of blank lines to insert between items")
			SayString(GetWindowType(FocusWindow))
			SayString(GetWindowText(FocusWindow, 0))
			return
		endif
	elif Class == "TCaptionListBox" then
		Let ID = GetControlID(FocusWindow)
		if ID == MedsInPatientID then ;Inpatient Medications on Meds tab
			SayString("Inpatient Medications")
		elif ID == MedsOutPatientID then ;Outpatient Medications on Meds tab
			SayString("Outpatient Medications")
		endif
	elif Class == "TCaptionMemo" then
		Let ID = GetControlID(FocusWindow)
		if ID == ODMedsCommentsID then ;Comment box on Meds order
			SayString("Comments")
		elif ID == ConsultActionCommentsID then ;Comment Box on consult action
			SayString("Comments")
		endif
	elif Class == "TORComboEdit" then
		Let ID = GetControlID(FocusWindow)
		if ID == ODMedsPriorityID then ;Priority combo box on Meds order
			SayString("Priority")
			SayString(GetWindowType(FocusWindow))
			SayString(GetWindowText(FocusWindow, 0))
			return
		endif
	elif Class == "TCheckBox" then
		Let ID = GetControlID(FocusWindow)
		if ID == ConsultActionAlertID then ;Alert check box on consult action tab
			SayString(GetWindowName(GetNextWindow(FocusWindow))) ;Auto-alert message
		endif
	endif
	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction


Void Function AutoStartEvent ()
	let CoverVitalsID = 0
	let ODProcReasonForRequestID = 0
	let ODProcInpatientID = 0
	let ODProcOutpatientID = 0
	let ODCsltReasonForCsltID = 0
	let ODCsltInpatientID = 0
	let ODCsltOutpatientID = 0
	let PtCWADAllergiesID = 0
	let PtSelNotificationsID = 0
	let TemplateEditorBlankLinesID = 0
	let MedsInPatientID = 0
	let MedsOutPatientID = 0
	let ODMedsCommentsID = 0
	let ODMedsPriorityID = 0
	let NotesViewMenuID = 0
	let ConsultsByStatusStatusID = 0
	let ConsultActionCommentsID = 0
	let ConsultActionAlertID = 0
	let CurrentMenuContext = NoMenuContext
	AutoStartEvent ()
EndFunction

Void Function MenuBarToMenuContext(string PlainKeyName)
	var
		string PageName
	let PageName = GetWindowClass(GetCurrentPageHandle())
	if PageName == "TfrmNotes" then
		if PlainKeyName == "A" then
			let CurrentMenuContext = NotesActionMenuContext
		elif PlainKeyName == "V" then
			let CurrentMenuContext = NotesViewMenuContext
		endif
	elif PageName == "TfrmConsults" then
		if PlainKeyName == "A" then
			let CurrentMenuContext = ConsultsActionMenuContext
		elif PlainKeyName == "V" then
			let CurrentMenuContext = ConsultsViewMenuContext
		endif
	endif
EndFunction

Void Function ProcessKeyPressed(int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
	var
		string PlainKeyName,
		int Shifted,
		int Controlled,
		int Alted,
		string PageName,
		int DoMenuBar
	let PlainKeyName = StripControls(strKeyName, Shifted, Controlled, Alted)
	let PageName = GetWindowClass(GetCurrentPageHandle())

	;Handle shortcut keys first
	if PageName == "TfrmNotes" &&  PlainKeyName == "A" && Shifted && Controlled && not Alted then
		SayString("Saving note without signature")
	else
		let DoMenuBar = GlobalMenuMode == MENUBAR_ACTIVE || (GlobalMenuMode == MENU_INACTIVE && Alted)
		if DoMenuBar then
			MenuBarToMenuContext(PlainKeyName)
		elif CurrentMenuContext == NotesActionMenuContext then
			if PlainKeyName == "A" then
				SayString("Saving note without signature")
				let CurrentMenuContext = NoMenuContext
			else
				MenuBarToMenuContext(PlainKeyName)
			endif
		elif CurrentMenuContext == NotesViewMenuContext  then
			if PlainKeyName == "D" then
				SayString("Toggling note details")
				let CurrentMenuContext = NoMenuContext
			else
				MenuBarToMenuContext(PlainKeyName)
			endif
		elif CurrentMenuContext == ConsultsActionMenuContext  then
			if PlainKeyName == "C" then
				let CurrentMenuContext = ConsultsTrackingMenuContext
			else
				MenuBarToMenuContext(PlainKeyName)
			endif
		elif CurrentMenuContext == ConsultsTrackingMenuContext  then
			if PlainKeyName == "T" then
				SayString("Displaying consult details")
				let CurrentMenuContext = NoMenuContext
			elif PlainKeyName == "U" then
				SayString("Displaying consult results")
				let CurrentMenuContext = NoMenuContext
			else
				MenuBarToMenuContext(PlainKeyName)
			endif
		elif CurrentMenuContext == ConsultsViewMenuContext  then
			if PlainKeyName == "F" then
				SayString("Returning to default view")
				let CurrentMenuContext = NoMenuContext
			else
				MenuBarToMenuContext(PlainKeyName)
			endif
		endif
	endif
ProcessKeyPressed(nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

Void Function MenuModeEvent (handle WinHandle, int mode)
	if mode == MENU_INACTIVE then
		let CurrentMenuContext = NoMenuContext
	endif
	MenuModeEvent(WinHandle,mode)
EndFunction

/*  Event chasing code below.  Uncomment bits of this to trace the firing of events
Void Function FocusChangedEvent (handle FocusWindow, handle PrevWindow)
	SayString( "Focus Changed Event")
	FocusChangedEvent(FocusWindow, PrevWindow)
EndFunction

Void Function ActiveItemChangedEvent (handle curHwnd, int curObjectId, int curChildId,
	handle prevHwnd, int prevObjectId, int prevChildId)
	SayString( "Active Item Changed Event")
	ActiveItemChangedEvent (curHwnd, curObjectId, curChildId, prevHwnd, prevObjectId, prevChildId)
EndFunction

Void Function AutoFinishEvent ()
	SayString( "Auto Finish Event")
	AutoFinishEvent ()
EndFunction

Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
	SayString( "Key Pressed Event")
	KeyPressedEvent (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
EndFunction

void function ObjStateChangedEvent (handle hObj)
	SayString( "Object State Changed Event")
	ObjStateChangedEvent (hObj)
EndFunction

Void Function FocusPointMovedEvent (int nX, int nY, int nOldX, int nOldY, int nUnit, int nDir, int nTimeElapsed)
	SayString( "Focus Point Moved Event")
	FocusPointMovedEvent (nX, nY, nOldX, nOldY, nUnit, nDir, nTimeElapsed)
EndFunction

Void Function ValueChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sObjName, string sObjValue, int bIsFocusObject)
SayString( "Value Changed Event")
ValueChangedEvent (hwnd, objId, childId, nObjType, sObjName, sObjValue, bIsFocusObject)
EndFunction

Void Function DocumentLoadedEvent ()
	SayString( "Dcoument Loaded Event")
	DocumentLoadedEvent ()
EndFunction

void function FormsModeEvent(int bEntering, optional int lastMovementUnit  )
	SayString( "Forms Mode Event")
	FormsModeEvent(bEntering, lastMovementUnit)
EndFunction

void function TextSelectedEvent(string strText, int bUnSelecting)
	SayString( "Text Selected Event")
	TextSelectedEvent(strText, bUnSelecting)
EndFunction
/* End of event chasing */

