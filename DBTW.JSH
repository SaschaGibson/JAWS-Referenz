;script header ffile for DBT for Windows
; cln, Nov. 4, 2019
; Copyright Duxbury Systems, Inc.
; All rights reserved.

const

;window classes
	wcMDIClient = "MDIClient",
	wcDBTWindow = "DBT Window",
	wcDBTCodesEdit = "DBT_CODESEDIT",

; other constants
	ciStyleLabelLength = 15,
	ciPage = 5,
	ciLine = 5,
	ciColumn = 7,
	ciUnicode = 2,
	DBT_Window_Control=0,
	cBrailleMessageTime = 30

; The lines below for speaking characters as braille cells can be localized.
; Each line tells JAWS how to speak the next 16 Unicode characters as braille cells.
; using semicolon is the delimiter
; The first four lines are for ASCII characters spoken in English context.
; the next three lines are for characters in the Russian braille encoding.
; The next four lines are for characters on Unicode page 28.

; first four below for North American braille encoding
; They give English-based speaking of braille cells.
; You can edit these four lines to speak the braille cells in the North American braille encoding differently.
; After editing these lines, save this file and recompile dbtw.jss.

const

	csBrailleChars32 = "space;t h e sign;dot 5;number sign;e d sign;s h sign;a n d sign;dot 3;o f sign;w i t h sign;c h sign;i n g sign;dot 6;dots 3 6;dots 4 6;s t sign",
	csBrailleChars48 = "low j;low a;low b;low c;low d;low e;low f;low g;low h;low i;w h sign;dots 5 6;g h sign;f o r sign;a r sign;t h sign; dot 4",
	csBrailleChars91 = "o w sign;o u sign;e r sign;dots 4 5;dots 4 5 6;dot 4;a;b;c;d;e;f;g;h;i;j",
	csBrailleChars107 = "k;l;m;n;o;p;q;r;s;t;u;v;w;x;y;z;o w sign;o u sign;e r sign;dots 4 5;dots 4 5 6",

; three lines below for Russian braille encoding
	csBrailleChars123 = "dots 4 6;dots 4 5 6;dot 6;dots 1 2 4 5 6; ",
	csBrailleChars1072 = "dot 1;dots 1 2;dots 2 4 5 6;dots 1 2 4 5;dots 1 4 5;dots 1 5;dots 2 4 5;dots 1 3 5 6;dots 2 4;dots 1 2 3 4 6;dots 1 3;dots 1 2 3;dots 1 3 4;dots 1 3 4 5;dots 1 3 5;dots 1 2 3 4",
	csBrailleChars1088 = "dots 1 2 3 5;dots 2 3 4;dots 2 3 4 5;dots 1 3 6;dots 1 2 4;dots 1 2 5;dots 1 4;dots 1 2 3 4 5;dots 1 5 6;dots 1 3 4 6;dots 1 2 3 5 6;dots 2 3 4 6;dots 2 3 4 5 6;dots 2 4 6;dots 1 2 5 6;dots 1 2 4 6;dots 1 6",

; four lines below for Unicode braille patterns (Unicode page 28)
	csBrailleChars10240 = "space;a;low a;b;dot 3;k;low b;l;dot 4;c;i;f;s t sign;m;s;p",
	csBrailleChars10256 = "dot 5;e;low c;h;low i;o;low f;r;dots 4 5;d;j;g;a r sign;n;t;q",
	csBrailleChars10272 = "dot 6;c h sign;low e;g h sign;hyphen;u;low h;v;dots 4 6;s h sign;o w sign;e d sign;i n g sign;x;t h e sign;a n d sign",
	csBrailleChars10288 = "dots 5 6;w h sign;low d;o u sign;low j;z;low g;o f sign;dots 4 5 6;t h sign;w;e r sign;number sign;y;w i t h sign;f o r sign"

