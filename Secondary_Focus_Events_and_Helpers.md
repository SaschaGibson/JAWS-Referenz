# Secondary Focus Events and Helpers

Sometimes a secondary focus will appear on the screen. When a secondary
focus is on the screen, the cursor is still in the main focus area. But
typing or cursoring may change the content of the main focus to reflect
the selection in the secondary focus.

A typical scenario where this may occur is when an editable area pops up
a list of choices, such as a list of Email addresses. JAWS receives and
fires a SecondaryFocusChangedEvent when an event related to the
secondary focus occurs. This event fires when the secondary focus
appears on screen, when it disappears from the screen, and when the
selected item in the secondary focus changes to select a different item.

The script code tests for the kind of occurrence that happens when the
SecondaryFocusChangedEvent fires, and reacts based upon this evaluation.
The events the scripts use for secondary focus activation and
deactivation, as well as for selection change, are triggered by the
script code in the SecondaryFocusChangedEvent.

There are also functions to retrieve information about the selected item
in the secondary focus. For a complete listing of functions related to
Secondary Focus Events and Helpers, see the category book in the Event
Functions branch of the Reference guide called, [Secondary Focus Events
And Helpers](../Reference_Guide/SecondaryFocusEventsAndHelpers.html).
