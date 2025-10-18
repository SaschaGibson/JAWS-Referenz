; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 8.0
; Borland Developer Studio 2006
; Script file to switch to BDS configuration

Include "vcl100.jsh"
include "vcl100.jsm"

Void Function AutoStartEvent ()
Var
	String sClass
Let SClass = GetWindowClass (GetAppMainWindow (GetFocus ()))
If sClass == wc_TAppBuilder
|| sClass == wc_TForm Then
	SwitchToConfiguration (fnBorlandDeveloperStudio)
EndIf
EndFunction
