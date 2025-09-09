# Reference Guide of JAWS Scripts and Functions

The Freedom Scientific Scripting Reference Guide for JAWS consists of
many major category books. Each book contains a summary of the category
it represents, along with code samples where appropriate. And the tree
structure for each book lists all the scripts and functions for that
category.

Check the category books that have been added since the last published
version of the FSDN. Some new categories have been added, and some have
been enhanced to include related types of functions. For example, the
new Braille Split Mode Functions category comprises all the functions
you need to customize your own Split Braille modes using the model from
the ones that ship with JAWS 2024. In fact, even familiar category books
may have new functions for you to explore just introduced in JAWS 2024.
For example, the System category has new functions for the registry -
e.g., GetRegistryEntryDWORD.

To examine the details about any script or function in the tree
structure list, arrow to a script or function name, and press **ENTER**.
This causes the function\'s details to appear in the right pane. Press
**F6** to move to the right pane. Then use standard virtual key
navigation to read the contents. Press **F6** again to return to the
tree structure.

As you navigate within a particular category book, you may find
duplicate entries. This occurs where a script and function have the same
name. An example is the SayAll script and the SayAll function, both of
which appear under the category book called \"Screen Text\". So be sure
to check out the summaries of both instances of any entries in the tree
structure that appear twice.

When viewing a topic page for a particular script or function, be sure
to read the version information for when it became available. This is
important to avoid unexpected results in the version of JAWS for which
you are coding. At times, a topic page for a script or function may
present the entry twice, each entry with slightly different information.
The information may vary especially with respect to the ranges of the
versions of JAWS where the entry became available. For example, if a
function is available through a particular version of JAWS and then
gains an additional parameter for newer versions of JAWS, then the topic
page for the function displays the function twice. Each entry has its
specific parameters and the versions of JAWS in which it is available.
An example is the FindString function. So it is critical to know in what
version of JAWS the function you are working with is supported, and its
expected behaviors.

Finally, take care when working with a source file that already ships
with JAWS, such as the Notepad.jss or the Wordpad.jss script source
file. Such files already contain scripts and functions by default. Place
your sample code at the very bottom of the file. And make sure to remove
this overwritten .jss and its associated overwritten .jsb and .jkm files
from your user Settings\\(language) folder when done testing. It is
assumed that the script is being processed in the .jss script source
file and compiled in the .jsb script binary file.
