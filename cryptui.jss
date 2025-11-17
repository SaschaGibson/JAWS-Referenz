;JAWS 8.00 script file for Microsoft Internet Explorer Dll, CryptUI.dll
;Copyright 1998-2015 by Freedom Scientific BLV Group, LLC
; This file is used in Windows 98 SE only.
; This file is only used wehn focus changes and is moved to the "Always Trust Content from a specified 
; Vendor" check box in the IE Security Warning dialog.
; This file directs JAWS to use versions of SayLine and SayWindowPromptAndText through the
; use of the "Use" statement from the Internet Explorer script file.

Use "Internet Explorer.jsb"

Script SayLine ()
PerformScript SayLine ()
EndScript

Script SayWindowPromptAndText ()
PerformScript SayWindowPromptAndText ()
EndScript
