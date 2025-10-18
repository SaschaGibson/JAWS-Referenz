Unser Regelwerk für das JAWS-Scripting-Projekt (Version 5.0 - Final)
Block 1: Grundlegende Zusammenarbeit & Wissensbasis
Regel #1: Initialisierung der Arbeitsumgebung

Zu Beginn jeder neuen Session oder wenn eine Aktualisierung der Wissensbasis nötig ist, verwenden wir den Satz: "Hallo, wir setzen unser JAWS-Scripting-Projekt fort. Aktualisiere deine Wissensbasis aus dem GitHub-Repository." Daraufhin werde ich automatisch das jaws-referenz GitHub-Repository neu laden.

Regel #2: Umfang und aktive Nutzung der Wissensbasis (Das "Lehrbuch-Prinzip")

Die Wissensbasis für unser Projekt umfasst alle Dokumente im jaws-referenz GitHub-Repository und stellt die einzige Quelle der Wahrheit dar.

Diese Dateien sind als Lehrbücher voller funktionierender Code-Beispiele zu betrachten. Anstatt Funktionen nur nachzuschlagen, muss ich proaktiv prüfen, wie eine Funktion oder ein Programmier-Muster in den Referenzdokumenten tatsächlich in einem funktionierenden Kontext verwendet wird.

Besonderes Augenmerk liegt auf den folgenden Dokumenten, die existentielles Grundwissen enthalten:

Kern-Skripte: default.jss, chrome.jss, SharePointWeb.jss, WebInspectorXML.jss, outlook.jss, HomeRowXMLDom.jss, FSXMLDomFunctions.JSS, IA2Browser.jss

Dokumentationen: Alle *.md-Dateien, JAWS UIA Script API Documentation.mhtml, JAWS-ARIA-Support.doc

Fundamentals: Die in der Datei fundamentals.txt aufgelisteten Dokumente, die weitere grundlegende Konzepte der JAWS-Skriptsprache erläutern.

Externe Quellen: Die in der Datei externe_Quellen_Zusatz.md kuratierte Sammlung von externen Web-Ressourcen und Tutorials.

Protokoll: Google Gemini.mhtml (als Dokumentation bereits gelöster Probleme)

Konstanten-Bibliotheken (.jsh - "Die Wörterbücher"): MSAAConst.jsh, IAccessible2.jsh, UIA.jsh, HJConst.JSH, jfw.JSH, WinStyles.jsh, XMLDom.jsh, rundll32.jsh. Diese Dateien sind entscheidend, um die von Funktionen und Objekteigenschaften zurückgegebenen Integer-Werte zu interpretieren. Je nach Anwendungsfall können auch weitere .jsh-Dateien relevant werden.

Block 2: Code-Erstellung & Syntax
Regel #3: Die default.jss-Sonderbehandlung

Allgemeiner Grundsatz: Jede von uns erstellte .jss-Datei (außer default.jss) muss die Compiler-Direktiven ScriptFileVersion und ScriptFile enthalten.

Sonderfall default.jss: Wenn wir eine benutzerdefinierte default.jss erstellen, gelten zwei zwingende Ausnahmen, um eine "katastrophale Fehlfunktion" von JAWS zu verhindern:

Die Direktiven ScriptFileVersion und ScriptFile werden weggelassen.

Als eine der ersten Anweisungen in der Datei muss die Use "default.jsb"-Anweisung enthalten sein, um die originalen JAWS-Standardskripte nachzuladen.

Regel #4: Freedom Scientific Scripting Standards (Grundgesetz der Syntax)

Dieser Regelblock fasst die offiziellen Freedom Scientific Scripting Standards zusammen und dient als übergeordnete maßgebliche Richtlinie für alle folgenden Syntax-Regeln und Best Practice-Ansätze. Er adressiert die Struktur von Skript-Dateien (.jsh, .jsm, .jss), die Benennung von Variablen, den Umgang mit Sprach- und Brailleausgabe und vieles mehr. Die umfangreichen und verbindlichen Regeln stehen in der jeweils aktuell gültigen Version im Github-Repository in der deutschen Übersetzung unter "Freedom Scientific Scripting Standards_deutsch.md" sowie im englischen Original unter "FS_Scripting_Standards.md" detailliert beschrieben zur Verfügung. Sie müssen stets in der aktuell gültigen Version geladen, analysiert und angewendet werden, um regelkonforme Skripte erstellen zu können.

Regel #5: Verbindliche Syntax der Variablendeklaration (Präzisierung zu Regel #4)

In jeder Funktion oder jedem Skript müssen zuerst alle lokalen Variablen deklariert werden, bevor der ausführbare Code beginnt.

Abweichend von der allgemeinen Empfehlung in den "Freedom Scientific Scripting Standards" (Regel #4), die eine Block-Deklaration erlaubt, ist zur Vermeidung von Compiler-Fehlern die folgende, strengere Syntax für uns verbindlich:

Es wird nur eine Variable pro Zeile deklariert.

Jede dieser Zeilen muss mit ihrem eigenen var-Schlüsselwort beginnen.

Regel #6: Sichere String-Formatierung vor Funktionsaufrufen

Wir vermeiden die Verkettung von Strings mit dem +-Operator direkt innerhalb von Funktionsaufrufen. Die verbindliche Methode ist, komplexe Ausgabestrings immer zuerst in einer separaten string-Variable mit der Funktion FormatString() zu erstellen.

Regel #7: Verbindliche Standard-Includes

Grundsatz: Jede von uns erstellte .jss-Datei muss zu Beginn die drei Standard-Header-Dateien in der folgenden Reihenfolge einbinden, um den Zugriff auf globale Konstanten und Funktionen zu gewährleisten:

Code-Snippet

Include "HJConst.JSH"
Include "HJGlobal.JSH"
Include "common.jsm"
Erweiterung: Weitere Include- oder Use-Anweisungen (wie z.B. Use "UIA.jsb" gemäß Regel #8) sind nur bei Bedarf hinzuzufügen und folgen nach diesem Standard-Block.

Regel #8: Verbindlicher Umgang mit externen Bibliotheken (z.B. Use "UIA.jsb")

Wenn wir externe Bibliotheken verwenden, gilt die strikte Verifizierungspflicht. Wir müssen die genaue Funktionsdefinition (Syntax, Parameter, Rückgabetyp) und die Art des Aufrufs (eigenständige Funktion vs. Objektmethode) anhand der offiziellen Dokumentation der Bibliothek (z.B. JAWS UIA Script API Documentation.mhtml) oder durch Analyse von funktionierendem Code in unseren "Lehrbüchern" (gemäß Regel #2) überprüfen. Jede darüber hinausgehende Annahme oder Vermutung ist gem. Regel #10 unzulässig.

Regel #9: Kontextbezogene Code-Struktur (Script vs. Function)

Code-Logik muss immer an ihren Kontext angepasst werden. Ein Script, das durch eine Tastenkombination ausgelöst wird, dient primär der Ausführung von Aktionen. Eine Function dient primär der Berechnung und Rückgabe eines Wertes (return). Wir werden Code nicht blind zwischen diesen beiden Blöcken kopieren, ohne die Struktur und den Zweck umfassend zu validieren.

Block 3: Lektionen & Kernprinzipien
Regel #10: Das strikte Annahmeverbot ("JAWS ist anders"-Direktive)

Grundsatz: JAWS-Scripting ist eine hochspezialisierte Sprache mit eigenen, oft von modernen Standards abweichenden Regeln. Jede Annahme, die auf Wissen aus anderen Programmiersprachen (wie C, Java, JavaScript etc.) basiert, ist grundsätzlich als falsch und gefährlich anzusehen, bis das Gegenteil bewiesen ist.

Konkrete Verbote: Das Annahmeverbot gilt ausnahmslos für:

Syntax: Kontrollstrukturen (z.B. die while-Schleife), Schlüsselwörter (z.B. break, wend) und Operatoren.

Funktionssignaturen: Die Anzahl, Reihenfolge und Datentypen von Parametern (z.B. StringContains, SayString).

Funktions-Existenz: Die Verfügbarkeit von Funktionen (z.B. die DOM...-Funktionen).

Einziger Ausweg: Der einzige Weg, eine Annahme zu validieren und sie in Wissen umzuwandeln, ist die rigorose und ausnahmslose Anwendung des dreistufigen Verifizierungs-Protokolls aus Regel #12. Eine Code-Struktur oder Funktion, die nicht durch dieses Protokoll anhand unserer "Lehrbücher" (Regel #2) validiert wurde, darf unter keinen Umständen verwendet werden.

Regel #11: Das Prinzip des direkten Objektzugriffs (MSAA & Handles)

Grundsatz: Um mit den Eigenschaften eines UI-Elements zu interagieren (z.B. seinen Namen, seine Rolle, seinen Wert abzufragen), benötigen wir ein object. Handles (int) allein sind dafür nicht ausreichend.

Verbindlicher Lösungsweg: Der primäre, verifizierte Weg, ein solches object zu erhalten, führt über Built-In-Funktionen, die direkt ein MSAA-Objekt zurückgeben. Die wichtigsten dieser Funktionen sind:

GetAccessibleObjectFromEvent(...): Holt das Objekt, das ein bestimmtes Ereignis ausgelöst hat.

GetAccessibleObjectFromWindow(...): Holt das Objekt, das zu einem bestimmten Fenster-Handle (hwnd) gehört.

Verifizierungspflicht: Bevor auf ein Objekt zugegriffen wird, muss der Code-Pfad zur Erzeugung dieses Objekts anhand unserer "Lehrbuch"-Skripte (gemäß Regel #2) verifiziert werden.

Block 4: Qualitätssicherung & Ergebnis-Präsentation
Regel #12: Das dreistufige Verifizierungs-Protokoll vor jeder Code-Ausgabe

Bevor ich einen neuen oder überarbeiteten Code poste – ausnahmslos und jedes Mal – muss ich ein internes, dreistufiges Protokoll abarbeiten. Das Ergebnis dieser Prüfung wird in der "Verifizierungs-Checkliste" (gemäß Regel #13) dokumentiert.

Stufe 1: Fundamentale Validierung (Die "Ist es echt?"-Prüfung)

Für jede einzelne Funktion, jeden Befehl und jede Konstante im Code muss ich ihre Herkunft und Existenz verbindlich und ausschließlich anhand der in Regel #2 definierten "Quellen der Wahrheit" (unsere "Lehrbücher") verifizieren.

Annahmeverbot: Wenn eine Funktion in den gemäß Regel #2 relevanten Quellen nicht gefunden wird, existiert sie für mich nicht und darf nicht verwendet werden. Dies hat absolute Priorität vor allen anderen Prüfungen.

Stufe 2: Syntaktische Detailprüfung (Die "Passen die Teile zusammen?"-Prüfung)

Funktionssignaturen: Für jede Funktion aus Stufe 1 muss ich die Anzahl, Reihenfolge und den Datentyp der übergebenen Parameter exakt mit der Dokumentation abgleichen.

Rückgabewerte: Ich muss den Datentyp der Variable, die den Rückgabewert einer Funktion empfängt, exakt mit dem dokumentierten Rückgabewert abgleichen (besondere Beachtung von int vs. object).

Kontrollstrukturen: Die Syntax von Schleifen (while-EndWhile), Bedingungen (if-Else-EndIf) und anderen Schlüsselwörtern (return) muss exakt der Syntax in der Control_Flow.md entsprechen.

Stufe 3: Kontextuelle Überprüfung (Die "Funktioniert es so in der Praxis?"-Prüfung)

Nach Abschluss von Stufe 1 und 2 muss ich, wann immer möglich, die geplante Code-Struktur (insbesondere bei komplexen Funktionsketten) mit einem funktionierenden Beispiel aus den "Lehrbuch"-Skripten (gemäß Regel #2) vergleichen. Findet sich dort ein abweichendes Muster, hat das Muster aus dem Lehrbuch Vorrang.

Regel #13: Das explizite Verifizierungs-Mandat

Vor jeder Ausgabe eines Code-Blocks, egal ob neu oder korrigiert, muss ich eine kurze, stichpunktartige "Verifizierungs-Checkliste" voranstellen. In dieser Liste muss ich explizit bestätigen, wie ich die wichtigsten Fehlerquellen (insbesondere Regel #12 und #10) geprüft habe, und dabei die konkrete Referenz aus Ihrer Wissensbasis benennen.

Regel #14: Vollständige Code-Ausgabe

Nach einem Code-Review oder einer Änderungsanforderung werde ich immer den gesamten, modifizierten Quellcode in einem einzigen Code-Block ausgeben.

Block 5: Projektspezifische Konventionen & Standards
Regel #15: Präfix für Dateinamen

Jede von uns neu erstellte Skript-Datei (.jss, .jsh, .jsm) muss mit dem Präfix BETA_ beginnen.

Beispiel: BETA_KOSmobil.jss

Begründung: Stellt die Einzigartigkeit unserer Dateien im JAWS-System sicher.

Regel #16: Präfix für Skripte und Funktionen

Jeder Name eines von uns erstellten Script oder einer Function muss mit dem Präfix BETA_ beginnen.

Beispiel: Script BETA_ListHiddenHeadings()

Begründung: Verhindert Namenskonflikte mit den Built-In-Funktionen von JAWS.

Regel #17: Namenskonvention für Variablen

Jede von uns definierte Variable folgt einer erweiterten Namenskonvention, die den FS-Standard (Regel #4) mit unserem Projekt-Präfix kombiniert. Die Struktur lautet: [Scope][Typ]BETA_[VariablenName]

[Scope] (optional): g für globale Variablen.

[Typ]: s für String, i für Integer, h für Handle, o für Object.

Beispiele:

var int hBETA_AppWindow (Lokales Handle)

var string sBETA_UserName (Lokaler String)

var object gBETA_UIAElement (Globales Objekt)

Begründung: Maximale Klarheit über Gültigkeitsbereich, Datentyp und Herkunft der Variable auf einen Blick.

Regel #18: Namenskonvention für JSM-Konstanten

Konstanten, die in .jsm-Dateien für Nachrichten oder Vergleiche definiert werden, folgen ebenfalls der Präfix-Regel.

Beispiele:

msgBETA_NoHeadingsFound (für eine Sprachausgabe)

scBETA_DialogTitle (für einen String-Vergleich)

Begründung: Sorgt für Konsistenz und vermeidet Konflikte in den Nachrichtendateien.

Regel #19: Dokumentation und Kommentierung des Quellcodes

Datei-Header: Jede von uns erstellte Datei (.jss, .jsh, .jsm) muss zu Beginn einen Header-Kommentarblock enthalten. Dieser dokumentiert mindestens den Dateinamen, den Zweck der Datei und die aktuelle Version. Die Versionierung folgt dem semantischen Format Hauptversion.Nebenversion.Patch (z.B. 1.0.0).

Dokumentation von Abhängigkeiten (ConfigNames.ini): Wenn eine Skript-Datei einen zugehörigen Eintrag in der ConfigNames.ini erfordert (gemäß Regel #20), muss diese Einrichtungsanweisung im Datei-Header dokumentiert werden.

```jss
;------------------------------------------------------------------------------
; Wichtiger Hinweis zur Konfiguration:
; Damit dieses Skript von JAWS geladen wird, muss in der
; ConfigNames.ini des Benutzers folgender Eintrag hinzugefügt werden:
;
; [ConfigNames]
; BETA_AppName=appname.exe
;------------------------------------------------------------------------------
```
Inline-Kommentare: Der Quellcode ist durch Kommentare so zu dokumentieren, dass auch "Nicht-Profis" die Logik nachvollziehen können. Im Zweifel ist eher mehr als zu wenig zu kommentieren.

Sprache der Kommentare: Abweichend von den allgemeinen "Freedom Scientific Scripting Standards" (Regel #4) ist die Kommentierung für unser Projekt verbindlich in deutscher Sprache vorzunehmen.

Kommentar-Zeichen: Für Kommentare wird ausschließlich das Semikolon (;) verwendet.

Regel #20: Integration via ConfigNames.ini

Für jede Anwendung, für die wir ein benutzerdefiniertes Skript-Set mit unserem BETA_-Präfix erstellen (z.B. BETA_AppName.jss), muss ein entsprechender Eintrag in der ConfigNames.ini im Benutzerverzeichnis vorgenommen werden. Dieser Eintrag verknüpft unseren neuen Skript-Namen (BETA_AppName) mit dem Namen der ausführbaren Datei der Anwendung (appname.exe).

Ich hoffe, diese finale Fassung ist vollständig und korrekt. Starten Sie einen neuen Chat, und wir machen genau hier weiter. Ich danke Ihnen für Ihre Geduld und die unglaublich produktive Zusammenarbeit bei der Erstellung dieses "Grundgesetzes".