;Copyright 1995-2015 Freedom Scientific, Inc.
;JAWS 12.0.xx

;contains support strings for 'Adjust JAWS Options' dialog for all versions of Microsoft Outlook.

Const
;Nodes:
;Main node for apps:
	OutlookOptions="Microsoft Outlook Options",
OutlookExpressOptions="Outlook Express Options",
WindowsMailOptions="windows Mail Options",
WindowsLiveMailOptions="Windows Live Mail Options",
	NODE_MessageFlags="Message Flags",
;	String constants for tree child items:
	UO_toggleMessageHeader="ToggleMessageHeaderVerbosity:Message Header Field With Message Announcement",
	UO_ToggleMessageElements="ToggleMessageElementsVerbosity:Web frames and Link Count Announcement",
	UO_ToggleMessageLinkCountIndication="ToggleMessageLinkCountIndication:Web frames and Link Count Indication",
	UO_ToggleMessageSayAll="ToggleMessageSayAllVerbosity:Messages Automatically Read",
	UO_ToggleInfoBar="ToggleInfoBarVerbosity:Information Bar Messages Announcement",
	UO_ToggleAutoComplete="ToggleAutoCompleteVerbosity:Address List Auto-Complete Announcement",
	UO_ToggleMeetingRequest="ToggleMeetingRequestVerbosity:Message Meeting Request Indication",
	UO_ToggleFollowUpFlag="ToggleFollowUpFlagVerbosity:Message Follow-up Flag Indication",
	UO_ToggleForwardedFlag="ToggleForwardedFlagVerbosity:Message Forwarded Flag Indication",

;UNUSED_VARIABLES

	UO_ToggleMessageTitle="|ToggleMessageTitleVerbosity:Message Title When Reading Announcement",
	UO_ToggleMessageReadingPane="|ToggleReadingPaneVerbosity:Reading Pane Automatically Reads",
	UO_ToggleAttachments="ToggleAttachmentsVerbosity:Message Attachment Using MSAA Indication",
	UO_ToggleMessageStatus="ToggleMessageStatusVerbosity:Message Read/Unread Status Indication",
	UO_ToggleMessageFlag="ToggleMessageFlagVerbosity:Message Flags Announcement",
	UO_ToggleRepliedFlag="ToggleRepliedFlagVerbosity:Message Replied Flag Indication"

;END_OF_UNUSED_VARIABLES

Messages
;Node callback help strings:
;sample for adding specific help for existing nodes:
;@msgUO_OutlookGeneralOptionsHlp
;	This group contains Outlook-specific options for how to read tables as well as options that control overall %product% behavior.
;@@
@msgUO_OutlookReadingOptionsHlp
This group of options controls reading Microsoft Outlook 2007 messages and notes windows.
@@
;sample for adding help for a new node:
@msgUO_MessageFlagsHlp
This group contains options that control which message flags are announced while navigating the message list. Types of flags include: attachments, follow-up, read status, priority, etc.
@@
@msgUO_OutlookBrailleOptionsHlp
This group of options controls how Braille displays formatting  in Microsoft Outlook 2007 messages and notes windows.
@@
;sample for adding help for a particular option:
;@msgUO_...Hlp
;This option controls ...
;%1 is either msgDefaultSettingIsOn or msgDefaultSettingIsOff.
;@@
@msgUO_toggleMessageHeaderHlp
When turned on, %product% announces the sender's e-mail address and the subject title of the message. %1
@@
@msgUO_ToggleMessageElementsHlp
When turned on, %product% announces the number of web frames and links that appear in the e-mail message. %1
@@
@msgUO_ToggleMessageTitleHlp
This option controls whether the message title is read as you open each message. %1
@@
@msgUO_ToggleMessageSayAllHlp
When turned on, %product% reads the message when you open an e-mail. %1
@@
@msgUO_ToggleMessageReadingPaneHlp
@@
@msgUO_ToggleAttachmentsHlp
When turned on, %product% uses MSAA (Microsoft Active Accessibility) information to read the attachment. MSAA provides additional details to %product% so that the attachment can be read in full. %1
@@
@msgUO_ToggleInfoBarHlp
The Information Bar provides details about an open e-mail message, such as if you previously replied or forwarded the message.  When this option is turned on, %product% announces this type of information if it applies to the e-mail. Use the SPACEBAR to turn this option on or off. %1
@@
@msgUO_ToggleAutoCompleteHlp
When turned on, this option lets %product% announce suggestions for names and e-mail addresses as you type in the To, CC, or BCC edit boxes. The suggestions are based on previous entries that you have made. When turned off, %product% does not announce suggestions. %1
@@
@msgUO_ToggleMessageStatusHlp
As you use the UP and DOWN ARROWS to navigate through Outlook folders, %product% announces if an e-mail message has not been read when this option is set to Say Unread. When set to Silent, %product% does not announce an e-mail message's status. The default setting is Say Unread.
@@
@msgUO_ToggleMeetingRequestHlp
When turned on, %product% announces if a selected e-mail message is an Outlook appointment request. When turned off, %product% does not distinguish an appointment request from other e-mail messages. %1
@@
@msgUO_ToggleMessageFlagHlp
When turned on, %product% announces if a reminder or status flag has been applied to the selected e-mail message. When turned off, %product% does not announce if an e-mail message has a status flag. %1
@@
@msgUO_ToggleFollowUpFlagHlp
When turned on, %product% announces if a follow-up flag has been applied to the selected e-mail message. %1
@@
@msgUO_ToggleForwardedFlagHlp
When turned on, %product% announces if a forward flag has been applied to the selected e-mail message. %1
@@
@msgUO_ToggleRepliedFlagHlp
When turned on, %product% announces if a replied flag has been applied to the selected e-mail message. %1
@@
@msgUO_ToggleMessageLinkCountIndicationHlp
When turned on, %product% indicates the number of Web frames and links that appear in the e-mail message. %1
@@
@msgUO_OutlookNavigationQuickKeysSetHlp
You can toggle this option on and off from within any editable message by pressing JAWSKey+z. This option is specific to Microsoft Outlook 2007 messages. The option controls whether quick navigation keys are enabled for the current message.

For a read-only message, the feature is always turned on. For composing or replying to a message, the default is off.
@@
@MsgUO_OutlookIndicateNonbreakingSymbolsToggleHlp
This option controls whether %product%  detects nonbreaking symbols while navigating a message. When turned off, all nonbreaking symbols are treated as their standard counterparts: i.e., nonbreaking spaces as spaces, nonbreaking hyphens as hyphens, etc. The options include navigating the document by:
1. Characters
2. Characters and words
3. Characters, words, lines, sentences, and paragraphs
4. Even during SayAll

Pressing the SayCurrentCharacter  keystroke three times quickly always indicates the symbol's true value even when the feature is turned off.

%1 This means that nonbreaking symbols are treated as their standard counterparts no matter how the message is navigated.
@@
@msgUO_OutlookVCursorHeadingsAnnounceHlp
This option controls how %product% announces headings in Outlook messages.
Select between Off, On, and Heading and Level. The default setting is Heading and level.
@@
@msgUO_OutlookLanguageDetectChangeHlp
This option controls whether %product% detects changes in language within messages which support language tags. %1

This detection only affects those synthesizers, such as Eloquence, that support multiple languages.
@@
@msgUO_OutlookToggleSelCtxWithMarkupHlp
This option controls whether %product% detects changes in text context  with schemes. The purpose of Express Navigation  Mode is to speed up reading performance where a long message is being read or where it is not important to hear context changes as they are announced using for a particular scheme.

When Express Navigation Mode is on, Context detection includes detection of spelling or grammatical errors, headings, and tables. This means that these types of context changes are still detected, just not announced using the settings for the scheme you are using at the time.

If you turn off Express Navigation Mode, %product% returns to its default settings for all context detection. At that point, any scheme you have in place will once again honor context detection using its own settings. %1
@@

;UNUSED_VARIABLES

@msgUo_ToggleWarningMessageForBrowserOptionHlp
Some messages with complex tables or other formatting are difficult to read with %product% when opened in Outlook 2007 or above. This is because in Office 2007 or above, Word is used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, there are ways to allow the message to read more like it would in earlier versions of Outlook.

%product% attempts to warn you when you open such a message that it might be better viewed using your browser. %1

If you choose not to have %product% warn you each time such a message is opened, you can turn the feature off. Nevertheless, if you open a message that is difficult to read in Outlook 2007 or above, either because of complex graphics or nested tables, open the message in your browser instead, using the following steps:

Press ENTER to open the message as usual.

Press ALT then H then X then V, followed by ENTER. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press ENTER, a dialog opens giving you a security warning about opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the dialog box from displaying in the future.
@@
@msgUo_2010ToggleWarningMessageForBrowserOptionHlp
Some messages with complex tables or other formatting are difficult to read with %product% when opened in Outlook 2007 or above. This is because in Office 2007 or above, Word is used to render the HTML content, which may make it difficult for the screen reader to display the message. If you have a message, such as a newsletter or e-mail invoice, there are ways to allow the message to read more like it would in earlier versions of Outlook.

%product% attempts to warn you when you open such a message that it might be better viewed using your browser. %1

If you choose not to have %product% warn you each time such a message is opened, you can turn the feature off. Nevertheless, if you open a message that is difficult to read in Outlook 2007 or above, either because of complex graphics or nested tables, open the message in your browser instead, using the following steps:

Press ENTER to open the message as usual.

Press ALT+H, then the letter A, then the letter V, followed by ENTER. These are shortcuts to quickly navigate the ribbon to the View in Browser submenu item.

When you press ENTER, a dialog opens giving you a security warning about opening messages in the browser. Select OK. Note, you can press TAB to navigate to the Please Do Not Show this Dialog Again checkbox, and press SPACEBAR to select it. This will prevent the dialog box from displaying in the future.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
