; Build 3.7.10.001
;  Common message file for the Year 2000 Grolier Multimedia Encyclopedia

Const
	; Window Names and their string lengths of windows found only in the installation program.
	;The wn constants that end with 'len' are the character count of the string you localized.
	;So after you localize the string, count the characters of your new string and update its len companion.
	;Example: After localizing wnWelcome, change the character count in wnWelcomeLen
	wnWelcome = "Welcome",
	wnWelcomeLen = 7,
	wnLicense = "Software License Agreement",
	wnLicenseLen = 26,
	wnSetupType = "Setup Type",
	wnSetupTypeLen = 10,
	wnChooseDestination = "Choose Destination Location",
	wnChooseDestinationLen = 27,
	wnSelProgFolder = "Select Program Folder",
	wnSelProgFolderLen = 21,


;UNUSED_VARIABLES

	sc1 = "GVLIST",
	sc2 = "EndSearchThisArticle",
scBrowsePage_L = " Browse Page ",
scSearchPage_L = " Search Page ",
scMarkersPage_L = " Markers Page ",
scTextPage_L = " Text Page ",
scEventsPage_L = " Events Page ",
	;keystrokes
	ks1 = "control+1",
	ks2 = "control+2",
ks3 = "control+3",
ks4 = "control+4",
ks5 = "control+5",
ks6 = "control+6",
ks7 = "control+7",
;This keystroke passes the enter key through in the Enter script
ks8 = "enter",
	;This is the ALT+F4 that exits the current application during the ImportRegistryEntry  script
	ks9 = "alt+f4",
	;These items are messages but must be defined using the const syntax because
; they require that \007 and \n be converted to special characters,
; and the mesage syntax inserts everything literally into the string
;with no character conversion.  So a message with \n would insert a
; backslash followed by the letter n, not an ASCII 10.

	msgRightHandPanePages_L="Browse\007Search\007Markers",
msgRightHandPanePages_S="Browse\007Search\007Markers"

;END_OF_UNUSED_VARIABLES

Messages
@msgDialog_L
 Dialog 
@@
@msgDestFolder_L
 Destination Directory 
@@

; Messages specific the QuickTime 3.0 Installation Program
@msgQuickTimeInstall_L
 QuickTime 3.0 Installation Program 
@@
@msgNotInSetupTypeWin_L
 The currently active real window is not the setup type dialog.Destination directory information is not available 
@@
@msgNotInPlugInWin_L
 The currently active real window is not the QuickTime Plug In options dialog.  Plug In destination directory information is not available 
@@
@msgPlugInDirs_L
 The QuickTime 3.0 Plug In Destination Directories are as follows 
@@
@msgFor_L
 For 
@@
@msgNetscapePlugIn_L
 Netscape Navigator or Communicator Plug In 
@@
@msgIEPlugIn_L
 Microsoft Internet Explorer Plug In
@@
@msgRequired_L
 Space Required: 
@@
@msgAvailable_L
 Space Available: 
@@
@msgNotInCompWin_L
 The currently active real window is not the Installation Components And Sub-Components dialog.  Disk Space information is not available. 
@@
@msgNotInCompWinA_L
 The currently active real window is not the Installation Components And Sub-Components dialog.  omponent description information is not available. 
@@
	; Hot Key Help Messages
@msgToReadCompDesc_L
 To read the description of the currently selected QuickTime 3.0 component press 
@@
@msgAutoStart3_l
  for screen sensitive help Press %KeyFor(ScreenSensitiveHelp). 
 @@
@msgAutoStart3_s
 for screen sensitive help %KeyFor(ScreenSensitiveHelp).
 @@
@msgHotKeyHelp8_L
To review the disk space requirements for QuickTime 3.0 press 
%KeyFor(ReviewSpaceRequirements). 
To read the description of the currently selected QuickTime 3.0 component press 
%KeyFor(ReadComponentDescription).
@@
@msgHotKeyHelp10_L
To review the destination directory for QuickTime 3.0 press  %KeyFor(ReviewDestinationDirectory).
@@
@msgHotKeyHelp10_S
review destination directory press  %KeyFor(ReviewDestinationDirectory)
@@
@msgHotKeyHelp11_L
 To review the destination directory for the QuickTime 3.0 Plug Ins press  
 %KeyFor(ReviewPlugInDirectories)
@@
@msgHotKeyHelp11_S
 review destination directory, press   %KeyFor(ReviewPlugInDirectories).
@@
@msgScreenSensitiveHelpForKnownClasses3_l
@@
@msgScreenSensitiveHelpForKnownClasses3_s
@@
@msgScreenSensitiveHelpForKnownClasses4_l
 It is a member of a group of radio buttons 
 only one radio button can be checked at a time 
 to move between the members of the radial button group press the up or down arrow keys 
@@
@msgScreenSensitiveHelpForKnownClasses4_s
 a member of group of radio buttons 
 only one radio button can be checked at a time 
 to move between the members of the radial button group press the up or down arrow keys 
@@


			  ;%1 is the window title and %2 is the word dialog
			  @msgReadStaticWindows2_l
%1 %2
			  @@
			  @msgReadStaticWindows2_s
%1 %2
			  @@
			  @msgReadStaticWindows3_l
			   %1 %2

			  @@
			  @msgReadStaticWindows3_s
%1 %2


			  @@
			  @msgReadStaticWindows4_l
%1 %2
			  @@
			  @msgReadStaticWindows4_s
%1 %2
			  @@
			  @msgReadStaticWindows5_l
%1 %2
			  @@
			  @msgReadStaticWindows5_s
			  %1 %2
			  @@
			  @msgReadStaticWindows6_l
			   Destination Directory 
			  @@
			  @msgReadStaticWindows6_s
			   Destination Directory 
			  @@
			  @msgReadStaticWindows7_l
			  %1 %2
			  @@
			  @msgReadStaticWindows7_s
			  %1 %2
			  @@
			  @msgReadStaticWindows8_l
			  %1 %2
			  @@
			  @msgReadStaticWindows8_s
			  %1 %2
			  @@
			  @msgReadStaticWindows9_l
			   Space Required: 
			  @@
			  @msgReadStaticWindows9_s
			   Space Required: 
			  @@
			  @msgReadStaticWindows10_l
			   Space Available: 
			  @@
			  @msgReadStaticWindows10_s
			   Space Available: 
			  @@
;For @ReadCustomControls, %1 is the window name and %2 is the window type
@msgReadCustomControls2_L
%1 %2
@@


;UNUSED_VARIABLES

@msgSilent

@@
@msgBlank_L
Blank
@@
@msgBlank_S
Blank
@@
@msgTitleScreen_L
 The currently active window is the title screen of the Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgTitleScreen_S
 The active window is title screen of Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgTitleScreenA_L
 This screen must be disabled in order to allow you to use this application 
@@
@msgTitleScreenA_S
 This screen must be disabled in order to use this application 
@@
@msgTitleScreenB_L
 Call the script Import Registry Entry by pressing  
@@
@msgTitleScreenB_S
 script Import Registry Entry 
@@
@msgTitleScreenC_L
 To cause %product% to import the Registry entries that disable this screen 
@@
@msgTitleScreenC_S
 To cause %product% to import Registry entries that disable this screen 
@@
@msgTitleScreenD_L
 This script will shut down the encyclopedia and then run the file that will import the required registry entries 
@@
@msgTitleScreenD_S
 This script will shut down encyclopedia then import the required registry entries 
@@
@msgTitleScreenE_L
 You will then need to restart the encyclopedia for the changes to take effect and to enable you to use the encyclopedia 
@@
@msgTitleScreenE_S
 You then need to restart encyclopedia for changes to take effect 
@@
@msgImportingReg_L
 Exiting the Year 2000 Grolier Multimedia Encyclopedia and beginning Import of Registry Entries 
@@
@msgImportingReg_S
 Exiting Grolier Encyclopedia and beginning Import of Registry Entries 
@@
@msgSettingsSubDir_L
\\Settings\\Enu\\
@@
@msgSettingsSubDir_S
\\Settings\\Enu\\
@@
@msgNotTilteScreen_L
 The currently active window is not the title screen of the Year 2000 Grolier Multimedia Encyclopedia.
 This script is not avaiable in this window 
@@
@msgNotTilteScreen_S
 not title screen of Year 2000 Grolier Multimedia Encyclopedia.
 This script is not avaiable in this window 
@@
; Common messages used throughout the project
@msgForScreenSensitiveHelp_L
 for screen sensitive help Press insert + f1 
@@
@msgForScreenSensitiveHelp_S
 for screen sensitive help insert + f1 
@@
@msgForJAWSHotKeys_L
 for %product% Hot Keys or help in dialog boxes Press Insert + H 
@@
@msgForJAWSHotKeys_S
 %product% Hot Keys or help in dialogs  Insert + H 
@@
@msgWindowsKeys_L
 for a summary of windows short cut keys Press insert + W 
@@
@msgWindowsKeys_S
 summary of windows short cut keys insert + W 
@@
@msgDialog_S
 Dialog 
@@
@msgHotKeysAre_L
Hot keys are as follows
@@
@msgHotKeysAre_S
Hot keys are as follows
@@
@hkmsgForThe_L
 For the 
@@
@hkmsgForThe_S
 For the 
@@
@hkmsgAltPlus_L
 press Alt + 
@@
@hkmsgAltPlus_S
 press Alt + 
@@
	; Screen Sensitive Help Messages
@sshThisIsThe
 This is the 
@@
@sshButton
 button 
@@
@sshToActivateButton
 to activate the button press either the space bar or the enter key 
@@
@sshMoveToNextControl
 to move to the next control press the tab key 
@@
@sshRadioButton
 Radio Button 
@@
@msgOneOfRBGroup_L
 It is a member of a group of radio buttons 
@@
@msgOneOfRBGroup_S
 a member of group of radio buttons 
@@
@msgOnlyOneRB_L
 only one radio button can be checked at a time 
@@
@msgOnlyOneRB_S
 only one radio button can be checked at a time 
@@
@msgMoveBetweenRB_L
 to move between the members of the radial button group press the up or down arrow keys 
@@
@msgMoveBetweenRB_S
 to move between the members of the radial button group press the up or down arrow keys 
@@
; Messages specific the installation program of the Year 2000 Grolier Multimedia Encyclopedia
@msgGrolierInstall_L
 Year 2000 Grolier Multimedia Encyclopedia Installation Program 
@@
@msgGrolierInstall_S
 Year 2000 Grolier Multimedia Encyclopedia Installation Program 
@@
@msgDestFolder_S
 Destination Directory 
@@
@msgReviewDest_L
 To review the destination directory for The Year 2000 Grolier Multimedia Encyclopedia press 
@@
@msgReviewDest_S
 To review the destination directory for The Year 2000 Grolier Multimedia Encyclopedia press 
@@
@msgQuickTimeInstall_S
 QuickTime 3.0 Installation Program 
@@
@msgIntroduce1_L
 The Quicktime 3.0 system software you are about to install will enable you to integrate video   graphics   music   sound   
@@
@msgIntroduce1_S
 The Quicktime 3.0 system software you are about to install will enable you to integrate video   graphics   music   sound   
@@
@msgIntroduce2_L
 sprites   text   panoramas   and animation into your documents 
@@
@msgIntroduce2_S
 sprites   text   panoramas   and animation into your documents 
@@
@msgIntroduce3_L
 Your computer will need certain software to use QuickTime.
 This installer will choose the software that Apple 
@@
@msgIntroduce3_S
 Your computer will need certain software to use QuickTime.
 This installer will choose the software that Apple 
@@
@msgIntroduce4_L
 recommends for your computer and place it in the appropriate locations on your computer 
@@
@msgIntroduce4_S
 recommends for your computer and place it in the appropriate locations on your computer 
@@
@msgIntroduce5_L
 A directory called QuickTime will be created for QuickTime's applications and sample content 
@@
@msgIntroduce5_S
 A directory called QuickTime will be created for QuickTime's applications and sample content 
@@
@msgIntroduce6_L
 The QuickTime Plug in will also be installed for your Internet Browsers 
@@
@msgIntroduce6_S
 The QuickTime Plug in will also be installed for your Internet Browsers 
@@
@msgIntroduce7_L
 Choose custom only if you are sure that you want to override these recommendations 
@@
@msgIntroduce7_S
 Choose custom only if you are sure that you want to override these recommendations 
@@
@msgNotInSetupTypeWin_S
 The currently active real window is not the setup type dialog.  Destination directory information is not available 
@@
@msgNotInPlugInWin_S
 The currently active real window is not the QuickTime Plug In options dialog.  Plug In destination directory information is not available 
@@
@msgPlugInDirs_S
 The QuickTime 3.0 Plug In Destination Directories are as follows 
@@
@msgFor_S
 For 
@@
@msgNetscapePlugIn_S
 Netscape Navigator or Communicator Plug In 
@@
@msgIEPlugIn_S
 Microsoft Internet Explorer Plug In
@@
@msgRequired_S
 Space Required: 
@@
@msgAvailable_S
 Space Available: 
@@
@msgNotInCompWin_S
 The currently active real window is not the Installation Components And Sub-Components dialog.  Disk Space information is not available 
@@
@msgNotInCompWinA_S
 The currently active real window is not the Installation Components And Sub-Components dialog.  Component description information is not available 
@@
@msgToReviewDest_L
 To review the destination directory for QuickTime 3.0 press 
@@
@msgToReviewDest_S
 To review the destination directory for QuickTime 3.0 press 
@@
@msgToReviewPlugIn_L
 To review the destination directory for the QuickTime 3.0 Plug Ins press 
@@
@msgToReviewPlugIn_S
 To review the destination directory for the QuickTime 3.0 Plug Ins press 
@@
@msgToReviewSpace_L
 To review the disk space requirements for QuickTime 3.0 press 
@@
@msgToReviewSpace_S
 To review the disk space requirements for QuickTime 3.0 press 
@@
@msgToReadCompDesc_S
 To read the description of the currently selected QuickTime 3.0 component press 
@@
; Messages specific to the Would You Like to Run Dialog
@msgLikeToRun_L
 Would You Like To Run The The Year 2000 Grolier Multimedia Encyclopedia? 
@@
@msgLikeToRun_S
 Would You Like To Run Year 2000 Grolier Multimedia Encyclopedia? 
@@
@msgWouldDialog_L
 Would You Like To Run the Year 2000 Grolier Multimedia Encyclopedia Dialog 
@@
@msgWouldDialog_S
 Would You Like To Run the Year 2000 Grolier Multimedia Encyclopedia Dialog 
@@
@msgSelOpt_L
 To select whether or not you would To Run The The Year 2000 Grolier Multimedia Encyclopedia press 
@@
@msgSelOpt_S
 select whether or not you want To Run Grolier Encyclopedia 
@@
;	Messages for the Registration Dialogs
@msgReg1_L
 Congradulations on purchasing the Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgReg1_S
 Congradulations on purchasing the Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgReg2_L
 The finest multimedia encyclopedia available 
@@
@msgReg2_S
 The finest multimedia encyclopedia available 
@@
@msgReg3_L
 Register now and you will recieve 
@@
@msgReg3_S
 Register now and you will recieve 
@@
@msgReg4_L
 * special upgrade pricing on future editions 
@@
@msgReg4_S
 * special upgrade pricing on future editions 
@@
@msgReg5_L
 * Technical Support 
@@
@msgReg5_S
 * Technical Support 
@@
@msgReg6_L
 * Special money saving offers on other Grolier titles and ... 
 @@
@msgReg6_S
 * Special money saving offers on other Grolier titles and ... 
@@
@msgReg7_L
 Special Bonus. 
 The New York Times Science Q & A feature 
@@
@msgReg7_S
 Special Bonus. 
 The New York Times Science Q & A feature 
@@
@msgGME2000Install_L
 Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgGME2000Install_S
 Year 2000 Grolier Multimedia Encyclopedia 
@@
@msgSpeed_L
  Speed  
@@
@msgSpeed_S
  Speed  
@@
@msgMSpeed_L
 Modem Speed 
@@
@msgMSpeed_S
 Modem Speed 
@@
@msgChecked_L
Checked
@@
@msgChecked_S
Checked
@@
@msgUnchecked_L
not checked
@@
@msgUnchecked_S
not checked
@@
@msgLowerRB_L
 Than 14.4 K 
@@
@msgLowerRB_S
 Than 14.4 K 
@@
@msgK_L
 K 
@@
@msgK_S
 K 
@@
@msgHigherRB_L
 Than 33.6 K 
@@
@msgHigherRB_S
 Than 33.6 K 
@@
@msgCDSpeed_L
 CD-ROM Speed 
@@
@msgCDSpeed_S
 CD-ROM Speed 
@@
@msgFasterRB_L
 than quad speed 
@@
@msgFasterRB_S
 than quad speed 
@@
@msgSelectCountry_L
 Select Country 
@@
@msgSelectCountry_S
 Select Country 
@@
; Messages for the right and left hand panes
@msgBrowsePage_S
 Browse Page 
@@
@msgSearchPage_S
 Search Page 
@@
@msgMarkersPage_S
 Markers Page 
@@
@msgSoundsPage_L
 Sounds Page 
@@
@msgSoundsPage_S
 Sounds Page 
@@
@msgTablePage_L
 Table Page 
@@
@msgTablePage_S
 Table Page 
@@
@msgPicturePage_L
 Picture Page 
@@
@msgPicturePage_S
 Picture Page 
@@
@msgScienceQAOrFactBoxPage_L
 Science Question and Answer Or Fact Box Page 
@@
@msgScienceQAOrFactBoxPage_S
 Science Q and A Or Fact Box Page 
@@
@msgPanoramaPage_L
 Panorama Page 
@@
@msgPanoramaPage_S
 Panorama Page 
@@
@msgTextPage_S
 Text Page 
@@
@msgPage_L
 Page 
@@
@msgPage_S
 Page 
@@
@msgTab_L
 Tab 
@@
@msgTab_S
 Tab 
@@
@msgTopicEdit_L
 Topic 
@@
@msgTopicEdit_S
 Topic 
@@
@msgTopicsList_L
 Topics 
@@
@msgTopicsList_S
 Topics 
@@
@msgSearchList_L
 Search Results 
@@
@msgSearchList_S
 Search Results 
@@
@msgSearchEdit_L
 Search Phrase 
@@
@msgSearchEdit_S
 Search Phrase 
@@
@msgMarkersCombo_L
 Select Marker List Combo Box 
@@
@msgMarkersCombo_S
 Select Marker List Combo Box 
@@
@msgMarkersList_L
 Markers 
@@
@msgMarkersList_S
 Markers 
@@
@msgNotMarkerDlg_L
 The active real window is not the Marker List Management Dialog Box 
@@
@msgNotMarkerDlg_S
 active real window is not Marker List Management Dialog 
@@
@msgSelectAPage_L
Select A Page
@@
@msgSelectAPage_S
Select A Page
@@
@msgBrowseArticles_L
 Browse Articles 
@@
@msgBrowseArticles_S
 Browse Articles 
@@
@msgComplexSearch_L
 Complex Search 
@@
@msgComplexSearch_S
 Complex Search 
@@
@msgTopic_L
 Topic 
@@
@msgTopic_S
 Topic 
@@
@msgSubTopic_L
 Sub-Topic 
@@
@msgSubTopic_S
 Sub-Topic 
@@
@msgArticleView_L
Article View
@@
@msgArticleView_S
Article View
@@
@msgText_L
Text
@@
@msgText_S
Text
@@
@msgOutlinePage_L
Outline Page
@@
@msgOutlinePage_S
Outline Page
@@
@msgOutline_L
Outline
@@
@msgOutline_S
Outline
@@
@msgRelatedMediaPage_L
Related Media Page
@@
@msgRelatedMediaPage_S
Related Media Page
@@
@msgRelArticlesPage_L
 Related Articles Page 
@@
@msgRelArticlesPage_S
 Related Articles Page 
@@
@msgRelMedia_L
 Related Media
@@
@msgRelMedia_S
 Related Media
@@
@msgRelArticles_L
Related Articles
@@
@msgRelArticles_S
Related Articles
@@
@msgLeftPane_L
 Left Hand Pane 
@@
@msgLeftPane_S
 Left Hand Pane 
@@
@msgRightPane_L
 Right Hand Pane 
@@
@msgRightPane_S
 Right Hand Pane 
@@
@msgSecondAVNotFound_L
 Second Article View Window Not Found 
@@
@msgSecondAVNotFound_S
 Second Article View Window Not Found 
@@
@msgAVNotFound_L
 Article View Window Not Found 
@@
@msgAVNotFound_S
 Article View Window Not Found 
@@
@msgKnowledgeTree_L
 Knowledge Tree Dialog
@@
@msgKnowledgeTree_S
 Knowledge Tree Dialog
@@
@msgKTMainTopic_L
 Main Topic 
@@
@msgKTMainTopic_S
 Main Topic 
@@
@msgKTSubTopic_L
 Sub Topic 
@@
@msgKTSubTopic_S
 Sub Topic 
@@
@msgDictionaryDlg_L
 Dictionary Dialog 
@@
@msgDictionaryDlg_S
 Dictionary Dialog 
@@
@msgOnlineKnowledgeExplorer_L
Online Knowledge Explorer
@@
@msgOnlineKnowledgeExplorer_S
Online Knowledge Explorer
@@
@msgNull_L
NULL
@@
@msgNull_S
NULL
@@
@msgMapsCombo_L
 Maps 
@@
@msgMapsCombo_S
 Maps 
@@
@msgSelectATool_L
Select A Tool
@@
@msgSelectATool_S
Select A Tool
@@
@msgEventsPage_S
 Events Page 
@@
@msgEventsList_L
Events
@@
@msgEventsList_S
Events
@@
@msgArticleViewWin_L
This is the article view window
@@
@msgArticleViewWin_S
article view window
@@
@msgArticleViewWinPurpose_L
It contains the text of either an encyclopedia article or a picture caption
@@
@msgArticleViewWinPurpose_S
It contains text of either article or picture caption
@@
@hkmsgSelectAPage_L
 To Select a page in the currently active pane press 
@@
@hkmsgSelectAPage_S
 Select page in active pane 
@@
@hkmsgSelectAPage1_L
To Select a page in the right hand pane regardless of which pane has focus press 
@@
@hkmsgSelectAPage1_S
Select page in right hand pane regardless of which pane has focus 
@@
@msgActivePage_L
 The active page is the 
@@
@msgActivePage_S
 The active page is the 
@@
@hkmsgFocusToArticleView_L
 To move focus to the first visible Article View window press 
@@
@hkmsgFocusToArticleView_S
 move focus to first visible Article View 
@@
@hkmsgFocusToArticleView2_L
 To move focus to the second visible Article View window press 
@@
@hkmsgFocusToArticleView2_S
 To move focus to the second visible Article View window press 
@@
@hkmsgHotKeysAre_L
Hot Keys are as follows 
@@
@hkmsgHotKeysAre_S
Hot Keys are as follows 
@@
@hkmsgIfUnableAV_L
 If the scripts Focus To Article View Window and Focus To Second Article View Window are both unable to function
@@
@hkmsgIfUnableAV_S
 If scripts Focus To Article View Window and Focus To Second Article View Window are both unable to function
@@
@hkmsgIfUnableAV1_L
 Then perhaps the active page in the right hand pane contains only items that are unaccessible to %product% 
@@
@hkmsgIfUnableAV1_S
 perhaps active page in right hand pane contains only items that are unaccessible to %product% 
@@
@hkmsgIfUnableAV2_L
 In this case you may try calling Select A Page Right Hand Pane or if the interactivities section is active 
@@
@hkmsgIfUnableAV2_S
 In this case try calling Select A Page Right Hand Pane or if interactivities section is active 
@@
@hkmsgIfUnableAV3_L
 using the topics list box of the browse page to select an item below the top level item 
@@
@hkmsgIfUnableAV3_S
 using topics list of browse page to select an item below top level item 
@@
@hkmsgResearchStarters_L
 Please note that the Research Starters section is not accessible via %product% 
@@
@hkmsgResearchStarters_S
 Research Starters section not accessible via %product% 
@@
@hkmsgSelectATool_L
To Select A Tool press 
@@
@hkmsgSelectATool_S
To Select A Tool press 
@@
@hkmsgBelowArticle_L
 To move focus to the buttons displayed below the Article View Window press 
@@
@hkmsgBelowArticle_S
 To move focus to the buttons displayed below the Article View Window press 
@@
@hkmsgTwiceQuickly_L
 Twice Quickly 
@@
@hkmsgTwiceQuickly_S
 Twice Quickly 
@@
@msgBackToArticle_L
 To move focus back to the Article Vindow press 
@@
@msgBackToArticle_S
 move focus back to Article Vindow 
@@
@msgNavigationKeys_L
 You may use the standard navigation and reading keys to review the text contained within this window 
@@
@msgNavigationKeys_S
 use standard navigation and reading keys to review text 
@@
@msgNextControl_L
 to move to the next control you may press the Tab key 
@@
@msgNextControl_S
 to move to the next control you may press the Tab key 
@@
@msgLink_L
 Link 
@@
@msgLink_S
 Link 
@@
@msgForArticles_L
For the Articles Section press control + 1
@@
@msgForArticles_S
For Articles Section control + 1
@@
@msgForMedia_L
For the Media Section press control + 2
@@
@msgForMedia_S
Media Section  control + 2
@@
@msgForAtlas_L
For the Atlas Section press control + 3
@@
@msgForAtlas_S
Atlas Section control + 3
@@
@msgForTimeLines_L
For the Timelines Section press control + 4
@@
@msgForTimeLines_S
Timelines Section  control + 4
@@
@msgForResearch_L
For the Research Starters Section press control + 5
@@
@msgForResearch_S
Research Starters Section control + 5
@@
@msgForInteractivities_L
For the Interactivities Section press control + 6
@@
@msgForInteractivities_S
Interactivities Section  control + 6
@@
@msgForDictionary_L
For the Dictionary press control + 7
@@
@msgForDictionary_S
Dictionary control + 7
@@
@msgToSave_L
To save the currently open article as a Rich Text Format File press Control + s
@@
@msgToSave_S
save open article as Rich Text Format  Control + s
@@
@msgToPrint_L
To print the currently open article press Control + P
@@
@msgToPrint_S
print open article Control + P
@@
@msgToSelect_L
To select all press control + a
@@
@msgToSelect_S
Select all  control + a
@@
@msgForHistory_L
For the history list press Control + H
@@
@msgForHistory_S
history list  Control + H
@@
@msgForKnowledge_L
For the knowledge tree dialog press Control + K
@@
@msgForKnowledge_S
knowledge tree dialog Control + K
@@
@msgAddMarkers_L
To add items to the Marker List press control + m
@@
@msgAddMarkers_S
add items to Marker List control + m
@@
@msgUnknown_L
 Unknown 
@@
@msgUnknown_S
 Unknown 
@@
@msgSayLinksOn_L
 Announce Text Colors Set to Say Links 
@@
@msgSayLinksOn_S
 Say Links 
@@
@msgSayLinksOff_L
 Announce Text Colors Set to Say Colors
@@
@msgSayLinksOff_S
 Say Colors
@@
@msgPixels_L
 pixels 
@@
@msgPixels_S
 pixels 
@@
@msgPoint_L
 point
@@
@msgPoint_S
 point
@@
@msgCap_L
cap 
@@
@msgCap_S
cap 
@@
@msgAllCaps_L
all caps 
@@
@msgAllCaps_S
all caps 
@@
@hkmsgLeftHandPane_L
To move focus bact to the left hand pane press 
@@
@hkmsgLeftHandPane_S
To move focus bact to the left hand pane press 
@@
@msgAutoStart1_l
 for screen sensitive help Press %KeyFor(ScreenSensitiveHelp). 
@@
@msgAutoStart1_s
 for screen sensitive help %KeyFor(ScreenSensitiveHelp). 
 @@
@msgAutoStart2_l
  for screen sensitive help Press %KeyFor(ScreenSensitiveHelp). 
@@
@msgAutoStart2_s
 for screen sensitive help %KeyFor(ScreenSensitiveHelp). 
@@
@msgOpenDialog_l
There is currently an open %product% dialog box
 Only one %product% dialog box can be opened at a time
In order to bring up the requested dialog box, you must close the current dialog by pressing Escape and then activate the desired dialog box
@@
@msgOpenDialog_S
There is an open %product% dialog 
 Only one %product% dialog can be opened at a time
close current dialog by pressing Escape then activate desired dialog 
@@
@msgReadStaticTextWindows1_l
 Congradulations on purchasing the Year 2000 Grolier Multimedia Encyclopedia 
 The finest multimedia encyclopedia available 
 Register now and you will recieve 
 * special upgrade pricing on future editions 
 * Technical Support 
 * Special money saving offers on other Grolier titles and ... 
 Special Bonus.
 The New York Times Science Q & A feature 
@@
@msgReadStaticTextWindows1_s
 Congradulations on purchasing the Year 2000 Grolier Multimedia Encyclopedia 
 The finest multimedia encyclopedia available 
 Register now and you will recieve 
 * special upgrade pricing on future editions 
 * Technical Support 
 * Special money saving offers on other Grolier titles and ...  
 Special Bonus.
 The New York Times Science Q & A feature 
@@
;%1 is the name of the dialog and %2 is the word dialog
@msgReadStaticTextWindows2_l
 %1 %2
@@
@msgReadStaticTextWindows2_s
%1 %2
@@
@msgReadStaticTextWindows3_l
%1 %2
@@
@msgReadStaticTextWindows3_s
%1 %2
@@
@msgReadStaticTextWindows4_l
%1 %2
@@
@msgReadStaticTextWindows4_s
 %1 %2
@@
@msgReadStaticTextWindows5_l
 %1 %2
@@
@msgReadStaticTextWindows5_s
%1 %2
@@
@msgReadStaticTextWindows6_l
 Browse Articles 
@@
@msgReadStaticTextWindows6_s
 Browse Articles 
@@
@msgReadStaticTextWindows7_l
 Complex Search 
@@
@msgReadStaticTextWindows7_s
 Complex Search 
@@
@msgReadStaticTextWindows8_l
 Dictionary Dialog 
@@
@msgReadStaticTextWindows8_s
 Dictionary Dialog 
@@
@msgReadStaticTextWindows9_l
Outline
@@
@msgReadStaticTextWindows9_s
Outline
@@
@msgReadStaticTextWindows10_l
 Related Media
@@
@msgReadStaticTextWindows10_s
 Related Media
@@
@msgReadStaticTextWindows11_l
Related Articles
@@
@msgReadStaticTextWindows11_s
Related Articles
@@
@msgReadStaticTextWindows12_l
 Knowledge Tree Dialog
@@
@msgReadStaticTextWindows12_s
 Knowledge Tree Dialog
@@
;%1 is the name of the dialog and %2 is the word dialog
@msgReadStaticTextWindows13_L
%1 %2
@@
@msgReadStaticTextWindows14_L
%1 %2
@@
@msgReadStaticTextWindows15_L
%1 %2
@@
@msgFocusChanged1_l
 The currently active window is the title screen of the Year 2000 Grolier Multimedia Encyclopedia 
 This screen must be disabled in order to allow you to use this application 
 Call the script Import Registry Entry by pressing  
 To cause %product% to import the Registry entries that disable this screen 
 This script will shut down the encyclopedia and then run the file that will import the required registry entries 
 You will then need to restart the encyclopedia for the changes to take effect and to enable you to use the encyclopedia 
@@
@msgFocusChanged1_s
 The active window is title screen of Year 2000 Grolier Multimedia Encyclopedia 
 This screen must be disabled in order to use this application 
 script Import Registry Entry 
 To cause %product% to import Registry entries that disable this screen 
 This script will shut down encyclopedia then import the required registry entries 
 You then need to restart encyclopedia for changes to take effect 
@@
@msgWindowKeysHelp1_l
For the Articles Section press control + 1
For the Media Section press control + 2
For the Atlas Section press control + 3
For the Timelines Section press control + 4
For the Research Starters Section press control + 5
For the Interactivities Section press control + 6
For the Dictionary press control + 7
To save the currently open article as a Rich Text Format File press Control + s
To print the currently open article press Control + P
@@
@msgWindowKeysHelp1_s
For Articles Section control + 1
Media Section  control + 2
Atlas Section control + 3
Timelines Section  control + 4
Research Starters Section control + 5
Interactivities Section  control + 6
Dictionary control + 7
save open article as Rich Text Format  Control + s
print open article Control + P
@@
@msgWindowKeysHelp2_l
To select all press control + a
@@
@msgWindowKeysHelp2_s
Select all  control + a
@@
@msgWindowKeysHelp3_l
For the history list press Control + H
For the knowledge tree dialog press Control + K
To add items to the Marker List press control + m
@@
@msgWindowKeysHelp3_s
history list  Control + H
knowledge tree dialog Control + K
add items to Marker List control + m
@@
@msgHotKeyHelp1_l
 To Select a page in the currently active pane press  %KeyFor(SelectAPage).
To Select a page in the right hand pane regardless of which pane has focus press  %KeyFor(SelectAPageRightHandPane).
 To move focus to the first visible Article View window press  %KeyFor(FocusToArticleViewWindow).
 To move focus to the second visible Article View window press  
 %KeyFor(FocusToSecondArticleViewWindow).
Hot Keys are as follows 
 If the scripts Focus To Article View Window and Focus To Second Article View Window are both 
 unable to function
 Then perhaps the active page in the right hand pane contains only items that are unaccessible to 
 %product% 
 In this case you may try calling Select A Page Right Hand Pane or if the interactivities section is active 
 using the topics list box of the browse page to select an item below the top level item 
 Please note that the Research Starters section is not accessible via %product% 
@@
@msgHotKeyHelp1_s
 Select page in active pane  %KeyFor(SelectAPage).
Select page in right hand pane regardless of which pane has focus  %KeyFor(SelectAPageRightHandPane).
 move focus to first visible Article View  %KeyFor(FocusToArticleViewWindow).
 To move focus to the second visible Article View window press  
 %KeyFor(FocusToSecondArticleViewWindow).
Hot Keys are as follows 
 If scripts Focus To Article View Window and Focus To Second Article View Window are both unable 
 to function
 perhaps active page in right hand pane contains only items that are unaccessible to %product% 
 In this case try calling Select A Page Right Hand Pane or if interactivities section is active 
 using topics list of browse page to select an item below top level item 
 Research Starters section not accessible via %product% 
@@
@msgHotKeyHelp2_l
Hot keys are as follows
@@
@msgHotKeyHelp2_s
Hot keys are as follows
@@
@msgHotKeyHelp3_l
@@
@msgHotKeyHelp3_s
@@
@msgHotKeyHelp4_l
To move focus bact to the left hand pane press  %KeyFor(FocusToLeftHandPane).
@@
@msgHotKeyHelp4_s
To move focus bact to the left hand pane press  %KeyFor(FocusToLeftHandPane).
@@
@msgHotKeyHelp5_l
 To move focus to the buttons displayed below the Article View Window press  
 %KeyFor(FocusToArticleViewWindow).
@@
@msgHotKeyHelp5_s
 To move focus to the buttons displayed below the Article View Window press  
 %KeyFor(FocusToArticleViewWindow).
@@
@msgHotKeyHelp6_l
 To move focus back to the Article Vindow press  %KeyFor(FocusToArticleViewWindow).
@@
@msgHotKeyHelp6_s
 move focus back to Article Vindow  %KeyFor(FocusToArticleViewWindow).
@@
@msgHotKeyHelp7_l
 To Select a page in the currently active pane press  %KeyFor(SelectAPage).
To Select A Tool press  %KeyFor(SelectATool).
@@
@msgHotKeyHelp7_s
 Select page in active pane  %KeyFor(SelectAPage).
To Select A Tool press  %KeyFor(SelectATool).
@@
@msgHotKeyHelp9_L
To review the destination directory for The Year 2000 Grolier Multimedia Encyclopedia press  
%KeyFor(ReviewDestinationDirectory).
@@
@msgHotKeyHelp9_S
review destination directory, press  %KeyFor(ReviewDestinationDirectory).
@@
@msgHotKeyHelp12_L
To select whether or not you would To Run The The Year 2000 Grolier Multimedia Encyclopedia press 
%KeyFor(SelectAnOption).
@@
@msgHotKeyHelp12_S
To select whether you want To Run The Encyclopedia press %KeyFor(SelectAnOption).
@@
@msgScreenSensitiveHelpForKnownClasses1_l
@@
@msgScreenSensitiveHelpForKnownClasses1_s
@@
@msgScreenSensitiveHelpForKnownClasses2_l
 It is a member of a group of radio buttons 
 only one radio button can be checked at a time 
 to move between the members of the radial button group press the up or down arrow keys 
@@
@msgScreenSensitiveHelpForKnownClasses2_s
 a member of group of radio buttons 
 only one radio button can be checked at a time 
 to move between the members of the radial button group press the up or down arrow keys 
@@
@msgScreenSensitiveHelpForUnKnownClasses1_l
@@
@msgScreenSensitiveHelpForUnKnownClasses1_s
@@
@msgScreenSensitiveHelpForUnKnownClasses2_l
 It is a member of a group of radio buttons 
@@
@msgScreenSensitiveHelpForUnKnownClasses2_s
 a member of group of radio buttons 
@@
@msgScreenSensitiveHelpForUnKnownClasses3_l
This is the article view window
It contains the text of either an encyclopedia article or a picture caption
 You may use the standard navigation and reading keys to review the text contained within this window 
@@
@msgScreenSensitiveHelpForUnKnownClasses3_s
article view window
It contains text of either article or picture caption
 use standard navigation and reading keys to review text 
@@
@msgReadStaticWindows1_l
 Would You Like To Run The The Year 2000 Grolier Multimedia Encyclopedia? 
 To select whether or not you would To Run The The Year 2000 Grolier Multimedia Encyclopedia press  
 %KeyFor(SelectAnOption).
@@
@msgReadStaticWindows1_s
 Would You Like To Run Year 2000 Grolier Multimedia Encyclopedia? 
 select whether or not you want To Run Grolier Encyclopedia  %KeyFor(SelectAnOption).
@@
@ReadCustomControls1_L
%1 %2
@@

;END_OF_UNUSED_VARIABLES

EndMessages
