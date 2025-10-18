; JAWS 15.0 script file for VMWare
; Copyright 2010-2015 by Freedom Scientific Inc.

Include "HjGlobal.jsh" ; default HJ global variables
Include "hjconst.jsh" ; default HJ constants
Include "VMWare.jsh"
include "VMWare.jsm"


Script MoveToTree ()
  MoveFocusToControl ( Id_MachineTree )
EndScript

Script MoveToFind ()
   MoveFocusToControl (Id_EditFind )
EndScript


Function MoveFocusToControl ( int id)
   var
      handle hwnd
  
   let hwnd = GetForegroundWindow ()
    let hwnd = FindDescendantWindow (hwnd, id)

    if ( hwnd != 0)
       ; Move focus to selected control
        SetFocus (hwnd)
    endif

EndFunction
Script Tab ()
 var
    int controlId,
    string className
     
  let controlId = GetControlID (GetFocus ( ))
    
  if (  GetWindowName (GetForegroundWindow ()) == Id_SettingsTitle ) then
      if (GetWindowType (GetFocus()) == WT_EDIT) && (GetWindowTypeCode (getParent ( GetFocus()) ) == WT_COMBOBOX) then
           SetFocus(  GetParent ( GetFocus()))
      endif
      PerformScript Tab()
  else  
      if controlId == Id_EditFind then
         MoveFocusToControl (Id_MachineTree )
      elif controlId == Id_MachineTree then
         MoveFocusToControl (Id_EditFind )
       else
           PerformScript Tab()
      endif
   endif
EndScript



Void Function GetNodeInfo (string ByRef nodeText, string ByRef nodeStatus, string ByRef nodeBrailleStatus)
  var
   object objNow,
   int childNow,
   int left, int width, int top, int height,
   int id

   let objNow = GetFocusObject (0)
   let childNow = StringToInt (objNow.accSelection)
   objNow.accLocation(intRef(left), intRef(top), intRef(width), intRef(height), childNow)
  
   SaveCursor ()
   InvisibleCursor ()

    MoveTo (left - 5, top + (height /2) )
    let id =  GetGraphicID ()

   if (id == Icon_Running ) then
        let nodeStatus = "running"
        let nodeBrailleStatus = "[r]"
    elif (id ==Icon_Paused ) 
        let nodeStatus = "paused"
        let nodeBrailleStatus = "[p]"
    else
         let nodeStatus = ""
         let nodeBrailleStatus = ""
     endif

  RestoreCursor ()
  let nodeText = objNow.accName(childNow)
EndFunction

String Function GetCurrentObjectText ()
   var 
       string texto, 
        string  estado,
       string brailleEstado

    GetNodeInfo ( texto, estado, brailleEstado)
    return estado + " " + texto

EndFunction


	
Script SayNextLine ()
    PerformScript SayNextLine ()
   if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
      Say ( GetCurrentObjectText (), OT_LINE) 
   endif
EndScript
	
Script SayPriorLine ()
   PerformScript SayPriorLine ()
   if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
      Say ( GetCurrentObjectText (), OT_LINE) 
   endif
EndScript

Script JAWSEnd ()
   PerformScript JAWSEnd ()
   if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
      Say ( GetCurrentObjectText (), OT_LINE) 
   endif
EndScript

Script JAWSHome ()
   PerformScript JAWSHome ()
   if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
      Say ( GetCurrentObjectText (), OT_LINE) 
   endif
EndScript

int Function BrailleBuildLine ()
   var 
       string texto, 
        string  estado,
       string brailleEstado

   If UserBufferIsActive () then
       return false
   endif

    GetNodeInfo ( texto, estado, brailleEstado)
  
   if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
      BrailleAddString ( brailleEstado, 0, 0, 0)
      BrailleAddString ( texto, 0, 0, 0)
      return true
  else
     return false
  endif
EndFunction


Script HotKeyHelp()

If UserBufferIsActive () then
	UserBufferDeactivate ()
EndIf
SayFormattedMessage (OT_USER_BUFFER, wmwareHotKeyHelp1, wmwareHotKeyHelp1)

EndScript



Script ApplicationsKey ()
  if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
     {Space}
  endif
  Delay (2)
   { SHIFT + F10}

EndScript



Script GrabInput ()

  if (GetControlID (GetFocus ( )) == Id_MachineTree ) then
     {Space}
  endif
  TypeCurrentScriptKey ()

EndScript



