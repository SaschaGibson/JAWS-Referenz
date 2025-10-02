Hier bekommst du ein Beispiel, wie du in JAWS-Skripting nach FSDN-Standard einen Button „OK“ auf einer Webseite mit dem virtuellen Cursor per UIA oder MSAA suchst und aktivierst – ohne Hilfsfunktionen dazwischen, sondern direkt mit den FSDN-Objektfunktionen.

UIA- und MSAA-Objektzugriff im JAWS-Skript
1. UIA-Objekt unter dem virtuellen Cursor holen und aktivieren
fs
var
  oUIA

let oUIA = GetObjectAtPoint()
if oUIA && oUIA.Invoke then
  oUIA.Invoke()
else
  SayString("Kein unterstütztes UIA-Objekt unter dem Cursor.")
endIf
Erläuterung:

GetObjectAtPoint() gibt das UIA- oder MSAA-Objekt unter dem virtuellen Cursor zurück.
Die Methode Invoke() ist laut FSDN bei UIA-Objekten vorhanden, wenn das Element ein Invokable (wie ein Button) ist.
Du prüfst, ob die Methode existiert, und rufst sie dann auf.
2. MSAA-Objekt unter dem virtuellen Cursor holen und aktivieren
fs
var
  oMSAA

let oMSAA = GetObjectAtPoint()
if oMSAA && oMSAA.DoDefaultAction then
  oMSAA.DoDefaultAction()
else
  SayString("Kein unterstütztes MSAA-Objekt unter dem Cursor.")
endIf
Erläuterung:

Auch bei MSAA-Objekten bekommst du das Objekt mit GetObjectAtPoint().
Für viele klassische Controls (Buttons etc.) gibt es die Methode DoDefaultAction(), die dann einen Klick simuliert.
Handlungsempfehlung
Für moderne Webseiten ist in der Regel UIA bevorzugt (JAWS verwendet intern oft UIA für Webinhalte, kann aber auch auf MSAA zurückfallen).
Du kannst beide Methoden kombinieren, falls du nicht weißt, ob die Seite UIA oder MSAA verwendet:
fs
var
  oObj

let oObj = GetObjectAtPoint()
if oObj then
  if oObj.Invoke then
    oObj.Invoke()
  elseif oObj.DoDefaultAction then
    oObj.DoDefaultAction()
  else
    SayString("Objekt nicht klickbar.")
  endIf
else
  SayString("Kein Objekt erkannt.")
endIf
Wichtig:
GetObjectAtPoint() ist die FSDN-Funktion, mit der du an das aktuelle Objekt unter dem virtuellen Cursor kommst.
Invoke() und DoDefaultAction() sind die offiziellen FSDN-Methoden für UIA- bzw. MSAA-Objekte.
Wenn du die Zeile mit "OK" vorher gezielt ansteuern willst, musst du das wie bisher beschrieben mit einer Schleife und SetLine(n) machen, bevor du GetObjectAtPoint() verwendest!

