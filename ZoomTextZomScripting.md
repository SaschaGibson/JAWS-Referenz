# ZoomText ZOM Scripting

ZoomText Scripting lets you customize the behavior of ZoomText. ZoomText
exposes the ZoomText Object Model (ZOM) to provide access to the
properties of ZoomText, as well as the data that ZoomText collects about
running applications, windows, controls, text on the screen, insertion
cursor, and more.

You can access the Object Model by any program that can communicate with
COM objects, including JAWS scripting. All ZoomText methods, properties,
and events are derived from the basic IZoomText interface. They are
documented in the ZoomText scripting documentation included with
installations of ZoomText and Fusion.

You can find the ZoomText scripting documentation at:\
C:\\Program Files\\Freedom
Scientific\\ZoomText\\(ZoomTextVersion)\\Scripting\\Reference\\index.html.\
You can retrieve an IZoomText interface in JAWS scripts by calling\
CreateObject(\"ZoomText.Application\")\

As of JAWS 2023, some basic functions are present in ZTUtil.JSS to help
with ZoomText scripting. The function, \"ZTGetZOM\" in ZTUtil.JSS
creates and returns the IZoomText interface object.

## Example

An example in DEFAULT.JSS of JAWS 2023 and later uses ZTUtil.JSS
functions to implement \"TetheredView\", a feature introduced in
ZoomText 2023 for the JAWS Links List dialog. In this example, the
function, \"ProcessZTTetheredViewFocusChange\", in DEFAULT.JSS is called
from \"ProcessEventOnFocusChangedEvent\". It is used to create,
show/update, and/or hide the TetheredViewScenario when navigating into
or out of the Links list view.

The function, \"ProcessZTTetheredViewItemChange\", in DEFAULT.JSS is
called from \"ActiveItemChangedEvent\", and is used to show/update or
hide the TetheredViewScenario when navigating the items within the Links
list view, as appropriate.
