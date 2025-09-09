;Script Message File for Corel Central 9 Service Pack 4
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Version 3.7
;Accompanying executables to this application are: calframe.exe, cardfile.dll (Corel's version)
;by Joseph Stephen
;14 July 2000
; Build CC3710502 last modified by Joseph Stephen 12 October 2000

CONST
; Window Classes
wc_AfxOleControl42="AfxOleControl42",
wc_calendarDateChooser="Afx:3b040000:8:14be:72e:0",
; control ids
cID_memoText=5030,
; Corel Central apps version
icCentral10 = 10

Globals
	int giCorelCentralFirstTime,
	int nSuppressEcho,
	string g_strGraphicsList,
	string g_strGraphicsListX,
	string g_strGraphicsListY

