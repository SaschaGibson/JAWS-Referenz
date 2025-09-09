# Events

Microsoft Windows is constantly processing events. There are many types,
not all of which are necessary for screen readers to utilize. But
without the ability to identify which events are running and what their
output is, screen readers could not function at all.

The Freedom Scientific Scripting language supports many event functions.
In other words, JAWS must be able to tap into what events are doing in
order to decide whether to pass or suppress information to synthesizers
and Braille displays.

Often, there are timing issues to consider when working with event
functions. For example, there may be timing issues when windows are
created and destroyed as applications gain and lose focus or open and
close (focus change events). there may be timing issues when popup
information interrupts while JAWS is speaking and displaying something
(e.g., new text event). another example is the ZoomText scripting
functionality introduced for 2023, which includes secondary focus events
and helpers.

In addition, JAWS may suppress an event from firing at all unless a
setting is enabled. By default, there are many events whose settings
appear as disabled in the JAWS Settings Center user interface. Notifying
you about mouse cursor shape changes is one example of such an event. If
you enable any setting associated with an event, JAWS detects the firing
of the event by processing the default and/or application-specific
script configuration (.jcf) file. When the event is detected, the
related event functions in the associated script binary files fire and
determine what to speak and display in Braille.

The technical discussion of how the Windows operating system processes
events is beyond the scope of the Freedom Scientific Developer Network.
But you may find complete information on working with Windows events at
the Microsoft Developer Network for [Microsoft Windows
Events.](http://msdn.microsoft.com/en-us/library/windows/desktop/aa964766(v=vs.85).aspx)

For diagnostic purposes only, you may use an event trace hook type when
adding and removing a hook. When a hook of type event trace is in place,
it is called before every script event is run. An event trace hook
receives as parameters The path and name of the script binary (.jsb)
file that runs the event, the name of the event that runs, and any
parameters received by that event. But an event trace hook does not
prevent script events from running.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

The Scripting language utilizes many event functions in the default
script source file (.jss) as well as in many other script source files.
The categories of event functions and their helper event functions
include:

- [Application Info Events](Events/Application_Info_Events.html)
- [Clipboard Events](Events/Clipboard_Events.html)
- [Connection Events](Events/Connection_Events.html)
- [Cursors Events](Events/Cursors_Events.html)
- [Cursors Event Helpers](Events/Cursors_Event_Helpers.html)
- [Dialogs Events](Events/Dialogs_Events.html)
- [Help Events](Events/Help_Events.html)
- [HTML Events](Events/HTML_Events.html)
- [HTML Event Helpers](Events/HTML_Event_Helpers.html)
- [Keyboard Events](Events/Keyboard_Events.html)
- [Keyboard Event Helpers](Events/Keyboard_Event_Helpers.html)
- [Menus Events](Events/Menus_Events.html)
- [Menus Event Helpers](Events/Menus_Event_Helpers.html)
- [Mouse Events](Events/Mouse_Events.html)
- [Mouse Speech Events](Events/Mouse_Speech_Events.html)
- [Object Model And MSAA
  Events](Events/Object_Model_and_MSAA_Events.html)
- [Object Model and MSAA Event
  Helpers](Events/Object_Model_and_MSAA_Event_Helpers.html)
- [Optical Character Recognition
  Events](Events/Optical_Character_Recognition_Events.html)
- [SayAll Events](Events/SayAll_Events.html)
- [Screen Text Events](Events/Screen_Text_Events.html)
- [Screen Text Event Helpers](Events/Screen_Text_Event_Helpers.html)
- [Scripts Events](Events/Scripts_Events.html)
- [Secondary Focus Events and
  Helpers](Events/Secondary_Focus_Events_and_Helpers.html)
- [Selection Events](Events/Selection_Events.html)
- [Selection Event Helpers](Events/Selection_Event_Helpers.html)
- [Settings Events](Events/Settings_Events.html)
- [Window Events](Events/Window_Events.html)
- [Window Event Helpers](Events/Window_Event_Helpers.html)
