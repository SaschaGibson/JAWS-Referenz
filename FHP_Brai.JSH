; FHP definitions and messages (Deutsch)
const
/* wird in common.jsm definiert
	fhpmsg01 = "PC Modus", 
	fhpmsg02 = "Navigationsmodus",
	fhpmsg03 = "Kombinierter Modus",
	fhpmsg04 = "Sprachausgabenmodus",
	fhpmsg05 = "Braillemodus",
	fhpmsg06 = "Schalter hat keine Funktion",
	fhpmsg07 = "Dialogfeld",
	fhpmsg08 = "Aktuelles Attribut",
	fhpmsg09 = "Siehe unten",
	fhpmsg10 = "Attributanzeige",
	fhpmsg11 = "BRAILLEX EL",
;	fhpmsg12 = "Kurzschriftübersetzung",
;	fhpmsg13 = "Wort unterm Cursor kürzen",
;	fhpmsg14 = "Markierung mit Punkten 7 und 8",
	fhpmsg15 = "Braillezeilendarstellung",
	fhpmsg16 = "Anzeigen in",
	fhpmsg17 = "Arbeitsmodus",
	fhpmsg18 = "Geändert",
	fhpmsg19 = "Ausschalten der Cursorverfolgung",
 	fhpmsg20 = "Einschalten der Cursorverfolgung",
	fhpmsg21 = "Farben",
	fhpmsg22 = "Skriptdefinierte Markierungen",
	fhpmsg23 = "Blitzmeldungen",
	fhpmsg24 = "Sprechender Navigationsmodus",
	fhpmsg25 = "Profimodus",
	;fhpmsg26 = "Word Statuszelle",
	fhpmsg27 = "nicht verfügbar",
	fhpmsg28 = "nicht im strukturierten Modus möglich",
	fhpmsg29 = "aktiv",
	fhpmsg30 = "Erweiterte Arbeitsmodi",
*/
	MGR_BDAS = "bdasconf.exe",
	FHPNaviMode = 100,
	FHPKombiMode = 101,
	FHPPcMode = 102,
	BraillexEL1U = 501,
	BraillexEL1R = 502,
	BraillexEL1D = 503,
	BraillexEL1L = 504,
	BraillexEL2U = 505,
	BraillexEL2R = 506,
	BraillexEL2D = 507,
	BraillexEL2L = 508,
/* wird in common.jsm definiert
	BraillemanagerItem ="|BDAS Konfigurationsmanager",
*/
	BrailleModeIniFile = "BrailleMode.ini",

	EightDots ="12345678",
	Dots78="78"



Globals
	string g_sProfileName,
	Int g_bBrailleCursorHidden,
	Int g_b2DPCMode,
	Int g_b2DReadingMode,
	String OldCursorDots,
	String g_DlgName,
	int g_bELPCMode,
	Int g_bELReadingMode,
	Int g_BrailleMode,
	Int g_OldAttributSettings,
	Int g_activeAttribut,
;	Int g_SaveSetting,  ;/ wurde durch g_iLastNaviMove ersetzt, dort ist hinterlegt in welche richtung die navi leiste als letztes bewegt wurde \;
;	Int g_BRLmode,
	Int g_oldmode,
	Int g_bBRLModeChanged,
	Int g_iRetCurVal,				;Schalter für die Anzeige des aktuellen Attributes
	String g_Attr,						;merken des Attributes
	Int g_new_Attr,
	Int g_Marking_Change,
	Int brow,
	int g_oldCursorPos,
	int g_iELTaste,
	int g_iELXBrailleMode,								;/ welcher arbeitsmodus ist momentan aktiv \;
	int g_iSpeakingNaviMode,							;/ ist der sprechende navimodus aktiv \;
	int g_iProfiMode,					 						;/ ist der profi modus aktiv \;
	int g_iLastBrailleLineNr,								;/ hilfvariable, merkt sich die y position des braillecursors für den speaking navimodus \;
	int g_iWordStatusCell,									;/ sind die Word status zellen aktiv \;
	int g_iOld_BRLMode,									;/ speichert den braillemodus bevor ein brailledialog von papenmeier geoeffnet wird \;
	int g_iLastNaviMove,										;/ hier ist hinterlegt in welche richtung die navileiste als letztes bewegt wurde \;	
	int g_iIsFHPDialog,										;/ wird auf TRUE gesetzt wenn ein FHP dialog aufgeht damit 1l und 1r nicht den wert aendern sondern lesen \;
	String g_sAppName										;/ wird benutzt um festzustellen ob das Programm gewechselt wurde \;

CONST
	BRL_MARKING_ALL_ATTRIBUTE = 0x01fe