# Secondary Focus Events and Helpers

A secondary focus occurs when an area of an application has focus, but a
second area of the application also has focus\--such as a list of
suggestions related to the primary focus item. This second focus area is
called the secondary focus.

The secondary focus typically contains multiple items, and you can
navigate through the items in the secondary focus while it is visible on
the screen. The function, SecondaryFocusChangedEvent, fires when a
secondary focus becomes active, inactive, or when selection changes from
item to item in the secondary focus. This function is responsible for
calling the SecondaryFocusActivatedEvent or
SecondaryFocusDeactivatedEvent when the secondary focus become active or
inactive, since these two are actually event helper functions rather
than true event functions. The SecondaryFocusChangedEvent function is
also responsible for handling any speeking that should occur as a result
of the selection changing.

For a complete listing of secondary Focus Event and Helper functions,
see the topics in this category book of the Reference Guide.
