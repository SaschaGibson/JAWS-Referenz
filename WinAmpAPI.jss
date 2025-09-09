; WinampAPI
; WinampAPI.jss and its accompanying files constitute a port of the Winamp4JFW.Bridge class housed in WA4JFW.dll to the JAWS Scripting Language.
; This collection of JAWS functions obviates the need for the Winamp4JFW Bridge DLL.  JAWS can now access the Winamp API directly!
;
;Note 1:  As the current version of the JAWS Scripting Language provides methods for obtaining application information, the WinampVersion, WinampMajorVersionNumber and WinampMinorVersionNumber functions of the original Bridge class have not been implemented here.
; Note 2:  The WinampAppWindowClass property of the original Bridge class has been replace by the WinampAppWindowClass global variable.


Include "common.jsm"
Include "WinampAPI.jsh"

Globals
	String WinampAppWindowClass,
	Int gbWinampEqPos


Void Function AutoStartEvent ()
Let WinampAppWindowClass = DefaultWinampAppWindowClass
Let gbWinampEqPos = 0;
EndFunction


HANDLE Function GetWinampMainWindowHandle ()
Var
  String sClass,
  Handle hWnd,
  Int i
Let hWnd = GetTopLevelWindow(GetFocus())
Let sClass = GetWindowClass(hWnd)
Let i = 0
While (sClass != WinampAppWindowClass
&& i<=WindowSearchLoopTrap)
  Let hWnd = GetNextWindow(hWnd)
  Let sClass = GetWindowClass(hWnd)
  Let i = i + 1
EndWhile
If (sClass == WinampAppWindowClass) Then ; Was the Winamp main window located?
  Return hWnd
EndIf
Return 0
EndFunction

Int Function IsWinampRunning ()
Return GetWinampMainWindow()==0
EndFunction

String Function WinampEqValueToDecibels(int nValue)
Var
	String sSignChar,
	Int decibels,
Int lastDigit
Let decibels = (2000 * (63-2*nValue)) / 63
if decibels<0
  Let sSignChar = "-"
  Let decibels = 0-decibels ; make decibels positive
else
  Let sSignChar = ""
EndIf
Let lastDigit = decibels % 10
If lastDigit>=5 Then
  Let decibels = decibels + 10 ; round up
EndIf
Let decibels = decibels / 10 ; reduce precision to one decimal place
Return sSignChar + IntToString(decibels/10) + cscPeriod + IntToString(decibels%10)
EndFunction

Int Function GetEqPos()
Return gbWinampEqPos
EndFunction

Void Function WinampSetEqPos(Int nNewVal)
If nNewVal>=0 && nNewVal<=12 Then
	Let gbWinampEqPos = nNewVal
EndIf
EndFunction

Int Function WinampGetEqValue()
Return WinampGetEqData(gbWinampEqPos)
EndFunction

Void Function WinampSetEqValue(Int nNewVal)
WinampSetEqData(gbWinampEqPos, nNewVal)
EndFunction

Int Function WinampGetEqData(int nPos)
Var
	Handle hwndWinamp,
Int result
If nPos<0 || nPos>12 Then
		Return FAILURE
EndIf
Let hwndWinamp     = GetWinampMainWindowHandle()
If hwndWinamp Then
	Let result = SendMessage(hwndWinamp, WM_WA_IPC, nPos, IPC_GETEQDATA)
	If nPos>10 && result<0 Then
		Let result = 1 ; convert values < 0 to 1 for Disabled/Enabled equaliser data fields
	EndIf
	Return result;
Else
	Return FAILURE ; Winamp not started
EndIf
EndFunction

Void Function WinampSetEqData(int nPos, int nNewVal)
Var
	Handle hwndWinamp 
If nPos<0 || nPos>12 Then
	Return
EndIf
If (nPos<11 && (nNewVal<0 || nNewVal>63)) || (nPos>10 && nNewVal!=0 && nNewVal!=1) Then
	Return ; invalid value parameter
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_WA_IPC, nNewVal, IPC_SETEQDATA)
EndIf
EndFunction

String Function WinampEqSummary ()
Var
	String status,
String tmp,
	Int value,
	Int i
If !GetWinampMainWindowHandle() Then
  Return "" ; Winamp is not running, return the empty string
EndIf
; Status of the 10 equaliser bands
For i =1 to 10
	Let value = WinampGetEqData(i-1)
	If i<10 Then
		Let tmp = cscSpace + IntToString(i)
	Else
		Let tmp = IntToString(i)
	EndIf
	status = status + FormatString("Band %1:  %2|", tmp, WinampEqValueToDecibels(value))
EndFor
; Pre-amp status
Let value = WinampGetEqData(10)
Let status = status + "Preamp:  " + WinampEqValueToDecibels(value) + "|Equaliser:  ";
; Equaliser on/off status
Let value = WinampGetEqData(11)
If value==0 Then
	Let status = status + "disabled"
Else
Let status = status + "enabled"
EndIf
; Equaliser preset autoload status
Let status = status + "|Autoload:  "
Let value = WinampGetEqData(12)
If value==0 then
	Let status = status + "disabled"
Else
	Let status = status + "enabled"
EndIf
Return status
EndFunction

Int Function WinampGetShuffleMode ()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GET_SHUFFLE)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Void Function WinampSetShuffleMode (Int nNewVal)
Var
Handle hwndWinamp
If nNewVal< 0 || nNewVal> 1 Then
  Return
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_WA_IPC, nNewVal, IPC_SET_SHUFFLE)
EndIf
EndFunction

Int Function WinampGetRepeatMode ()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GET_REPEAT)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Void Function WinampSetRepeatMode (Int nNewVal)
Var
Handle hwndWinamp
If nNewVal< 0 || nNewVal> 1 Then
  Return
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_WA_IPC, nNewVal, IPC_SET_REPEAT)
EndIf
EndFunction

Void Function WinampPlay()
Var
		Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If (hwndWinamp)
Then
	SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_STARTPLAY)
EndIf
EndFunction

Int Function WinampIsPlaying ()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_ISPLAYING)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Int Function WinampIsPaused ()
Var
	Int result
result = WinampIsPlaying()
If result>0 Then
  Let result = result==3
EndIf
Return result
EndFunction

String Function WinampGetElapsedTime()
Var
	Handle hwndWinamp,
Int result
Let hwndWinamp = GetWinampMainWindowHandle()
If WinampIsPlaying()>0 Then
	Let result = SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GETOUTPUTTIME)
	Let result = result/1000
	Return IntToString(result/60) + cscColon + IntToString(result % 60)
EndIf
Return ""
EndFunction

String Function WinampGetTotalTime()
Var
	Handle hwndWinamp,
Int result
Let hwndWinamp = GetWinampMainWindowHandle()
If WinampIsPlaying()>0 Then
	Let result = SendMessage(hwndWinamp, WM_WA_IPC, 1, IPC_GETOUTPUTTIME)
	Return IntToString(result/60) + cscColon + IntToString(result % 60)
EndIf
Return ""
EndFunction

Void Function WinampJumpToTime (string sTime)
Var
	Handle hwndWinamp,
	Int nTime
If WinampIsPlaying()<=0 Then
	Return
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If StringContains(sTime, cscColon) Then
	Let nTime = StringToInt(StringSegment(sTime, cscColon, 1)) * 60 + StringToInt(StringSegment(sTime, cscColon, 2))
Else
	Let nTime = StringToInt(sTime)
EndIf
Let nTime = nTime * 1000
SendMessage(hwndWinamp, WM_WA_IPC, nTime, IPC_JUMPTOTIME)
EndFunction

Int Function WinampGetPlayListPosition ()
Var
	Handle  hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If (hwndWinamp) Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GETLISTPOS);
EndIf
Return FAILURE ; Winamp not running
EndFunction

Int Function WinampSetPlayListPosition (Int nNewVal)
Var
	Handle  hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If (hwndWinamp) Then
  SendMessage(hwndWinamp, WM_WA_IPC, nNewVal, IPC_SETPLAYLISTPOS)
EndIf
EndFunction

Int Function WinampGetPlayListLength ()
Var
	Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GETLISTLENGTH)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Int Function WinampGetSampleRate()
Var
	Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 0, IPC_GETINFO)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Int Function WinampGetBitRate()
Var
	Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 1, IPC_GETINFO)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Int Function WinampGetNumberOfChannels()
Var
	Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	Return SendMessage(hwndWinamp, WM_WA_IPC, 2, IPC_GETINFO)
EndIf
Return FAILURE ; Winamp not running
EndFunction

Void Function WinampSetDisplayTimeElapsed()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_COMMAND, 0, WINAMP_SETTIMEDISPLAYMODEELAPSED)
EndIf
EndFunction

Void Function WinampSetDisplayTimeREMAINING()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_COMMAND, 0, WINAMP_SETTIMEDISPLAYMODEREMAINING)
EndIf
EndFunction

Void Function WinampToggleAlwaysOnTop ()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_COMMAND, 0, WINAMP_OPTIONS_AOT)
EndIf
EndFunction

Void Function WinampSetPanning(int nPanning)
Var
Handle hwndWinamp
If nPanning< -128 || nPanning> 255 Then
  Return
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_WA_IPC, nPanning, IPC_SETPANNING)
EndIf
EndFunction

Void Function WinampSetVolume(int nVolume)
Var
Handle hwndWinamp
If nVolume < 0 || nVolume > 255 Then
  Return
EndIf
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_WA_IPC, nVolume, IPC_SETVOLUME)
EndIf
EndFunction

Void Function WinampToggleStopAfterCurrentTrack ()
Var
Handle hwndWinamp
Let hwndWinamp = GetWinampMainWindowHandle()
If hwndWinamp Then
	SendMessage(hwndWinamp, WM_COMMAND, 0, WINAMP_BUTTON5_CTRL)
EndIf
EndFunction
