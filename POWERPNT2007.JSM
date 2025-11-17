; Copyright 1995-2015 Freedom Scientific, Inc.
; JAWS 11.00.xx
;message file for Microsoft Powerpoint 2007
include "powerpntCommon.jsm"

const
;window titles
	wn_DiagramGallery="Diagram Gallery"

messages
@msgMSPowerpoint
Microsoft Powerpoint 2007
@@
@msgMSPowerpoint2010
Microsoft Powerpoint 2010
@@
@msgMSPowerpointClassic
Microsoft Powerpoint Classic
@@
@msgMSPowerpointClassicPlus
Microsoft Powerpoint
@@
@msgMSPowerpointWDAG
Microsoft PowerPoint in Windows Device Application Guard
@@
@MsgHotKeyHelpO365
To start a slide show, press f5.
To start the slide show in Presenter View, press Alt+F5.

The slide show and Presenter Views use the virtual cursor for navigation.
Use the following commands when a slide show or Presenter View is running:
Next slide: Spacebar, PageDown or N
Prior slide: Backspace, PageUp or P
Activate or dismiss speaker's notes: Control+Shift+N
@@
@msgWindowKeysHelpO365
To start a slide show, press f5.
To start the slide show in Presenter View, press Alt+F5.

In Slide Show and Presenter View:
Next slide: Spacebar, PageDown or N
Prior slide: Backspace, PageUp or P

In Slide Show only:
Go to specific slide by number: Type its number and press enter.

In Presenter View only, the following keystrokes are PowerPoint Announcements and don't use the virtual cursor.
Announce Elapsed Time: Alt+W
Announce name of next slide or animation: Alt+Q
Announce Speaker's Notes for the Active Slide if available: Alt+A

Press ESC to close this message.
@@
@msgHotkeyHelp7_L
Set Quick Settings %KeyFor(QuickSettings)
To select an object from a list use %KeyFor(selectShape).
To select a hyperlink from a list use %KeyFor(selectHyperlink).
To follow the selected object's hyperlink if it has one use %KeyFor(FollowSelectedHyperlink).
To speak information about the current slide view or show use %KeyFor(saySlideInfo).
To read the current slide use %KeyFor(sayAll).
To read the selected text, object or slide use %KeyFor(saySelectedObject).
To hear the selected object use %KeyFor(sayWindowPromptAndText).
To read the selected table row by row use %KeyFor(readTableRowByRow).
To read the selected table column by column use %KeyFor(readTableColumnByColumn).
To toggle the table reading method use %KeyFor(SetTableReadingMethod).
To hear the selected shape's animation status and description use %KeyFor(sayShapeAnimationInfo).
To read the speaker's notes use %KeyFor(readSpeakersNotes).
To hear the dimensions and location of the selected object use %KeyFor(sayObjectDimensionsAndLocation).
To speak the status line use %KeyFor(speakStatusLine).
To promote a paragraph level  %KeyFor(PromoteParagraph)
To demote a paragraph level  %KeyFor(demoteParagraph)
@@
@msgHotkeyHelp7_S
Set Quick Settings %KeyFor(QuickSettings)
select object %KeyFor(selectShape)
select hyperlink %KeyFor(selectHyperlink)
follow hyperlink %KeyFor(FollowSelectedHyperlink)
speak information about slide view or show %KeyFor(saySlideInfo)
read current slide %KeyFor(sayAll)
read selected text, object or slide %KeyFor(saySelectedObject)
hear selected object %KeyFor(sayWindowPromptAndText)
read selected table row by row %KeyFor(readTableRowByRow)
read selected table column by column %KeyFor(readTableColumnByColumn)
toggle table reading method %KeyFor(SetTableReadingMethod)
hear  animation status and description %KeyFor(sayShapeAnimationInfo)
read speaker's notes %KeyFor(readSpeakersNotes)
hear dimensions and location of selected object %KeyFor(sayObjectDimensionsAndLocation)
speak status line %KeyFor(speakStatusLine)
promote a paragraph level  %KeyFor(PromoteParagraph)
demote a paragraph level  %KeyFor(demoteParagraph)
@@
; The next two messages are to speak as prompts for the Powerpoint 2013 Spell Checker.
; These are not found in the application, just generic messages as prompts:
@msgNotInDictionary
Not in dictionary:
@@
@msgSuggestion
Suggestion:
@@
@msgNoSuggestion
No suggestions.
@@
@msgSmartArtPlaceHolder
Smart art placeholder
@@
@msgSmartArtPlaceHolderEnd
Smart art placeholder end
@@
@msgSmartArt
Smart art graphic
@@
@msgSmartArtPlaceholderBrl
Smart art
@@
@msgScreenSensitiveHelpSmartArtLongDesc
This object contains Smart Art graphics and shapes.
What follows is a description of the smart art:
@@
@msgMovePointerToCurrentLocation_L
Pointer moved to current location
@@
@msgMovePointerToCurrentLocation_S
Pointer to current
@@
@msgNotesPageNeedsPresenterView
Speakers Notes only available in Presenter View.
Press alt+f5 to use Presenter View when starting a slide show.
@@
; for msgScreenSensitiveHelpPowerPointSlideShowUIA, the text D and Shift+D correspond to the following scripts:
; D = MoveToNextDifferentElement
; Shift+D = MoveToPriorDifferentElement
@msgScreenSensitiveHelpPowerPointSlideShowUIA
While using slide show or presenter view, you can use your arrow keys to read the document as you would a web page.
To skip forward or backward over a group of graphics or other elements, press D or Shift+D respectively.
If you wish to avoid graphics all together in Power Point, go into Settings Center and search for "Include Images" and set it to None.
Important: Many presentations contain valuable information for the labels in their images.
@@
; For msgScreenSensitiveHelpSlideAreaWithCount, %1 is the slide number. %2 = number of slides.
@msgScreenSensitiveHelpSlideAreaWithCount
This is the Slide Areaand you are on Slide %1 of %2.
You can modify the slide by tabbing to the different objects and press enter to edit.
When editing is finished, press Escape to go back to the Object Level.
Use F6 to switch panes.
Use F5 to go to Slideshow view.
Use alt+f5 to go to Presenter View.
@@
;%1 is on or off
@msgShowSpeakersNotesDuringPresentation
Show Speaker's Notes During Presentation %1:Select this option to show or hide the speaker's notes during a presentation. You can independently pan through the notes without losing your place in the presentation.
@@
EndMessages
