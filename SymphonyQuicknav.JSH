const
;for keyname string compares:
	scPlusDelim="+",
	sc_RightControl="RightControl",
	scCtrl="Control",
	scAlt="Alt",
; delimiter and bullet type contstant
	sCDash="-",
	ki_dash=0xB,
; Keycodes for KeyPressedEvent and quick key mode
	kiRightAlt8 = 0x1000,
	kiCtrlA=0x1001E,
	kiCtrlB=0x10030,
	kiCtrlC=0x1002E,
	kiRightAltslash = 0x1035,
	kiAltL = 0x100026,  ;note that this is with left alt, not alt or right alt, which is 0x1026
	kiControlK = 0x425,
	kiNextSelectedParagraph = 0x400450,
	kiPriorSelectedParagraph = 0x400448,
	kiNextSelectedParagraphLaptop=0x800450,
	kiPriorSelectedParagraphLaptop=0x800448,
	kiCtrlApostrophe = 0x428,  ;note this is with left control, right control is 0x128
	kiCtrlGrave = 0x429,  ;note this is with left control, with right control it is 0x129
	kiCtrlTilde = 0x400429,  ;note that this is with left control and left shift, the other combinations are 0x400129 0x100129 0x100429
	kiCtrlCaret = 0x810007,
	kiCtrlColon = 0x400427,  ;note that this is with left control and left shift, the other combinations are 0x400127 0x100127 0x100427
	kiCtrlAt = 0x810003,
	kiCtrlAnd = 0x810008,
	kiCtrlComma = 0x10033,
	kiCtrlSlash = 0x435,  ;note that this is with left control, for right control use 0x135
	kiAltCtrlQuestion = 0x500435,  ;note that this is with left control, left alt and left shift, other combinations are 0x300435 0x500135 0x401435 0x300135 0x201435 0x201135
	kiAltCtrlExclaim = 0x500402,  ;note that this is with left contro, left alt and left shift, other combinations are 0x300402 0x500102 0x401402 0x300102 0x201402 0x201102
	kiEuro = 0x100412,  ;note this is with left control and left alt, other combinations are 0x100112 0x1412 0x1112
	kiCopyRight = 0x10042e,  ;note this is with left control and left alt, other combinations are 0x20122e 0x142e 0x112e
	kiRegistered = 0x100413,  ;note this is with left control and left alt, other combinations are 0x100113 0x1413 0x1113
	kiTrademark = 0x100414,  ;note this is with left control and left alt, other combinations are 0x100114 0x1414 0x1114
	kiElipsis = 0x100434,  ;note this is with left control and left alt, other combinations are 0x100134 0x1434 0x1134
	kiLeftShiftExclaim = 0x800002,
	kiLeftShiftQuestion = 0x800035,
	kiRightShiftExclaim = 0x800002,
	KIRightShiftQuestion = 0x800035,
	kiRightAltF4 = 0x103e,
; for Revision Detection
SpeakRevNone=0,
SpeakRevType=1,
SpeakRevTypeAuthor=2,
SpeakRevtypeAuthorDate=3,
speakRevcount=4 ; used as a bit flag
