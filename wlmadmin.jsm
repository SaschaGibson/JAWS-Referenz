; JAWS 6.10.xx Script message file for WLM Admin network tools
; Copyright 1999-2015  by Freedom Scientific BLV Group, LLC
Const
	scClientInfo = "Client Info",
	scLicenseInfo = "License Info",
	; names used in the virtual viewer to display group box information
	; these should be translated
	


;UNUSED_VARIABLES

	scItemSeperator = "|",
	wn_ServerInformation = "Server Information",
	wn_FeatureInformation = "Feature Information"

;END_OF_UNUSED_VARIABLES

Messages
@Msg1_l
WLM Admin network tools
@@
; For MsgLvItem, %1 is the first list view column and %2 is the second list view column
@MsgLvItem
%1 %2
@@
@msgTVNotFound_l
The server tree view could not be found
@@
@msgTVNotFound_S
Server tree view not found
@@
@MsgNotInClientInfo_L
You must be in the client information page to use this keystroke
@@
@MsgNotInClientInfo_S
You must be in the client information page
@@
@MsgNotInLicenseInfo_L
You must be in the license information page to use this keystroke
@@
@MsgNotInLicenseInfo_S
You must be in the license information page
@@
@MsgServerInformation
Server information
Server name: %1  IP address: %2
@@
@MsgFeatureInformation
Feature information
Feature name: %1 Version: %2
@@
@MsgServerStatistics
Statistics
							In Use:  Total: Queued:
Total Users:	%1     %2     %3
Reserved:			%4			%5
Commuter: 		%6			%7
@@
@MsgOtherFeatureInformation
Redundant: %1 Number of servers: %2
@@
@MsgReturnToTv
Press F6 to return to the server tree view.
@@
@msgHotKeyHelp1_L
Move to the server tree view %KeyFor (MoveToServerTreeView )
Speak static client information %KeyFor (SpeakStaticClientInfo). You must have focus on the client information list view within the Client info page to use this keystroke.
Speak static license info %KeyFor (SpeakStaticLicenseInfo). You must have focus on the License information list view within the License info page to use this keystroke.
Press F6 to move between the server tree view and additional server information displayed in the virtual viewer.
@@


;UNUSED_VARIABLES

@MsgLicenseInfo
License type: %1
Allow commuter license: %2
Start date: %3
EndDate: %4
@@
@MsgClientInfo
User name: %1
Licenses used: %2
Held license: %3
Start time: %4
Group name: %5
@@

;END_OF_UNUSED_VARIABLES

EndMessages
