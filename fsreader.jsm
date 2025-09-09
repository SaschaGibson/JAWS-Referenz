;FSReader script message file

const
;key names for TypeKey:
	ksRewind = ",",
	ksFastForward = ".",
;for delimiting the FS Reader application name:
;Window names:
;WN_MaxProgress is the 100% value of the progress bar.
;If a localized language uses digits and the percent sign then this will not need to be localized:
	wn_MaxProgress = "100%",
	wn_FindDialog = "Find",



;UNUSED_VARIABLES

	wn_FSReaderDemo_Demo = "Demo",
	scAppNameDelimiter = "-" ;the dash between the app name and the book name

;END_OF_UNUSED_VARIABLES

Messages
@msgFSReaderAppName
FSReader
@@
@msgReducePausesOn_L
Reduced Pauses
@@
@msgReducePausesOn_S
Reduced
@@
@msgReducePausesOff_L
Normal Pauses
@@
@msgReducePausesOff_S
Normal
@@
;for msgRatePercentage,
;%1 is the new rate percentage
@msgRatePercentage
%1 percent
@@
@msgWindowKeysHelp
The following are application shortcuts for FSReader:

To open a new book, press CTRL+O.
To play or pause audio, press CTRL+P.
To stop audio, press CTRL+S.
To fast forward audio, press PERIOD.
To rewind audio, press COMMA.
To skip ahead by five seconds, press CTRL+PERIOD.
To skip back by five seconds, press CTRL+COMMA.
To increase audio playback speed, press CTRL+PAGE UP.
To decrease audio playback speed, press CTRL+PAGE DOWN.
To set audio playback speed to normal, press CTRL+SHIFT+N.
To set a bookmark, press CTRL+B.
To view bookmarks, press CTRL+K.
To go to a page, press CTRL+G.
To find, press CTRL+F.
To find next, press F3.
To find previous, press SHIFT+F3.
@@
@msgErrSkimReadNotAvailableInTableOfContentsTreeview
Skim Read is not available in the Table of Contents Tree View Window. Press tab to move to the Text area and try again.
@@
@msgErrSayAllNotAvailableInTableOfContentsTreeview
Say All is not available in the Table of Contents Tree View Window. Press tab to move to the Text area and try again.
@@
@msgDlgFindErrorText
Not in text window.
Select a chapter or section and press tab to the text window before searching.
@@
@msgDlgFindErrorTitle
Find Error
@@
@sshmsg_CheckForUpdatesButton
When you select this button using SPACEBAR, %product% will launch a connection to
the Freedom Scientific Web site to check if DAISY books are available for
download. If files are available, the %product% Updates dialog box opens with a list
of DAISY books. Use the ARROW Keys and SPACEBAR to select books for download,
and then select the INSTALL button to begin the installation.
@@
@sshmsg_CancelCheckForUpdatesButton
Press SPACEBAR to close the FSReader dialog box.
@@
EndMessages
