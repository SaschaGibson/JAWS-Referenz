; Scripts for Microsoft Visual Basic 6.0 Environment
; Copyright 2010-2015 by Freedom Scientific, Inc.
; This is the header file for all object model constants and global variables.

globals
object oVB,
object null,
string gsToolsList,
string gsToolsX,
string gsToolsY

const
; For determining which instance of the VBE is running
VBIDE="{0002E100-0000-0000-C000-000000000046}",
wordApp="word.application",
excelApp="excel.application",
powerpointApp="powerpoint.application",
outlookApp="outlook.application",
accessApp="access.application",
ProjectApp="MSProject.application",
; Designer properties which are accessed by name
dpTop="top",
dpLeft="left",
dpWidth="width",
dpHeight="height",
; Designer progids
vbAddinDesigner="MSAddnDr.AddInDesigner", ; For the Addin ActiveXDesigner
vbDataReportDesigner="MSDataReportLib.DataReport",
; Overlap constants:
CTLVertexTopLeft=1,
CTLVertexTopRight=2,
CTLVertexBottomRight=4,
CTLVertexBottomLeft=8,
ctlCovered=16,
; Menu Class for distinguishing between controls on a form
VBMenuClass="menu",
; Proc Kind
vbext_pk_Proc = 0,
; Project Type
vbext_pt_StandardExe = 0,
vbext_pt_ActiveXExe = 1,
vbext_pt_ActiveXDll = 2,
vbext_pt_ActiveXControl = 3,
vbext_pt_HostProject = 100,
vbext_pt_StandAlone = 101,
; Code Pane View
 vbext_cv_FullModuleView = 1,
 vbext_cv_ProcedureView = 0,
; Component Types:
vbext_ct_StdModule = 1,
vbext_ct_ClassModule = 2,
vbext_ct_MSForm = 3,
vbext_ct_ResFile = 4,
vbext_ct_VBForm = 5,
vbext_ct_VBMDIForm = 6,
vbext_ct_PropPage = 7,
vbext_ct_UserControl = 8,
vbext_ct_DocObject = 9,
vbext_ct_RelatedDocument = 10,
vbext_ct_ActiveXDesigner = 11,
vbext_ct_Document = 100,
; Control Types:
vbext_ct_Light = 1,
vbext_ct_Standard = 2,
vbext_ct_Container = 3,
; VBEXT_VBA_MODE constants
vbext_vm_Run = 0,
vbext_vm_Break = 1,
vbext_vm_Design = 2,
; Window Types:
vbext_wt_CodeWindow = 0,
vbext_wt_Designer = 1,
vbext_wt_Browser = 2,
vbext_wt_Watch = 3,
vbext_wt_Locals = 4,
vbext_wt_Immediate = 5,
vbext_wt_ProjectWindow = 6,
vbext_wt_PropertyWindow = 7,
vbext_wt_Find = 8,
vbext_wt_FindReplace = 9,
vbext_wt_Toolbox = 10,
vbext_wt_LinkedWindowFrame = 11,
vbext_wt_MainWindow = 12,
vbext_wt_Preview = 13,
vbext_wt_ColorPalette = 14,
vbext_wt_ToolWindow = 15,
; msForms control progId, %1=control type
msFormsProgId="Forms.%1.1",
; Control names for all controls in the msForms class
; Note do not change these as they are used for building progIds for passing to the 
;add method of the controls collection
msFormsForm="Forms.form", ; note only complete progId, rest are constructed from parts 
msFormsCheckBox="CheckBox",
msFormsComboBox="ComboBox",
msFormsCommandButton="CommandButton",
msFormsFrame="Frame",
msFormsImage="Image",
msFormsLabel="Label",
msFormsListBox="ListBox",
msFormsMultiPage="MultiPage",
msFormsOptionButton="OptionButton",
msFormsScrollBar="ScrollBar",
msFormsSpinButton="SpinButton",
msFormsTabStrip="TabStrip",
msFormsTextBox="TextBox",
msFormsToggleButton="ToggleButton",
; VBForms intrinsic controls
VBClassProgId="VB.%1",
VBCheckBox="CheckBox",
VBComboBox="ComboBox",
VBCommandButton="CommandButton",
VBData="Data",
VBDirListBox="DirListBox",
VBDriveListBox="DriveListBox",
VBFileListBox="FileListBox",
VBFrame="Frame",
VBHScrollBar="HScrollBar",
VBImage="Image",
VBLabel="Label",
VBLine="Line",
VBListBox="ListBox",
VBOLE="OLE",
VBOptionButton="OptionButton",
VBPictureBox="PictureBox",
VBPropertyPage="PropertyPage",
VBShape="Shape",
VBTextBox="TextBox",
VBTimer="Timer",
VBVScrollBar="VScrollBar"
