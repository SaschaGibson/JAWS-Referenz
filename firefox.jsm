;JAWS script message file for FireFox
;Copyright 2010-2015 by Freedom Scientific BLV Group, LLC

const
;String Compares:
	;The following string is the dash separator and application name as it appears in the title bar.
	;it is the title bar text without the page name.
	;The text must be the same as it appears in the title bar:
	scTrimName_FirefoxTitleBar = "- Mozilla Firefox",
;window and object names:
	wn_Custom = "Custom...", ;Found in File -> Page Setup -> drop down menu in Header/Footer group.
;installation dialog or page:
	WN_Installation = "Software Installation",
	Obj_Install = "Install (4)",
	Obj_InstallReplacement = "Install now"

Messages
;msgFireFoxAppName and msgFireMozillaFoxAppName
;are used where needed to insert as string parameters into spoken messages as the name of the current browser.
@msgFirefoxAppName
Firefox
@@
@msgMozillaFirefoxAppName
Mozilla Firefox
@@
EndMessages
