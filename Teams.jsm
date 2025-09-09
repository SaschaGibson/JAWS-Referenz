﻿; Copyright 2019 by Freedom Scientific, Inc.
;Teams header file

const
; for scThreadedConversation, press control+2 to go to Chats,
; select a chat in the tree view,
; tab to the history.
; press escape to return to the threads list
; Script Utility Mode -> Object Name (Control+f9)
; take the beginning of the text before the number of replies.
	scThreadedConversation = "Threaded conversation",
scInaccessibleDocViewer="Document viewer.",
scBackButton="Back",
;For Keyboard Shortcuts, press Control+period
; In script utility mode, press Control+Alt+F9
; Scroll down until you find the dialog which is a parent of the document which is the parent of a dialog,
; This will probably be at level 7.
; What you need to localize for scKeyboardShortcuts is the Description field.
; If you have successfully localized the text, the virtual cursor should be automatically activated when this screen appears.
scKeyboardShortcuts = "Keyboard shortcuts",
scChatList = "Chat list", ;label for the chat list tree view
;For scContentSharedBy, join a Teams meeting with another participant.
;Have the other participant share their screen with you.
;Note, it needs to be a screen share, not sharing slides.
;Press tab until you come to something that says, "Content shared by <person's name>"
;The "Content shared" part of the string  is what is needed here, it is case insensitive.
scContentSharedBy = "Content shared"

messages
@msgConfigName
Microsoft Teams
@@
; msgVirtualCursorOn and msgVirtualCursorOff messages are spoken when 
; the virtual cursor is automatically activated or deactivated.
; The virtual cursor is automatically activated when the Keyboard Shortcuts dialog appears,
; and deactivated when it disappears--assuming that the user has not configured Teams to use the virtual cursor.
@msgVirtualCursorOn
Virtual cursor on
@@
@msgVirtualCursorOff
Virtual cursor off
@@
@msgInaccessibleDocumentViewer_L
This document viewer is inaccessible.
Press escape to return to the file list.
Then use the shift+f10 context menu to open the document in the appropriate desktop application.
@@
@msgInaccessibleDocumentViewer_S
Inaccessible document viewer.
Press escape to exit.
Choose open document in desktop app from context menu.
@@
@msgBack
Back
@@
@msgTabNotFound
Tab not found
@@
@msgButtonNotFound
%1 button not found.
@@
@msgTeamsHotKeyHelp
Here are some %product% hot keys for use in Teams:

Use Alt+1 through 5 on the numbers row to move to the first 5 tabs.
Use %KeyFor(SelectATab) to select a tab.
Use %KeyFor(SelectAButton) to select a button.
Use %KeyFor(BackButton) to go back to the prior screen.
Use %KeyFor(MeetingStatus) to get the microphone, camera, and screen sharing status.
When in a call or meeting window, use %KeyFor(MoveToToolBar) to move to the Meeting controls tool bar.
When not in a call or meeting window, use %KeyFor(MoveToToolBar) to move to the first tool bar.
When in an open chat, use Shift+Control+1 through 9 on the numbers row to read the most recent messages.

Press Escape to close this message.
@@
@msgTeamsWindowKeysHelp
Teams Keystrokes 

General
Show keyboard shortcuts Control+Period
Go to Search Control+E
Show commands Control+Slash
Open filter Control+Shift+F
Start new chat Control+N
Pop out new chat Control+Shift+N
Open Settings Control+Comma
Open Help F1
Close Escape
Zoom in Control+Equals
Zoom out Control+Dash
Reset zoom level Control+0
Report a problem Control+Alt+Shift+R

Navigation
Open 1st app on App bar Control+1
Open 2nd app on App bar Control+2
Open 3rd app on App bar Control+3
Open 4th app on App bar Control+4
Open 5th app on App bar Control+5
Move focus to Left rail item Control+L
Move focus to message pane Control+M
Open history menu Control+H
Go to previous section Control+Shift+F6 
Go to next section Control+F6

Messaging
Go to compose box Control+R
Reply to the latest/selected message Alt+Shift+R
Expand compose box Control+Shift+X
Send (expanded compose box) Control+Enter
Attach file Alt+Shift+O
Start new line Shift+Enter
Search current Chat/Channel messages Control+F

Meetings, Calls and Calendar
Leave Control+Shift+H
Accept video call Control+Shift+A
Accept audio call Control+Shift+S
Decline call Control+Shift+D
Join meeting Control+Shift+J
Open meeting chat Control+Shift+R
Start audio call Alt+Shift+A
Start video call Alt+Shift+V
Announce raised hands (screen reader) Control+Shift+L
Raise or lower your hand Control+Shift+K
Toggle mute Control+Shift+M
Start screen share session Control+Shift+E
Toggle video Control+Shift+O
Go to sharing toolbar Control+Shift+Space
Decline screen share Control+Shift+D
Accept screen share Control+Shift+A
Temporarily unmute Control+Space
Admit people from lobby notification Control+Shift+Y
Toggle background blur Control+Shift+P
Schedule a meeting Alt+Shift+N
Go to previous daySlashweek Control+Alt+LeftArrow
Go to next daySlashweek Control+Alt+RightArrow
View day Control+Alt+1
View workweek Control+Alt+2
View week Control+Alt+3
Save/send meeting request Control+S
Join from meeting details Alt+Shift+J
Go to suggested time Alt+Shift+S

Press Escape to close this message.
@@
@msgTreeNotVisible_l
The teams tree is not currently visible.
@@
@msgTreeNotVisible_s
tree not visible.
@@
@msgHandRaised_L
Hand raised
@@
@msgHandRaised_S 
Raised
@@
@msgHandLowered_L
Hand lowered
@@
@msgHandLowered_S
Lowered
@@
@msgRaiseOrLowerHandButtonNotFound_L
Raise or lower hand button not found.
@@
@msgRaiseOrLowerHandButtonNotFound_S
Button not found.
@@
@msgTeamsSplitButtonTutorHelp
Press Enter to activate, or Alt+DownArrow for more options.
@@
@msgKeyboardShortcutsDialogInsertWInstead
Press %KeyFor(WindowKeysHelp) instead to easily read the Teams keystrokes.
@@
;%1 is on or off.
@msgBrailleSplitChatView
Show History during Chat %1:Select this option to show or hide the text from the chat history while editing a chat message. You can pan through the history without losing your place in the message being edited.
@@
@msgNotInChat_L
Not in an open chat
@@
@msgNotInChat_S
No chat
@@
;For msgNoMessage_L and msgNoMessage_S, %1 is the nth most recent message
@msgNoMessage_L
There is no message number %1.
@@
@msgNoMessage_S
No message %1.
@@
endMessages
