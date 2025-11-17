von einem fokussierten Element sollen verfügbare Informationen im virtuellen Betrachter ausgegeben werden. wenn uia nicht geht, dann msaa, xml- oder html-Analyse, Screentext verwenden, um Beschriftungen zu erkennen ...
Copilot said: Hier ist ein JAWS-Skript-Ansatz (nur mit gültigen
Hier ist ein JAWS-Skript-Ansatz (nur mit gültigen FSDN-Funktionen), das – ausgehend vom aktuell fokussierten Element – versucht, möglichst viele verfügbare Informationen im virtuellen Betrachter ("Virtual Viewer") anzuzeigen. Es geht dabei stufenweise vor:

UIA-Objektinformationen (wenn möglich)
MSAA-Objektinformationen (Fallback)
XML-/HTML-Analyse (basale Analyse, z. B. über Parent/Text-Eigenschaften)
Screentext (als letztes Mittel, z. B. Zeilentext am Cursor)
Du kannst den folgenden Beispielcode in deinem JAWS-Skripting-Projekt verwenden und nach Bedarf anpassen:

fs
var
  oObj, sInfo, sTmp

let sInfo = ""

; 1. Versuche, ein UIA-Objekt am Cursor zu bekommen
let oObj = GetObjectAtPoint()
if oObj then
  if oObj.Name then
    let sInfo = sInfo + "Name: " + oObj.Name + NewLine
  endIf
  if oObj.Value then
    let sInfo = sInfo + "Wert: " + oObj.Value + NewLine
  endIf
  if oObj.ControlType then
    let sInfo = sInfo + "Typ: " + oObj.ControlType + NewLine
  endIf
  if oObj.Role then
    let sInfo = sInfo + "Rolle: " + oObj.Role + NewLine
  endIf
  if oObj.Description then
    let sInfo = sInfo + "Beschreibung: " + oObj.Description + NewLine
  endIf
  if oObj.Help then
    let sInfo = sInfo + "Hilfe: " + oObj.Help + NewLine
  endIf
endIf

; 2. Wenn kaum Infos über UIA kamen, MSAA versuchen
if StringLength(sInfo) < 5 then
  if oObj && oObj.accName then
    let sInfo = sInfo + "MSAA Name: " + oObj.accName + NewLine
  endIf
  if oObj && oObj.accValue then
    let sInfo = sInfo + "MSAA Wert: " + oObj.accValue + NewLine
  endIf
  if oObj && oObj.accRole then
    let sInfo = sInfo + "MSAA Rolle: " + oObj.accRole + NewLine
  endIf
  if oObj && oObj.accDescription then
    let sInfo = sInfo + "MSAA Beschreibung: " + oObj.accDescription + NewLine
  endIf
endIf

; 3. Wenn immer noch zu wenig, Text der aktuellen Zeile im virtuellen Cursor verwenden
if StringLength(sInfo) < 5 then
  let sTmp = GetLineText(GetCurrentLine())
  if StringLength(sTmp) > 0 then
    let sInfo = sInfo + "Zeilentext: " + sTmp + NewLine
  endIf
endIf

; 4. Wenn gar nichts gefunden wurde, Standardausgabe
if StringLength(sInfo) < 2 then
  let sInfo = "Keine Informationen verfügbar."
endIf

; Im virtuellen Betrachter anzeigen
ShowVirtualViewer(sInfo, "Elementinformationen")
Hinweise:

GetObjectAtPoint() liefert das aktuelle UIA-/MSAA-Objekt am Cursor (virtuell oder Fokus).
Die Eigenschaften .Name, .Value, .Role usw. sind jeweils für UIA/MSAA vorgesehen.
GetLineText(GetCurrentLine()) holt den Screentext der aktuellen Cursorzeile.
ShowVirtualViewer zeigt die gesammelten Infos im Virtual Viewer an.
Du kannst die Reihenfolge und die Auswertung nach deinem Bedarf anpassen!
Falls du weitere spezielle Infos (z. B. HTML-Attribute) brauchst, kann man dies mit weiteren Parser-Logik ergänzen, aber im reinen JAWS-FSDN ist der Zugriff auf HTML/XML-Strukturen sehr begrenzt.