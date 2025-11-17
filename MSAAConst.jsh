;JAWS MSAA constants

const

;MSAA Roles:
ROLE_SYSTEM_TITLEBAR	= 0x1,
ROLE_SYSTEM_MENUBAR	= 0x2,
ROLE_SYSTEM_SCROLLBAR	= 0x3,
ROLE_SYSTEM_GRIP	= 0x4,
ROLE_SYSTEM_SOUND	= 0x5,
ROLE_SYSTEM_CURSOR	= 0x6,
ROLE_SYSTEM_CARET	= 0x7,
ROLE_SYSTEM_ALERT	= 0x8,
ROLE_SYSTEM_WINDOW	= 0x9,
ROLE_SYSTEM_CLIENT	= 0xa,
ROLE_SYSTEM_MENUPOPUP	= 0xb,
ROLE_SYSTEM_MENUITEM	= 0xc,
ROLE_SYSTEM_TOOLTIP	= 0xd,
ROLE_SYSTEM_APPLICATION	= 0xe,
ROLE_SYSTEM_DOCUMENT	= 0xf,
ROLE_SYSTEM_PANE	= 0x10,
ROLE_SYSTEM_CHART	= 0x11,
ROLE_SYSTEM_DIALOG	= 0x12,
ROLE_SYSTEM_BORDER	= 0x13,
ROLE_SYSTEM_GROUPING	= 0x14,
ROLE_SYSTEM_SEPARATOR	= 0x15,
ROLE_SYSTEM_TOOLBAR	= 0x16,
ROLE_SYSTEM_STATUSBAR	= 0x17,
ROLE_SYSTEM_TABLE	= 0x18,
ROLE_SYSTEM_COLUMNHEADER	= 0x19,
ROLE_SYSTEM_ROWHEADER	= 0x1a,
ROLE_SYSTEM_COLUMN	= 0x1b,
ROLE_SYSTEM_ROW	= 0x1c,
ROLE_SYSTEM_CELL	= 0x1d,
ROLE_SYSTEM_LINK	= 0x1e,
ROLE_SYSTEM_HELPBALLOON	= 0x1f,
ROLE_SYSTEM_CHARACTER	= 0x20,
ROLE_SYSTEM_LIST	= 0x21,
ROLE_SYSTEM_LISTITEM	= 0x22,
ROLE_SYSTEM_OUTLINE	= 0x23,
ROLE_SYSTEM_OUTLINEITEM	= 0x24,
ROLE_SYSTEM_PAGETAB	= 0x25,
ROLE_SYSTEM_PROPERTYPAGE	= 0x26 ,
ROLE_SYSTEM_INDICATOR	= 0x27,
ROLE_SYSTEM_GRAPHIC	= 0x28,
ROLE_SYSTEM_STATICTEXT	= 0x29,
ROLE_SYSTEM_TEXT	= 0x2a,
ROLE_SYSTEM_PUSHBUTTON	= 0x2b,
ROLE_SYSTEM_CHECKBUTTON	= 0x2c,
ROLE_SYSTEM_RADIOBUTTON	= 0x2d,
ROLE_SYSTEM_COMBOBOX	= 0x2e,
ROLE_SYSTEM_DROPLIST	= 0x2f,
ROLE_SYSTEM_PROGRESSBAR	= 0x30,
ROLE_SYSTEM_DIAL	= 0x31,
ROLE_SYSTEM_HOTKEYFIELD	= 0x32,
ROLE_SYSTEM_SLIDER	= 0x33,
ROLE_SYSTEM_SPINBUTTON	= 0x34,
ROLE_SYSTEM_DIAGRAM	= 0x35,
ROLE_SYSTEM_ANIMATION	= 0x36,
ROLE_SYSTEM_EQUATION	= 0x37,
ROLE_SYSTEM_BUTTONDROPDOWN	= 0x38,
ROLE_SYSTEM_BUTTONMENU	= 0x39,
ROLE_SYSTEM_BUTTONDROPDOWNGRID	= 0x3a,
ROLE_SYSTEM_WHITESPACE	= 0x3b,
ROLE_SYSTEM_PAGETABLIST	= 0x3c,
ROLE_SYSTEM_CLOCK	= 0x3d,
ROLE_SYSTEM_SPLITBUTTON	= 0x3e,
ROLE_SYSTEM_IPADDRESS	= 0x3f,
ROLE_SYSTEM_OUTLINEBUTTON	= 0x40,

;MSAA states
STATE_SYSTEM_NORMAL = 0x00000000,  ;Indicates that the object does not have another state assigned to it.
STATE_SYSTEM_UNAVAILABLE = 0x00000001, ;The object is unavailable
STATE_SYSTEM_SELECTED = 0x00000002,  ;The object is selected
STATE_SYSTEM_FOCUSED = 0x00000004,  ;The object has the keyboard focus
STATE_SYSTEM_PRESSED = 0x00000008,  ;The object is pressed
STATE_SYSTEM_CHECKED = 0x00000010,  ;The object's check box is selected
STATE_SYSTEM_MIXED = 0x00000020,  ;the state of a three-state check box or toolbar button is not determined
STATE_SYSTEM_INDETERMINATE	= 0x00000020,  ;the state of a three-state check box or toolbar button is not determined
STATE_SYSTEM_READONLY = 0x00000040,   ;The object is designated read-only
STATE_SYSTEM_HOTTRACKED = 0x00000080,  ;The object is hot-tracked by the mouse
STATE_SYSTEM_DEFAULT = 0x00000100,  ;This state represents the default button in a window
STATE_SYSTEM_EXPANDED = 0x00000200,  ;Children of this object that have the ROLE_SYSTEM_OUTLINEITEM role are displayed
STATE_SYSTEM_COLLAPSED = 0x00000400,  ;Children of this object that have the ROLE_SYSTEM_OUTLINEITEMrole are hidden
STATE_SYSTEM_BUSY = 0x00000800,  ;The control cannot accept input at this time
STATE_SYSTEM_FLOATING = 0x00001000,  ;Children "owned" not "contained" by parent (This object state constant is not supported)
STATE_SYSTEM_MARQUEED = 0x00002000,  ;Indicates scrolling or moving text or graphics
STATE_SYSTEM_ANIMATED = 0x00004000,  ;The object's appearance changes rapidly or constantly
STATE_SYSTEM_INVISIBLE = 0x00008000,  ;The object is programmatically hidden
STATE_SYSTEM_OFFSCREEN = 0x00010000,  ;The object is clipped, or scrolled out of view, but not programmatically hidden
STATE_SYSTEM_SIZEABLE = 0x00020000,  ;The object can be resized
STATE_SYSTEM_MOVEABLE = 0x00040000,  ;Indicates that the object can be moved
STATE_SYSTEM_SELFVOICING = 0x00080000,  ;The object or child uses text-to-speech (TTS) technology for description purposes
STATE_SYSTEM_FOCUSABLE = 0x00100000,  ;The object is on the active window and is ready to receive keyboard focus
STATE_SYSTEM_SELECTABLE = 0x00200000,  ;The object accepts selection
STATE_SYSTEM_LINKED = 0x00400000,  ;Indicates that the object is formatted as a hyperlink
STATE_SYSTEM_TRAVERSED = 0x00800000,  ;The object is a hyperlink that has been visited (previously clicked) by a user
STATE_SYSTEM_MULTISELECTABLE = 0x01000000,  ;The object supports multiple selection
STATE_SYSTEM_EXTSELECTABLE = 0x02000000,  ;The object supports extended selection
STATE_SYSTEM_ALERT_LOW = 0x04000000,  ;This information is of low priority
STATE_SYSTEM_ALERT_MEDIUM = 0x08000000,  ;This information is of medium priority
STATE_SYSTEM_ALERT_HIGH = 0x10000000,  ;This information is of high priority
STATE_SYSTEM_PROTECTED = 0x20000000,  ;The object is a password-protected edit control.
STATE_SYSTEM_HASPOPUP = 0x40000000,  ;Object displays a pop-up menu or window when invoked.
STATE_SYSTEM_VALID	= 0x7fffffff,

; Selection constants (possible bit flags for o.accSelect())
	SELFLAG_NONE = 0x0L,
	SELFLAG_TAKEFOCUS = 0x1L,
	SELFLAG_TAKESELECTION = 0x2L,
	SELFLAG_EXTENDSELECTION = 0x4L,
	SELFLAG_ADDSELECTION = 0x8L,
	SELFLAG_REMOVESELECTION = 0x10L,
	SELFLAG_VALID = 0x1fL,

; Object identifiers for AccessibleObjectFromWindow
; These come from WinAble.h
	OBJID_WINDOW = 0x00000000L,
	OBJID_SYSMENU = 0xFFFFFFFFL,
	OBJID_TITLEBAR = 0xFFFFFFFEL,
	OBJID_MENU = 0xFFFFFFFDL,
	OBJID_CLIENT = 0xFFFFFFFCL,
	OBJID_VSCROLL = 0xFFFFFFFBL,
	OBJID_HSCROLL = 0xFFFFFFFAL,
	OBJID_SIZEGRIP = 0xFFFFFFF9L,
	OBJID_CARET = 0xFFFFFFF8L,
	OBJID_CURSOR = 0xFFFFFFF7L,
	OBJID_ALERT = 0xFFFFFFF6L,
	OBJID_SOUND = 0xFFFFFFF5L,
	OBJID_QUERYCLASSNAMEIDX = 0xFFFFFFF4L,
	OBJID_NATIVEOM = 0xFFFFFFF0L,

; Navigation direction constants for accNavigate
	NAVDIR_UP = 1,
	NAVDIR_DOWN = 2,
	NAVDIR_LEFT = 3,
	NAVDIR_RIGHT = 4,
	NAVDIR_NEXT = 5,
	NAVDIR_PREVIOUS = 6,
	NAVDIR_FIRSTCHILD = 7,
	NAVDIR_LASTCHILD = 8,

; Child ID for referring to an object itself, not a child element (from winable.h)
	CHILDID_SELF = 0
