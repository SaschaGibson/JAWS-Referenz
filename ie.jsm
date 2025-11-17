;Copyright 1998-2024 by Freedom Scientific BLV Group, LLC
;JAWS script message file for Microsoft Internet Explorer

Const
;VersionInfoSeparator is the delimiter for the version info returned by GetVersionInfoString:
	VersionInfoSeparator = ".",
;for scViewDownloads, this is the name of the View Downloads button associated with the Notification bar in IE 9.
;To make it happen, start multiple simultaneous downloads,
; and when they are running, press alt+n to go to the notification bar
	scViewDownloads = "View downloads",
;Object name of the first child of View Downloads dialog object:
	objn_ViewAndTrackYourDownloads = "View and track your downloads",
;scNotificationBarText is the object name received by ValueChangedEvent when the notification bar appears:
	scNotificationBarText = "Notification bar Text",
;delimiter for checking link titles:
scEqualsDelim="=",

;configuration names:
	CONFIG_LIBERA = "Libera System 7",
	config_MsWord="Word",
	config_msExcel="Excel",
	config_msPowerpoint2007="Microsoft Powerpoint 2007",
;application names
	wn_msWord="Microsoft Word",
	wn_msExcel="Microsoft Excel",
	wn_msPowerpoint="Microsoft PowerPoint",
;Window class for address bar parent:
	wc_AddressBarParent = "Address Band Root",
;Window class for breadcrumb parent:
	wc_BreadcrumbParent = "Breadcrumb Parent",
;Control Panel applet Breadcrumb strings, used with msgControlPanelAppletBreadcrumb:
	wc_ComboBox = "ComboBox",
	wc_CtrlNotifySink = "CtrlNotifySink",
	wc_ControlPanelAutoPlay = "Control Panel\\AutoPlay",
	wc_DirectUI = "DirectUIHWND",
;Control Panel applet Names
	wan_WindowsUpdate = "Windows Update",
	wan_System = "System",
;Windows Update Control Panel
	vcp_wup_ViewAvailableUpdates = "View available updates",
	vcp_wup_ViewAvailableExtras = "View available Extras",
	vcp_wup_MostRecent = "Most recent check for updates:",
	vcp_wup_ViewUpdateHistory = "View update history",
;System Control Panel
	vcp_sys_ExpIndex = "Windows Experience Index",
	vcp_sys_NoExpIndex = "System Rating Is Not Available",
	vcp_sys_ChangeSettings = "Change Settings",
	vcp_sys_ChangeKey = "Change Product Key",
	vcp_sys_LearnMore = "Learn More Online...",
	vcp_sys_WGAGraphic = "License Logo",
	vcp_sys_WGAGraphicReplace = "Ask for genuine Microsoft software",
	vcp_sys_System = "System",
	vcp_sys_Computer = "Computer name, domain, and workgroup settings",
	vcp_sys_Activate = "Windows activation",
;For the Settings button in IE7 Internet Options:
	objn_settings_button = "Settings",  ;object name of the settings buttons
	WN_LIBERA = "System 7",
	wn_TemporaryInternetFilesAndHistorySettings = "Temporary Internet Files and History Settings",  ;window name of dialog it opens
	scSearchDefaultSettings = "Search Default Settings",  ;modification of the window name of dialog it opens
	wn_TabbedBrowsingSettings = "Tabbed Browsing Settings",  ;window name of dialog it opens
	wn_PopUpBlockerSettings = "Pop-up Blocker Settings",
	wn_AutoCompleteSettings = "AutoComplete Settings",  ;window name of dialog it opens
	wn_FeedSettings = "Feed Settings",  ;window name of dialog it opens
	wn_EditPlanSettings = "Edit Plan Settings", ;Windows Vista | Control Panel | power options
;for the Delete button in IE7 Internet Options:
	objn_Delete_button = "Delete...",  ;object name of the Delete button
	scBrowsingHistoryDelete = "Browsing History Delete...",  ;modification of window name of dialog it opens
;window names:
	wn_DeleteShortcut = "Delete Shortcut",

	wn_DeleteFile = "Delete File", ;windows 7 windows explorer delete file

	wn_DeleteFolder = "Delete Folder", ;windows 7 windows explorer delete folder

	wn_movefile = "Move File",
	wn_copyfile = "Copy File",
	wn_InternetOptions = "Internet Options",
	wn_FileDownload_SecurityWarning = "File Download - Security Warning",
	wn_SearchCompanion = "Search Companion",
	WnSecurityWarning = "Security Warning",
; for Windows help and support center
	WN_HelpAndSupportCenter = "Help and Support Center",
;for windows System Restore dialog
	wn_SystemRestore = "System Restore",
;for the IE-specific verbosity toggles:
	jvIEInformationBarAnnounce = "|InformationBarAnnouncement:Information Bar",
	jvIERSSFeedAvailabilityAnnounce = "|RSSFeedAvailabilityAnnouncement:RSS Feed Availability Announcement",
	UO_IEInformationBar = "UOInformationBar:Information Bar",
	UO_IERSSFeeds = "UORSSFeeds:RSS Feeds",
	UO_ToggleHTMLFrameUpdateNotification = "UOToggleHTMLFrameUpdateNotification:Frame Update Notification",
	UO_CustomToggleHTMLFrameUpdateNotification = "UOCustomToggleHTMLFrameUpdateNotification:Frame Update Notification",

scRightBracket = "]",
scDriveColon = ":",
scPathSlash = "/",
;the following is for when an URL is local to the computer:
scLocalURL = "file:",
;the next message is used as a window type in the first form field script
scHidden1_L = "Hidden",
;object names in the list of links
scSortLinks = "Sort Links",
scDisplayLinks = "Display",
;Keystrokes
;The following two key strokes are issued in the GoBack and GoForward scripts to go to previous and next web page
ks1 = "alt+leftarrow",
ks2 = "alt+rightarrow",
;The next two keystrokes are issued in the next frame and previous frame scripts
ks3 = "control+tab",
ks4 = "control+shift+tab",
ks5 = "backspace",  ;issued in the JAWSBackSpace script
ks6 = "ctrl+f",  ;For the IeFind script



;window names
wnAlert1 = "Alert",


;Element description, for RSS Feed document:
	scDocTypeRSSFeed = "DocType=RssFeed",
;Element description, for RSS feed available:
	scRssFeedAvailable = "rss=true",

;hotkey for the Information Bar, must be in a form recognized by TypeKey:
	ksInformationBarHotKey = "Alt+N",

;the IE7 search:
	wn_UniversalSearchBand = "UniversalSearchBand",

; for the IE Toolbar dialog
	ToolbarDialogName = "Internet Explorer Toolbar",
; for the Select a frame dialog
	SelectAFrameDialogName = "Frames List",
	Separator = "\007",



;UNUSED_VARIABLES

	NODE_IE_OPTIONS = "InternetExplorer Options",
;Control Panel applet Breadcrumb strings, used with msgControlPanelAppletBreadcrumb:
	csc_Breadcrumb_AutoPlay = "AutoPlay",
	sc_Computer = "computer",
	wc_ShellTabWindowClass = "shellTabWindowClass",
	;This is the internal addition to the Window name,
	;on tree views in Security Settings,
	;We just strip this off the end of a given name, and return the rest from GetWindowName
	scTreeStrip = "Tree1",
scPeriod = ".",
scVirticalBar = "|",
; For SelectAnArticle script which calls GetListOfTags and requires an attribute, not to be localized.
scPrompt="prompt",
;the following two messages are used when locating the history window
scWeek1_L = "week",
scWInitials1 = "www.",

; Adobe acrobat config name
scAdobeAcrobat = "Adobe Acrobat",

;The next two keystrokes are issued in the MoveToLink4  function in shdocvw
ks7 = "tab",
ks8 = "shift+tab",
;keystrokes ks9-ks12 are to open history
ks9 = "v",
ks10 = "e",
ks11 = "h",
ks12 = "n",
;The character which separates the app title from the page name on the title bar:
	scTitleAndAppSeparator = "-",
;Real name of the security dialog
	rnSecurityDlg = "Internet Explorer",
; for the IE Toolbar dialog
	strToolbar = "Back|Forward|Stop|Refresh|Home|Search|Favorites|History|Mail|Print|Edit",
	strExpectedToolBarButtons = "Back Button|Forward Button|Stop Button|Refresh Button|Home Button|Search Button|Favorites Button|History Button|Mail Button|Print Button|Edit Button",

;END_OF_UNUSED_VARIABLES

;Personal Settings Dialog Stuff
;Relevant text translatable, like insert+v
; Translate text *after* the ":" character only.
	jvCustomClearAllSettings = "|CustomClearAllSettings:Personalized Settings",
	jvCustomToggleVirtualCursor = "|CustomToggleVirtualCursor:Virtual Cursor",
	jvCustomNavigationQuickKeysMode = "|CustomNavigationQuickKeysMode:Navigation Quick Keys",
	jvCustomDocumentPresentationModeToggle = "|CustomDocumentPresentationModeToggle:Document Presentation",
	jvCustomIncludeGraphicsToggle = "|CustomIncludeGraphicsToggle:Graphics In HTML",
	jvCustomGraphicReadingVerbosityToggle = "|CustomGraphicReadingVerbosityToggle:Graphics Recognized by",
	jvCustomIncludeLinksToggle = "|CustomIncludeLinksToggle:Links with Graphics",
	jvCustomGraphicsLinkLastResortToggle = "|CustomGraphicsLinkLastResortToggle:As a last resort",
	jvCustomIncludeImageMapLinksToggle = "|CustomIncludeImageMapLinksToggle:Links In Image Maps",
	jvCustomTextLinkVerbosityToggle = "|CustomTextLinkVerbosityToggle:Links With Text Only",
	jvCustomIdentifyLinkTypeToggle = "|CustomIdentifyLinkTypeToggle:Link Type Announcement",
	jvCustomIdentifySamePageLinksToggle = "|CustomIdentifySamePageLinksToggle:Link, Same Page Announcement",
	jvCustomButtonTextVerbosityToggle = "|CustomButtonTextVerbosityToggle:Buttons Recognized by",
	jvCustomExpandAbbreviationsVerbosityToggle = "|CustomExpandAbbreviationsVerbosityToggle:Expand Abbreviations",
	jvCustomExpandAcronymsVerbosityToggle = "|CustomExpandAcronymsVerbosityToggle:Expand Acronyms",
	jvCustomToggleUseVirtualInfoInFormsMode = "|CustomToggleUseVirtualInfoInFormsMode:Forms Mode Uses Virtual Labels",
	jvCustomToggleFormsModeAutoOff = "|CustomToggleFormsModeAutoOff:Forms Mode Auto Off",
	jvCustomToggleLanguageDetection = "|CustomToggleLanguageDetection:Language Detection",
	jvCustomFormFieldPromptsRenderingToggle  = "|CustomFormFieldPromptsRenderingToggle :Form Field Prompts Use",
	jvCustomFrameIndicationToggle = "|CustomFrameIndicationToggle:Frame Announcement",
	jvCustomToggleIgnoreInlineFrames = "|CustomToggleIgnoreInlineFrames:Inline Frames",
	jvCustomScreenFollowsVCursorToggle = "|CustomScreenFollowsVCursorToggle:Screen Follow Virtual Cursor",
	jvCustomSkipPastRepeatedTextToggle = "|CustomSkipPastRepeatedTextToggle:Skip Past Repeated Text On New Pages",
	jvCustomIncrementMaxLineLength = "|CustomIncrementMaxLineLength:Increase Line Length",
	jvCustomDecrementMaxLineLength = "|CustomDecrementMaxLineLength:Decrease Line Length",
	jvCustomIncrementMaxBlockLength = "|CustomIncrementMaxBlockLength:Increase Nonlink Text To",
	jvCustomDecrementMaxBlockLength = "|CustomDecrementMaxBlockLength:Decrease Nonlink Text To",
	jvCustomIndicateBlockQuotes = "|CustomIndicateBlockQuotes:Block Quote Announcement",
	jvCustomIndicateLists = "|CustomIndicateLists:List Announcement",
	jvCustomElementAttributeAnnounce = "|CustomElementAttributeAnnounce:Element Attribute Announcement",
	jvCustomIndicateTablesToggle = "|CustomIndicateTablesToggle:Table Announcement",
	jvCustomDetectTables  = "|CustomDetectTables :Layout Tables",
	jvCustomIndicateHeadingsToggle = "|CustomIndicateHeadingsToggle:Heading Announcement",
	jvCustomFlashOnWebPagesToggle = "|CustomFlashOnWebPagesToggle:Flash Movies",
	jvCustomRefreshActiveContent = "|CustomRefreshActiveContent:Refresh Flash Movies",
	jvCustomRefreshHTML = "|CustomRefreshHTML:Refresh Page",
	jvAnnounceLiveRegionUpdates = "|CustomAnnounceLiveRegionUpdates:Announce live region updates",
	jvCustomCustomPageSummary = "|CustomCustomPageSummary:Custom Page Summary",
	jvCustomStyleSheetProcessing = "|CustomStyleSheetProcessing:Style Sheet Processing",
	strCustomClearAll = "CustomClearAllSettings:Personalized Settings"


Messages
@msgIEVer_l
Internet Explorer
@@
;msgMicrosoftInternetExplorerAppName and msgInternetExplorerAppName
;are used as a replaceable parameter for inserting into messages where the browser name is used.
@msgMicrosoftInternetExplorerAppName
Microsoft Internet Explorer
@@
@msgInternetExplorerAppName
Internet Explorer
@@
@msgBack1_L
Back
@@
@msgForward1_L
Forward
@@
@msgHome1_L
Home
@@
;for msgAddress, %1 = the address in the address bar
@msgAddress1_L
Address is %1
@@
@msgAddressBar1_L
address bar
@@
@msgAddressBarNotFound1_L
Address bar not found
@@
@msgAddressBarNotFound1_S
not found
@@
@msgAddressNotVisible_L
Address not visible
@@
@msgAddressNotVisible_S
not visible
@@
@msgToolBarNotFound1_L
Tool bar not found
@@
;for msgLabelNotFound, %1 = the desired button name
@msgLabelNotFound1_L
%1 button not found
@@
@msgLabelNotFound1_S
%1 not found
@@
; for HotKeyHelp
; for ScreenSensitiveHelp
@msgIEWindow1_L
This is an Internet Explorer window
@@
;for msgFrame and msgFrames, %1 = the number of frames in the current page
@msgFrame1_L
%1 frame
@@
@msgFrames1_L
%1 frames
@@
;for msgForm and msgForms, %1 = the number of forms on the current page
@msgForm1_L
%1 form
@@
@msgForms1_L
%1 forms
@@
@msg1_L
no links
@@
;For msgNumLink and msgNumLinks, %1 = the number of hyper links on the current page
@msgNumLink1_L
%1 link
@@
@msgNumLinks1_L
%1 links
@@
;msgLinksListDialogName_L and msgNoLinks_L
;are used by MAGic to show the error message when the page has no links
@msgLinksListDialogName_L
Links List
@@
@msgNoLinks_L
No links found in document.
@@
; for FocusChangedEvent4
@msgNewBrowserWindow1_L
New browser window
@@
;for msgDialog, %1 = the name of the current dialog
@msgDialog1_L
 %1 Dialog
@@
@msgFeatureNotAvailable1_S
only available in Internet Explorer 4
@@
;msgFocusToFormFieldDialog is the title of a dialog presented by MAGic
;for error messages about moving to form fields
@msgFocusToFormFieldDialog
Focus To Form Field
@@
@msgFieldNotFound1_L
No form fields found
@@
@msgFieldNotFound1_S
No form fields
@@
@msgFieldNotFound2_L
No more form fields found
@@
@msgFieldNotFound2_S
No more form fields
@@
@msgFieldNotFound3_L
No prior form fields found
@@
@msgFieldNotFound3_S
No prior form fields
@@
;for msgCurContains, %1 = msgFrame or msgFrames, %2= msgLink or msgLinks,
;%3 = msgForm or msgForms, %4=description of headings, %5 = msgAddress
@msgCurContains1_L
The current page contains %1 %2 %3 %4 %5
@@
@msgCurContains1_S
page contains %1 %2 %3 %4 %5
@@
@msgNoFrames1_L
No frames found in page
@@
@msgNoFrames1_S
No frames found
@@
@msgDot1_L
.
@@
;
; New HotKey and WindoKeys Help
;for msgLookIn, %1 = the Current line, presumably containing a hyperlink
@msgLookIn1
Look in %1
@@
@msgNotAvailable1_L
Not available when virtual PC cursor is off
@@
@msgNotAvailable1_S
Not Available
@@
@msgFormsModeOn1
Forms mode is on
@@
@msgFormsModeNavigate1
Use tab and shift+tab to move between the fields
@@
@MSG2_L
Virtual Find
@@
@msgHotKeyHelp1_L
To hear the %product% help topic for Internet Explorer, press insert+f1 twice quickly.
@@
@msgHotKeyHelp1_S
%product% help topic for Internet Explorer, insert+f1 twice quickly.
@@
@msgFormsModeHotKeyHelp_L
To move forward and backward through links and other controls, use %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
To read the selected link or control, use %KeyFor(SayWindowPromptAndText).
To select a link from a list of all the links contained in the page, use %KeyFor(SelectALink).
To go to the first form field on the page, use %KeyFor(FocusToFirstField).
To place the JAWS cursor in the address bar, use %KeyFor(AddressBar).
@@
@msgFormsModeHotKeyHelp_S
move forward and backward through links and controls, %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
Read selected link or control, %KeyFor(SayWindowPromptAndText).
Select link from list of all links contained in page, %KeyFor(SelectALink).
Go to first form field, %KeyFor(FocusToFirstField).
Place JAWS cursor in address bar, %KeyFor(AddressBar).
@@
@msgBrowserVirtualHotKeyHelp1_L
Go Back a page, ALT+LEFT ARROW.
Read the Address bar, INSERT+A.
Next link, TAB.
Prior link, SHIFT+TAB.
Open a link, ENTER.
Display a list of links, %KeyFor(SelectALink).
Display and manage PlaceMarkers, %KeyFor(SelectAPlaceMarker).
Display a list of form fields, %KeyFor(SelectAFormField).
Display a list of headings, %KeyFor(SelectAHeading).
Display a list of frames, %KeyFor(SelectAFrame).

To move through a web page:
Next Radio Button, A.
Next Button, B.
Next ComboBox, C.
Next different element, D.
Next Edit, E.
Next Form Field, F.
Next Graphic, G.
Next Heading, H.
Next List Item, I.
Jump to a specific line with J,
And return to the starting point before the jump with Shift+J.
Next Place Marker, K.
Next List, L.
Next Frame, M.
Skip past links, N.
Next Article, O.
Next Paragraph, P.
Next Main Region, Q.
Next Region, R.
Next Same Element, S.
Next Table, T.
Next unvisited link, U.
Next visited link, V.
Next instance of a word from a created word list, W.
Next Checkbox, X.
Next glance highlight, Y.
Next Division, Z.
Next OnMouseOver element, ; (semicolon).
Next Tab, ' (apostrophe).
Next element with an onclick handler, / (slash).
Next MailTo link, \ (backslash).
Next Slider, ` (Grave).
Next Separator, - (Dash).
Next FlowTo element, = (Equals).
Add SHIFT to these commands to move to the prior item.

Step past element, > (greater than).
Step prior to element, < (less than).

Add Control+JAWSKey to the applicable quick keys to bring up a list of that element,
For example, Control+JAWSKey+z will bring up a list of the divisions on the page.

To move and read in tables:
Next row, WINDOWS KEY+Alt+DOWN ARROW.
Prior row, WINDOWS KEY+Alt+UP ARROW.
Read Row, WINDOWS KEY+ALT+COMMA.
Next column, WINDOWS KEY+Alt+RIGHT ARROW.
Prior column, WINDOWS KEY+Alt+LEFT ARROW.
Read Column, WINDOWS KEY+ALT+PERIOD.
Next cell in a row, ALT+CTRL+RIGHT ARROW.
Prior cell in a row, ALT+CTRL+LEFT ARROW.
Cell below in a column, ALT+CTRL+DOWN ARROW.
Cell above in a column, ALT+CTRL+Up ARROW.
Jump to cell,Control+Windows+j.
@@
@msgForMoreProductHelp
Visit %product% help for more information.
Press and hold INSERT, then press F1 twice quickly to open help directly to the %1 topic. Press F6 to move into the help topic window.
@@
@msgScreenSensitiveHelp1_L
For a list of hot keys, press %KeyFor(HotKeyHelp).
@@
@msgScreenSensitiveHelp1_S
For hot keys, %KeyFor(HotKeyHelp).
@@
@msgScreenSensitiveHelp2_L
This is a list of all the links contained on the current page. Select a link using the arrow keys or the first letter
and press enter to go to it.
@@
@msgScreenSensitiveHelp2_S
list of all the links contained on the page. Select link using the arrow keys or first letter.
@@
@msgScreenSensitiveHelp3_L
this is a list of the buttons in the Internet Explorer toolbar. Select a button using the arrow keys or the first letter of the label
and press enter to click on it.
@@
@msgScreenSensitiveHelp3_S
List of Buttons in the Toolbar. Select button using arrow keys or first letter of label.
@@
;msgWindowsKeyHelp replaces msgWindowsKeyHelp_L and msgWindowsKeyHelp_S,
;since it does not make sense to use links for some of the keys in the list.
;%1 is the MoveToNextLink keystroke
;%2 is the MoveToPriorLink keystroke
;%3 is the GoBack keystroke
;%4 is the GoForward keystroke
@msgWindowsKeyHelp
To move forward to the next link or control, press %1.
To move backwards to the previous Link or control, press %2.
To activate a link, press Enter.
To move back to the previous page, press %3.
To move forward to the next page, press %4.
To move focus to the Address Bar, press alt + d.
@@
@msgFeatureNotAvailable1_L
This feature is only available when using Internet Explorer 4.
@@
@msgNoLinks1_L
No links found
@@
@msgNoLinks1_S
No links found
@@
@msgNoHeadings1_L
No headings found
@@
@msgNoHeadings1_S
No headings found
@@
@msgNoHeadings2_L
no level%1 headings found
@@
@msgNoHeadings2_S
no level%1 headings
@@
@msgNoNextHeading1_L
no more headings found
@@
@msgNoNextHeading1_S
no more headings
@@
@msgNoPriorHeading1_L
no prior headings found
@@
@msgNoPriorHeading1_S
no prior headings
@@
@msgNoNextHeading2_L
no next heading at level%1 in this section
@@
@msgNoNextHeading2_S
no next heading at level%1 in section
@@
@msgNoPriorHeading2_L
no prior heading at level%1 in this section
@@
@msgNoPriorHeading2_S
no prior heading at level%1 in section
@@
;for msgHeadsAtLevelN
;%1 is the heading level number
@msgHeadingsAtLevelN
headings at level %1 in this section
@@
@msgNoHeadings_L
There are no headings on this page.
@@
@msgNoHeadings_S
No headings
@@
@msgNoTables1_L
No tables found
@@
@msgNoTables1_S
No tables
@@
@msgNoTables2_L
No more tables found
@@
@msgNoTables2_S
No more tables
@@
@msgNoTables_L
There are no tables on this page.
@@
@msgNoTables_S
No tables
@@
@msgFormsModeOn
Forms mode is on.
@@
@msgHeadingsDesc1
there is 1 heading.
@@
@msgHeadingsDescMultiple
there are %1 headings.
@@
@msgHeadingsDescAtLevel
%1 at level %2,
@@
@msgNoLists1_L
No Lists found
@@
@msgNoLists1_S
No Lists
@@
@msgNoLists2_L
No more Lists found
@@
@msgNoLists2_S
No more Lists
@@
@MsgNoPriorList_L
No prior Lists found
@@
@MsgNoPriorList_S
No prior Lists
@@
@msgNoMoreFrames_L
No more frames found
@@
@msgNoMoreFrames_S
No more frames
@@
@msgNoPriorFrames_L
No prior frames found
@@
@msgNoPriorFrames_S
No prior frames
@@
@msgNoFrames_L
There are no frames on this page.
@@
@msgNoFrames_S
No frames
@@
;for msgFrameIndexOutOfRange_L/s,
;%1 is index of frame which is out of range,
;%2 is number of frames on page
@msgFrameIndexOutOfRange_L
There is no frame %1.
The page contains %2 frames.
@@
@msgFrameIndexOutOfRange_S
no frame %1.
page contains %2 frames.
@@
@msgSelectAFormFieldTitle
Select a Form Field
@@
; msgMoveToFrameNumberFailed is spoken when move to frame number fails
;even though there is a frame of that number on the page
;%1 is the frame number
@msgMoveToFrameNumberFailed
Failed to move to frame %1
@@
@msgCleared
All Cleared
@@
@msg1OrMoreSet
Set
@@
@msgPagePersonalized
Personalized Settings for this Site
@@
; Region "no element" messages used when quick nav fails to move to the item
@CVmsgNoElements_L
There are no %1 on this page.
@@
@CVmsgNoElements_S
No %1
@@
; Emails are a special case, as even when you can't find one,
; there is an email on the page. You're always in the first email.
@cVmsgNoMoreEmails_L
There are no more %1 on this page.
@@
@cVmsgNoMoreElements_L
No more %1 found.
@@
@cVmsgNoPriorElements_L
No prior %1 found.
@@
@cVmsgNoMoreElements_S
No more %1
@@
@cVmsgNoPriorElements_S
No prior %1
@@
; Below are error messages for elements not found when searching in a section for a specific level,
;specifically for headings at level greater than 1.
; For level 1, the search is not restricted to a section.
; %1 is the element searched for
; %2 is the level of the element searched for
@CVmsgNoNextElementsAtLevel_L
No more %1 at level1.
@@
@CVmsgNoNextElementsAtLevel_S
No more %1 at level1
@@
@CVmsgNoNextElementsAtLevelInSection_L
No more %1 at level%2 in this section.
@@
@CVmsgNoNextElementsAtLevelInSection_S
No more %1 at level%2 in section
@@
@CVmsgNoPriorElementsAtLevel_L
No prior %1 at level1.
@@
@CVmsgNoPriorElementsAtLevel_S
No prior %1 at level1
@@
@CVmsgNoPriorElementsAtLevelInSection_L
No prior %1 at level%2 in this section.
@@
@CVmsgNoPriorElementsAtLevelInSection_S
No prior %1 at level%2 in section
@@
@MsgButtonDisabled_L
button disabled
@@
@MsgButtonDisabled_S
disabled
@@
@MsgButtonNotFound_L
Button not found
@@
@MsgButtonNotFound_S
not found
@@
; EndRegion
@msgContainsText
Contains text
@@
@msgInformationBarAnnouncement_Virtualize
Virtualize
@@
@msgInformationBarAnnouncement_Speak
Speak
@@
@msgInformationBarAnnouncement_Off
Off
@@
@msgRSSFeedAvailabilityAnnounce_virtualize
Virtualize
@@
@msgRSSFeedAvailabilityAnnounce_Speak
Speak
@@
@msgRSSFeedAvailabilityAnnounce_Off
Off
@@
@msgRssFeedavailabilityAnnouncement_L
RSS feeds available
@@
@msgRssFeedavailabilityAnnouncement_S
RSS feeds
@@
; msgNewWindow and msgNewTabPage are announce when a new browser window (Control+n) or tab page (control+t) is open while on the address bar.
@msgNewWindow
New window
@@
@msgNewTabPage
New tab page
@@
@msgIE7SearchControlEditCustomTutorHelp
Type in text.
Control+DownArrow for context menu.
@@
@msgIE7SearchControlEditScreenSensitiveAppendedHelp
Use Control+DownArrow for a context menu of Search options.
@@
@msgToolBarTutor
To activate, press the space bar.
Find more buttons with the arrow keys.
@@
@MsgButtonContextTutor
To activate, press the space bar.
For the context menu, press DownArrow.
@@
@msgUO_AnnounceNew
Announce Change
@@
@msgUO_VirtualizeContent
Virtualize Content
@@
@msgUO_InformationBarHlp
This option controls how %product% will handle the Information bar.
Select Ignore for %product% to ignore changes.
Select Announce Change and %product% will announce changes to the Information Bar in the Message voice.
Virtualize means that %product% will show the Information Bar in a mini virtual document.
@@
@msgUO_RSSFeedsHlp
This option controls how %product% will handle the RSS Feeds.
Select Ignore for %product% to ignore changes.
Select Announce Change and %product% will announce changes to the RSS Feeds in the Message voice.
Virtualize means that %product% will show the RSS Feeds in a mini virtual document.
@@
@msgUO_InternetExplorerOptionsHlp
These options are specific to Internet Explorer.
RSS Feeds are only available in Internet Explorer 7 or later.
The Information Bar is available in Internet Explorer 6 with the latest updates, or 7 and later.
@@
@msgPersonalizedSettingsNotAvailable
Personalized Settings only available for web pages and pdf documents.
@@
;for msgControlPanelBreadcrumb
;the intire breadcrumb is the text in the child window of the window of class breadcrumb parent.
;The control panel breadcrumb is the portion which refers to the Control Panel.
@msgControlPanelBreadcrumb
Control Panel
@@
@msgToggleHTMLFrameUpdateNotificationHlp
This setting controls how %product% notifies you that a frame has been updated. Off sends no notification, Speak Frame Name speaks the name of the frame which was last updated, and Move To Frame moves the cursor to the beginning of the most recently updated frame and speaks the line.
@@
@msgFrameUpdateNotificationSpeakFrameName
Speak Frame Name
@@
@msgFrameUpdateNotificationMoveTo
Move To Frame
@@
@msgNoRegions_L
There are no Regions on this page.
@@
@msgNoRegions_S
No regions
@@
@msgNoMainRegion_L
There is no Main Region on this page.
@@
@msgNoMainRegion_S
No main region
@@
@msgNoNextRegion_L
no more regions found
@@
@msgNoNextRegion_S
no more regions
@@
@msgNoPriorRegion_L
no prior regions found
@@
@msgNoPriorRegion_S
no prior regions
@@
@msgNoMailToLinks_L
There are no mailto links on this page.
@@
@msgNoMailToLinks_S
No mailto links
@@
@msgNoNextMailToLink_L
no more MailTo links found
@@
@msgNoNextMailToLink_S
no more MailTo links
@@
@msgNoPriorMailToLink_L
no prior Mailto links found
@@
@msgNoPriorMailToLink_S
no prior MailTo links
@@
@msgNoMailToLink_L
no mailto links found
@@
@msgNoPlaceMarkersOnPage_L
No placemarkers on current page
@@
@msgNoPlaceMarkersOnPage_S
No placemarkers
@@
;for msgNoPlacemarkerN
;%1 is the number of the place marker
@msgNoPlacemarkerN
No place marker #%1
@@
@msgPlaceMarkerError
Placemarker error
@@
@msgLinkTitle
title=
@@
@msgNotOnAnElement_L
The cursor is not on an HTML element
@@
@msgNotOnAnElement_S
Not on an element
@@
@cmsgSameElement
elements of same type
@@
;for msgTableDimensions_L
;%1 is table or grid
;%2 and %3 are the row and column count
;for msgTableDimensions_S
;;%1 and %2 are the row and column count
;to be announced when using quick nav keys to move to the table or grid
@msgTableDimensions_L
%1 with %2 columns and %3 rows
@@
@msgTableDimensions_S
%1 columns and %2 rows
@@
;msgVisibleTableDimensions messages are used when only some of the rows and columns are visible.
;for msgVisibleTableDimensions_L
;%1 is table or grid
;%2 and %3 are visible columns of total columns
;%4 and %5 are visible rows of total rows
;for msgTableDimensions_S
;%1 and %2 are visible and total columns 
;%3 and %4 are visible and total rows
;to be announced when using quick nav keys to move to the table or grid
@msgVisibleTableDimensions_L
%1 with %2 of %3 columns and %4 of %5 rows
@@
@msgVisibleTableDimensions_S
%1 of %2 columns and %3 of %4 rows
@@
;msgTableDimensionsWithInvisibleRows messages are used when only some of the rows of the table are visible.
;For msgTableDimensionsWithInvisibleRows_L,
;%1 is table or grid
;%2 is the number of columns
;%3 and %4 are visible rows of total rows
;For msgTableDimensionsWithInvisibleRows_S,
;%1 is the number of columns
;%2 and %3 are visible rows of total rows
@msgTableDimensionsWithInvisibleRows_L
%1 with %2 columns and %3 of %4 rows
@@
@msgTableDimensionsWithInvisibleRows_S
%1 columns and %2 of %3 rows
@@
;msgTableDimensionsWithInvisibleColumns messages are used when only some of the columns of the table are visible.
;For msgTableDimensionsWithInvisibleColumns_L,
;%1 is table or grid
;%2 and %3 are visible of total columns
;%4 is the number of rows
;For msgTableDimensionsWithInvisibleRows_S,
;%1 and %2 are visible of total columns
;%3 is the number of rows
@msgTableDimensionsWithInvisibleColumns_L
%1 with %2 of %3 columns and %4 rows
@@
@msgTableDimensionsWithInvisibleColumns_S
%1 of %2 columns and %3 rows
@@
@msgTable
table
@@
@msgGrid
grid
@@
@msgNotificationBarRequiresResponse_L
Notification bar requires response.
Press Alt+n.
@@
@msgNotificationBarRequiresResponse_S
Notification bar.
Press Alt+n.
@@
@cmsgMarkedPlaceSelectingTextError_l
You must first set a temporary placemarker with %KeyFor(DefineATempPlaceMarker) so you can select text between that place and your current location.
@@
@cmsgMarkedPlaceSelectingTextError_s
Set a temporary placemarker with %KeyFor(DefineATempPlaceMarker) then you can select between that place and your current location.
@@
@cmsgMarkedPlaceSelectingText
selecting between marked place and current position
@@

;for msgMultipleDownloadsNotificationBarText_Part1 and msgMultipleDownloadsNotificationBarText_Part2
;this is text that appears in IE 10 on the notification bar when multiple downloads are in progress.
;This text is received in valueChangedEvent repeatedly as long as simultaneous multiple downloads are in progress.
;These two messages are parts of a single text output,
;the number of downloads and the actual time remaining is omitted since it will vary.
;The text is used to suppress constant announcement of the value change as the downloads are in progress.
@msgMultipleDownloadsNotificationBarText_Part1
downloads in progress
@@
@msgMultipleDownloadsNotificationBarText_Part2
remaining
@@
;msgReadDialogFlyoutControls is the format of each control spoken by script ReadBoxInTabOrder
;when UIA is used to read through the controls in a flyout dialog,
;such as you get in IE 11 under Windows 10,
;in Tools menu > Options dialog > Programs tab, then press Set Associations button.
;%1 is the element name,
;%2 is the localized control type from UIA,
;%3 is the state string if any exists
@msgReadDialogFlyoutControls
%1 %2 %3
@@

;UNUSED_VARIABLES

@msgIE1_L
Internet Explorer 5
@@
@msgIE2_L
Internet Explorer 4
@@
@msgIE3_L
Internet Explorer 3
@@
@msgToolBarNotFound1_S
not found
@@
@fsBack1
Back
@@
@fsChannels1
Channels
@@
@fsEdit1
Edit
@@
@fsFavorites1
Favorites
@@
@fsForward1
Forward
@@
@fsFullscreen1
Fullscreen
@@
@fsHistory1
History
@@
@fsHome1
Home
@@
@fsMail1
Mail
@@
@fsPrint1
Print
@@
@fsRefresh1
Refresh
@@
@fsSearch1
Search
@@
@fsStop1
Stop
@@
;for msgDocContains, %1 = msgFrame or msgFrames, %2 = msgForm or msg Forms
@msgDocContains1_L
This document contains %1 %2
@@
@msgReformattingPage1_L
Reformatting page
@@
@msgReformattingPage1_S
Reformatting
@@
@msgReformattingFailed1_L
Reformatting failed.  Document may not have finished loadingd
@@
; for opening and closing the history treeview, added by KAG
@msgOpenHist1_L
open history
@@
@msgCloseHist1_L
close history
@@
@msgProblemOpeningHist1_L
Problem opening history.  Please try again.
@@
@msgAddress2_L
Address
@@
@msgAddressBarNotFound2_L
The address bar could not be found. Try selecting the address button.
@@
@msgAddressBarNotFound2_S
not found
@@
@WebInitials1
Www
@@
@msgWeekOf1_L
week of
@@
@msgHotKeyHelp2_L
You may use the following hot keys when browsing a page:
@@
@msgHotKeyHelp2_S
Use the following hot keys when browsing a page:
@@
@msgHotKeyHelp3_L
To move forward and backward through links and other controls, use %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
To read the selected link or control, use %KeyFor(SayWindowPromptAndText).
To select a link from a list of all the links contained in the page, use %KeyFor(SelectALink).
@@
@msgHotKeyHelp3_S
move forward and backward through links and controls, %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
Read selected link or control, %KeyFor(SayWindowPromptAndText).
Select link from list of all links contained in page, %KeyFor(SelectALink).
@@
@msgHotKeyHelp4_L
To reformat the current page, use %KeyFor(ReformatDocument).
@@
@msgHotKeyHelp4_S
Reformat page, %KeyFor(ReformatDocument).
@@
@msgHotKeyHelp5_L
To go to the first form field on the page, use %KeyFor(FocusToFirstField).
To click a button in the toolbar, use %KeyFor(Toolbar).
To place the JAWS cursor in the address bar, use %KeyFor(AddressBar).
@@
@msgHotKeyHelp5_S
Go to first form field, %KeyFor(FocusToFirstField).
Click button in toolbar, %KeyFor(Toolbar).
Place JAWS cursor in address bar, %KeyFor(AddressBar).
@@
@msgHotKeyHelp6_L
To read the body of the page with the JAWS cursor, use %KeyFor(ReadCurrentScreen).
To scroll the page up and down and read with the JAWS cursor, use %KeyFor(ReadPriorScreen) and %KeyFor(ReadNextScreen) respectively.
@@
@msgHotKeyHelp6_S
Read body of page with JAWS cursor, %KeyFor(ReadCurrentScreen).
Scroll page up and down reading with JAWS cursor, %KeyFor(ReadPriorScreen) and %KeyFor(ReadNextScreen) respectively.
@@
@msgHotKeyHelp7_L
to read columns with the JAWS cursor, use control combined with the arrow keys.
@@
@msgHotKeyHelp7_S
Read columns with JAWS cursor . control combined with arrow keys.
@@
;this message belongs to the HotKeyHelp for IE4.01
@msgHotKeyHelp8_L
To move forward and backward through links and other controls, use  %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
To read the selected link or control, use  %KeyFor(SayWindowPromptAndText).
To select a link from a list of all the links contained in the page, use  %KeyFor(SelectALink).
To reformat the current page, use  %KeyFor(ReformatDocument).
To go to the first form field on the page, use  %KeyFor(FocusToFirstField).
To click a button in the toolbar, use  %KeyFor(Toolbar).
To place the JAWS cursor in the address bar, use  %KeyFor(AddressBar).
To read the body of the page with the JAWS cursor, use  %KeyFor(ReadCurrentScreen).
To scroll the page up and down and read with the JAWS cursor, use  %KeyFor(ReadPriorScreen) and %KeyFor(ReadNextScreen) respectively.
To read columns with the JAWS cursor, use control combined with the arrow keys.
To open the History tree view or return to it from the body of the page, use  %KeyFor(OpenHistory).
To close the History tree view, use  %KeyFor(CloseHistory).
@@
@msgHotKeyHelp8_S
Move forward and backward through links and controls, %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink).
Read selected link or control, %KeyFor(SayWindowPromptAndText).
Select link from list of all links contained in page, %KeyFor(SelectALink).
Reformat page, %KeyFor(ReformatDocument).
Go to first form field, %KeyFor(FocusToFirstField).
Click button in toolbar, %KeyFor(Toolbar).
Place JAWS cursor in address bar, %KeyFor(AddressBar).
Read body of page with JAWS cursor, %KeyFor(ReadCurrentScreen).
Scroll page up and down reading with JAWS cursor, %KeyFor(ReadPriorScreen) and %KeyFor(ReadNextScreen).
Read columns with JAWS cursor, control combined with arrow keys.
Open History tree view or return to it  from page, %KeyFor(OpenHistory).
Close History tree view, %KeyFor(CloseHistory).
@@
;this message is for HotKeyHelp in IE3
@msgHotKeyHelp9_L
To move forward and backward through links and other controls, use  %KeyFor(MoveToNextLink) and %KeyFor(MoveToPriorLink) respectively.
To read the selected link or control, use  %KeyFor(SayWindowPromptAndText).
To place the JAWS cursor in the address bar, use  %KeyFor(AddressBar).
To place the JAWS cursor in the first button of the tool bar, use  %KeyFor(Toolbar).
To read the body of the page with the JAWS cursor, use  %KeyFor(ReadBody).
to read columns with the JAWS cursor, use control combined with the arrow keys
@@
@msgHotKeyHelp9_S
Move forward and backward in links and controls, %KeyFor(MoveToNextLink).
Read selected link or control, %KeyFor(SayWindowPromptAndText).
Place JAWS cursor in address bar, %KeyFor(AddressBar).
Place JAWS cursor in first button of tool bar, %KeyFor(Toolbar).
Read body of page with JAWS cursor, %KeyFor(ReadBody).
Read columns with JAWS cursor . control with arrow keys
@@
@msgVirtualHotKeyHelp1_S
List of Links, %KeyFor(SelectALink).
List of form fields, %KeyFor(SelectAFormField).
List of Frames, %KeyFor(SelectAFrame).
list of headings, %keyFor(SelectAHeading).
List of tool bar buttons, %KeyFor(ToolBar).
move to next or prior frame, %keyFor(MoveToNextFrame) and %keyFor(moveToPriorFrame).
move to next or prior heading, %keyFor(MoveToNextHeading) and %keyFor(moveToPriorHeading).
move to first or last heading, %keyFor(moveToFirstHeading) and %keyFor(moveToLastHeading).
move to next or prior heading at level, %KeyFor(MoveToNextHeadingLevelN) through 6 and %keyFor(moveToPriorHeadingLevelN) through 6 respectively.
move to first or last heading at level, %keyFor(MoveToFirstHeadingLevelN) through 6 and %keyFor(moveToLastHeadingLevelN) through 6 respectively.
move forward past links to text, %KeyFor(MoveToNextNonLinkText).
update screen view to location of Virtual Cursor, %KeyFor(RefreshScreen).
jump to first control on form, %KeyFor(FocusToFirstField).
jump to next control on form %KeyFor(FocusToNextField).
jump to previous control on form, %KeyFor(FocusToPriorField).
jump to last control on form, %KeyFor(FocusToLastField).
 Speak U R L, %KeyFor(AddressBar).
move JAWS cursor to address line, %KeyFor(AddressBar) twice quickly.
toggle Virtual Cursor mode, %KeyFor(VirtualPcCursorToggle).
When on a control, turn on forms mode  by pressing %KeyFor(Enter).
Restore Virtual Cursor, %KeyFor(PcCursor).
For specific help on this page, %KeyFor(ScreenSensitiveHelp).
list of Standard application keystrokes, %KeyFor(WindowKeysHelp).
@@
;for msgScreenSensitiveHelp4, %1 = the current page name
@msgScreenSensitiveHelp4_L
This is an internet explorer window named %1, in which, you can read the currently loaded page, or select a link to go to another site.
@@
@msgScreenSensitiveHelp5_L
This is an internet explorer window, in which, you can read the currently loaded page, or select a link to go to another site.
@@
@msgScreenSensitiveHelp6_L
This is a list of all the links contained on the current page. Select a link using the arrow keys or the first letter, and press enter to go to it.
@@
@msgScreenSensitiveHelp6_S
List of all the links contained on page. Select link using arrow keys or first letter.
@@
@msgScreenSensitiveHelp7_L
This is a list of the buttons in the Internet Explorer toolbar. Select a button using the arrow keys or the first letter of the label, and press enter to click on it.
@@
@msgScreenSensitiveHelp7_S
List of Buttons in Toolbar. Select button using arrow keys or first letter of label.
@@
@msgScreenSensitiveHelp8_L
This is the main Internet Explorer window, in which, you can read the current loaded page,
or select a link to go to another site.
@@
@msgScreenSensitiveHelp8_S
Main Internet Explorer window In which you can read current page
@@
@msgWindowKeysHelp1_L
To move forward to the next link or control, press %KeyFor(MoveToNextLink).
To move backwards to the previous Link or control, press %KeyFor(MoveToPriorLink).
To activate a link, press %KeyFor(Enter).
To move back to the previous page address you came from, press %KeyFor(GoBack).
To move forward, press %KeyFor(GoForward).
To move focus to the Address Bar, press alt + d.
@@
@msgWindowKeysHelp1_S
Move forward to next link or control, %KeyFor(MoveToNextLink).
Move backwards to previous Link or control, %KeyFor(MoveToPriorLink).
Activate link, %KeyFor(Enter).
Move back to previous page address, %KeyFor(GoBack).
Move forward, %KeyFor(GoForward).
Move focus to Address Bar, alt + d.
@@
@msgFormsModeNavigate
Use tab and shift+tab to move between the fields.
@@
@msgNoneSet
Not Set
@@
;for msgControlPanelAppletBreadcrumb
;%1 is the name of the applet in the breadcrumb.
;the intire breadcrumb is the text in the child window of the window of class breadcrumb parent.
@msgControlPanelAppletBreadcrumb
Control Panel %1
@@
@msgNoMailToLink_S
no mailto links
@@
@MSG_MoveToControlledTargetFailed
Failed to move to element
@@
@MSG_MoveToControlledTargetSucceeded
Moved to controlled element
@@
@MSG_FollowErrorRelationFailed
Failed to move to error
@@
@MSG_FollowDetailsRelationFailed
Failed to move to details
@@

;END_OF_UNUSED_VARIABLES

EndMessages
