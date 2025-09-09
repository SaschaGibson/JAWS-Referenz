;Windows 8 TWinUI start screen message header file

const
;object names:
	objn_Settings = "Settings", ;In search screen
	objn_Files = "Files", ;In search screen

;UNUSED_VARIABLES
;native Windows 8 keystrokes used in JAWS output messages:
	ks_Win8SearchAppsEdit = "Windows+Q"
;END_OF_UNUSED_VARIABLES

Messages
;msgTWinUIAppName is for ScriptFileName:
@msgTWinUIAppName
Windows UI
@@
;msgStartScreenName is what we're calling the start screen
@msgStartScreenName
Start screen
@@
;msgAppListGroup0Name and msgAppListGroup1Name
;are what we are calling the two groups of apps under the All Apps list.
;Group0 is the first group, Group1 is the second group.
@msgAppListGroup0Name
Windows 8 Apps
@@
@msgAppListGroup1Name
Desktop Apps
@@
;msgTileGroupColumnRowCount is the column and row count spoken for tile groups on zoomed out Start screen
@msgTileGroupColumnRowCount
Contains %1 columns and %2 rows
@@
;msgScreenSensitiveHelpCommandBar is a copy of cmsgScreenSensitiveHelp53_L,
;but with the line about moving to next command bar removed.
@msgScreenSensitiveHelpCommandBar
This command bar consists of a row of buttons.
To move through the buttons, press RIGHT ARROW or LEFT ARROW.
To activate a button, press ENTER.
To leave the command bar, press ESC.
@@
@msgScreenSensitiveHelpStartScreenTile
This is the Start Screen. You may start typing to use the Search edit field,
then UP and DOWN ARROW to move through the list of results. When you locate the
item you want, press ENTER to open it.

Alternatively, you may wish to navigate and explore the tiles. First activate
the Touch Cursor by pressing SHIFT+NUM PAD PLUS, and then navigate on a touch
screen with single-finger flick right and left gestures, or on a keyboard using
RIGHT and LEFT ARROW. Use single-finger flick up and down gestures, or UP and
DOWN ARROW, to move between the groups. When you locate a tile for an
application you want to launch, double tap or press ENTER.
@@
@msgScreenSensitiveHelpStartScreenGroup
Use left and right arrows to navigate across the groups.
Press Enter to zoom the Start screen back into view on the chosen group.
@@
;msgEnteringGroupDuringMove is spoken when moving a tile causes it to move into a new group.
;%1 is the name of the new group.
@msgEnteringGroupDuringMove
Entering group %1
@@
;msgCurrentGroupRenamedDuringMove is spoken if the group does not change
;but it was renamed during a tile move.
;%1 is the old group name
;%2 is the new group name
@msgCurrentGroupRenamedDuringMove
Group %1 renamed to %2
@@
;msgCreatingGroupDuringMove is spoken when moving a tile causes it to create a new group.
;%1 is the name of the new group.
@msgCreatingGroupDuringMove
Creating group %1
@@
;msgNewGroupRenamedDuringMove is spoken if the group changes,
;and the group has been renamed because of the moved tile.
;%1 is the name the new group has been renamed to
@msgNewGroupRenamedDuringMove
New group renamed to %1
@@
;msgMoveGroupLeft and msgMoveGroupRight are spoken when moving Start screen groups left or right.
@msgMoveGroupLeft
Move group left
@@
@msgMoveGroupRight
Move group right
@@

;UNUSED_VARIABLES
;msgTabErrorOnSummaryOrAppList is spoken when tab or shift+tab
;cannot be used on the app list to move to the search edit field
;%1 is ks_Win8SearchAppsEdit
@msgTabErrorOnSummaryOrAppList
Press %1, or start typing to move to the Search edit field.
@@
;END_OF_UNUSED_VARIABLES

EndMessages
