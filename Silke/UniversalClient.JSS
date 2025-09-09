use "uia.jsb"

include "hjconst.jsh"
include "uia.jsh"

;Const Reason = "flpReasons"
Const Reason = "lbText",
info = "lbInfo",

Title_Team = "Team: Mein Team"

Globals
	int myNameSet,
	string myName,
	
	string myliste, string myliste_name, int myliste_index, int myliste_on, string myliste_runafter,
	string submenu_names_x, string submenu_names_y,
	
	int schedInfo,
	
	string callerInfo,
	
	handle HwndAgentOne,
	
	int myPosX, int myPosy

int Function Focuschangedevent (handle hto, handle hfrom)
	var
		int type,
		string name
		
	myNameSet = false
		
	type = GetObjectSubTypeCode (hto)
	
	if type == WT_EDIT || type == WT_PASSWORDEDIT  Then
		if GetObjectName (false, 0) == "" || GetObjectName (false, 0) == "Benutzer:" Then
			SaveCursor ()
			InvisibleCursor ()
;			JawsCursor ()
			RouteInvisibleToPc ()
;			RouteJawsToPc ()
			MoveTo (GetCursorCol () + 5, GetCursorRow () - 20)
			name = GetObjectName (false, 0)
			SayControlEx (hto, name, "", "", "", "", "", "", "")
			mynameset = true
			myname = name
			return
		Endif
	Endif
	FocusChangedEvent (hto, hfrom)
EndFunction

int Function BrailleAddObjectName (int type)
	if mynameset Then
		BrailleAddString (myname, 0, 0, 0)
		return true
	Endif
	return false
EndFunction

Globals object myUia,
		object mytree

Script GotoAgentButton ()
	var
	
	object element,
	handle hwnd,
	int weiter, int weiter2,
	object rect, string name, string color,
	string localname,
	
	int x, int y,
	
	string names, string pos_x, string pos_y,
	int ret

	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	Savecursor ()
	JawsCursor ()
	MoveTo (1, 1)
	Pause ()
	MoveTo (GetWindowRight (GetRealWindow (GetFocus ())), GetWindowBottom (GetRealWindow (GetFocus ())))
	Restorecursor ()
	
;	hwnd = FindWindow (0, "WindowsForms10.Window.8.app.0.2982bee_r6_ad1", "AgentOne Client")
	hwnd = hwndAgentOne
	myTree.CurrentElement = myUia.GetElementFromHandle (hwnd)
	myTree.GotoFirstChild ()
	myTree.GotoFirstChild ()
	weiter = true
	while weiter
		localname = ""
		mytree.GotoFirstChild ()
		weiter2 = true
		while weiter2
			element = mytree.CurrentElement
			rect = element.BoundingRectangle ()
			x = rect.left + 5
			y = (rect.top + rect.bottom) / 2
			
			name = Element.name
			localname = name + " " + localname 
			weiter2 = mytree.GotoNextSibling ()
		EndWhile
		mytree.GotoParent ()
		element = mytree.CurrentElement
		name = Element.name
		color = GetColorName (GetColorAtPoint (x, y))
		if color == "grau97" Then
			color = ""
		Endif
		if Color == "zitronengrün2" Then
			color = "grün"
		Endif
		if color == "blassgrün2" Then
			color = "hellgrün"
		Endif
		name = name + color
		if (StringContains (names, "Wartefeld") == 0) Then 
			names = names + localname + color + "\007"
			pos_x = pos_x + inttostring (x) + "\007"
			pos_y = pos_y + inttostring (y) + "\007"
		Else
			if (StringContains (localname, "Wartefeld") == 0) Then
				names = names + localname + "\007"
				pos_x = pos_x + inttostring (x) + "\007"
				pos_y = pos_y + inttostring (y) + "\007"
			Endif
		Endif
		weiter = mytree.GotoNextSibling ()
	EndWhile

	ret = DlgSelectItemInList (names, "Schalter wählen", false, 0)
	
	if ret Then
		x = StringToInt (StringSegment (pos_x, "\007", ret))
		y = StringToInt (StringSegment (pos_y, "\007", ret))
		
	
		SaveCursor ()
		JawsCursor ()
		MoveTo (x, y)
		Delay (1)
		Pause ()
		RightMouseButton ()
		RestoreCursor ()
		PerformScript HandleSubPanel ()
	Endif
EndScript

String Function GetAgentState ()
	var
	
	object element,
	handle hwnd,
	int weiter,
	object rect, string name, string color,
	
	int x, int y,
	
	string result

	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	Savecursor ()
	JawsCursor ()
	MoveTo (1, 1)
	Pause ()
	MoveTo (GetWindowRight (GetRealWindow (GetFocus ())), GetWindowBottom (GetRealWindow (GetFocus ())))
	Restorecursor ()

;	hwnd = FindWindow (0, "WindowsForms10.Window.8.app.0.2982bee_r6_ad1", "AgentOne Client")
	hwnd = hwndAgentOne
	
	myTree.CurrentElement = myUia.GetElementFromHandle (hwnd)
	myTree.GotoFirstChild ()
	myTree.GotoFirstChild ()
	weiter = true
	while weiter
		mytree.GotoFirstChild ()
		while mytree.GotoNextSibling ()
			element = mytree.CurrentElement
			name = element.name
			rect = element.BoundingRectangle ()
			x = rect.left + 5
			y = (rect.top + rect.bottom) / 2
			
		EndWhile
		mytree.GotoParent ()
		element = mytree.CurrentElement
;		name = Element.name
		color = GetColorName (GetColorAtPoint (x, y))
		if color == "grau97" Then
			color = ""
		Endif
		if Color == "zitronengrün2" Then
			color = "grün"
		Endif
		if Name == "Status" Then
			result = color
			myposx = x
			myposy = y
			return result
		Endif
		weiter = mytree.GotoNextSibling ()
	EndWhile

	return "nicht gefunden"
EndFunction

Script AgentOn ()
	var
		string akstate
		
	akstate = GetAgentState ()
	if IsSameScript () Then
		if akstate != "grün" Then
			SaveCursor ()
			JawsCursor ()
			MoveTo (myposx, myposy)
			LeftMouseButton ()
			Delay (1)
			MoveTo (1, 1)
			ScheduleFunction ("NextAgentStatus", 5)
		else
			saystring ("ich mach nix")
		Endif
	Else
		sayString (akstate)
	Endif
EndScript

Function NextAgentStatus ()
	SayString (GetAgentState ())
EndFunction



Script HandleSubPanel ()
	var
		object old, object now,
		string types,
		string name, string names,
		object rect, object val,
		string names_x, string names_y,
		int x, int y, int ret, string value,
		int sec

	SaveCursor ()
	JawsCursor ()
	MouseRight (10)
	MouseDown (30)
	Delay (1)
	old = myUia.GetElementFromHandle (GetCurrentWindow ())
	Delay (10)
	now = myUia.GetElementFromHandle (GetCurrentWindow ())
		mytree.currentelement = now
		while now.ControlType != UIA_WindowControlTypeId
			types = types + inttostring (now.Controltype) + "|"
			now = mytree.currentelement
			mytree.currentelement = now
			mytree.gotoparent ()
			now = mytree.currentelement
			sec = sec + 1
			delay (2)
			if sec > 100 Then
				return
			endif
			if !now Then
				return
			Endif
		EndWhile
		if now.name == Title_Team Then
			PerformScript HandleTeamWindow (now)
			return
		Endif
		submenu_names_x = ""
		submenu_names_y = ""
		while now
			now = MoveToNextUIAElement (myuia, now, mytree)
			if now.Controltype == UIA_ButtonControlTypeId || now.Controltype == UIA_EditControlTypeId Then
				name = now.name
				if now.Controltype == UIA_EditControlTypeId Then
					val = now.GetvaluePattern()
					value = val.value
					
					name = name + "Edit: " + value
				Endif
				if StringLength (name) Then
					names = names + name + "\007"
					rect = now.BoundingRectangle
					x = (rect.left + rect.right) / 2
					y = (rect.top + rect.bottom) / 2
					names_x = names_x + inttostring (x) + "\007"
					names_y = names_y + inttostring (y) + "\007"
				Endif
			Endif
		EndWhile
		PerformScript HandleMyListe ("Element wählen", names, "SelectSubEntrie")
		Submenu_Names_x = names_x
		Submenu_Names_y = names_y
EndScript

Script HandleTeamWindow (object win)
	var
	
		object texte, object text,
		object condi, string s,
		string akline, int counter, string lines
	
	condi = myUia.CreateIntPropertyCondition(UIA_ControlTypePropertyId, UIA_TextControlTypeId);	
	
	texte = win.FindAll (TreeScope_SubTree, condi)
		
	foreach text in texte
		s = text.name
		akline = akline + s
		counter = counter + 1
		if counter == 3 Then
			lines = lines + akline + "\007"
			akline = ""
			counter = 0
		Endif
	EndForeach
		PerformScript HandleMyListe ("Team", lines, "nix")
EndScript

Script GotoCallButton ()
	var
	
	object element,
	handle hwnd,
	int weiter,
	object rect, string name, string color,
	
	int x, int y,
	
	string names, string pos_x, string pos_y,
	int ret

	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	Savecursor ()
	JawsCursor ()
	MoveTo (1, 1)
	Pause ()
	MoveTo (GetWindowRight (GetRealWindow (GetFocus ())), GetWindowBottom (GetRealWindow (GetFocus ())))
	Restorecursor ()
	


	hwnd = FindWindow (0, "WindowsForms10.Window.8.app.0.2982bee_r6_ad1", "AgentOne Client")
	
	myTree.CurrentElement = myUia.GetElementFromHandle (hwnd)
	myTree.GotoFirstChild ()
	myTree.GotoFirstChild ()
	weiter = true
	while weiter
		mytree.GotoFirstChild ()
		while mytree.GotoNextSibling ()
			element = mytree.CurrentElement
			rect = element.BoundingRectangle ()
			x = rect.left + 5
			y = (rect.top + rect.bottom) / 2
			
			name = Element.name
			names = names + name + " "
		EndWhile
		mytree.GotoParent ()
		element = mytree.CurrentElement
		name = Element.name
		color = GetColorName (GetColorAtPoint (x, y))
		if color == "grau97" Then
			color = ""
		Endif
		if Color == "zitronengrün2" Then
			color = "grün"
		Endif
		name = name + color
		names = names + name + "\007"
		pos_x = pos_x + inttostring (x) + "\007"
		pos_y = pos_y + inttostring (y) + "\007"
		weiter = mytree.GotoNextSibling ()
	EndWhile

	ret = 3
	
	if ret Then
		x = StringToInt (StringSegment (pos_x, "\007", ret))
		y = StringToInt (StringSegment (pos_y, "\007", ret))
		
	
		SaveCursor ()
		JawsCursor ()
		MoveTo (x, y)
		Delay (1)
		Pause ()
		RightMouseButton ()
		RestoreCursor ()
		PerformScript HandleSubPanel ()
	Endif
EndScript

Function SelectSubEntrie ()
	var
		int x, int y
	
		x = StringToInt (StringSegment(submenu_names_x, "\007", myListe_index))
		y = StringToInt (StringSegment(submenu_names_y, "\007", myliste_index))
		Savecursor ()
		JawsCursor ()
		MoveTo (x, y)
		Pause ()
		LeftMouseButton ()
		
		if !stringCompare (stringSegment (myliste, "\007", myliste_index), "Nicht Bereit") Then
			Delay (10)
			MouseDown (40)
			PerformScript ListReasons()
		Else
			RestoreCursor ()
		Endif
EndFunction

Object Function MoveToNextUIAElement (object uia, object element, object tree)
	var
		object o, int i
		
	tree.CurrentElement = element
	if tree.GotoFirstChild ()
		return tree.Currentelement()
	Endif
	if tree.GotoNextSibling ()
		return tree.Currentelement()
	Endif
	o = tree.CurrentElement ()
	while o.ControlType != UIA_WindowControlTypeId
		i = i + 1
		if i == 200 then
			return null()
		Endif
		if tree.GotoParent()
			o = tree.CurrentElement 
			if o.ControlType == UIA_WindowControlTypeId Then
				return null()
			Endif
			if tree.GotonextSibling () Then
				o = tree.CurrentElement ()
				return o
			Endif
		else
		endif
	EndWhile
EndFunction

Script HandleMyListe (string name, string elements, string runafter)
	if stringsegmentcount (elements, "\007") > 0 Then
		myliste_name = name
		myliste = elements
		myliste_on = true
		myliste_index = 1
		myliste_runafter = runafter
		PerformScript SayMyList ()
	Else
		SayString ("Keine Liste")
	Endif
EndScript

Script SAyMyList ()
	stopspeech ()
;	SayString (myListe_name)
	SayString (StringSegment (myliste, "\007", myliste_index))
	BrailleRefresh ()
EndScript

int Function BrailleBuildLine ()
	if myliste_on Then
		BrailleAddString (myliste_name + ": " + StringSegment (myliste, "\007", myliste_index), 0, 0, 0)
		return true
	Endif
	brailleAddString (callerinfo, 0, 0, 0)
	if GetObjectClassName (0) == "System.Windows.Forms.DataGridView" Then
		brailleaddString (GetObjectValue (false, 0), 0, 0, 0)
	Endif
;	BrailleAddFocusItem (false, false)
	return true
EndFunction

Script SayNextLine ()
	if myListe_on Then
		myListe_index = myListe_index + 1
		if myListe_index > StringSegmentCount (myListe, "\007")
			myListe_index = 1
			beep ()
		Endif
		PerformScript SayMyList ()
	Else
		Performscript SayNextLine ()
	Endif
EndScript

Script SayPriorLine ()
	if myListe_on Then
		myListe_index = myListe_index - 1
		if myListe_index < 1 Then
			myListe_index = StringSegmentCount (myListe, "\007")
			beep ()
		Endif
		PerformScript SayMyList ()
	Else
		Performscript SayPriorLine ()
	Endif
EndScript

Script Enter ()
	if myListe_on Then
		myListe_on = false
		ScheduleFunction (MyListe_runafter, 1)
	Endif
EndScript

Function KeyPressedEvent (int ikey, string name, int ibraille, int iscript)
	if myListe_on Then
		if name == "Enter" Then
			myListe_on = false
			ScheduleFunction (MyListe_runafter, 1)
		Endif
		if name == "Escape" Then
			myListe_on = false
			SayString ("Tschüß")
		Endif
	Endif
	
EndFunction

Script ListReasons ()
	var
		object condi, object element,
		object reasons, object rea, int i,
		string names, string name,
		object loc, int x, int y

		
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	SaveCursor ()
	JawsCursor ()
	element = myUia.GetElementFromHandle (GetCurrentWindow ())
	
	mytree.Currentelement = element
	mytree.GotoParent ()
	mytree.GotoParent ()
	element = mytree.Currentelement
	
	condi = myUia.CreateStringPropertyCondition(UIA_AutomationIdPropertyId, Reason);	
	
	reasons = element.FindAll (TreeScope_SubTree, condi)
		
	submenu_names_x = ""
	submenu_names_y = ""
		
	foreach rea in reasons
		name = rea.name
		names = names + name + "\007"
		loc = rea.BoundingRectangle
		x = (loc.left + loc.right) / 2
		y = (loc.top + loc.bottom) / 2
		
		submenu_names_x = submenu_names_x + inttostring (x) + "\007"
		submenu_names_y = submenu_names_y + inttostring (y) + "´\007"

		i = i + 1
	EndForeach
	
	PerformScript HandleMyListe("Grund:", names, "ClickReason")
EndScript

Function ClickReason()
	var
		int x, int y
		
	x = StringToInt (stringSegment (submenu_names_x, "\007", myliste_index))
	y = StringToInt (stringsegment (submenu_Names_y, "\007", myliste_index))
	
	SaveCursor ()
	JawsCursor ()
	
	MoveTo (x, y)
	Pause ()
	LeftMouseButton ()
EndFunction

Function AutoStartEvent ()
	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	schedInfo = ScheduleFunction ("UpdateInfo", 10)
	
	if !IsWindowVisible (HwndAgentOne) Then
		HwndAgentOne = GetAppMainWindow (GetFocus ())
	Endif
EndFunction

Function AutoFinishEvent ()
	unscheduleFunction (schedinfo)
EndFunction

Function UpdateInfo ()
	var
		object element, object condi, object infos,
		int i, string caller, string s

	myTree.CurrentElement = myUia.GetElementFromHandle (GetRealWindow (GetFocus ()))

	element = myTree.currentElement

	condi = myUia.CreateStringPropertyCondition(UIA_AutomationIdPropertyId, Info);	
	infos = element.FindAll (TreeScope_SubTree, condi)
	
	foreach element in infos
		s = element.name
		caller = caller + " " + s
	endforeach
	
	if StringCompare (caller, callerinfo) != 0 Then
		SayString (caller)
		callerinfo = caller
		braillerefresh ()
	Endif

	ScheduleFunction ("UpdateInfo", 10)
EndFunction

Script CopyCaller ()
;	var
;		string text, int i
		
;	text = callerinfo
;	i = StringContains (text, ":")
;	if i Then
;		text = substring (text, i + 1, StringLength (text))
;	endif
;	CopyToClipboard (text)
;	SayString (text)
;	saystring ("kopiert")
EndScript

Script CopyInfo ()
	var
		string s
		
	s = GetLastCallInfo ()
	CopyToClipboard (s)
	SayString (s)
	SayString ("kopiert")
EndScript

Script SqayLastCallInfo ()
	SayString (GetLastCallInfo ())
EndScript

String Function GetLastCallInfo ()
	var
	
	object element,
	handle hwnd,
	int weiter, int weiter2,
	string name, 
	string localname,
	
	string names, string pos_x, string pos_y,
	int ret

	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	Savecursor ()
	JawsCursor ()
	MoveTo (1, 1)
	Pause ()
	MoveTo (GetWindowRight (GetRealWindow (GetFocus ())), GetWindowBottom (GetRealWindow (GetFocus ())))
	Restorecursor ()
	
;	hwnd = FindWindow (0, "WindowsForms10.Window.8.app.0.2982bee_r6_ad1", "AgentOne Client")
	hwnd = hwndAgentOne
	myTree.CurrentElement = myUia.GetElementFromHandle (hwnd)
	myTree.GotoFirstChild ()
	myTree.GotoFirstChild ()
	weiter = true
	while weiter
		localname = ""
		mytree.GotoFirstChild ()
		weiter2 = true
		while weiter2
			element = mytree.CurrentElement
			
			name = Element.name
			localname = name + " " + localname 
			weiter2 = mytree.GotoNextSibling ()
		EndWhile
		mytree.GotoParent ()
		element = mytree.CurrentElement
		name = localname
		if (StringContains (name, "Info") != 0) Then
			name = SubString (name, StringContains (name, "Info") + 4, 100)
			if (StringContains (localname, "Anrufer") != 0) Then
				name = SubString (name, StringContains (name, "Anrufer") + 8, 100)
			Endif
			name = StringReplaceSubStrings (name, "(", "")
			name = StringReplaceSubStrings (name, ")", "")
			name = StringReplaceSubStrings (name, "\n", " ")
			name = StringReplaceSubStrings (name, "\l", " ")
			name = StringReplaceSubStrings (name, "Service:", "")
			if StringContains (name, "Wartezeit:") Then
				name = SubString (name, 1, StringContains (name, "Wartezeit:"))
			endif
			return name
		Endif
		weiter = mytree.GotoNextSibling ()
	EndWhile

	return "nicht gefunden"
EndFunction

Script GotoStringTable ()
	;dataGridView
	var
		object condi, object element,
		object table

	myliste_on = false
	
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	SaveCursor ()
	RouteJawsToPc ()
	JawsCursor ()
	element = myUia.GetElementFromHandle (GetCurrentWindow ())
	
	mytree.Currentelement = element
	mytree.GotoParent ()
	mytree.GotoParent ()
	mytree.GotoParent ()
	element = mytree.Currentelement
		
	condi = myUia.CreateStringPropertyCondition(UIA_AutomationIdPropertyId, "dataGridView");	
	
	table = element.FindFirst (TreeScope_SubTree, condi)
		
	table.SetFocus ()
EndScript

Script MachmalPause ()
	var
	
	object element,
	handle hwnd,
	int weiter,
	object rect, string name, string color,
	
	int x, int y,
	
	string names, string pos_x, string pos_y,
	int ret

	if !myuia Then
		myUia = CreateObjectEx ("FreedomSci.UIA", false, "UIAScriptAPI.x.manifest" )
	Endif
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	SayString ("a")
	braillemessage ("...", 4000)

	Savecursor ()
	JawsCursor ()
	MoveTo (1, 1)
	Pause ()
	MoveTo (GetWindowRight (GetRealWindow (GetFocus ())), GetWindowBottom (GetRealWindow (GetFocus ())))
	Restorecursor ()
	


	hwnd = FindWindow (0, "WindowsForms10.Window.8.app.0.2982bee_r6_ad1", "AgentOne Client")
	
	myTree.CurrentElement = myUia.GetElementFromHandle (hwnd)
	myTree.GotoFirstChild ()
	myTree.GotoFirstChild ()
	weiter = true
	while weiter
		mytree.GotoFirstChild ()
		while mytree.GotoNextSibling ()
			element = mytree.CurrentElement
			rect = element.BoundingRectangle ()
			x = rect.left + 5
			y = (rect.top + rect.bottom) / 2
			
			name = Element.name
			names = names + name + " "
		EndWhile
		mytree.GotoParent ()
		element = mytree.CurrentElement
		name = Element.name
		color = GetColorName (GetColorAtPoint (x, y))
		if color == "grau97" Then
			color = ""
		Endif
		if Color == "zitronengrün2" Then
			color = "grün"
		Endif
		name = name + color
		names = names + name + "\007"
		pos_x = pos_x + inttostring (x) + "\007"
		pos_y = pos_y + inttostring (y) + "\007"
		weiter = mytree.GotoNextSibling ()
	EndWhile

	ret = 1
	
	if ret Then
		x = StringToInt (StringSegment (pos_x, "\007", ret))
		y = StringToInt (StringSegment (pos_y, "\007", ret))
		
	
		SaveCursor ()
		JawsCursor ()
		MoveTo (x, y)
		RestoreCursor ()
		Pause ()
		RightMouseButton ()
		RestoreCursor ()
		PerformScript HandleSubPanelForPause ()
	Endif
EndScript

Script HandleSubPanelForPause ()
	var
		object old, object now,
		string types,
		string name, string names,
		object rect, object val,
		string names_x, string names_y,
		int x, int y, int ret, string value,
		int sec

	SaveCursor ()
	JawsCursor ()
	MouseRight (10)
	MouseDown (10)
	Delay (1)
	old = myUia.GetElementFromHandle (GetCurrentWindow ())
	Delay (10)
	SayString ("b")
	braillemessage ("...", 4000)
	now = myUia.GetElementFromHandle (GetCurrentWindow ())
		mytree.currentelement = now
		while now.ControlType != UIA_WindowControlTypeId
			types = types + inttostring (now.Controltype) + "|"
			now = mytree.currentelement
			mytree.currentelement = now
			mytree.gotoparent ()
			now = mytree.currentelement
			sec = sec + 1
			delay (2)
			if sec > 100 Then
				return
			endif
			if !now Then
				return
			Endif
		EndWhile
		submenu_names_x = ""
		submenu_names_y = ""
		while now
			now = MoveToNextUIAElement (myuia, now, mytree)
			if now.Controltype == UIA_ButtonControlTypeId || now.Controltype == UIA_EditControlTypeId Then
				name = now.name
				if now.Controltype == UIA_EditControlTypeId Then
					val = now.GetvaluePattern()
					value = val.value
					
					name = name + "Edit: " + value
				Endif
				if StringLength (name) Then
					names = names + name + "\007"
					rect = now.BoundingRectangle
					x = (rect.left + rect.right) / 2
					y = (rect.top + rect.bottom) / 2
					names_x = names_x + inttostring (x) + "\007"
					names_y = names_y + inttostring (y) + "\007"
					if name == "Nicht Bereit" Then
						SaveCursor ()
						JawsCursor ()
						MoveTo (x, y)
						Delay (10)
;						PerformScript HandleSubPanelForLangePause ()
						PerformScript ListReasonsForPause ()
						return
					Endif
				Endif
			Endif
		EndWhile
EndScript

Script ListReasonsForPause ()
	var
		object condi, object element,
		object reasons, object rea, int i,
		string names, string name,
		object loc, int x, int y

		
	if !mytree Then
		mytree = myuia.ControlViewWalker
	Endif

	SaveCursor ()
	JawsCursor ()
	element = myUia.GetElementFromHandle (GetCurrentWindow ())
	
	mytree.Currentelement = element
	mytree.GotoParent ()
	mytree.GotoParent ()
	element = mytree.Currentelement
	
	condi = myUia.CreateStringPropertyCondition(UIA_AutomationIdPropertyId, Reason);	
	
	reasons = element.FindAll (TreeScope_SubTree, condi)
		
	submenu_names_x = ""
	submenu_names_y = ""
		
	foreach rea in reasons
		name = rea.name
		names = names + name + "\007"
		loc = rea.BoundingRectangle
		x = (loc.left + loc.right) / 2
		y = (loc.top + loc.bottom) / 2
		
		if name == "LP: Pause" Then
			MoveTo (x, y)
			Pause ()
			LeftMouseButton ()
			SayString ("c")
			braillemessage ("...", 4000)
			ScheduleFunction ("NextAgentStatus", 10)
			return
		Endif
		
		submenu_names_x = submenu_names_x + inttostring (x) + "\007"
		submenu_names_y = submenu_names_y + inttostring (y) + "´\007"

		i = i + 1
	EndForeach
EndScript	

Function BrailleBuildLine1 (int type)
	if StringContains (GetWindowClass (GetFocus ()), "WindowsForms10.Window.8.app.0.2982bee_r7_ad1") > 0 Then
		BrailleAddString (GetlastCallInfo (), 0, 0, 0)
		return true
	Endif
	return false
EndFunction