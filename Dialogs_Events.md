# Dialog Events

A Dialog event function provides information about a dialog, such as
whether it has changed or IS updated. JAWS uses this information to
determine whether to speak and display it, for comparison purposes, etc.
In this case, to display information refers to showing it in Braille.

An example of a Dialog Event function is DialogPageChangedEvent. If you
can find an application that contains a multi page dialog (e.g.,
Internet Explorer, Microsoft Word, etc.), you may try overwriting the
function in the application\'s script source file and adding, say, a
debug statement in it so that you can see how this function works. to
avoid unpredictable results, make sure that there is not an overwritten
version of DialogPageChangedEvent already in the application\'s script
source file.

For a complete listing of functions related to dialogs, see the category
books in the [Reference Guide.](../Reference_Guide.html)
