It looks like you're interested in "JAWS script." To clarify, JAWS (Job Access With Speech) is a popular screen reader for Windows, and "JAWS scripting" refers to writing scripts (with the .jss extension) to customize or extend how JAWS interacts with specific applications.

JAWS scripts are written in a proprietary language similar to JavaScript or C. These scripts allow developers to:

Enhance accessibility for custom or complex applications.
Provide spoken information or Braille output that would not be available otherwise.
Remap keyboard shortcuts for easier navigation.
Example: A Simple JAWS Script
Below is a basic example of a JAWS script that speaks "Hello, world!" when the user presses Insert+Ctrl+H:


hello_world.jss
Script HelloWorld ()
    SayString ("Hello, world!")
EndScript

; Map key: Insert+Ctrl+H
KeyMap INS+CTRL+H, HelloWorld
How to use:

Save the script as hello_world.jss in your JAWS user scripts folder for your application or globally.
Compile the script using the JAWS Script Manager.
Press Insert+Ctrl+H in JAWS to hear "Hello, world!"
If you need a JAWS script for a specific application or functionality, please provide more details about what you want the script to do, and I can help you write a custom script!

You said: Ich möchte auf Objekte und deren Methoden
Ich möchte auf Objekte und deren Methoden mit JAWS-Scripting zugreifen. Wie mache ich das?
Copilot said: Um mit JAWS-Scripting (in der Regel mit
Um mit JAWS-Scripting (in der Regel mit der Sprache FS (Freedom Scientific Script)) auf Objekte und deren Methoden zuzugreifen, nutzt man typischerweise die Object Navigation und die COM-Objektintegration von JAWS. Hier ein Überblick, wie du vorgehen kannst:

1. Zugriff auf COM-Objekte
Mit CreateObject kannst du COM-Objekte instanziieren und deren Methoden/Eigenschaften verwenden, z. B.:

fs
var
  oFSO
let oFSO = CreateObject("Scripting.FileSystemObject")
SayString(oFSO.GetAbsolutePathName("C:\"))
2. Zugriff auf UI-Elemente (UIA-Objekte)
Für UI Automation-Objekte nutzt du Funktionen wie GetObjectFromPoint, GetObjectAtFocus, etc. Beispiel:

fs
var
  oUIA
let oUIA = GetObjectAtFocus()
SayString(oUIA.Name)
Du kannst dann Methoden wie .Name, .Value, .Navigate, usw. verwenden.

3. Methoden und Eigenschaften aufrufen
Um Methoden/Eigenschaften eines Objekts zu nutzen, rufst du sie wie folgt auf:

fs
SayString(oFSO.DriveExists("C:\"))
Oder für UIA-Objekte:

fs
SayString(oUIA.ControlType)
4. Objektinformation herausfinden
Um alle verfügbaren Methoden und Eigenschaften zu sehen, kannst du in der JAWS-Skriptdokumentation nach dem jeweiligen Objekt suchen oder das Objekt im Skript debuggen (z. B. mit Inspect-Tools).

Beispiel: Alle Fenster auflisten (Win32 API via COM)
fs
var
  oShell, oWindows, i, oWin
let oShell = CreateObject("Shell.Application")
let oWindows = oShell.Windows()
for i = 0 to oWindows.Count - 1
  let oWin = oWindows.Item(i)
  SayString(oWin.FullName)
endFor
Wichtige Hinweise:

JAWS-Skripte haben keinen vollständigen Zugriff auf .NET-Objekte, sondern hauptsächlich auf COM-Objekte.
Für UIA-Objekte stehen nur die von JAWS bereitgestellten Methoden/Eigenschaften zur Verfügung.
Dokumentation:
JAWS Scripting Basics (Freedom Scientific)
FS Scripting Reference
Wenn du ein konkretes Objekt oder eine Anwendung im Sinn hast, kann ich dir ein spezifisches Beispiel geben!

You said: Meine Fragen sind im Moment noch fundamentaler:
Meine Fragen sind im Moment noch fundamentaler: Ich stolpere immere wieder über die Transformation/Brücke handle/int/object in der JAWS-Philosophie ... kannst du dazu was genaueres sagen??
Copilot said: Sehr gerne! Die Begriffe **handle**, **int** und
Sehr gerne! Die Begriffe handle, int und object sind im JAWS-Scripting tatsächlich zentral für das Verständnis, wie JAWS intern auf Windows-Objekte und -Elemente zugreift. Ich erkläre die Begriffe und die "Brücken/Transformationen" zwischen ihnen im Kontext von JAWS-Skripting:

1. Handle
Ein Handle ist in Windows-Programmierung ein Referenzwert (meist ein Integer), der auf ein Betriebssystem-Objekt (z. B. Fenster, Menü, Datei) verweist.
In JAWS-Skripten taucht der Handle häufig als Rückgabewert von Funktionen wie GetWindowHandle() oder als Übergabeparameter für Fensteroperationen auf.
Beispiel:

fs
var
  hWnd
let hWnd = GetWindowHandle()
2. int
int bezeichnet einen ganzzahligen Wert (Integer).
Viele Windows-Handles werden als Integer gespeichert, sind aber eigentlich "undurchsichtige" Referenzen (engl. "opaque handles").
In JAWS kann ein Handle einfach als int gespeichert werden, verliert dabei aber seine Typinformationen.
3. object
Ein object im JAWS-Skripting ist eine Instanz eines Objektes, z. B. ein UI Automation-Objekt, ein COM-Objekt oder ein spezielles JAWS-Objekt.
Methoden wie GetObjectFromWindowHandle(int h) oder GetObjectAtPoint() liefern dir ein "object", das du dann weiter untersuchen kannst.
Transformation/Brücke zwischen handle, int und object
Typische Flows:
a) Von handle (int) zu object
Das ist die häufigste Transformation in JAWS:
Du bekommst einen Fensterhandle (int) z. B. von GetWindowHandle()
Dann wandelst du ihn in ein JAWS/FS-Objekt um, z. B. mit GetObjectFromWindowHandle(hWnd)
Beispiel:

fs
var
  hWnd, oObj
let hWnd = GetWindowHandle()
let oObj = GetObjectFromWindowHandle(hWnd) ; jetzt kannst du auf Methoden/Eigenschaften zugreifen
b) Von object zu handle (int)
Manche Objektmethoden bieten eine Eigenschaft oder Methode, die dir den zugehörigen Handle liefert, z. B. oObj.WindowHandle
Dann bekommst du wieder einen int/Handle, den du für Windows-API-Aufrufe nutzen kannst.
Beispiel:

fs
var
  oObj, hWnd
let oObj = GetObjectAtFocus()
let hWnd = oObj.WindowHandle
c) Direkte Nutzung von int als handle
In vielen Fällen werden Handles als int durchgereicht, etwa bei API-Aufrufen oder in Schleifen über Fensterhierarchien.
JAWS-"Philosophie" dazu
Handles (int) sind "primitive" Zugangspunkte zum Windows-System.
Objects bieten eine "intelligentere" und objektorientierte Sicht auf Elemente – mit Methoden und Eigenschaften.
Die Transformation vom handle zum object ist der Schlüssel, um von der reinen Identifikation zum "Begreifen" und "Manipulieren" des Elements zu kommen.
JAWS-Skripting stellt dafür Brückenfunktionen bereit, etwa:
GetObjectFromWindowHandle(handle) (handle → object)
object.WindowHandle (object → handle)
Zusammenfassung
handle = Windows-Objektreferenz (int)
int = Ganzzahl, in JAWS oft synonym für handle
object = JAWS-Objekt, mit Methoden/Eigenschaften
Brücken:
handle (int) → object: GetObjectFromWindowHandle()
object → handle (int): object.WindowHandle