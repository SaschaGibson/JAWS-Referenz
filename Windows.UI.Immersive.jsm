;Copyright 2012-2016 Freedom Scientific, Inc.

Messages
;msgOpenWithFlyoutDlgText_DefaultSelectedItem is used to speak the default selected item or application 
;when a flyout dialog appears asking which program to use when opening a file.
;It is spoken as part of the dialog static text if focus lands on the OK button
;when the Open With flyout dialog appears after pressing Enter on a file in Windows Explorer.
;The dialog window text, if any exists, will be spoken before this message,
;and if there is a default selected application this message will then be spoken.
;%1 is the prompt for the selected list item, usually asking if you want to keep this default.
;%2 is the selected default application to use when opening the file.
@msgOpenWithFlyoutDlgText_DefaultSelectedItem
%1
%2
@@
EndMessages
