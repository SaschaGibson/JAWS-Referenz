# Virtual Viewer Functions

A Virtual Viewer function processes or returns information about events
caused by user interaction either with an application that supports
Virtual Viewer activity automatically, or user interaction with JAWS
directly on demand. Examples of automatic Virtual Viewer activity
include when you launch a browser like Google Chrome, Edge chromium,
Firefox, or Internet Explorer, or when you run a PowerPoint slide show.
An example of user interaction that causes JAWS to display information
in the Virtual Viewer is when you request screen-sensitive help from
JAWS on demand.

Many scripts that ship with JAWS involve the use of the Virtual Viewer.
However, the focus of the present discussion is about functions that you
may call from your own scripts and functions or those that you may
overwrite from those in default.jsss or from the built-in functions.

Some examples of Virtual Viewer functions include:

- EnsureNoUserBufferActive
- AddHotKeyLinks
- UserBufferActivate
- UserBufferDeactivate
- UserBufferClear
- UserBufferAddFormattedMessage
- UserBufferAddText

For a complete listing of Virtual Viewer functions, see the topics in
this category book of the Reference Guide.

## Additional Resources

For a detailed discussion and numerous code samples for using the
Virtual Viewer, see the topic in the General Scripting Concepts book
called [Implementing a Virtual Viewer
Window.](../Virtual_Viewer_Functions.html)
