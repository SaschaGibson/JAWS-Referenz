# HTML XML DOM Functions

DOM stands for document object model, a structure of nodes containing
properties with information about each node. The browser creates a DOM
that is used to render the contents of, and support, navigation in and
HTML or XML document.

JAWS inspects the DOM created by the browser, and builds its own
internal DOM structure with extra properties used to convey information
about the elements of a web page or Chrome-based application. Scripts
have a set of functions which provide access to this JAWS DOM. In
addition to the functions listed in this book, the script file,
FSXMLDomFunctions.JSS, contains a set of functions you will find useful
for accessing information, and performing actions on the nodes making up
the JAWS DOM for the web page or Chrome-based application.

Use these steps to inspect a web page or Chrome-based application:\

- Use the JAWS utility mode (toggled on or off with
  JAWSKey+Windows+NumpadMinus) to browse and inspect the nodes and
  properties of its internal DOM.
- Use Alt+X to toggle on or off the DOM browser mode.
- Exit the script utility mode and also exit the DOM browser mode if it
  is active when you toggle off the script utility mode.

In the scrip utility DOM browse mode, you can use keys similar to script
utility mode for windows for traversing and getting information about
the nodes. For example, you can use F2 and Shift+F2, Tab and Shift tab,
Control+Tab and Shift+Control+Tab to navigate the DOM structure. Use F3
to cycle through the types of output for the node, and use F1 to display
the information in the virtual viewer.

Once the virtual viewer shows the information, the cursor keys will
navigate the text being shown. You can use F5 to set the output to the
focused element.

For a complete listing of HTML XML DOM scripts and functions, see the
topics in this category book of the Reference Guide.
