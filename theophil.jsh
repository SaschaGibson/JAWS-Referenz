; Build 3.71.05.001
; JFW 3.7 script header file for Theophilos version 2.6 and 3.0
; Copyright 2010-2015 by Freedom Scientific, Inc.
; written by Joseph Stephen (formerly Dunn) and Justin Daubenmire
; Last modified on May 25, 2000 by Joseph Stephen

globals
;checks to see if Theophilos has been run once 
;if not, it will announce help information. 
int TheophilosRunOnce,
string globalTheophilosVersion, ; JFW 3.7 supports v2.6 and v3.0
; for toolbar button list
string g_strGraphicsList,
string g_strGraphicsListX,
string g_strGraphicsListY,
; for link navigation
int globalNewPage, ; set to true when a new page is activated
int globalLinkFound,
int globalInLink, ; set to true when an underlined link is detected in a text or HTML window
handle ghContext

const
; Window Classes
wc_textWindow="TSRichEdit",
wc_MDIClient="MDIClient",
wc_splash="tSplashF",
wc_jumpListGrid="TmstrGrid",
wc_HTMLViewer="THTMLViewer",
wc_paintPanel="tPaintPanel", ; actual html area 
wc_statusBar="tStatusBar",
; link movement constants
first_link=1,
next_link=2,
prior_link=3,
last_link=4,
Key_Page="+Page" ; used in key pressed event