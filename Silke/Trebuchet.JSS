include "hjconst.jsh"
include "msaaConst.jsh"

Const Class_Edit = ".EDIT.",
			 Class_Static = ".STATIC.",
			Class_Window = ".Window.",
			Class_Wrapper = "HwndWrapper[Trebuchet."

Globals
	int TessfitTextSet,

	String TessfitVirtualStrings,
	Handle TessfitFocus,
	int TessfitListFound,
	int TessfitListCount,
	string MeldungText

Function AutostartEvent ()
	var
		handle hwndsic, handle hwndKompost
		
	if TessfitTextSet == 2 Then
		TypeKey ("Ctrl+A")
		Pause ()
		hwndsic = GetFocus ()
		hwndKompost = FindWindow (GetRealWindow (GetFocus ()), "", "Email Compose Toolbar")
		
		if hwndKompost Then
			SaveCursor ()
			JawsCursor ()
			MoveTo (GetWindowLeft (hwndKompost), GetWindowTop (hwndKompost))
			MouseRight (130)
			MouseDown (10)
			Pause ()
			LeftMouseButton ()
			StopSpeech ()
			SayString (GetClipboardText ())
			SayString ("eingefügt")
		Endif
		Pause ()
		setFocus (hwndsic)
		TessfitTextset = 0
	Endif
	if IsWindowVisible (TessfitFocus) Then
;		SetFocus (TessfitFocus)
	Endif
PerformScript ToggleScreenCaptureMethod()
BrailleRefresh ()
BraillePanLeft ()
EndFunction

Script AlternativesEinfuegen ()
	var
		handle hwndsic, handle hwndKompost

		hwndsic = GetFocus ()
		hwndKompost = FindWindow (GetRealWindow (GetFocus ()), "", "Email Compose Toolbar")
		
		if hwndKompost Then
			SaveCursor ()
			JawsCursor ()
			MoveTo (GetWindowLeft (hwndKompost), GetWindowTop (hwndKompost))
			MouseRight (130)
			MouseDown (10)
			Pause ()
			LeftMouseButton ()
			SayString (GetClipboardText ())
			Saystring ("eingefügt")
		Else
			SayString ("Kein Einfügen-Schalter")
		Endif
		Pause ()
		setFocus (hwndsic)

EndScript

Script ShowStaticText ()
	Var
		handle hak, handle hwnd,
		string text, int found

	Found = 0

	hwnd = GetFocus ()
	
	SaveCursor ()
	JawsCursor ()
	RouteJawsToPC ()
	MoveTo (GetCursorCol () + 10, GetCursorRow() + 30)
	Text = GetWindowname (GetCurrentWindow ())
	if !StringLength (text) Then
		GetWindowTextEx (GetParent (GetCurrentWindow ()), false, true)
	Endif
	SayString (text)
	RestoreCursor ()
	BrailleMessage (text, 0, 100000)
EndScript

int Function EnumChildObjects (int typeCode, int stateCode,string name, string value,string Description)
	if !StringContains (TessfitVirtualStrings, name) Then
		if typeCode == WT_STATIC Then
			TessfitVirtualStrings = name + "\n" + TessfitVirtualStrings
		Endif
	Endif
	return true
EndFunction

int Function BrailleAddObjectName ()
	Var
		string name, string newname,
		handle hwnd

	hwnd = GetFocus ()
	if StringContains (GetWindowClass (hwnd), Class_edit) Then
		if getwindowname (hwnd) == GetWindowText (hwnd, false) Then
			Savecursor ()
			InvisibleCursor ()
			RouteInvisibleToPc ()
			MoveTo (GetCursorCol (), GetCursorRow () - 20)
			hwnd = GetCurrentWindow ()
			if StringContains (GetWindowClass (hwnd), Class_Static) Then
				BrailleAddstring (GetWindowName (hwnd), 0, 0, 0)
				return true
			Endif
			RestoreCursor ()
		Endif
	Endif 
	
	name = GetObjectname (0, false)
	newname = BrailleResult (name)
	
	if stringcompare (name, newname) != 0 Then
		brailleaddstring (newname, 0, 0, 0)
		return true
	Endif
	return false
EndFunction

int Function BrailleBuildLine ()
	Var
		object o,
		int i,
		string s, string line
	
;	brailleaddstring ("moin", 0, 0, 0)
	if IsPcCursor () Then
		o = GetCurrentObject (0)
		if o.accRole (0) == 29 Then
			o = o.accParent ()
			i = 0
			While i < o.accChildCount ()
				i = i + 1
				s = o.accValue (i)
				line = line + "|" + s
			EndWhile
			BrailleAddString (line, 0, 0, 0)
			return true
		Endif
	Endif
	BrailleAddFocusItem ()
	return false
EndFunction

int Function SayListLine ()
	Var
		object o,
		int i,
		string s, string line, int count

	count = 0
	if IsPcCursor () Then
		o = GetCurrentObject (0)
		if o.accRole (0) == 0 Then
;			TypeKey ("Tab")
;			ScheduleFunction ("SayListLine", 2)
			return
		Endif
;		stopspeech ()
		if o.accRole (0) == 29 Then
			count = count + 1
			if count == 1 Then
				stopspeech ()
			endif
			o = o.accParent ()
			i = 1
			While i < o.accChildCount ()
				i = i + 1
				s = o.accValue (i)
				line = line + " " + s
			EndWhile
			s = o.accValue (1)
			line = line + " " + s
			SayString (line)
			braillerefresh ()
			return true
		Endif
	Endif
	return false
EndFunction

Script Test ()
	var
		string text
		
	TypeKey ("Ctrl+A")
	Pause ()
	TypeKey ("Ctrl+C")
	Pause ()
	Delay (2)
	TessfitTextSet = 1
	Run ("wordpad.exe c:\\temp\\mailtext.rtf")
EndScript

Script SayNextLine ()
	PerformScript SayNextLine ()
	Pause ()
	if !SayListLine () Then
	Endif
EndScript

Script SayPriorLine ()
	PerformScript SayPriorLine ()
	Pause ()
	if !SayListLine () Then
	Endif
EndScript

function MenuModeEvent (handle hwnd, int mode)
EndFunction

Function FocusChangedEvent (handle hwnd, handle hfrom)
	Var
		string name,
		handle hto,
		object o

	hto =hwnd
	

	FocusChangedEvent (hto, hfrom)

	if StringContains (GetAppFileName (), "Trebuchet.") Then
		TessfitFocus = hto
	Endif

	o = GetCurrentObject (0)
	if o.accRole(0) == ROLE_SYSTEM_CELL Then
		SayListLine ()
		return
	Endif
	if o.accRole(0) == 10 Then
;		SayString (GetWindowTextEx (hto, false, true))
	Endif

	if GetObjectSubTypeCode (false, 0) == WT_MULTILINE_EDIT |
		GetObjectSubTypeCode (false, 0) == WT_EDIT Then
		if !StringLength (GetObjectname (false, 0)) Then
			var
				int left, int right, int top, int bottom
				GetObjectRect (left, right, top, bottom, true, 0)
			SaveCursor ()
			JawsCursor ()
			MoveTo (left + 5, top + 5)	
			LeftMouseButton ()
			Pause ()
			MoveTo (left + 5, top - 10)
			name = GetObjectName (false, 0)
			SayControlEx (hto, name)
			return
		Endif
	Endif


	if StringContains (GetWindowClass (hwnd), Class_edit) Then
		if getwindowname (hwnd) == GetWindowText (hwnd, false) Then
			Savecursor ()
			InvisibleCursor ()
			RouteInvisibleToPc ()
			MoveTo (GetCursorCol (), GetCursorRow () - 20)
			hwnd = GetCurrentWindow ()
			if StringContains (GetWindowClass (hwnd), Class_Static) Then
				StopSpeech ()
				SayControlEx (HWND, GetWindowName (hwnd), "", "", "", "", GetWindowText (hto, false), "", "")

				return true
			Endif
			RestoreCursor ()
		Endif
	Endif 
	
	return false
EndFunction

Script Wiedereroeffnen ()
	SaveCursor ()
	JawsCursor ()
	Moveto (GetWindowLeft (GetRealWindow (GetFocus ())) + 830, GetWindowTop (GetRealWindow (GetFocus ())) + 94)
	LeftMouseButtonLock ()
	Pause ()
	LeftMouseButtonLock ()
EndScript

Script GotoList ()
	Var 
		handle hwnd

	hwnd = FindWindow (GetAppMainWindow (GetFocus ()), "", "elementHost1")
	if hwnd Then
		SpeechOff ()
		SaveCursor ()
		JawsCursor ()
		MoveTo (GetWindowLeft (hwnd) + 50, GetWindowTop (hwnd) + 56)
		Pause ()
		MouseRight (1)
		LeftMouseButtonLock ()
		Pause ()
		LeftMouseButtonLock ()
		RestoreCursor ()
		Pause ()
		TypeKey ("Tab")
		Pause ()
		SpeechOn ()
		StopSpeech ()
		SayString ("Team")
		SayListLine ()
	Else
		SayString ("Nicht gefunden")
	Endif
EndScript

Script GotoList2 ()
	Var 
		handle hwnd

	hwnd = FindWindow (GetAppMainWindow (GetFocus ()), "", "elementHost1")
	if hwnd Then
		SpeechOff ()
		SaveCursor ()
		JawsCursor ()
		MoveTo (GetWindowLeft (hwnd) + 50, GetWindowTop (hwnd) + 340)
		Pause ()
		MouseRight (1)
;		PriorLine ()
		LeftMouseButtonLock ()
		Pause ()
		LeftMouseButtonLock ()
		RestoreCursor ()
		TypeKey ("Tab")
		StopSpeech ()
		SpeechOn ()
		SayString ("Meine")
		SayListLine ()
	Else
		SayString ("Nicht gefunden")
	Endif
EndScript

Script GotoList3 ()
	Var 
		handle hwnd

	hwnd = FindWindow (GetAppMainWindow (GetFocus ()), "", "elementHost1")
	if hwnd Then
		SpeechOff ()
		SaveCursor ()
		JawsCursor ()
		MoveTo (GetWindowLeft (hwnd) + 50, GetWindowTop (hwnd) + 530)
		Pause ()
		MouseRight (1)
		LeftMouseButtonLock ()
		Pause ()
		LeftMouseButtonLock ()
		RestoreCursor ()
		TypeKey ("Tab")
		StopSpeech ()
		SpeechOn ()
		SayString ("Serviceportal")
		SayListLine ()
	Else
		SayString ("Nicht gefunden")
	Endif
EndScript

int Function EnumMeldung (int typeCode, int stateCode,string name, string value,string Description)
	MeldungText = MeldungText + name + inttostring (statecode)
	return true
EndFunction

Script SayMeldung ()
	var
		handle hwnd,
		string text

	hwnd = GetFirstChild (GetRealWindow (GetFocus ()))
	text = GetWindowTextEx (hwnd, false, true)
	if StringLength (text) > 0 Then
		SayString (text)
	Else
		MeldungText = ""
		EnumerateTypeAndTextStringsForWindow (GetRealWindow (Getfocus ()), "EnumMeldung")
		if StringLength (MeldungText) > 0 Then
			SayString (MeldungText)
;			messagebox (meldungtext)
		Else
			SayString ("nichts")
		Endif
	Endif
	BrailleMessage (text, 10000)
EndScript

String Function BrailleResult (string s)
	var
		string result


	s = StringReplaceSubStrings (s, "07d9122ce09244b3b7004c0eb55e1052","Benutzer Sperrungen")
	s = StringReplaceSubStrings (s, "3d7e19c625bb41f18ca13eeaab09e672", "Sperren")
	s = StringReplaceSubStrings (s, "6E9A6DBCBF124EA1BA29225DD31316F5", "Messgrößen Manager")
	s = StringReplaceSubStrings (s, "93a20fbd0802e017be7936407abab400266353bd42", "Anhänge ")
	s = StringReplaceSubStrings (s, "93a20fbd08085ebf7f4cd347c9a48e1b7e85c4ff34", "Ergebnisse in Tabellenform")
	s = StringReplaceSubStrings (s, "93a20fbd080914b62a9e954487bdb9bf37e28f5d38", "Aktualisieren F5")
	s = StringReplaceSubStrings (s, "93a20fbd080b94ea0ea1564576a563f26ff42a02e3", "Inhalt F1")
	s = StringReplaceSubStrings (s, "93a20fbd080ea3a93b6a214d4f9535282168a1dbdb", "Rückgängig Strg + Z")
	s = StringReplaceSubStrings (s, "93a20fbd080eb3ccc13d6a421e8ae2b1ec3d488280", "Ausschneiden Strg + X")
	s = StringReplaceSubStrings (s, "93a20fbd08106de14bbbb64b6ba4c8b4bd0d14ab41", "Wiederholen Strg + Y")
	s = StringReplaceSubStrings (s, "93a20fbd08127a1088c5554e9e9512e6ffb098bc5c", "Online-Shop O")
	s = StringReplaceSubStrings (s, "93a20fbd08132b84861e5044ce8110632600b0b2d4", "Optionen ")
	s = StringReplaceSubStrings (s, "93a20fbd0813cc2a459cdb4738ba9923dfd618f0f6", "Anhängen")
	s = StringReplaceSubStrings (s, "93a20fbd081645af6fe31f49f8825d8913051d6d22", "Haupt-Kalender")
	s = StringReplaceSubStrings (s, "93a20fbd081b7d696b265e4319b4f1bfa6f7d32108", "Info")
	s = StringReplaceSubStrings (s, "93a20fbd0820b29efaf90241058fcbbf194ed0fd8a", "Visualisierungen verwalten")
	s = StringReplaceSubStrings (s, "93a20fbd08215e26e8436c438da17d586324572f39", "Haeds up Display")
	s = StringReplaceSubStrings (s, "93a20fbd0821e2f4aa50574056bed8de177cc42ff4", "Vorheriger Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd0829e95da27ca5491aa3d5650758001fc6", "Vorherige Seite")
	s = StringReplaceSubStrings (s, "93a20fbd082aca65eb0e214615881c709c69617396", "Hilfe")
	s = StringReplaceSubStrings (s, "93a20fbd082ba3ded106c44e89b90f36a7cb8ccc23", "Definitionen neu laden")
	s = StringReplaceSubStrings (s, "93a20fbd082d5d5c00e6c54ccc97273c0415bcb75a", "Letzter Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd082da1930e9776459f907ebe74a6c0f7c9", "Widget-Manager")
	s = StringReplaceSubStrings (s, "93a20fbd082e6e9c9aba7d40dba000e1d57cd1e609", "Queue Manager")
	s = StringReplaceSubStrings (s, "93a20fbd0830f62847e1a44f0fb872e8feaaa92301", "Reports")
	s = StringReplaceSubStrings (s, "93a20fbd0831a05739cc104d9d81491424131b8f2b", "Verwerfen V")
	s = StringReplaceSubStrings (s, "93a20fbd08370ada00fbc34f2fa85799cae6be9524", "Schließen")
	s = StringReplaceSubStrings (s, "93a20fbd08381f9ceecefb4d53a6618bdaac10dca1", "Configuration Items F7")
	s = StringReplaceSubStrings (s, "93a20fbd083fbd50c546a6499f9f5de30eecc86001", "Ansicht A")
	s = StringReplaceSubStrings (s, "93a20fbd0840fda5fa4e944c129c925acaf6265159", "Wissen")
	s = StringReplaceSubStrings (s, " 93a20fbd0842278e428d5b47e4b1a4652e964b27d3", "Datei hinzufügen (import)")
	s = StringReplaceSubStrings (s, "93a20fbd084517cd62fa194f44b91ccba0e1c2b054", "Nächster Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd0852859b5562de4b84bcd4bb293b0c9572", "Verwende Details und führe die Suche aus")
	s = StringReplaceSubStrings (s, "93a20fbd08583afe6a648b474299587bfcf7c88c05", "Bearbeiten")
	s = StringReplaceSubStrings (s, "93a20fbd085850b3ae05bf4e7cb004b491bd5516b4", "Datei D")
	s = StringReplaceSubStrings (s, "93a20fbd0858ae5c6bce97492b83b7f458336a85b0", "Auswahl anzeigen F3")
	s = StringReplaceSubStrings (s, "93a20fbd0858e58886df9f469b9976e006971cb18f", "Ergebnisse anzeigen")
	s = StringReplaceSubStrings (s, "93a20fbd08597e540516ac467a9b79751d8b8ef6e1", "Aktuelle Info F6")
	s = StringReplaceSubStrings (s, "93a20fbd085d8d445072584f0284f4056707f42264", "Kunden K")
	s = StringReplaceSubStrings (s, "93a20fbd085dcb48956865496fbf7efd3b5e921588", "Anhänge")
	s = StringReplaceSubStrings (s, "93a20fbd0862fc30dcc8c248c5aac5ed5f1e7653f0", "Such Manager ")
	s = StringReplaceSubStrings (s, "93a20fbd08685de45b8d1c4b0d9191b5122b7f4c5c", "Datenbank")
	s = StringReplaceSubStrings (s, "93a20fbd0870bf3553f4214ae184edffa170ccee09", "Dashboard Helpdesk Stile bearbeiten")
	s = StringReplaceSubStrings (s, "93a20fbd0871306b8b303249e1ae9dbd2500c2e2e1", "Zoom F8")
	s = StringReplaceSubStrings (s, "93a20fbd087244b749e83047eaa56b26714e7b9716", "Ausgewählten Datensatz anzeigen")
	s = StringReplaceSubStrings (s, "93a20fbd0873b244607bc14589a918a90e6a0986f6", "Aktueller Datensatz Business Process")
	s = StringReplaceSubStrings (s, " 93a20fbd087721d150fb9c4b5b8994d3df9ce3487f", "Tabellenmanagement")
	s s StringReplaceSubStrings (s, "93a20fbd087eba1356e1e64a62bf2c0bfc6a8c3190", "Drucken D")
	s = StringReplaceSubStrings (s, "93a20fbd087f228377417b4e7a9dfa8e58914974ac", "Einfügen Strg + V")
	s = StringReplaceSubStrings (s, "93a20fbd08803c6b37c80a48898c0b63cbacf4422a", "Reports ")
	s = StringReplaceSubStrings (s, "93a20fbd088a9cdda495b1484e9df00b7cb356583b", "Kalender Manager")
	s = StringReplaceSubStrings (s, "93a20fbd088e05e4e92486446e85df84fffe6c42e4", "Nächste Seite")
	s = StringReplaceSubStrings (s, "93a20fbd088f6caf6841274517bec4c24c35eb56d7", "Online Shop Manager")
	s = StringReplaceSubStrings (s, "93a20fbd089103658888c54931b6d34b0b8c606aec", "Nächstes Fenster N")
	s = StringReplaceSubStrings (s, "93a20fbd089164ab6d1e7c40a68f90f55744e4c1bf", "Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd08929d25e2f56b4ad0ac7403a8d7bcfa61", "E-Mail")
	s = StringReplaceSubStrings (s, "93a20fbd08943959aeb64647d98b7b4afa529aab0a", "Datenbank Manager")
	s = StringReplaceSubStrings (s, "93a20fbd089d59bd7ff87a407c9dd092f03f101e8e", "Erste Seite")
	s = StringReplaceSubStrings (s, "93a20fbd08a0a7599660ae4cd78d5d28d6a6654f6c", "Suche")
	s = StringReplaceSubStrings (s, "93a20fbd08a14a9efe6ff341a6936ee8681a13def6", "CMDB ")
	s = StringReplaceSubStrings (s, "93a20fbd08a6506dccc51d421f82018bcb621c9b60", "Aktuelle Suche bearbeiten")
	s = StringReplaceSubStrings (s, "93a20fbd08a71cbd47a7ff42df9f5e2978ebdb454c", "Abmelden A")
	s s StringReplaceSubStrings (s, "93a20fbd08a94d4d55d8b243f0a6cc5b49423d2bab", "Objekte")
	s = StringReplaceSubStrings (s, "93a20fbd08aec790680a144e028638f4a61e691e60", "Verwende Details")
	s = StringReplaceSubStrings (s, "93a20fbd08af9156bbe83548758e57b1e0ea9b000a", "Kontakt Manager")
	s = StringReplaceSubStrings (s, "93a20fbd08b385f4466dc2402d8b03050aa2c24ecb", "Löschen L")
	s = StringReplaceSubStrings (s, "93a20fbd08b6d996f6d130459a82548b7a9e2a2a58", "Letzte nicht verbundene Online Shops")
	s = StringReplaceSubStrings (s, "93a20fbd08c1a90f70bba043928f14403fb8b282ac", "Kopieren Strg + C")
	s = StringReplaceSubStrings (s, "93a20fbd08c271b6dc900a4d348957ac3dcfb53556", "E-Mail an aktuellen Kunden zustellen")
	s = StringReplaceSubStrings (s, "93a20fbd08c48a3baea2174c94849f192f24e889dc", "Schnell-Suche erstellen")
	s = StringReplaceSubStrings (s, "93a20fbd08c88dcdffee1a4ac0b3fd8dd67e099fce", "Kalender")
	s = StringReplaceSubStrings (s, "93a20fbd08cff988dd5d4a40148e85482077f412be", "Tools")
	s = StringReplaceSubStrings (s, "93a20fbd08d003cf86aebb457abc377c5ed6f07c25", "Zurückl Alt Links")
	s = StringReplaceSubStrings (s, "93a20fbd08d0493d7b438a4cbaa4769bb899833994", "Anhänge anzeigen")
	s = StringReplaceSubStrings (s, "93a20fbd08d1920d00baeb4974bc73f3932edf4eba", "Neu ")
	s = StringReplaceSubStrings (s, "93a20fbd08d94acc35dd644b0db30c0539bf345d56", "Queue-Bereiche")
	s = StringReplaceSubStrings (s, "93a20fbd08dcc8e065a1de429aaa6db02f56846fe8", "Aktueller Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd08e1225177a76148b5a998a9ce1522db8f", "Vorwärts Alt Rechts")
	s = StringReplaceSubStrings (s, "93a20fbd08e26abb3e7a084f01b89c30787dd33758", "Visualisierungen")
	s = StringReplaceSubStrings (s, "93a20fbd08e665c2cc21ad497eb41770c179f4d306", "Aktuelle Suche speichern als")
	s = StringReplaceSubStrings (s, "93a20fbd08f08814944f27496e88470a38c97cf4b0", "Startseite Strg + &rsquo;F4")
	s = StringReplaceSubStrings (s, "93a20fbd08f71e406db6aa4acf8ac95125f754f32e", "Visualisierungs Manager")
	s = StringReplaceSubStrings (s, "93a20fbd08f96386601f0644c699ecf0cfc7e5b040", "Erster Datensatz")
	s = StringReplaceSubStrings (s, "93a20fbd08ff0aefdd34574049b2398d6eb6948208", "Speichern S")
	s = StringReplaceSubStrings (s, "93a20fbd08ff71af2f36a14877840eed8f8885491a", "Navigation")
	s = StringReplaceSubStrings (s, "93a6e649638761ada8dabd4bb78050fc526654ed76", "Helpdesk Stile als Standard Deshboard setzen")
	s = StringReplaceSubStrings (s, "93a946760652a6a738da3c4eb2b243855884ea8bde", "Fehler melden")
	s = StringReplaceSubStrings (s, "93aab55f56bc44f93ebb4c4bbfbdbeb4999f57a90e", "Feld Informationen")
	s = StringReplaceSubStrings (s, "93ca604e926fde81607fb44bb8b3edb0309083d7ff", "Bild aus Zwischenablage einfügen")
	s = StringReplaceSubStrings (s, "942b9d0924493037a9af7c452cbadf827bd1667768", "Farbpaletten Manager")
	s = StringReplaceSubStrings (s, "9438d8e1553e1ca93f0612482d9f8397aeeb808a0d", "Fokus auf Deshboard")
	
	return s
EndFunction

Script GotoStatus ()
	var
		handle hwnd
		
	hwnd = FindWindow (GetRealWindow (GetFocus ()), "", "Status:")
	if hwnd
		JawsCursor ()
		MoveToWindow (hwnd)
		MouseRight (100)
		Pause ()
		SetFocus (GetCurrentWindow ())
		PcCursor ()
	Else
		SayString ("Nicht gefunden")
	Endif
EndScript