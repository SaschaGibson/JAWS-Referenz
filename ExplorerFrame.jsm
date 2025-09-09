;Windows 7 Explorer message file

const
;object names:
	objn_Address = "Address:", ;Address object in window of class breadcrumb parent
	objn_ViewSliderControl = "View Slider Control", ;parent object to up/down sliders under View split button, Win7 Command module toolbar
;Window names
	;The following is for the header controls in the files list.
	;when using the default setting, it's the second, as you cursor across to the right.
	;it is the return value of getObjectName or Script Utility Mode | f10 until you hear 'name'.
	;Press either f9 to hear it or CTRL+f9 to copy it to the clipboard.
	wnDateHeader = "Date modified",
;Windows 7 & 8 Notification Area Icons, properties dialog for Taskbar > Customize:
	wn_NotificationAreaIcons = "Notification Area Icons"

Messages
@msgApp_WindowsExplorer
File Explorer
@@
@msgAddressNotFound_L
Address not found
@@
;msgViewSliderControl_CustomTutorialHelp and msgViewSliderControl_CustomScreenSensitiveHelp
;are custom help messages for the view slider control,
;under View split button, Win7 Command module toolbar.
@msgViewSliderControl_CustomTutorialHelp
Use Page Up/Down to change to a view.
For icon views, change the icon size using arrow keys.
@@
@msgViewSliderControl_CustomScreenSensitiveHelp
Use the PAGE DOWN and PAGE UP keys to move this slider to the desired view.
Arrow keys may also be used to change the slider to a view, or to change the size of the icon for any of the icon views.
@@
;For msgBreadcrumbBar, %1 is the breadcrumb(s) shown for the current folder in File Explorer
@msgBreadcrumbBar
Breadcrumb bar: %1
@@
EndMessages
