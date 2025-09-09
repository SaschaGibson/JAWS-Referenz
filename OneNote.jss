; Copyright 2023 - 2025 by Freedom Scientific, Inc.
; OneNote script file

include "HjConst.jsh"
include "common.jsm"
include "OneNote.jsm"

string function GetOneNoteWindowKeysHelpText()
var
	string sHeading,
	string sKeystrokes,
	string sHelpText
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_FrequentlyUsed)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_FrequentlyUsed)
sHelpText = sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Format)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Format)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Insert)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Insert)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Tables)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Tables)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Selection)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Selection)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Tag)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Tag)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Outlines)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Outlines)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Pages)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Pages)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_NotebooksAndSections)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_NotebooksAndSections)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Search)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Search)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Share)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Share)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHeading = MarkupLayerHelpSectionTextAsHeading(msgOneNoteWindowKeysHelp_Heading_Protect)
sKeystrokes = ConvertTextToLinesWithHTMLLineBreak(msgOneNoteWindowKeysHelp_Protect)
sHelpText = sHelpText+sHeading+"<br/>"+sKeystrokes+"<br/>"
sHelpText = sHelpText+cMsgResultsViewerExit
return sHelpText
EndFunction

script scriptFileName ()
scriptAndAppNames (msgConfigName)
endScript

script WindowKeysHelp ()
UserBufferClearResultsViewer ()
UpdateResultsViewerTitle(msgOneNoteWindowKeysHelp_Title)
UserBufferAddTextResultsViewer (GetOneNoteWindowKeysHelpText())
endScript

int function GetTreeViewItemState()
var int State = GetControlAttributes()
if (State & (CTRL_OPENED|CTRL_CLOSED))
	State = (State & ~CTRL_SELECTED)
endIf
return state
EndFunction
