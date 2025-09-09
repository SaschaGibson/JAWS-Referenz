; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 10.0.xx script header file for Microsoft powerpoint 2007

Globals
;For Shape Navigation Callback:
	int giFN_ShapeNavCallback,
	int giFocusChangeTriggeredByDOMCall,
;for initialization of object, schedule to ensure no duplicate calls.
	int giFN_initPPTAppObj,
	int giFN_SpeakSlideChangeInfo,;hlds ID for timed slide change:
	int giEnterKey,
	int giTabControl,
	int giSlideAreaActive,
	int giSlideShowActive,
	handle ghSlideShowApp,
	int giDescribeObjects, ; for determining whether to announce object types when navigating among slides.
	int giSlideTransitions, ; for determining whether to announce slide transitions during presentation
	int giDiagramGalleryListbox,
	int giReadingUserBufferChart,
	int giSpeakersNotesActive, ; used to track when speaker's notes as opposed to slideshow content is in User Buffer
	int switchingPanes, ; flag for suppressing speech when switching panes until the pane name and status line have been spoken
	int pptVersion,
	int GlobalCurrentControl,
	HANDLE GlobalRealWindow,
	string GlobalRealWindowName,
	int PPTHasRunBefore,
	int PptSuppressEcho, ; used to suppress echoing of highlights and prompts at inappropriate times
	int PptFocusChangeCalled, ; used to determine if focus has changed or not,
	int globalTableReadingMethod, ; 0=describe only, 1=read row by row, 2=read column by column
	int globalDetectOverlappingShapes,
	int globalDetectTextOverflow,
	int GlobalSayOpenListViewItem,
	int GlobalSayStabilizedOpenListViewItem,
	int GlobalSayStabilizedShape,
	int giSelectedHyperlink,
	string gsAddress,
	string gsSubAddress

const
;function names:
	fn_SpeakSlideChangeInfo = "SpeakSlideChangeInfo",
; view constants
	ppViewSlide=1,
	ppViewSlideMaster = 2,
	ppViewNotesPage = 3,
	ppViewHandoutMaster = 4,
	ppViewNotesMaster = 5,
	ppViewOutline = 6,
	ppViewSlideSorter = 7,
	ppViewTitleMaster = 8,
	ppViewNormal = 9,
	ppViewPrintPreview=10,
	ppViewThumbnails=11,
	ppViewMasterThumbnails=12,
; jsi filename and section info
	jsiFileName="powerpoint.jsi",
	hKey_DetectOverlappingShapes="DetectOverlappingShapes",
	hKey_DetectTextOverflow="DetectTextOverflow",
	hKey_TableReadingMethod="TableReadingMethod",
	hKey_AnnounceSlideTransitions="AnnounceSlideTransitions",
	hKey_DescribeObjects="DescribeObjects",
; wait time is the time in tenths of a second before JFW tries to get the app object after a failure.
waitTime=100, ; 10 seconds
; used when reading tables
TableRowByRow=1,
tableColByCol=2,
tableDimensionsOnly=3,
tableIgnore=0,
; used by ColumnNumberToLetter
	alphabet = " ABCDEFGHIJKLMNOPQRSTUVWXYZ",
; used for dlgSelectItemInList list entries.
DlgLstItemMaxLength=40, ; max chars used in list box entries
; window classes
	wc_CommandBarDropdown = "MsoWorkPane",
	wc_PaneClassDCParentClass="mdiClass",
	wcUserControl="UserControl", ; specifically used in new slide wizard.
	wcPaneClassDC="paneClassDC",
	wcPowerpointClient = "mdiClass",
	wcPowerpointSlideShow = "screenClass",
	wcExcel7="Excel7", ; Excel 97/2000 worksheet
	wc_msoBalloonChild="MsoBalloonChild",
	wc_qpwChild="QPWChild", ; for Quattro Pro 8 spreadsheet support
	wc_qpChild="QPChild", ; for Quattro Pro 9 spreadsheet support
	wc_wpDocClient="WPDocClient", ; WP document support
	wc_pp97FrameClass="PP97FrameClass",
	wc_msGraph97="GRAPH", ; for embedded MSGraph97 charts
; control ids:
cID_SymbolChar=28,
cId_SymbolChar2003=27,
cID_HistoryButton=28,
cId_backButton=30,
cId_animatedShapeList=6, ; the list of shapes to be animated
cId_animationOrderList=102, ; the list containing the order of the selected animated shapes in the Order & Timing page of the Custom Animation dialog
cId_moveAhead=103,
cId_moveAhead97=7,
cId_MoveBack=105,
cId_moveBack97=8,
cId_entryEffect97=22, ; PP97
cId_EntryEffectCombo=202, ; effects page of same dlg
cId_animationEffectCombo=203,
cId_soundEffectCombo=204,
cId_soundEffectCombo97=23, ; PP97
cId_animationAfterEffect=206, ; User Control class
cId_animationAfterEffect97=25, ; PP97
cId_paraLevel=210,
cId_paraLevel97=29, ; pp97
cId_slideMiniatures97=3,
cId_slideMiniatures=6, ; Slide Finder/Slides from files option
cIdSlideTitles97=4,
cId_slideTitles=7, ; slide finder
cId_slideMiniatureDisplay=8, ; slide finder
cId_openButton=31,
cId_FolderCombo=25, ; SDM control id of folder to save in or look in Office 2000
cId_folderCombo97=17, ; Office 97
cId_helpButton=21, ; Pack and Go Wizard Help button on first screen
cId_ChooseDestination=38, ; Pack and Go Wizard
cId_helpButtonAutoContentWiz=5,
cId_presTypeListbox=32,
cId_AutoContentWizNodeLabels=7, ; the labels for the active tree node or dialog page in the wizards
cId_packAndGoNodeLabels=3,
;Font dialog
	cID_EffectsOffset=22,
	cIdEffectsColorGroupbox=31,
	cIdEffectsColorStatic=24,
; SpellChecker
	cId_misspelledWordPrompt=8,
	cId_MisspelledWord=9,
	cId_changeToPrompt=10,
	cId_changeToEdit=11,
	cId_OKButton=2,
	cId_SuggestionList=13,
templateListview=1000, ; Template Listview where Presentation Design templates are selected.
BulletColorMenuId=8,
BulletColorMenu=106,
cId_BulletColorMenu=17,
BulletTypeId=13,
cIdBulletButton=109,
cIdNumberButton=210,
FillTypeMenuId=6,
NewSlideTypeId=6,
penId=23,
graphicActiveTab="Graphic 456", ; The active tab in the AutoContent Wizard and Pack and Go Wizard.
GraphicVerbosityAll=2, ; all graphics
; version constants
ppt_8=8,
ppt_9=9,
ppt_XP=10,
ppt_11=11,
cStr_Bullet="•", ; should not be localized, the text is a real bullet character which will speak from the symbol file and Braille to the display as bullet.
cStr_MsgNumberedBullet=" %1", ; should not be localized, %1 = the number of the item - this would be a numbered bulletted list. In accordance with Bug 36122, we do not show the actual bullet for numbered bullets.
; Do not localize these, they must match the filenames in the installer for the JBS files minus the jbs extension
	cPowerpoint2007JBSBase="Powerpoint 2007",
	cPowerpoint2010JBSBase="Powerpoint 2010",
	cPowerpointClassicJBSBase="PowerpointClassic"