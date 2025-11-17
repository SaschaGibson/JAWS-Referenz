const

sc1 = "JFWUI60",
sc4 = "MAGICUI",




;UNUSED_VARIABLES

scVirticleBar = "|",
sc2 = "minimize symbol",
sc3 = "WT_"

;END_OF_UNUSED_VARIABLES

messages

@cmsgNewFeatureTextViewer
TextViewer feature coming to MAGic soon
@@
@cmsgNewFeatureSelectAndSay
SelectAndSay feature coming to MAGic soon
@@

@cmsg_MAGicScriptingNotAuthorized
Your current version of MAGic does not allow the use of the MAGic Scripting feature. To enable the use of the Scripting feature, contact your local dealer or Freedom Scientific to upgrade to MAGic Pro Scripting Edition.
@@
@cmsg_ScriptUtilityModeNotAuthorized
Your current version of MAGic does not allow the use of the MAGic scripting utility functions. To enable the use of the Home Row functions, contact your local dealer or Freedom Scientific to upgrade to MAGic Pro Scripting Edition.
@@

;When shutting down MAGic:
@cmsgQuitMAGicDlgMessageTitle
Quit MAGic
@@
@cmsgQuitMAGicDlgMessageText
Are you sure you want to quit MAGic?  Press Enter to quit now, or Escape to cancel.
@@
@cmsgMagicUnloaded
MAGic unloaded
@@

; cmsgVoiceProfilesContextMenuName refers to the MAGic context menu for voice profiles
@cmsgVoiceProfilesContextMenuName
Voice Profiles
@@
@cmsgMagicContextMenuName
Magic
@@

;for cmsgMAGicKeyOn and cmsgMAGicKeyOff,
; %1 is the name of the key which acts as MAGicKey, such as CapsLock
@cmsgMAGicKeyOn
%1 on
@@
@cmsgMAGicKeyOff
%1 off
@@

@mag001
MAGic is active
@@
@mag002
The current level of magnification is
@@
@mag004
MAGic is not active
@@
@mag012
Mouse Centered
@@
@mag017
MAGic Not running
@@
@mag023
screen not magnified
@@
@mag024
Locator On
@@
@mag025
Locator Off
@@
@mag026
Magnification On
@@
@mag027
magnification off
@@
@cmsgResizingTool
MAGic resizing tool
@@
@mag033
horizontal split
@@
@mag034
vertical split
@@
@mag035
full screen
@@
@mag036
overlay
@@
@mag037
lens
@@
@mag038
tracking lens
@@
@mag046
magic re sizing tool
@@
@mag047
this magic view does not have sizeable borders
@@
@mag052
Smoothing On
@@
@mag053
Smoothing Off
@@
@mag062
Tracking On
@@
@mag063
Tracking Off
@@
;for msgMagnificationLevelAnnouncement
;%1 is the level of magnification
@msgMagnificationLevelAnnouncement
%1 X
@@
;for msgMagnificationLevelAnnouncementFractional
;%1 is the integer part of the magnification level
;%2 is the fractional part of the magnification level
@msgMagnificationLevelAnnouncementFractional
%1 point %2 X
@@

@cmsg_RestrictMouseToActiveMonitor_off
Restrict Mouse to Active Monitor disabled
@@
@cmsg_RestrictMouseToActiveMonitor_on
Restrict Mouse to Active Monitor enabled
@@
@cmsgFocusEnhancementON
Focus enhancement enabled
@@
@cmsgFocusEnhancementOff
Focus enhancement disabled
@@

@cmsgJumpingRequiresMultiMon_L
Jumping to a display is only available when Multi-Monitor support is enabled
@@
@cmsgJumpingRequiresMultiMon_S
Multi-Monitor not enabled
@@
@cmsgJumpingRequiresExtendedMode_L
Jumping to a display is only available when Multi-Monitor support is configured for extended mode
@@
@cmsgJumpingRequiresExtendedMode_S
Multi-Monitor extended mode not enabled
@@
@cmsgJumpingRequiresMag_L
Jumping to a display is only available when Magnification is turned on
@@
@cmsgJumpingRequiresMag_S
Screens are not magnified
@@
; for cmsgActiveDisplay, %1 is the new active display number
@cmsgActiveDisplay
Display %1
@@
@cmsgPrimaryDisplay
Primary display
@@
@cmsgExtendedDisplay
Extended display
@@
@cmsgNotSupportedInMultiMonitorMode_S
Not supported in Multi-Monitor mode
@@
@cmsgFramesNotSupportedInMultiMonitorMode_L
QuickView frames are not supported in Multi-Monitor mode
@@
@cmsgLocatorNotSupportedInMultiMonitorMode_L
Locator not supported in Multi-Monitor mode
@@

@cmsgMVFull
Full
@@
@cmsgMVLens
Lens
@@
@cmsgMVOverlay
Overlay
@@
@cmsgMVSplit
Split
@@
@cmsgMVDynamicLens
Dynamic lens
@@
@cmsgMVTextViewer
Text viewer
@@
@cmsgFullScreenMagicView
Full Screen MAGic view
@@
@cmsgTrackingLensView
tracking lens
@@
@cmsgMultiMonVFull
Multi-Monitor enabled, view forced to Full
@@

@cmsgUnmagnifiedMouseSizeOn
Unmagnified mouse size on
@@
@cmsgUnmagnifiedMouseSizeOff
Unmagnified mouse size off
@@
@cmsgMagnifiedMouseSizeOn
Magnified mouse size on
@@
@cmsgMagnifiedMouseSizeOff
Magnified mouse size off
@@

@cMSGOpenMAGicDlgError_L
There is currently an open MAGic dialog box. Only one MAGic dialog box can be opened at a time.

You must close the current dialog by pressing Escape in order to bring up the requested dialog box
and then activate the desired dialog box.
@@
@cMSGOpenMAGicDlgError_S
There is an open MAGic dialog. Only one MAGic dialog box can be opened at a time.
You must close the current dialog before opening a new one.
@@

@cmsgNoUserDefinedVoiceProfiles
There are no user-defined voice profiles.
@@

@cmsgVisualEnhancementsOn
Visual enhancements enabled
@@
@cmsgVisualEnhancementsOff
Visual enhancements disabled
@@
@cmsgMagnficationOn
Magnification enabled
@@
@cmsgMagnficationOff
magnification disabled
@@
@cmsgCustomMouseOn
Mouse enhancements enabled
@@
@cmsgCustomMouseOff
Mouse enhancements disabled
@@
@cmsgCustomColorsOn
Color enhancements enabled
@@
@cmsgCustomColorsOff
Color enhancements disabled
@@
@cmsgTrackingOn
Tracking enabled
@@
@cmsgTrackingOff
Tracking disabled
@@
@cmsgLocatorsOn
Locator enabled
@@
@cmsgLocatorsOff
Locator disabled
@@
@cmsgCustomCursorOn
Cursor enhancements enabled
@@
@cmsgCustomCursorOff
Cursor enhancements disabled
@@
@cmsgSmoothingOn
Smoothing Enabled
@@
@cmsgSmoothingOff
Smoothing Disabled
@@

@cmsgMouseNotFollowCursor_L
The mouse will not follow the cursor
@@
@cmsgMouseNotFollowCursor_S
Mouse will not follow cursor
@@
@cmsgMouseFollowCursor_L
The mouse will follow the cursor
@@
@cmsgMouseFollowCursor_S
Mouse will follow cursor
@@

@cmsgMouseCentered
Mouse Centered
@@
@cmsgMouseStyleHidden
hidden
@@
@cmsgMouseStyleWindowsStandard
windows standard
@@
@cmsgMouseStyleCrossHair
cross hair
@@
@cmsgMouseStyleCross
cross
@@
@cmsgMouseStyleCircle
circle
@@
@cmsgMouseStyleOutlinedCircle
outlined circle
@@
@cmsgMouseStyleCircledCircle
circled circle
@@
@cmsgShiftViewToMouse
Shift View To Mouse
@@
@cmsgMagicViewMouseInverted
MAGic view mouse Inverted
@@
@cmsgMagicViewMouseNotInverted
MAGic view mouse not inverted
@@
@cmsgRealViewMouseInverted
real view mouse inverted
@@
@cmsgRealViewMouseNotInverted
real view mouse not inverted
@@

@cmsgLineLockOn
Line lock enabled
@@
@cmsgLineLockOff
Line lock disabled
@@
@cmsgAutoSwitchOn
Auto switch on
@@
@cmsgAutoSwitchOff
Auto switch off
@@

@cmsgCursorActive
Cursor
@@
@cmsgMouseActive
Mouse
@@
@cmsgMouseToCursor_L
Route mouse to cursor
@@
@cmsgMouseToCursor_S
Mouse to cursor
@@
@cmsgCursorToMouse_L
Route cursor to mouse
@@
@cmsgCursorToMouse_S
Cursor to mouse
@@

@cmsgQuickViewFramesOn
Quick view frames on
@@
@cmsgQuickViewFramesOff
Quick view frames off
@@

;when setting quickview frame corners:
@cmsgQVSetTopLeftCorner
Setting quick view top left corner
@@
@cmsgQVSetBottomRightCorner
Settings quick view bottom right corner
@@
@cmsgUnmagnifiedEnhancementsOn
Unmagnified enhancements on
@@
@cmsgUnmagnifiedEnhancementsOff
Unmagnified enhancements off
@@
@cmsgUnmagnifiedMouseOn
Unmagnified mouse on
@@
@cmsgUnmagnifiedMouseOff
Unmagnified mouse off
@@
@msgDemoVersion
Demonstration
@@

;UNUSED_VARIABLES

@mag003
Magnification level is
@@
@mag005
up
@@
@mag006
down
@@
@mag007
left
@@
@mag008
right
@@
@mag009
edge|center|continuous|predictive
@@
@mag010
Tracking Alignment
@@
@mag011
Tracking Alignment set to
@@
@mag013
Custom Colors On
@@
@mag014
Custom Colors Off
@@
@mag015
Custom Mouse On
@@
@mag016
Custom Mouse Off
@@
@mag018
Shift View To Mouse
@@
@mag019
magic view mouse Inverted
@@
@mag020
magic view mouse not inverted
@@
@mag021
real view mouse inverted
@@
@mag022
real view mouse not inverted
@@
@mag028
Full Screen magic view
@@
@mag029
Alt manual panning mode
@@
@mag030
shift manual panning mode
@@
@mag031
magic could not be unloaded
@@
@mag032
magic unloaded
@@
@mag039
hidden
@@
@mag040
windows standard
@@
@mag041
cross hair
@@
@mag042
cross
@@
@mag043
circle
@@
@mag044
outlined circle
@@
@mag045
circled circle
@@
@mag048
 background smoothing color
 @@
@mag049
Use the eye dropper to select the background color you wish to smooth
@@
@mag050
Background Smoothing On
@@
@mag051
Background Smoothing Off
@@
@mag054
Caret Tracking On
@@
@mag055
Caret Tracking Off
@@
@mag056
Dialog Tracking On
@@
@mag057
Dialog Tracking Off
@@
@mag058
Menu Tracking On
@@
@mag059
Menu Tracking Off
@@
@mag060
Mouse Tracking On
@@
@mag061
Mouse Tracking Off
@@

;END_OF_UNUSED_VARIABLES

EndMessages
