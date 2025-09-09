; Copyright 2009-2015 by Freedom Scientific, Inc.
; Scripts for QuickSettings - message file.
;

Messages
@MSG_OneOf
1 of %1
@@
@MSG_ClearSearchEditBox_L
Search edit box cleared.
@@
@MSG_ClearSearchEditBox_S
Cleared
@@
@MSG_NoMatchesFound_L
No matches found.
@@
@MSG_NoMatchesFound_S
No matches
@@
@MSG_SearchBoxIsNotEmpty_L
Search box is not empty. You need to clear it before switching the pages.
@@
@MSG_SearchBoxIsNotEmpty_S
Is not empty
@@
@MSG_ControlInactive
Unavailable
%1
@@
@MSG_PressF6ToMove_L
Press the F6 key to change the value.
@@
@MSG_PressF6ToMove_S
F6 key to change the value
@@
@MSG_ImpossibleToChangeDisableState_L
It is impossible to change the value of a disabled control. Please enable it first.
@@
@MSG_ImpossibleToChangeDisableState_S
Impossible. Please enable.
@@
@MSG_PaneEmpty_L
There is nothing visible at the configuration display pane at the moment.
@@
@MSG_PaneEmpty_S
Nothing visible
@@
@sshmSG_Treeview
This is the Quick Settings tree view. It contains options that are specific to the current application or document. 
To open a group in the tree view, press RIGHT ARROW while focus is on the item.
To close the group, press LEFT ARROW.
You can also select the Expand Tree View check box located at the bottom of the Quick Settings window to always have the tree view expanded. 
Clear the check box to always have the tree view collapsed. 
Use UP ARROW, DOWN ARROW, or first letter navigation to move through the tree view. 
To change the setting of an option in the tree view, press SPACEBAR. 
Press F6 to switch between the tree view and the Configuration pane. 
Press TAB to move to other parts of the Quick Settings window.  
@@
@sshmSG_SearchResultsList
This is the search results list.

When you type in the Search edit field, QuickSettings will search for items containing the text in the edit field and the search results are displayed in this list. The search result may include group names as well as togglable options. %product% will tell you the group location for each item in the list after it announces the item.

You may toggle options in this list by using the Spacebar.
Pressing Enter will restore the full tree of options and keep focus on the chosen item.
Pressing Escape will restore the full tree of options and return you to the last item prior to the search.

Use up and down arrows, or use first letter navigation to move in the list.
@@
;for sshmsg_QuickHelpReadOnlyEdit
;%1 is the key for SayAll
@sshmsg_QuickHelpReadOnlyEdit
This is a read-only edit window.

This window contains a description of the selected group or options in the tree of options. The first line of text is automatically spoken when you tab to this window. You can navigate through the full text using standard reading commands, or read it using %1. Use Shift+Tab to move back to the tree of options.
@@
;for sshmsg_ApplicationComboBox
;%1 is the key for SayWindowTitle
@sshmsg_ApplicationComboBox
This is the Application combo box.

When QuickSettings starts, it brings up the settings for the current application. If there are no settings for the current application, you are asked if QuickSettings should create them; if you choose not to create new settings for the current application, the default settings are loaded.

You can change which aplication's settings are loaded in this combo box. You can also switch to the default settings by choosing them in this list, or by pressing Control+Shift+D from anywhere in QuickSettings. The title bar shows which settings are loaded. You can read the title bar with %1.

To select an item in this combo box, press the first letter of the item or use UP or DOWN ARROW to move through the list.
@@
@sshmsg_SearchEdit
This is the Search edit field. When you type text in it, the tree view shows a list of all groups or options that contain this text. 
Press DOWN ARROW or TAB to move to a list of search results in the tree view pane. 
Press SHIFT+TAB to switch from the tree view back to the edit field. 
@@
@sshmsg_ApplyButton
This is the Apply button.

Press Enter on the Apply button to save changes without closing Setting Center.
@@
@sshmsg_OKButton
This is the OK button.

Press Enter on the OK button to save changes and close QuickSettings.
@@
@sshmsg_CancelButton
This is the Cancel button.

Press Enter on the Cancel button to discard any unsaved changes and close QuickSettings.
@@
@sshmsg_GeneralHelp
QuickSettings provides a central access point for %product% configuration settings.

It has two panes, the tree view pane and the configuration display pane.
The tree view pane contains the Search edit field, the tree of all options, and a read-only edit window displaying help text for the currently selected item in the tree of options. 

The configuration display pane contains the controls belonging to the currently active group in the tree of options.

Use %1 on each control to read specific help for the currently focused control.

Use Tab to move through the controls in the tree view or configuration display pane, and F6 to toggle between panes.
@@
;for sshmsg_TreeViewPaneDisplayFormat:
;%1 is an sshmsg specific to the currently focus control
;%2 is the sshmsg general help message
@sshmsg_TreeViewPaneDisplayFormat
%1

%2
@@


;UNUSED_VARIABLES

; Help messages for different controls...
@MSG_SettingsTreeView_ControlHelpPart1
Use the tree view pane to select and change settings for %product% or a specific application. To retrieve the %product% default settings, press
%KeyFor (ChangeToDefault).
@@
@MSG_SettingsTreeView_ControlHelpPart2
To retrieve application settings, press %KeyFor (ShiftTab) twice to move focus to the Application combo box. Next, select the application from the combo box, and then press %KeyFor (Tab) to move focus back to the tree view pane. For a brief description of the item selected in the tree view, press %KeyFor (Tab) to move focus to the read-only edit box. Use the %KeyFor (SayLine) or %KeyFor (SayAll) commands to read the help message.
@@
@MSG_TreeviewNavigation_Heading
Tree View Navigation
@@
@MSG_TreeviewNavigation_HelpPart1
- Press %KeyFor (SayPriorLine) or %KeyFor (SayNextLine) to move up or down the tree view.
- Press %KeyFor (SayPriorCharacter) or %KeyFor (SayNextCharacter) to expand or collapse a tree view group.
- Use first letter navigation to select a group or item in the tree view.
- Press %KeyFor (Space) or %KeyFor (Enter) to modify the state of the items while focused on them in the tree view.
@@
@MSG_TreeviewNavigation_HelpPart2
This works for options such as radio button, check boxes, or buttons without having to press
%KeyFor (F6Key)
to move to the configuration pane to adjust them.
- Press
%KeyFor (ChangeToDefault)
to load the Default.jcf file and apply changes globally.
@@
@MSG_TreeviewNavigation_HelpPart3
- When searching for an item in QuickSettings, search results display in the tree view. Press %KeyFor (Enter) on any entry to restore the full tree view and then move directly to that item.  Pressing %KeyFor (UpALevel) when on search results, restores the full tree view to the last item prior to the search.
@@
@MSG_TreeviewNavigation_HelpPart4
- Press
%KeyFor (F6Key)
to move to the configuration display pane. Press
%KeyFor (F6Key)
again to return to the tree view.
@@
@MSG_ConfigurationDisplayPane_ControlHelp
As you move through the tree view, a sighted user can simultaneously track cursor movement using the configuration display pane. Press
%KeyFor (F6Key)
to switch between the tree view and this pane. This is necessary when typing in an edit or edit spin box.
@@
@MSG_ConfigurationDisplayPane_Heading
Configuration Display Pane Navigation
@@
@MSG_ConfigurationDisplayPane_HelpPart1
- Press
%KeyFor (F6Key)
to move focus to this pane. This is required to change the value of an edit box. Press
%KeyFor (F6Key)
again to move focus to the tree view.
- To jump to an item, press ALT along with its access key. For example, in the Forms Mode group, press ALT+A to move focus to the Auto radio button.
@@
@MSG_ConfigurationDisplayPane_HelpPart2
- Press %KeyFor (SayNextLine)or %KeyFor (SayPriorLine) to select items in a list box or radio button group, or move between items in a group.
- Press %KeyFor (Tab) to move between items in the display pane.
@@
@MSG_SearchEditBox_ControlHelpPart1
Press
%KeyFor (ActivateSearchBox)
to move focus to the Search box. Type a search word or phrase in the edit box to reduce the number of items that appear in the tree view list.
@@
@MSG_SearchEditBox_ControlHelpPart2
Press %KeyFor (SayNextLine) to move to search results, and then press %KeyFor (Enter) to move focus directly to that item in the tree view.
@@
@MSG_ApplicationsComboBox_ControlHelpPart1
Select an application from the list to modify its settings for use with %product%. To retrieve the %product% default settings, press
%KeyFor (ChangeToDefault).
@@
@MSG_ApplicationsComboBox_ControlHelpPart2
To retrieve application settings, press %KeyFor (ShiftTab) to move focus to the Application combo box. Next, select the application from the combo box, and then press %KeyFor (Tab) to move focus back to the tree view pane.
@@
@MSG_ApplicationsListNavigation_Heading
Applications List Navigation
@@
@MSG_ApplicationsListNavigation_Help
- Press %KeyFor (ShiftTab) untill focus moves to the Applications list box.
- Press %KeyFor (SayNextLine) or %KeyFor (SayPriorLine) to select items in the Applications list.
- Use first letter navigation to select items in the list.
- Press %KeyFor (Tab) or %KeyFor (ShiftTab) to move focus away from the combo box.
@@
;	This message should be added to all other messages...
@MSG_OverAll_Heading
General Overall Help
@@
@MSG_OverAll_ControlHelpPart1
QuickSettings provides a consistent interface and central access point for %product% features and settings. QuickSettings dialog box contains the Application combo box, search box, tree view, configuration display pane, help message pane, and Apply, OK, and Cancel buttons.
- Press %KeyFor (Tab) or %KeyFor (ShiftTab) to move through different areas of QuickSettings dialog box.
@@
@MSG_OverAll_ControlHelpPart2
- Press
%KeyFor (F6Key)
to move to the configuration display pane.
@@
@MSG_OkButtonControlHelp
Choose OK to save changes and close QuickSettings.
@@
@MSG_ApplyButtonControlHelp
Choose Apply to make changes and continue using QuickSettings.
@@
@MSG_CancelButtonControlHelp
Choose Cancel to close QuickSettings without saving changes.
@@

;For persistence levels in QuickSettings:
@msgRestoreOnJAWSExit
Restore on %product% Exit
@@
@msgRestoreOnFocusChange
Restore on Focus Change
@@
@msgSaveToDisk
Save to Disk
@@
@msgSettingsNode
Settings Category
@@
@msgSettingsHistory
History
@@
@msgDocumentSettings
Document Setting
@@
EndMessages
