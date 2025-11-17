; Copyright 1995-2015 Freedom Scientific, Inc.
; header file PowerPntCommon, ppfunc and ppfunc2007.
;Makes common all globals.



; This file contains Object Model constants and globals 
Globals
; navigation globals:
	object goFocusSlide,
	int gnSlideLeft,
	int gnSlideTop,
	int gnSlideRight,
	int gnSlideBottom,
	object goFocusShape,
	int gnLeft, int gnTop, int gnRight, int gnBottom,
int giObjectCreated,
Object oPpt, ; pointer to Powerpoint.application
object null, ; reset objects
int globalPriorSlideIndex, ; used to determine if a slide has changed in slide show view
int globalParaIndexPointer, ; used in slide show view when viewing a slide point by point
int lastParaSpokenIndex, ; always points to last paragraph spoken during a slide show
int lastShapeSpokenIndex, ; always points to last shape spoken during a slide show 
int globalShapeIndex, ; which shape on a slide is being animated
int globalAnimationTriggered, ; flag for indicating whether an animation has been triggerd by a keypress.
string globalBrlShapeOverlapDesc

const
;Navigation Info Bits,
;store info as to how a shape has moved.
;it is assumed that if a shape is moved with an arrow key, 
;it may well be moved multidirectionally, e.g. up arrow could potentially move up and left, 
; depending on the position info on Slide.
;it is assumed that Z order and visual position can be different, as is the case in .Net, VB or any other dev environment.
	SHAPE_NAVE_NONE			  0x0000,
	SHAPE_NAV_LEFT			  0x0001,
	SHAPE_NAV_TOP				  0x0002,
	SHAPE_NAV_RIGHT			  0x0004,
	SHAPE_NAV_BOTTOM		  0x0008,
	SHAPE_NAV_SLIDE_LEFT  0x0010,
	SHAPE_NAV_SLIDE_TOP	  0x0020,
	SHAPE_NAV_SLIDE_RIGHT 0x0040,
	SHAPE_NAV_SLIDE_BOTTOM 0x0080,
	SHAPE_NAV_OUT_OF_SLIDE 0x0100, ; shape coords outside of slide (ugly)
;jbs constants
PP_WT_SHAPE=1,
PP_WT_TABLE=2, ; at Object Level
PP_WT_SLIDE=3,
PP_WT_SHAPE_RANGE=4,
PP_WT_SLIDE_RANGE=5,
PP_WT_XLWS=6,
PP_WT_PLACEHOLDER=7,
PP_WT_TABLE_CELL=8, ; at edit level
PP_WT_USER_CONTROL=9,
;Object Model identifier for PP App Obj
appObjname="powerpoint.application",
; ProgId identifiers
excel97Sheet="excel.sheet.8",
Excel97Chart="excel.Chart.8",
MsGraphChart8="MSGraph.Chart.8",
PaintPicture="Paint.Picture",
MsClipartGallery2="MS_ClipArt_Gallery.2",
Word97Doc="Word.Document.8",
Ppt97Show="PowerPoint.Show.8",
Ppt97Slide="PowerPoint.Slide.8",
wpDoc="WP8Doc", ; we will not look at the version number 8 when we compare progids
qpwChart="QuattroPro.Chart.", ; removed trailing ver number
qpwNotebook="QuattroPro.Notebook.", ; removed trailing version number
; next constants from Object Browser.
; animation settings text unit effect for shapes
ppAnimateByCharacter = 2,
ppAnimateByParagraph = 0,
ppAnimateByWord = 1,
;ppAnimateUnitMixed = -2 (&HFFFFFFFE)
; paragraph alignment
ppAlignCenter=2,
ppAlignDistribute=5,
ppAlignJustify=4,
ppAlignLeft=1,
;ppAlignmentMixed=-2, ; negative 2
ppAlignRight=3,
; ppSelectionType constants
None=0,
ppSelectionSlides=1,
ppSelectionShapes=2,
ppSelectionText=3,
; ppSlideLayout constants
; stripped off ppLayout to trim size of constants
Blank = 12,
Chart = 8,
ChartAndTxt = 6,
ClipartAndTxt = 10,
ClipArtAndVerticalTxt = 26,
FourObjs = 24,
LargeObj = 15,
MediaClipAndTxt = 18,
;Mixed = -2, ; cannot have negative constants
Obj = 16,
ObjAndTxt = 14,
ObjOverTxt = 19,
Orgchart = 7,
TableSlide = 4,
Txt = 2,
TxtAndChart = 5,
TxtAndClipart = 9,
TxtAndMediaClip = 17,
TxtAndObj = 13,
TxtAndTwoObjs = 21,
TxtOverObj = 20,
Title = 1,
TitleOnly = 11,
TwoColumnTxt = 3,
TwoObjsAndTxt = 22,
TwoObjsOverTxt = 23,
VerticalTxt = 25,
VerticalTitleAndTxt = 27,
VerticalTitleAndTxtOverChart = 28,
Comparison=34,
ContentWithCaption=35,
Custom=32,
PictureWithCaption=36,
SectionHeader=33,
ObjAndTwoObjs=30,
TwoObjs=29,
TwoObjsAndObj=31,
; pointer types
; actual constant names too long, appear as following comment
PointerAlwaysHidden=3, ; ppSlideShowPointerAlwaysHidden = 3
PointerArrow=1, ;ppSlideShowPointerArrow = 1
PointerNone=0, ; ppSlideShowPointerNone = 0
PointerPen=2, ;  ppSlideShowPointerPen = 2
; slide show state constants 
ppSlideShowBlackScreen=3,
ppSlideShowDone = 5,
ppSlideShowPaused = 2,
ppSlideShowRunning = 1,
ppSlideShowWhiteScreen = 4,
; MSO Shape Type constants
msoAutoShape = 1,
msoCallout = 2,
msoChart = 3,
msoComment = 4,
msoEmbeddedOLEObject = 7,
msoFormControl = 8,
msoFreeform = 5,
msoGroup = 6,
msoLine = 9,
msoLinkedOLEObject = 10,
msoLinkedPicture = 11,
msoMedia = 16,
msoOLEControlObject = 12,
msoPicture = 13,
msoPlaceholder = 14,
msoShapeTypeMixed=2, ;actually -2 but we make positive since we only handle positive integers.
msoTextBox = 17,
msoHyperlinkShape=1,
msoHyperlinkInlineShape=2,
msoTable=19, ; new in PP 2000
msoSmartArt = 24, ; new in 2013 or later.
; MSO AutoShape constants
; where constant name exceeds 32 chars, have shortened and placed comment after
msoShape16pointStar = 94,
msoShape24pointStar = 95,
msoShape32pointStar = 96,
msoShape4pointStar = 91,
msoShape5pointStar = 92,
msoShape8pointStar = 93,
msoShapeActionBtnBackorPrev = 129,
msoShapeActionButtonBeginning = 131,
msoShapeActionButtonCustom = 125,
msoShapeActionButtonDocument = 134,
msoShapeActionButtonEnd = 132,
msoShapeActionBtnForwardorNxt = 130,
msoShapeActionButtonHelp = 127,
msoShapeActionButtonHome = 126,
msoShapeActionBtnInfo = 128,
msoShapeActionButtonMovie = 136,
msoShapeActionButtonReturn = 133,
msoShapeActionButtonSound = 135,
msoShapeArc = 25,
msoShapeBalloon = 137,
msoShapeBentArrow = 41,
msoShapeBentUpArrow = 44,
msoShapeBevel = 15,
msoShapeBlockArc = 20,
msoShapeCan = 13,
msoShapeChevron = 52,
msoShapeCircularArrow = 60,
msoShapeCloudCallout = 108,
msoShapeCross = 11,
msoShapeCube = 14,
msoShapeCurvedDownArrow = 48,
msoShapeCurvedDownRibbon = 100,
msoShapeCurvedLeftArrow = 46,
msoShapeCurvedRightArrow = 45,
msoShapeCurvedUpArrow = 47,
msoShapeCurvedUpRibbon = 99,
msoShapeDiamond = 4,
msoShapeDonut = 18,
msoShapeDoubleBrace = 27,
msoShapeDoubleBracket = 26,
msoShapeDoubleWave = 104,
msoShapeDownArrow = 36,
msoShapeDownArrowCallout = 56,
msoShapeDownRibbon = 98,
msoShapeExplosion1 = 89,
msoShapeExplosion2 = 90,
msoShapeFlowchartAltProcess = 62, ; alt=alternate 
msoShapeFlowchartCard = 75,
msoShapeFlowchartCollate = 79,
msoShapeFlowchartConnector = 73,
msoShapeFlowchartData = 64,
msoShapeFlowchartDecision = 63,
msoShapeFlowchartDelay = 84,
msoShapeFlowchartDirAccStorage = 87, ; dirAcc=direct access
msoShapeFlowchartDisplay = 88,
msoShapeFlowchartDocument = 67,
msoShapeFlowchartExtract = 81,
msoShapeFlowchartIntStorage = 66, ; int=internal
msoShapeFlowchartMagneticDisk = 86,
msoShapeFlowchartManualInput = 71,
msoShapeFlowchartManualOp = 72, ; op=operation
msoShapeFlowchartMerge = 82,
msoShapeFlowchartMultidocument = 68,
msoShapeFlowchartOffpageCon = 74, ; con=connector
msoShapeFlowchartOr = 78,
msoShapeFlowchartPredefProc = 65, ; predef proc=Predefined Process
msoShapeFlowchartPreparation = 70,
msoShapeFlowchartProcess = 61,
msoShapeFlowchartPunchedTape = 76,
msoShapeFlowchartSeqAccStorage = 85, ; seq acc=sequential access
msoShapeFlowchartSort = 80,
msoShapeFlowchartStoredData = 83,
msoShapeFlowchartSummingJunct = 77, ; junct=junction
msoShapeFlowchartTerminator = 69,
msoShapeFoldedCorner = 16,
msoShapeHeart = 21,
msoShapeHexagon = 10,
msoShapeHorizontalScroll = 102,
msoShapeIsoscelesTriangle = 7,
msoShapeLeftArrow = 34,
msoShapeLeftArrowCallout = 54,
msoShapeLeftBrace = 31,
msoShapeLeftBracket = 29,
msoShapeLeftRightArrow = 37,
msoShapeLeftRightArrowCallout = 57,
msoShapeLeftRightUpArrow = 40,
msoShapeLeftUpArrow = 43,
msoShapeLightningBolt = 22,
msoShapeLineCallout1 = 109,
msoShapeLineCallout1AccentBar = 113,
msoShapeLnCallout1BordAccBar = 121, ; ln=line, bord acc=border and accent
msoShapeLineCallout1NoBorder = 117,
msoShapeLineCallout2 = 110,
msoShapeLineCallout2AccentBar = 114,
msoShapeLnCallout2BordAccBar = 122, ; ln=line, bordAcc=border and accent
msoShapeLineCallout2NoBorder = 118,
msoShapeLineCallout3 = 111,
msoShapeLineCallout3AccentBar = 115,
msoShapeLnCallout3BordAccBar = 123, ; ln=line, bordAcc=border and accent
msoShapeLineCallout3NoBorder = 119,
msoShapeLineCallout4 = 112,
msoShapeLineCallout4AccentBar = 116,
msoShapeLnCallout4BordAccBar = 124, ; ln=line,bordAcc=border and accent
msoShapeLineCallout4NoBorder = 120,
;msoShapeMixed = -2,
msoShapeMoon = 24,
msoShapeNoSymbol = 19,
msoShapeNotchedRightArrow = 50,
msoShapeNotPrimitive = 138,
msoShapeOctagon = 6,
msoShapeOval = 9,
msoShapeOvalCallout = 107,
msoShapeFunnel = 174,
msoShapeParallelogram = 2,
msoShapePentagon = 51,
msoShapePlaque = 28,
msoShapeQuadArrow = 39,
msoShapeQuadArrowCallout = 59,
msoShapeRectangle = 1,
msoShapeRectangularCallout = 105,
msoShapeRegularPentagon = 12,
msoShapeRightArrow = 33,
msoShapeRightArrowCallout = 53,
msoShapeRightBrace = 32,
msoShapeRightBracket = 30,
msoShapeRightTriangle = 8,
msoShapeRoundedRectangle = 5,
msoShapeRoundedRectCallout = 106, ; rect=rectangular
msoShapeSmileyFace = 17,
msoShapeStripedRightArrow = 49,
msoShapeSun = 23,
msoShapeTrapezoid = 3,
msoShapeUpArrow = 35,
msoShapeUpArrowCallout = 55,
msoShapeUpDownArrow = 38,
msoShapeUpDownArrowCallout = 58,
msoShapeUpRibbon = 97,
msoShapeUTurnArrow = 42,
msoShapeVerticalScroll = 101,
 msoShapeWave = 103,
; place holder constants
ppPlaceholderBitmap = 9,
ppPlaceholderBody = 2,
ppPlaceholderCenterTitle = 3,
ppPlaceholderChart = 8,
ppPlaceholderDate = 16,
ppPlaceholderFooter = 15,
ppPlaceholderHeader = 14,
ppPlaceholderMediaClip = 10,
;ppPlaceholderMixed = -2, 
ppPlaceholderObject = 7,
ppPlaceholderOrgChart = 11,
ppPlaceholderSlideNumber = 13,
ppPlaceholderSubtitle = 4,
ppPlaceholderTable = 12,
ppPlaceholderTitle = 1,
ppPlaceholderVerticalBody = 6,
ppPlaceholderVerticalTitle = 5,
; action settings constants
ppMouseClick = 1,
ppMouseOver = 2,
; action settings object, action property
; only hyperlink action property of interest to us 
ppActionHyperlink = 7,
; Entry effect constants from Object Browser
ppEffectAppear=3844, ; (&HF04)
ppEffectBlindsHorizontal=769, ; (&H301)
ppEffectBlindsVertical=770, ; (&H302)
ppEffectBoxIn=3074, ; (&HC02)
ppEffectBoxOut=3073, ; (&HC01)
ppEffectCheckerboardAcross=1025, ; (&H401)
ppEffectCheckerboardDown=1026, ; (&H402)
ppEffectCoverDown=1284, ; (&H504)
ppEffectCoverLeft=1281, ; (&H501)
ppEffectCoverLeftDown=1287, ; (&H507)
ppEffectCoverLeftUp=1285, ; (&H505)
ppEffectCoverRight=1283, ; (&H503)
ppEffectCoverRightDown=1288, ; (&H508)
ppEffectCoverRightUp=1286, ; (&H506)
ppEffectCoverUp=1282, ; (&H502)
ppEffectCrawlFromDown=3344, ; (&HD10)
ppEffectCrawlFromLeft=3341, ; (&HD0D)
ppEffectCrawlFromRight=3343, ; (&HD0F)
ppEffectCrawlFromUp=3342, ; (&HD0E)
ppEffectCut=257, ; (&H101)
ppEffectCutThroughBlack=258, ; (&H102)
ppEffectDissolve=1537, ; (&H601)
ppEffectFade=1793, ; (&H701)
ppEffectFlashOnceFast=3841, ; (&HF01)
ppEffectFlashOnceMedium=3842, ; (&HF02)
ppEffectFlashOnceSlow=3843, ; (&HF03)
ppEffectFlyFromBottom=3332, ; (&HD04)
ppEffectFlyFromBottomLeft=3335, ; (&HD07)
ppEffectFlyFromBottomRight=3336, ; (&HD08)
ppEffectFlyFromLeft=3329, ; (&HD01)
ppEffectFlyFromRight=3331, ; (&HD03)
ppEffectFlyFromTop=3330, ; (&HD02)
ppEffectFlyFromTopLeft=3333, ; (&HD05)
ppEffectFlyFromTopRight=3334, ; (&HD06)
;ppEffectMixed=-2, ; (&HFFFFFFFE) ; jfw doesn't handle negatives yet.
ppEffectNone=0,
ppEffectPeekFromDown=3338, ; (&HD0A)
ppEffectPeekFromLeft=3337, ; (&HD09)
ppEffectPeekFromRight=3339, ; (&HD0B)
ppEffectPeekFromUp=3340, ; (&HD0C)
ppEffectRandom=513, ; (&H201)
ppEffectRandomBarsHorizontal=2305, ; (&H901)
ppEffectRandomBarsVertical=2306, ; (&H902)
ppEffectSpiral=3357, ; (&HD1D)
ppEffectSplitHorizontalIn=3586, ; (&HE02)
ppEffectSplitHorizontalOut=3585, ; (&HE01)
ppEffectSplitVerticalIn=3588, ; (&HE04)
ppEffectSplitVerticalOut=3587, ; (&HE03)
ppEffectStretchAcross=3351, ; (&HD17)
ppEffectStretchDown=3355, ; (&HD1B)
ppEffectStretchLeft=3352, ; (&HD18)
ppEffectStretchRight=3354, ; (&HD1A)
ppEffectStretchUp=3353, ; (&HD19)
ppEffectStripsDownLeft=2563, ; (&HA03)
ppEffectStripsDownRight=2564, ; (&HA04)
ppEffectStripsLeftDown=2567, ; (&HA07)
ppEffectStripsLeftUp=2565, ; (&HA05)
ppEffectStripsRightDown=2568, ; (&HA08)
ppEffectStripsRightUp=2566, ; (&HA06)
ppEffectStripsUpLeft=2561, ; (&HA01)
ppEffectStripsUpRight=2562, ; (&HA02)
ppEffectSwivel=3356, ; (&HD1C)
ppEffectUncoverDown=2052, ; (&H804)
ppEffectUncoverLeft=2049, ; (&H801)
ppEffectUncoverLeftDown=2055, ; (&H807)
ppEffectUncoverLeftUp=2053, ; (&H805)
ppEffectUncoverRight=2051, ; (&H803)
ppEffectUncoverRightDown=2056, ; (&H808)
ppEffectUncoverRightUp=2054, ; (&H806)
ppEffectUncoverUp=2050, ; (&H802)
ppEffectWipeDown=2820, ; (&HB04)
ppEffectWipeLeft=2817, ; (&HB01)
ppEffectWipeRight=2819, ; (&HB03)
ppEffectWipeUp=2818, ; (&HB02)
ppEffectZoomBottom=3350, ; (&HD16)
ppEffectZoomCenter=3349, ; (&HD15)
ppEffectZoomIn=3345, ; (&HD11)
ppEffectZoomInSlightly=3346, ; (&HD12)
ppEffectZoomOut=3347, ; (&HD13)
ppEffectZoomOutSlightly=3348, ; (&HD14)
; After Effect constants from object browser
ppAfterEffectDim = 2,
ppAfterEffectHide = 1,
ppAfterEffectHideOnClick = 3,
;ppAfterEffectMixed = -2, (&HFFFFFFFE)
ppAfterEffectNothing = 0,
; TextLevelEffect constants:
ppAnimateByAllLevels=16,
ppAnimateByFifthLevel=5,
ppAnimateByFirstLevel=1,
ppAnimateByFourthLevel=4,
ppAnimateBySecondLevel=2,
ppAnimateByThirdLevel=3,
;ppAnimateLevelMixed=-2,
ppAnimateLevelNone=0,
; advance mode for shape animation
ppAdvanceOnClick=1,
ppAdvanceOnTime=2,
; For embedded Excel charts
; chart types
; note must convert negatives when comparing
xl3DArea=4098,
xl3DAreaStacked=78,
xl3DAreaStacked100=79,
xl3DBarClustered=60,
xl3DBarStacked=61,
xl3DBarStacked100=62,
xl3DColumn=4100,
xl3DColumnClustered=54,
xl3DColumnStacked=55,
xl3DColumnStacked100=56,
xl3DLine=4101,
xl3DPie=4102,
xl3DPieExploded=70,
xlArea=1,
xlAreaStacked=76,
xlAreaStacked100=77,
xlBarClustered=57,
xlBarOfPie=71,
xlBarStacked=58,
xlBarStacked100=59,
xlBubble=15,
xlBubble3DEffect=87,
xlColumnClustered=51,
xlColumnStacked=52,
xlColumnStacked100=53,
xlConeBarClustered=102,
xlConeBarStacked=103,
xlConeBarStacked100=104,
xlConeCol=105,
xlConeColClustered=99,
xlConeColStacked=100,
xlConeColStacked100=101,
xlCylinderBarClustered=95,
xlCylinderBarStacked=96,
xlCylinderBarStacked100=97,
xlCylinderCol=98,
xlCylinderColClustered=92,
xlCylinderColStacked=93,
xlCylinderColStacked100=94,
xlDoughnut=4120,
xlDoughnutExploded=80,
xlLine=4,
xlLineMarkers=65,
xlLineMarkersStacked=66,
xlLineMarkersStacked100=67,
xlLineStacked=63,
xlLineStacked100=64,
xlPie=5,
xlPieExploded=69,
xlPieOfPie=68,
xlPyramidBarClustered=109,
xlPyramidBarStacked=110,
xlPyramidBarStacked100=111,
xlPyramidCol=112,
xlPyramidColClustered=106,
xlPyramidColStacked=107,
xlPyramidColStacked100=108,
xlRadar=4151,
xlRadarFilled=82,
xlRadarMarkers=81,
xlStockHLC=88,
xlStockOHLC=89,
xlStockVHLC=90,
xlStockVOHLC=91,
xlSurface=83,
xlSurfaceTopView=85,
xlSurfaceTopViewWireframe=86,
xlSurfaceWireframe=84,
xlXYScatter=4169,
xlXYScatterLines=74,
xlXYScatterLinesNoMarkers=75,
xlXYScatterSmooth=72,
xlXYScatterSmoothNoMarkers = 73,
; axes types
xlCategory = 1,
xlValue = 2,
xlSeriesAxis = 3,
; plot by (xlRowCol
xlRows=1,
xlColumns=2,
; Word constants for table handling
wdWithInTable = 12,
; Overlap constants:
CTLVertexTopLeft=1,
CTLVertexTopRight=2,
CTLVertexBottomRight=4,
CTLVertexBottomLeft=8,
ctlCovered=16,
;BulletType:
ppBulletNone = 0,
ppBulletUnnumbered = 1,
ppBulletNumbered = 2,
ppBulletPicture = 3,
; Media Type constants:
ppMediaTypeSound = 2,
ppMediaTypeMovie = 3,
;VB Bool = -1:
VBTrue = 0xffffffff