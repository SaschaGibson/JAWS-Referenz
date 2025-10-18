;Copyright (C) 2015 Freedom Scientific Inc
;Freedom Scientific domain scripts for a Sharepoint web server

const
;for the Web App Toolbar dialog:
	WebAppToolBarDialogName = "Web App Toolbar"

Messages
@msgExtraButtons
&Move to
@@
;%1 error reason, %2 line number
@msgParseError
%1 on line %2
@@
@msgNoToolbarControls_L
Couldn't find any toolbar controls.
@@
@msgNoToolbarControls_S
no controls.
@@
@msgUnlabeled
unlabeled
@@
;Screen-sensitive help messages for the web app toolbar dialog:
@sshmsg_WebAppToolBarList
Select a toolbar control with up and down arrow or use first letter navigation. Press Enter to activate the control.
@@
@sshmsg_WebAppToolBarOKButton
Press Enter to activate the selected toolbar control.
@@
@sshmsg_WebAppToolBarMoveToButton
Choose this button to set focus to the selected toolbar control.
@@
@sshmsg_WebAppToolBarCancelButton
To exit this dialog, select this button.
@@
endMessages
