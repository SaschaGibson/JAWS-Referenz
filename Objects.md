# Objects

The Freedom Scientific Scripting language supports working with objects,
and with attaching and detaching COM events to application pointers in
order to provide access to application user interfaces that may not be
user-friendly out of the box to assistive technology such as screen
readers. For the purpose of this topic, when referring to screen
readers, you may assume that other assistive technology products apply
to the discussion.

Microsoft Windows provides numerous tools you may utilize in order to
make COM objects accessible to screen readers. A brief overview appears
within this summary. Since this highly technical subject is far beyond
the scope of the Freedom Scientific Developer Network, a few reference
sources are listed at the end of this summary for your convenience. But
we assume that you have general knowledge of the terminology and
concepts of working with objects.

## MSAA

Microsoft Active Accessibility (MSAA) became part of the Microsoft
Developer\'s Kit in 1997. It has been included as a part of Windows
operating systems since that time, with numerous updates. but as of
Windows Vista, Microsoft introduced a more robust accessibility
component to serve a similar purpose. This is called User Interface
Automation (UIA). Newer applications tend to favor UIA over MSAA.

MSAA was developed to provide a programmatic communication mechanism for
products like screen readers, and Microsoft Windows and applications
that run on Windows operating systems. Basically, MSAA gives screen
readers the ability to provide information for Windows controls, and
thus gives you, the end user, the ability to interact with those
controls. The properties of controls are exposed to inform you about a
control\'s name, prompt, location on screen, type, value, state, etc. A
control\'s state reflects whether the control is selected, checked or
unchecked, enabled or disabled, expanded or collapsed, and so on.

An accessible object is represented by an IAccessible COM interface and
an integer ChildId, allowing applications to expose a tree hierarchy.
Each element of this tree structure exposes a set of properties and
methods for the object. Those properties and methods allow you to
manipulate the corresponding user interface element. MSAA clients can
access the programmatic user interface information through a standard
API.

The Freedom Scientific Scripting language supports MSAA and UIA with
over 70 functions. For a complete listing of objects, see the summary in
the screen reader\'sFunctions book of the [Reference
Guide.](Reference_Guide.html)

For more details on working with object-related event functions, see the
topics under Events in this General Scripting Concepts book called
[Object Model and MSAA
Events](Events/Object_Model_and_MSAA_Events.html)\
and\
[Object Model and MSAA Event
Helpers.](Events/Object_Model_and_MSAA_Event_Helpers.html)

## UIA

For the most part, since Windows Vista, Microsoft UI Automation has
replaced MSAA to support screen readers. Like MSAA, UI Automation is a
component of all operating systems, and it supports Windows Presentation
Foundation (WPF). Its purpose is to provide a programmatic means for
screen readers to expose information about the user interface, thus
allowing you, the end user, to interact with applications through
keyboard commands or other non-standard input devices.

The Freedom Scientific Scripting language provides a primary FSUIA
object which is accessible to the scripts via the CreateObject built-in
script function with the object ID "FreedomSci.UIA". The primary object
provides for creating of all other script API objects.

In touch.jss, you can see how UIA is used to implement gesture support
and the touch cursor. The scripts in default.jss use touch.jss functions
to implement the touch cursor support. The touch cursor is completely
implemented via scripts.

Office.jss and Outlook.jss have some functions where UIA is used to do
things which could not be accomplished via MSAA or Window structure.
TWinUITouch.jss (used by TwinUI) gives some support from UIA to the
scripts for the Windows 8 start screen. But do be careful not to confuse
it with the iAccessible object methods used in TwinUI. In JAWS 14,
iAccessible object methods were utilized in areas where they were needed
for Windows 8 support, and IAccessible objects are still in use in
several areas. Windows.ui.search.jss also has UIA to support the Windows
8 search for the Start screen. All of this is greatly enhanced and
updated for Windows 10 support and going forward.

Note: As of JAWS 16, some code may still be in use where the screen
reader detaches events from the UIA object before removing it. This is
no longer necessary. Simply nulling a UIA object (or the object going
out of scope because it is local) disposes of all events attached to it.
That is why all UIA objects used for attaching events are global.

Scripts for Microsoft Office use UIA to perform specific tasks rather
than as a large part of the scripting support. You can find functions in
the source (.JSS) files for MS Office where UIA is used by searching for
\"FreedomSci.UIA\". Also, the function, CreateUIAFocusElement, in
touch.jss illustrates how application scripts get a temporary UIA
object.

As of JAWS 18.0.xxx and JAWS 2018 and later, UIA.jss has a set of
functions which use a global FSUIA object and treewalker, available for
convenience and reduced overhead when all you need to do is a routine
UIA task such as get focus, parent, etc. As of JAWS 2018, two functions
have been added: FSUIAGetNextSiblingOfElement and
FSUIAGetPriorSiblingOfElement.

### Script API Object Interfaces

When describing the return values of UIA object methods, the term "true"
indicates an integer value of -1, and the term "false" indicates an
integer value of 0. The terms "Object", "Handle", and \"Int" refer to
the built-in Freedom Scientific script function types.

### Definitions

- Control - a component of the user interface with specific properties
  and potential interactions; for example: buttons, links, text, and so
  on.
- Object - an object as implemented by the Freedom Scientific script
  language.
- Method - a member function call, taking a set of parameters, which
  performs an operation on an object or returns requested data from it.
- Property - a data member of an object which can be used in assignment
  operations and dereferenced using the \".\" (dot) operator if the data
  member is itself an object.
- UIA condition - a UIA mechanism for determining which UIA elements
  match a given set of criteria. These are used to find elements in the
  UIA tree and can be used to customize the behavior of a UIA tree
  walker.
- UIA element - the UIA interface which provides properties and actions
  for a single control.
- UIA property - a piece of information about a UIA element such as its
  name or type.
- UIA tree - a hierarchical collection of UIA elements.
- UIA tree walker - a UIA provided mechanism for traversing a UIA tree.
  These can be customized using UIA conditions to include or exclude UIA
  elements with certain properties.

## Examining Objects on the Fly

1.  Turn on Script Utility Mode - Ins+Windows+NumpadMinus.
2.  Route to current window - F5.
3.  Press Alt+Ctrl+Windows+O to activate the object tree UIA browser.
4.  Now use the script utility mode keys normally used to navigate
    windows hierarchy. Instead, you will be navigating by objects.
5.  Press Alt+Ctrl+Windows+O again to turn off the object tree UIA
    browser, and press Ins+Windows+NumpadMinus to turn off Script
    Utility Mode.

You may also wish to write test scripts using the function
GetUIAObjectTree (hwnd) to get the top level object associated with the
window. Then use o.FindByKeyboardFocus(1) to get the item at the deepest
focus, not just the list box but the list item inside it.

All other methods and properties are detailed in the file,
HomeRowUIAObject.jss. Also, see SkypeWatch.jss for real-time usage of
accessing objects.

## Additional Resources

For a complete discussion of Objects, MSAA, UIA, and IAccessible
objects, see the topics in Freedom Scientific\'s own page and the
Microsoft Developer Network as follows:

- [JAWS UIA Script API
  Documentation](http://www2.freedomscientific.com/documentation/scripts/JAWS-UIAScriptAPI.asp)
- [COM Objects and COM
  Interfaces](http://msdn.microsoft.com/en-us/library/windows/desktop/ee684009.aspx)
- [Microsoft Active
  Accessibility](http://msdn.microsoft.com/en-us/library/ms971310.aspx)
- [UIA
  Automation](http://msdn.microsoft.com/en-us/library/ms747327.aspx)
- [UI Automation
  API](http://msdn.microsoft.com/en-us/library/windows/desktop/ee684009.aspx)
- [IAccessible
  Interface](http://msdn.microsoft.com/en-us/library/windows/desktop/dd318466(v=vs.85).aspx)
