Script PauseBeenden ()
	SaveCursor ()
	JawsCursor ()
	MoveTo (GetWindowLeft (GetRealWindow (GetFocus ()))  + 65, GetWindowTop (GetRealWindow (GetFocus ())) + 150)
	MouseLeft (1)
	LeftMouseButtonLock ()
	Pause ()
	LeftMouseButtonLock ()
	Restorecursor ()
EndScript

Script Abmelden ()
	SaveCursor ()
	JawsCursor ()
	MoveTo (GetWindowLeft (GetRealWindow (GetFocus ()))  + 25, GetWindowTop (GetRealWindow (GetFocus ())) + 150)
	MouseLeft (1)
	LeftMouseButtonLock ()
	Pause ()
	LeftMouseButtonLock ()
	Restorecursor ()
EndScript


Script GotoTextfield ()
	SaveCursor ()
	JawsCursor ()
	MoveTo (GetWindowLeft (GetRealWindow (GetFocus ()))  + 25, GetWindowTop (GetRealWindow (GetFocus ())) + 65)
	MouseLeft (1)
	LeftMouseButtonLock ()
	Pause ()
	LeftMouseButtonLock ()
	Restorecursor ()
	Pause ()
	SayString (GetWindowText (GetFocus (), 0))
EndScript


Script GotoNummer ()
	SaveCursor ()
	JawsCursor ()
	MoveTo (GetWindowLeft (GetRealWindow (GetFocus ()))  + 25, GetWindowTop (GetRealWindow (GetFocus ())) + 180)
	MouseLeft (1)
	LeftMouseButtonLock ()
	Pause ()
	LeftMouseButtonLock ()
	Restorecursor ()
	Pause ()
	SayString (GetWindowText (GetFocus (), 0))
EndScript
