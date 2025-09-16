Include "hjConst.jsh"
Include "hjGlobal.jsh"
Include "common.jsm"

; Hilfsfunktion zum Hinzufügen eines Abschnittstitels zum Benutzerpuffer
void Function AddSectionTitle(string sTitle, int iSectionNumber)
    UserBufferAddText(IntToString(iSectionNumber) + ". " + sTitle, cScNull, cScNull, cFont_Aerial, 14, ATTRIB_BOLD, RGBStringToColor(cColor_BLACK), RGBStringToColor(cColor_White), TRUE)
EndFunction

; Hilfsfunktion zur Verarbeitung einer Liste von Elementen, die von GetListOfTags zurückgegeben wurden
void Function ProcessElementList(string sElementList, string sDelimiter)
    var
        string sCurrentElement
        int i, iCount

    if !StringIsBlank(sElementList) then
        iCount = StringSegmentCount(sElementList, sDelimiter)
        for i = 1 to iCount
            sCurrentElement = StringSegment(sElementList, sDelimiter, i)
            UserBufferAddText(" - " + sCurrentElement, cScNull, cScNull, cFont_Aerial, 12, 0, RGBStringToColor(cColor_BLACK), RGBStringToColor(cColor_White), TRUE)
        endFor
    else
        UserBufferAddText(" (Keine Einträge)", cScNull, cScNull, cFont_Aerial, 12, 0, RGBStringToColor(cColor_BLACK), RGBStringToColor(cColor_White), TRUE)
    endIf
    UserBufferAddText(cScBufferNewLine, cScNull, cScNull, cScNull, 0, 0, 0, 0, TRUE) ; Eine Leerzeile zur besseren Trennung
EndFunction

; 1. Übersicht über Überschriften (H1-H6)
void Function AddHeadingOverview ()
    var
        string sHeadingsList
        string sDelimiter = "|"
        int i

    AddSectionTitle("Überschriften", 1)
    sHeadingsList = cscNull
    for i = 1 to 6
        sHeadingsList = sHeadingsList + GetListOfTags("H"+IntToString(i), "alt,title", sDelimiter)
    endFor
    ProcessElementList(sHeadingsList, sDelimiter)
EndFunction

; 2. Übersicht über Links (A-Tags)
void Function AddLinkOverview ()
    var
        string sLinksList
        string sDelimiter = "|"

    AddSectionTitle("Links", 2)
    sLinksList = GetListOfTags(TAG_ANCHOR, "alt,title", sDelimiter) ; TAG_ANCHOR aus hjConst.jsh verwenden [3]
    ProcessElementList(sLinksList, sDelimiter)
EndFunction

; 3. Übersicht über Tabellen (TABLE-Tags)
void Function AddTableOverview ()
    var
        string sTablesList
        string sDelimiter = "|"

    AddSectionTitle("Tabellen", 3)
    sTablesList = GetListOfTags(TAG_TABLE, "summary,title,alt", sDelimiter) ; TAG_TABLE aus hjConst.jsh verwenden [4]
    ProcessElementList(sTablesList, sDelimiter)
EndFunction

; 4. Übersicht über Grafiken (IMG-Tags)
void Function AddGraphicOverview ()
    var
        string sGraphicsList
        string sDelimiter = "|"

    AddSectionTitle("Grafiken", 4)
    sGraphicsList = GetListOfTags(TAG_GRAPHIC, "alt,title", sDelimiter) ; TAG_GRAPHIC aus hjConst.jsh verwenden [4]
    ProcessElementList(sGraphicsList, sDelimiter)
EndFunction

; 5. Übersicht über Schaltflächen (BUTTON-Tags)
void Function AddButtonOverview ()
    var
        string sButtonsList
        string sDelimiter = "|"

    AddSectionTitle("Schaltflächen", 5)
    sButtonsList = GetListOfTags("BUTTON", "alt,title", sDelimiter)
    ProcessElementList(sButtonsList, sDelimiter)
EndFunction

; 6. Übersicht über Eingabefelder (INPUT-Tags)
void Function AddInputOverview ()
    var
        string sInputList
        string sDelimiter = "|"

    AddSectionTitle("Eingabefelder (Input)", 6)
    sInputList = GetListOfTags("INPUT", "placeholder,alt,title", sDelimiter)
    ProcessElementList(sInputList, sDelimiter)
EndFunction

; 7. Übersicht über Textbereiche (TEXTAREA-Tags)
void Function AddTextareaOverview ()
    var
        string sTextareaList
        string sDelimiter = "|"

    AddSectionTitle("Textbereiche (Textarea)", 7)
    sTextareaList = GetListOfTags("TEXTAREA", "placeholder,alt,title", sDelimiter)
    ProcessElementList(sTextareaList, sDelimiter)
EndFunction

; 8. Übersicht über Auswahllisten (SELECT-Tags)
void Function AddSelectOverview ()
    var
        string sSelectList
        string sDelimiter = "|"

    AddSectionTitle("Auswahllisten (Select)", 8)
    sSelectList = GetListOfTags("SELECT", "alt,title", sDelimiter)
    ProcessElementList(sSelectList, sDelimiter)
EndFunction

; 9. Übersicht über Ungeordnete Listen (UL-Tags)
void Function AddUnorderedListOverview ()
    var
        string sList
        string sDelimiter = "|"

    AddSectionTitle("Ungeordnete Listen (UL)", 9)
    sList = GetListOfTags("UL", "alt,title", sDelimiter)
    ProcessElementList(sList, sDelimiter)
EndFunction

; 10. Übersicht über Geordnete Listen (OL-Tags)
void Function AddOrderedListOverview ()
    var
        string sList
        string sDelimiter = "|"

    AddSectionTitle("Geordnete Listen (OL)", 10)
    sList = GetListOfTags("OL", "alt,title", sDelimiter)
    ProcessElementList(sList, sDelimiter)
EndFunction

; 11. Übersicht über Listenelemente (LI-Tags)
void Function AddListItemOverview ()
    var
        string sListItemList
        string sDelimiter = "|"

    AddSectionTitle("Listenelemente (LI)", 11)
    sListItemList = GetListOfTags("LI", "alt,title", sDelimiter) ; "LI" als HTML-Tag verwenden
    ProcessElementList(sListItemList, sDelimiter)
EndFunction

; 12. Übersicht über ARIA-Regionen/Landmarks (Elemente mit 'role'-Attribut für Regionen/Landmarks)
void Function AddAriaRegionOverview ()
    var
        string sRegionsList
        string sDelimiter = "|"

    AddSectionTitle("ARIA-Regionen/Landmarks", 12)
    sRegionsList = GetListOfTags("", "aria-label,aria-labelledby,role,title,alt", sDelimiter)
    ProcessElementList(sRegionsList, sDelimiter)
EndFunction

; 13. Übersicht über Abschnitte (DIV-Tags - generische Blöcke)
void Function AddDivisionOverview ()
    var
        string sDivisionsList
        string sDelimiter = "|"

    AddSectionTitle("Abschnitte (DIV)", 13)
    sDivisionsList = GetListOfTags("DIV", "title,id", sDelimiter) ; "DIV" als HTML-Tag verwenden
    ProcessElementList(sDivisionsList, sDelimiter)
EndFunction

; 14. Übersicht über Blockzitate (BLOCKQUOTE-Tags)
void Function AddBlockquoteOverview ()
    var
        string sBlockquoteList
        string sDelimiter = "|"

    AddSectionTitle("Blockzitate (Blockquote)", 14)
    sBlockquoteList = GetListOfTags(TAG_BLOCKQUOTE, "cite,title,alt", sDelimiter) ; TAG_BLOCKQUOTE aus hjConst.jsh verwenden [4]
    ProcessElementList(sBlockquoteList, sDelimiter)
EndFunction

; 15. Übersicht über eingebettete Objekte (OBJECT-Tags/Eingebettete Medien)
void Function AddObjectOverview ()
    var
        string sObjectList
        string sDelimiter = "|"

    AddSectionTitle("Eingebettete Objekte (Object)", 15)
    sObjectList = GetListOfTags(TAG_OBJECT, "title,alt", sDelimiter) ; TAG_OBJECT aus hjConst.jsh verwenden [4]
    ProcessElementList(sObjectList, sDelimiter)
EndFunction

; 16. Übersicht über Benannte Anker (A-Tags mit 'name'/'id' - nicht unbedingt Links, sondern Ziele)
void Function AddNamedAnchorOverview ()
    var
        string sNamedAnchorList
        string sDelimiter = "|"

    AddSectionTitle("Benannte Anker (Ziele)", 16)
    ; Die GetListOfTags-Funktion unterstützt das Filtern nach Attribut-Existenz ohne Wert nicht direkt,
    ; daher wird hier ein allgemeinerer Ansatz mit name, id verwendet.
    sNamedAnchorList = GetListOfTags(TAG_ANCHOR, "name,id,title,alt", sDelimiter) ; Versucht Anker mit name/id
    ProcessElementList(sNamedAnchorList, sDelimiter)
EndFunction

; 17. Übersicht über Artikel (ARTICLE-Tags)
void Function AddArticleOverview ()
    var
        string sArticleList
        string sDelimiter = "|"

    AddSectionTitle("Artikel (Article)", 17)
    sArticleList = GetListOfTags("ARTICLE", "alt,title", sDelimiter)
    ProcessElementList(sArticleList, sDelimiter)
EndFunction

; 18. Übersicht über Absätze (P-Tags)
void Function AddParagraphOverview ()
    var
        string sParagraphList
        string sDelimiter = "|"

    AddSectionTitle("Absätze (P)", 18)
    sParagraphList = GetListOfTags("P", "alt,title", sDelimiter) ; "P" als HTML-Tag verwenden
    ProcessElementList(sParagraphList, sDelimiter)
EndFunction

; 19. Übersicht über Span-Elemente (SPAN-Tags)
void Function AddSpanOverview ()
    var
        string sSpanList
        string sDelimiter = "|"

    AddSectionTitle("Span-Elemente (Span)", 19)
    sSpanList = GetListOfTags("SPAN", "title,id", sDelimiter) ; "SPAN" als HTML-Tag verwenden
    ProcessElementList(sSpanList, sDelimiter)
EndFunction

; Haupt-Skript: Ruft die Element-Übersicht im virtuellen Betrachter auf
Script WebContextOverview ()
    ; Überprüft, ob sich der virtuelle PC-Cursor im Modus befindet,
    ; da diese Funktion nur in virtuellen Dokumenten wie Webseiten verfügbar ist.
    if !IsVirtualPCCursor() then
        SayFormattedMessage(OT_ERROR, cmsgFeatureRequiresVirtualCursor_L, cmsgFeatureRequiresVirtualCursor_S)
        return
    endIf

    ; Leert den Benutzerpuffer, bevor neue Inhalte hinzugefügt werden.
    UserBufferClear ()

    ; Fügt den Haupttitel zur Übersicht hinzu.
    UserBufferAddText("Übersicht über HTML-Elemente auf dieser Seite:", cScNull, cScNull, cFont_Aerial, 14, ATTRIB_BOLD, RGBStringToColor(cColor_BLUE), RGBStringToColor(cColor_White), TRUE)
    UserBufferAddText(cScBufferNewLine, cScNull, cScNull, cScNull, 0, 0, 0, 0, TRUE) ; Fügt eine Leerzeile zur besseren Formatierung hinzu.

    ; Ruft Hilfsfunktionen für jeden Elementtyp auf, um den Puffer zu füllen.
    AddHeadingOverview()
    AddLinkOverview()
    AddTableOverview()
    AddGraphicOverview()
    AddButtonOverview()
    AddInputOverview()
    AddTextareaOverview()
    AddSelectOverview()
    AddUnorderedListOverview()
    AddOrderedListOverview()
    AddListItemOverview()
    AddAriaRegionOverview()
    AddDivisionOverview()
    AddBlockquoteOverview()
    AddObjectOverview()
    AddNamedAnchorOverview()
    AddArticleOverview()
    AddParagraphOverview()
    AddSpanOverview()

    ; Fügt eine Anweisung zum Schließen der Übersicht hinzu.
    UserBufferAddText(cScBufferNewLine, cScNull, cScNull, cScNull, 0, 0, 0, 0, TRUE)
    UserBufferAddText("Drücken Sie ESCAPE, um diese Übersicht zu schließen.", cScNull, cScNull, cFont_Aerial, 12, 0, RGBStringToColor(cColor_BLACK), RGBStringToColor(cColor_White), TRUE)

    ; Aktiviert den Benutzerpuffer und liest dessen Inhalt.
    JAWSTopOfFile () ; Stellt sicher, dass das Lesen am Anfang der Datei beginnt.
    UserBufferActivate ()
    SayAll ()
EndScript
