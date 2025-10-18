;message file for rundll32.jss

const
;window names & file names
	FNMain = "System Dialogs",
	WN_VOLUME_GENERAL = "Volume",
;Display Properties:
	wn_Display_Properties = "Display Properties"	,  ;Windows XP
	wn_Display_Settings = "Display Settings",  ;Windows Vista
	script_Display = "Display",
;Internet Options:
	config_Internet_Properties = "Internet Properties",
;Connect to a network:
	wn_ConnectToANetwork = "Connect To A Network",
	wn_ConnectToANetwork_2 = "Connect to a network",
	wn_ConnectVPNConnection = "Connect VPN Connection",
	 wn_VPN = " VPN ",
	config_ConnectToANetwork = "Connect to a network",
;Bluetooth Devices:
	wn_BluetoothDevices = "Bluetooth Devices",
	config_BluetoothDevices = "Control Panel Bluetooth Devices",
;Safely Remove Hardware:
	wn_SafelyRemoveHardware = "Safely Remove Hardware",
; For Internet Properties dialog in Control Panel.
; call this control panel applet from the run dialog: inetcpl.cpl.
; Name of real or title window.
; Script Utility Mode | f3 to Real Window Name | Control+F1 to copy to clipboard.
	wn_InternetProperties = "Internet Properties"

Messages
@msgConfigName
General Windows Dialogs
@@
EndMessages
