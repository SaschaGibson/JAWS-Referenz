;JAWS script message file for Google Chrome
;Copyright 2013-2015 by Freedom Scientific BLV Group, LLC


const
;String Compares:
	;The following string is the dash separator and application name as it appears in the title bar.
	;it is the title bar text without the page name.
	;The text must be the same as it appears in the title bar:
	scTrimName_ChromeTitleBar = "- Google Chrome",
	;This is the name of the Immersive reader button in Microsoft Edge Chromium which needs to be localized to different languages.
	;Find a page where the immersive reader button is shown and locate it by moving to the addressbar with alt+d and then tabbing once.
	;This is not the entire name of the button, but just a unique substring converted to lower case.
		cEnterImmersiveReader = "immersive reader"

Messages
;msgChromeAppName and msgGoogleChromeAppName
;are used where needed to insert as string parameters into spoken messages as the name of the current browser.
@msgChromeAppName
Chrome
@@
@msgGoogleChromeAppName
Google Chrome
@@
@msgImmersiveReader
immersive reader available
@@
;msgEdgeAppName
;are used where needed to insert as string parameters into spoken messages as the name of the current browser.
@msgEdgeAppName
Microsoft Edge with Chromium
@@
;the following three messages are spoken as part of the announceComment script
@msgNoCommentAvailable
No comment available!
@@
@msgNoCommentTextAvailable
No comment text available!
@@
@msgComment
Comment:
@@
EndMessages
