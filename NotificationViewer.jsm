; Copyright (C) 2022 Freedom Scientific Inc.
; Notification History messages file

const
	; These keystrokes are different for each language, so they need to be translatable, which is why they're located here.
	ksPressMoveUpButton = "Alt+U",
	ksPressMoveDownButton = "Alt+O"

Messages
@msgNotificationViewerAppName
Notification Viewer
@@
@msgNotificationViewer_HistoryListScreenSensitiveHelp
This list contains notifications received from Windows and applications during the past 24 hours while JAWS or Fusion was running.  Use the ARROW keys to navigate and review items in the list. Pressing the APPLICATIONS key on the selected notification opens a context menu where you can choose to create a rule to customize how it is spoken or shown in braille , or don't show the selected notification at all in the history.
@@
@msgNotificationViewer_EnableRulesCheckboxScreenSensitiveHelp
Clear this check box to turn off all user-created rules for notifications. When disabled, the options for creating and managing rules are not available. This check box is selected by default.
@@
@msgNotificationViewer_CreateRuleButtonScreenSensitiveHelp
Select this button to create a rule for the currently selected notification in the Recent Notifications list.
@@
@msgNotificationViewer_ManageRulesButtonScreenSensitiveHelp
Select this button to view and edit your current rules.
@@
@msgNotificationViewer_ClearHistoryButtonScreenSensitiveHelp
Select this button to delete all notifications from the history.
@@
@msgNotificationViewer_RulesListScreenSensitiveHelp
This list shows all of your notification rules. Use the ARROW keys to select the rule you want to modify, rename, enable, disable or delete. Pressing the applications key on a rule will open a context menu where you can choose to modify the rule or delete it. Pressing the delete key will delete the rule. Pressing Control + Shift + Up/Down arrow will move the current rule up and down the list.
@@
@msgNotificationViewer_ModifyRuleButtonScreenSensitiveHelp
Select this button to make changes to the currently selected rule in the Rules list.
@@
@msgNotificationViewer_DeleteRuleButtonScreenSensitiveHelp
Select this button to delete the selected rule from the Rules list.
@@
@msgNotificationViewer_RenameRuleButtonScreenSensitiveHelp
Select this button to rename the currently selected rule.
@@
@msgNotificationViewer_ToggleRuleStateButtonScreenSensitiveHelp
Select this button to enable the currently selected rule if it is disabled, and to disable it if it currently is enabled.
@@
@msgNotificationViewer_MoveRuleUpButtonScreenSensitiveHelp
Select this button to move the current rule up the list.
@@
@msgNotificationViewer_MoveRuleDownButtonScreenSensitiveHelp
Select this button to move the current rule down the list.
@@
@msgNotificationViewer_RuleTypeComboBoxScreenSensitiveHelp
This combo box lets you choose the type of rule you'd like to create. Select Contains to create a rule that acts on a notification that contains the text in the text box below. Select Begins with to create a rule that acts on a notification that begins with the text in the textbox below. Select Ends With to create a rule that acts on a notification that ends with the text in the text box below. Select Matches Pattern to use the text box below to create a regular expression that any incoming notification will be matched against.
@@
@msgNotificationViewer_ContainsTextboxScreenSensitiveHelp
The use of this text box changes depending on which value you chose in the previous combo box:

If you chose "Contains":
This edit box contains the full text of the notification you are creating the rule for. Depending on the type of notification, you can choose to leave the text as is, or modify it to be more generic. For example, if you want to create a rule for a notification from Outlook that contains the word "Suggestion:" at any point in the notification, you could delete everything except "suggestion:"

If you chose begins With:
This edit box contains the full text of the notification you are creating the rule for. Depending on the type of notification, you can choose to leave the text as is, or modify it to be more generic. For example, if you want to create a rule for a notification from Outlook that begins with the word "Suggestion:" followed by some specific text, you could delete everything except "suggestion:"

If you chose Ends With:
This edit box contains the full text of the notification you are creating the rule for. Depending on the type of notification, you can choose to leave the text as is, or modify it to be more generic. For example, if you want to create a rule for a notification from Teams that ends with the words "Press Control + Shift + J to join" preceded by some specific text, you could delete everything except "Press Control + Shift + J to join"

If you chose Matches Pattern:
This text box contains the text for the notification, but it's recommended you change that to a regular expression using elements from the notification. If you want to use the notification text as is, or parts of it, consider using one of the other Rule Types. As an example of a regular expression, take a look at the regular expression to capture the name of the sender from an Outlook notification: "^New Notification from Outlook, (.*?)," without the quotes.
@@
@msgNotificationViewer_ApplicationSpecificCheckboxScreenSensitiveHelp
Clear this check box to apply this rule globally for all applications.
This check box is selected by default, which means this rule will only apply to the application associated with the current notification.
@@
@msgNotificationViewer_SpeechAndSoundsActionComboBoxScreenSensitiveHelp
Use this combo box to choose what JAWS or Fusion announces when this notification is received. You can choose to speak the full message, speak an alternate message that you specify, play a sound, or completely mute speech.
The default setting is Mute. If Don't Show in History is selected from the context menu for the current notification in the history list, the default setting is to speak the full message.
@@
@msgNotificationViewer_SpeechShortenTextboxScreenSensitiveHelp
Enter the alternate notification text you would like spoken. If you've selected Matches Pattern in the Rule Type Combo box before, you can include captured variables in your shortened text by adding \n to your shortened text, where n is the index of the variable in capture group. So, \1 is the first variable, \2 is the second, etc. If you want to add the literal text \1 to your shortened notification, you can use another \ to escape it: \\1.
@@
@msgNotificationViewer_PreviewSpeechResultsButtonScreenSensitiveHelp
Select this button to hear JAWS speak the results of processing the notification example in the "Example Notification" text box with the input regular expression and your shortened text, including variable capture.
@@
@msgNotificationViewer_SoundPathTextboxScreenSensitiveHelp
Enter the location and name of the sound file you want JAWS or Fusion to play when the notification is received.
@@
@msgNotificationViewer_SelectSoundButtonScreenSensitiveHelp
Select this button to open a standard Windows Open File dialog box where you can select the sound you want JAWS or Fusion to play when this notification is received.
@@
@msgNotificationViewer_PlaySoundButtonScreenSensitiveHelp
Select this button to play a sample of the currently selected sound.
@@
@msgNotificationViewer_BrailleActionComboBoxScreenSensitiveHelp
Use this combo box to choose what is shown on a braille display when this notification is received. You can choose to display a flash message, display a flash message containing alternate text that you specify, or you can display nothing.
The default is Show Flash Message.
@@
@msgNotificationViewer_BrailleShortenFlashTextboxScreenSensitiveHelp
Enter the alternate notification text you would like displayed in braille as a flash message. If you've selected Matches Pattern in the Rule Type Combo box before, you can include captured variables in your shortened text by adding \n to your shortened text, where n is the index of the variable in the capture group. So, \1 is the first variable, \2 is the second, etc. If you want to add the literal text \1 to your shortened notification, you can use another \ to escape it: \\1.
@@
@msgNotificationViewer_PreviewBrailleResultsButton
Select this button to have JAWS flash the results of processing the notification example in the "Example Notification" text box with the input regular expression and your shortened text, including variable capture.
@@
@msgNotificationViewer_ExampleNotificationTextBoxScreenSensitiveHelp
This text box contains an notification example. This example will be used to preview the effect your new rule will have. This text box is empty when you're modifying an existing rule and filled with the notification you've selected from history when you create a new rule.
@@
@msgNotificationViewer_ExcludeFromHistoryCheckboxScreenSensitiveHelp
If this check box is selected, any notifications received that match the criteria of the current rule will not be included in the list of recent notifications. This check box is cleared by default unless Don't Show in History is selected from the context menu for the current notification in the history list.
@@
@msgNotificationViewer_RenameRuleTextBoxScreenSensitiveHelp
Enter your preferred name in this text box. If you're creating a new rule, the text box will be filled with the match text you've entered. If you're modifying an existing rule, the rule's name will appear in this field.
@@
EndMessages