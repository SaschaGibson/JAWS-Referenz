; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS message file for tutorial help

; The messages for each control are in a single string per control,
; separated where necessary with the \n escape character for ease of listening
; The condition containing all the controls will then only reference one message per control,
;So cut and paste in the updated messages from Documentation
; inserting \n wherever they inserted hard return
;
const
;Window Class
	wc_Checkable_Listbox = "ISAVIEWCMPTCLASS",
;This is a window name, so don't change it:
	msgRegister = "Certificate of Ownership",
;part of text found in hotkey of ribbons:
	sc_HotKey_AltComma="Alt,"

Messages
@msgButton
To activate press spacebar.
@@
@msgToggleButton
To toggle the state press spacebar.
@@
@msgComboBox
To change the selection use the Arrow keys.
@@
@msgEdit
Type in text.
@@
@msgListBox
To move to an item press the Arrow keys.
@@
@msgExecListBox
Use the arrow keys to select an item.
Press the space bar to toggle between the choices
@@
	; The scroll bar message for now references both LeftRight and UpDown scroll bars for TutorialHelp,
	; Differs from Default.jsm
@msgScrollBar
To increase or decrease use the Arrow keys.
@@
; msgHorizontalToolBar or msgVerticalToolBar is spoken when focus moves to an item on a toolbar where JAWS knows the orientation.
; This message is spoken after the toolbar is announced and before the item on the toolbar is announced.
; The item on the toolbar should have its own tutorial help message, spoken after it is announced.
@msgHorizontalToolBar
To move through the toolbar, use left or right arrow.
@@
@msgVerticalToolBar
To move through the toolbar, use up or down arrow.
@@
;This is questionable, but better than "a series of graphical buttons ..."
@msgToolBar
To activate, press the space bar.
@@
@msgStatusBar
Read with SayBottomLineOfWindow.
@@
@msgHeaderBar
Select column title to sort by that category.
@@
@msgSpinBox
To set the value use the Arrow keys.
@@
@msgMenu
To move through items press up or down arrow.
@@
@msgHorizontalMenu
To move through items press left or right arrow.
@@
@msgStartMenuSearchEditWindow
Type text in this edit field or press up or down arrow to move through items.
@@
@msgDesktop
To move between items press the Arrow keys.
@@
@msgIconTitle
Activate with Enter.
@@
@msgMDIClient
Multiple document interface client window.
@@
@msgDialog
To navigate use Tab.
@@
@msgRadioButton
To change the selection press Up or Down Arrow.
@@
@msgCheckBoxNotChecked
To check press Spacebar.
@@
@msgCheckBoxChecked
To clear checkmark press Spacebar.
@@
@msgSDMDialog
To navigate use Tab.
@@
@msgGeneralPicture
This is a picture specific to the application.
@@
@msgHotKeyEdit
To define the hotkey Type the keystroke combination.
@@
@msgTabControl
To switch pages, press Control+PageDown.
@@
@msgTabControlJava
To switch between pages use the Arrow keys.
@@
@msgTabControlWithHotKey
To switch pages press %1.
@@
@msgVirtualTabControl
To activate tab page press Spacebar.
@@
@msgListView
To move to items use the Arrow keys.
@@
@msgListViewEdit
To edit the selected item press f2.
@@
@msgTreeView
To move through or expand items use the Arrow keys.
@@
@msgStartButton
To open press Enter.
@@
@msgStartMenu
To navigate press Up or Down Arrow.
@@
@msgContextMenu
To navigate press Up or Down Arrow.
@@
@msgTaskBar
To move through items press Left or Right Arrow.
@@
@msgMultiSelectListBox
To move to items use the Arrow keys.
@@
@msgExtendedSelectListBox
To move to items use the Arrow keys.
@@
@msgLeftRightSlider
To increase or decrease use the Arrow keys.
@@
@msgUpDownSlider
To increase or decrease use the Arrow keys.
@@
@msgEditCombo
To set the value use the Arrow keys or type the value.
@@
@msgPasswordEdit
Type in text.
@@
@msgReadOnlyEdit
Use your reading keys to read the text.
@@
@msgCommandBar
To navigate press Left or right arrow.
@@
@msgSystray
To move between the buttons  use the left and right Arrows.
@@
@msgMenuBar
To navigate press Left or Right Arrow.
@@
@msgEditSpinBox
To set the value use the Arrow keys or type the value.
@@
;For msgHotKeyText, %1 = the hot key or underlined letter for the control
@msgHotKeyText
%1
@@
;For msgMenuText, %1 = Menu HotKey
@msgMenuText
%1
@@
@msgMenuText2
%1
@@
@msgCheckableListBox
Use the up and down arrows to move through the list.  use the space bar to check or uncheck items.
@@
@msgButtonMenu
Press space to activate the menu, then navigate with arrow keys
@@
@msgTutorialHelpGrid
Navigate with left and right, up and down arrow keys
@@
@msgTutorialHelpMath
To activate the math viewer, press Enter.
@@
;cmsgHotKeyAltFollowedBy is the message to replace Alt, Access keys in ribbons:
@cmsgHotKeyAltFollowedBy
Alt followed by
@@
@msgRibbonToggleStateTutorHelp
To expand the ribbons, Press Control+F1.
@@
@msgRibbonTabTutorialHelp
To change ribbons Use Left or Right arrows. To navigate the current ribbon, use Tab or Shift Tab.
@@
@msgLowerRibbonTutorialHelp
To move through the controls on this ribbon, use Tab or Shift Tab, or use the Arrow keys.
@@
@msgRibbonButtonDropDownTutorialHelp
Press Space to activate, then use Up or Down Arrow.
@@
@msgRibbonButtonDropdownGridTutorialHelp
Press Space to activate, then use the  arrow keys.
@@
@msgSplitButtonTutorHelp
Press ENTER or SPACEBAR for more options.
@@
;msgSplitButtonOffice2016TutorHelp is for split buttons in Office 2016
@msgSplitButtonOffice2016TutorHelp
Press Alt + Down Arrow for more options.
@@
;msgSpinControlTutorialHelp is for combined shortcuts in the Fusion Quick Access Bar
@msgSpinControlTutorialHelp
Use Enter to select and up and down arrow to adjust the value.
@@
;msgQuickAccessCustomizeSelectionItemHelp is for shortcuts in the Fusion Quick Access Bar's Customize view.
@msgQuickAccessCustomizeSelectionItemHelp
Use Spacebar to select an item and move it up and down with arrow keys.
@@


;UNUSED_VARIABLES

@msgEnterButton
To activate press Enter.
@@
@msgStatic
Read with standard reading keys.
@@
@msgCheckBox
To read press ReadCurrentLine.
@@
@msgGroupBox
Groups together related controls.
@@

;END_OF_UNUSED_VARIABLES
EndMessages
