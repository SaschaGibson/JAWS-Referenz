; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 8.0
; Script header file for Borland Developer Studio

globals
; To speak the TCodeCompleteListView highlighted item
int giSpeakCodeCompletionList,
int giSuppressSayLine,
; To gather information for braille structured mode output
String gsFormElementName,
string gsFormElementType,
int gbHasNameBeenRetrieved,
; For structured mode Code Insight
String gsCodeCompletion,
handle ghCodeCompletion,
string gsCodeInsight,
handle ghCodeInsight,
string gsErrorInsight,
handle ghErrorInsight
const
; Window classes
wc_ideCategoryButtons = "tideCategoryButtons", ; For the Tool Palette
WCPropertyInspector = "TPropertyInspector",  ; used for the speaking of the currently selected component in forms
WCPanel = "TPanel",  ; General TPanel component
WCListButton = "TListButton",  ; When closing combo boxes in Object Inspector
wc_PropSelection = "TPropSelection",
wc_PropInspEdit = "TPropInspEdit",
wc_InspListBox = "TInspListBox",
wc_TokenWindow = "TTokenWindow", ; For live templates
wc_TokenHintWindow = "TTokenHintWindow", ; Hints for live templates
wc_UTF8HintWindow = "TUTF8HintWindow", ; Error insight messages
wc_CodeCompleteListView = "TCodeCompleteListView", ; Code Completion
wc_EditControl = "TEditControl", ; Code Editor control
wc_VirtualStringTree = "TVirtualStringTree", ; a non-standard TreeView
wc_CastaliaMessageFrm = "TCastaliaMessageFrm", ; Castalia's message form
wc_PaintPanel = "TPaintPanel", ; Castalia's Paint Panel
wc_FormContainer = "TFormContainerForm", ; To find the VCL form designer for structured mode
wc_EditorFormDesigner = "TEditorFormDesigner", ; The element in focus when navigating a Data Module
wc_DotNetDesignerFrame = "TDotNetDesignerFrame" ; The frame for the Windows Forms designer
