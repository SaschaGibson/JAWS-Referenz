# Web App Scriptability

Since JAWS 17, the Freedom Scientific Scripting language supports
scripting specifically for a Web App in a browser. When referring to a
browser, it is always assumed that browser is supported by JAWS. Hence,
a scripter may create domain-specific scripts for a web page or web
application. When a specific domain is viewed in a supported browser,
the domain-specific scripts are loaded in addition to the host
application scripts. Thus, the behavior in the domain-specific app
supersedes application behaviors.

The ability to customize a Web app through the Freedom Scientific
Scripting language allows you to:

- Associate a script set (.jss/.jsb, .jkm, .jcf and .jdf) with a given
  domain name by adding an entry in the \[Domains\] section of
  confignames.ini, which associates the website domain with the name of
  the script set for the domain.
- Obtain well-formed XML from the DOM Server which represents Freedom
  Scientific\'s view of the browser webpage or application at any given
  point in its execution. Note that, while the FS XML DOM is based on
  the application\'s DOM, extra FS attributes have been added to the
  nodes.
- Use the Scripting language, along with a Com Object such as the MSXML
  engine and XPath queries, to parse and interact with the XML as a node
  tree.
- Request that the DOM Server act upon a particular element in that node
  tree by finding the equivalent node in the real DOM and invoking an
  action.
- Write custom scripts based on the information in this node tree (e.g.,
  find the nth heading on the page and read it, find the following
  table, add up the numbers in the last row of the table, and speak the
  total, all without moving the virtual cursor).

## Definitions

- DOM Server - Freedom Scientific's module which is used to construct a
  virtual view of a document hosted in a web browser.
- Layering - When one script set is loaded on top of another such that
  scripts in the set loaded later supersede scripts loaded in an earlier
  set. Scripts which are not overridden in a set loaded later are
  inherited from a set loaded earlier.
- Supported Browser - Currently Freedom Scientific supports the
  following web browsers:
  - Firefox.
  - Google Chrome.
  - Microsoft Edge Chromium
  - Internet Explorer.
- Web Application - An application hosted in a web browser.
- Well-formed XML - XML which may be parsed by the MSXML Com object
  without errors.
- XML (Extensible Markup Language) - A well-formed markup language for
  describing complex documents.
- XPath: An XML query language that allows the parsing and querying of
  information in an XML document.

## Examining a Webpage with the XMLDom Browser

JAWS has extensive tools you can use in addition to, or instead of,
writing functions to obtain XML information about a particular webpage.
From the page you want to inspect:

1.  Toggle the Script Utility on with **JAWSKey+WINDOWS+NumpadMINUS.**
2.  Press **ALT+X.** The entire page XML information is presented in the
    virtual viewer for you to examine.
3.  Use the keystrokes normally used for determining window classes,
    control types, and so on - namely: **F3** and **F1,** except that
    now these keystrokes provide information such as nodename, tag info,
    number of children (elements), etc. **TAB** and **SHIFT+TAB** move
    to next/prior siblings of an element if they exist. **F2** and
    **SHIFT+F2** move down and back up through the tree of nodes. You
    can use the cursor to examine more closely the text that is
    displayed in the virtual viewer for the current node.
4.  Toggle the XMLDom browser mode off when done examining the webpage
    by pressing **ALT+X** and by toggling off the Script Utility itself
    with **JAWSKey+WINDOWS+NumpadMINUS.** If you toggle off the Script
    Utility before toggling off the XMLDom browser mode, it immediately
    reverts to a normal view of the webpage.

## Designing a Custom Script Using Special Functions

You must enable your custom scripts to load within any of the supported
browsers by adding a section and certain lines to Confignames.ini. Note
that this is not the same as the information presented in
[Domain-Specific Utilities](Domain-Specific_Utilities.html) where you
are using the existing JAWS utilities such as Settings Center to specify
how you prefer JAWS to behave for a certain domain. For example, you
want JAWS to speak your bank site\'s numbers differently than the way
you want JAWS to speak numbers everywhere else. So you choose to change
some text Processing options in Settings Center just for that site. Your
ConfigNames.ini file contains a section called \[Confignames\] and
entries in that section refer specifically to that bank site. A .jcf
file gets created with the same name as your bank\'s site to match the
entry in ConfigNames.ini.

For the present discussion however, let\'s assume that your custom
scripts are the sample provided by Freedom Scientific for the Sharepoint
Web app from Microsoft. For this and any other custom scripts to run
within your browser, you must create or add to the ConfigNames.ini file
in your User\\Settings(language-specific) folder with the section called
\[Domains\]. The entries in this section must be in the form: specific
Web domain = (equals sign) followed by the name of your custom script
set. So in this example, your Confignames.ini file would show this:\

    [Domains]
    fsservices-my.sharepoint.com=SharePointWeb

Note: This particular entry already exists but is commented out in the
Shared ConfigNames.ini file located in Program Data\\Freedom
Scientific\\JAWS\\Version\\Settings\\Language-specific folder.

### Using Regular Expressions for ConfigNames.ini Entries

\'Regular expression\' entries were introduced in JAWS 2020 for use in
the ConfigNames.ini file. Regex is short for regular expression, a
string of text used to create patterns to help match, locate, and manage
text. Programming languages utilize this basic concept for searches,
etc. to manage patterns such as wildcards.

Suppose that you develop a set of custom scripts for your specialized
Web-based application, but you do not want the custom scripts to load
everywhere within the application, or you want every domain that
includes your application\'s name in some way always to load your custom
scripts. A regular expression entry in the ConfigNames.ini \[domains\]
section may be very helpful to control when custom scripts load or do
not load.

Use the following guidelines and syntax for regular expression entries
where \"Custom Script\" is the actual name of your custom script set,
domain.com is the URL, and subpath is a subset of that domain:\

- Custom script loads for any domain matching the URL obtained from the
  address bar:\

      regex:domain.com=CustomScript

- Custom script loads for URLs matching the given domain and subpath
  instead of matching just the domain:\

      regex:.*domain.com/subpath/.*=CustomScript

- Custom script should not load and JAWS loads browser default settings
  and scripts:\

      regex:URL=

- Custom script loads for a local file within a supported browser
  matching the name of your local file:\

      regex:file:.*MyFile.html=Custom Script

  \
  Or only for my local file in a specified path:\

      regex:file:C:\path1\path2\MyFile.html=CustomScript

\

### Functions for Customized Web App Scripts

Some of the functions you can use to customize your Web Aps include:\

- GetDocumentXML - returns XML for the current virtual document. It
  obtains well-formed XML for the entire document from the Dom Server
  for parsing using the MSXML com object.
- GetElementXML - returns XML for the current virtual element. It
  obtains well-formed XML for the current element and its direct
  ancestors, depending on parameters passed to the function, from the
  Dom Server for parsing, using the MSXML com object. Passing a 0
  retrieves only the current elemet\'s information. Passing 1 retrieves
  the element\'s parent; passing 2 retrieves the element\'s grandparent,
  etc. Passing -1 retrieves all ancestors of the element.
- PerformActionOnElementWithTagAndAttribute - finds an element in the
  DOM by tag and attrib/value pair and performs an action on it such as
  setFocus, makeVisible or doDefaultAction.
- PerformActionOnElementWithId - finds an element in the DOM by its
  unique ID and performs an action on it such as setFocus, makeVisible
  or doDefaultAction.

For example, let\'s say you want to create a custom script for the
Freedom Scientific site itself. Use the function GetDocumentXML or
GetElementXML to determine what content to utilize to pass parameters to
the functions that perform one of the actions described above. Then
return the string from either function into the User Buffer in the
virtual viewer or copy the string to the clipboard. Paste the copied
string into a text editor like Notepad where you can save the content
and examine it at leeisure.

**Special Note:**\
In order to pass the FSID parameter to the function,
PerformActionOnElementWithId, the FSID must be obtained for the current
session of the page. It is a dynamically changing value, much like a
window handle that changes each time the Web page loads. Therefore, you
must use the FSId returned by GetDocumentXML or GetElementXML just
before you pass it to PerformActionOnElementWithId. Clearly, it is less
convenient to use PerformActionOnElementWithId rather than
PerformActionOnElementWithTagAndAttribute. But both functions can be
very useful. See the sample script set for Sharepoint that ships with
JAWS, and is presented below for your convenience.

Once you have the various values you need from the XML code, you may add
to the browser\'s .jss file or simply create your own special script
source file that, when compiled, will generate the custom script set for
you. Add your script set\'s name to the ConfigNames.ini file section
called, \[Domains\] as described above. For example, your custom script
set could be for the Freedom Scientific site and be called \"MyFSWeb\".
The entry in the Confignames.ini file in the \[Domains\] section would
be something like this:\

    www.freedomscientific.com=MyFSWeb

The default scripts load \"FSXMLDomFunctions.jsb\". This file contains a
set of functions which can be called to perform some routine tasks
without having to write the code from scratch each time it is needed.
You can read the documentation in the FSXMLDomFunctions.jsd file, and
the source code is available in the FSXMLDomFunctions.jss file.

### Code Samples

Some samples are provided below based on the Freedom Scientific main
webpage for illustration purposes only. clearly, you can easily make
JAWS start reading or hide elements from a particular point through the
Flexible Web feature, or simply by using quick keys. Nevertheless, these
samples illustrate how these functions can help you determine the
information you need to customize your web app scripts.

#### Example 1: Moving to the Search Button

Suppose all you want to do is to be able to move with your own custom
script key to the Search button on the freedom Scientific page. First
obtain the element\'s XML info either by using the GetDocumentXMl
function or better yet with the newer function, GetElementXML. Here\'s
how:

1.  From the www.freedomscientific.com webpage, move directly onto the
    button called \"Search\".

2.  Write a script that obtains the XML information for this element:\

        Script GetElementInfo ()
        Var
            String eXMLInfo
        ;initialize
        eXMLInfo = cscNull

        eXMLInfo = GetElementXML ()
        If  eXMLInfo () != cscNull
            SayString "Found info")
            CopyToClipboard (eEXMLInfo)
        Else
            SayString ("element info not found")
        EndIf
        EndScript

Now examine the XML information just retrieved by pasting it into a text
editor like Notepad. You should then be able to write a script that
contains a call to PerformActionOnElementWithTagAndAttribute like this:\

    PerformActionOnElementWithTagAndAttribute (Action_SetFocus, "Button", "id", "BtnG")

#### Example 2: Moving to the Search Query edit field

Suppose instead that you want to move with your own custom script key to
the Search edit query field on the freedom Scientific page. First obtain
the element\'s XML info by moving to the element and then using a script
test just like the one shown in stepd 2 of Sample 1 above. Paste the
resulting XMl info into a text editor like Notepad and examine its
contents. You can then write a script that puts focus directly on the
field, as in the following:\

    PerformActionOnElementWithTagAndAttribute (Action_SetFocus, "INPUT", "name", "q")

#### Example 3: Activating the Shop Link

Finally, let\'s go shopping for products and services at the Freedom
Scientific EStore. Again, you may use the script shown in Example 1 or a
variant of it to obtain the XML of the Shop link on the Freedom
Scientific webpage. You may need to vary the script slightly by passing
it a parameter of 1 to get more useful data from an ancestor of the
element. You could then write a script that activates this particular
link as follows:\

    PerformActionOnElementWithTagAndAttribute (action_DoDefaultAction, "A", "href", "http://sales.freedomscientific.com/")

## Running a Custom Script Set for your Web App

For the Sharepoint scripts that ship with JAWS, if the scripts are not
working - that is, the toolbars cannot be activated by the
**JAWSKey+CTRL+F8** keystroke, or whatever other custom scripts you have
coded, check the address of the current domain. If necessary, add
another line to your confignames.ini file so that your custom scripts
load for that specific domain.

### Sample Code for SharePoint

Below is a sample script which may be used to interact with the xml on a
page. This script finds and lists toolbar controls in the Sharepoint web
application and allows the user to click the chosen control. The script
set is included with JAWS since JAWS 17. It is available when you
uncomment the entry for SharepointWeb found in Confignames.ini - as
described above.

## Additional Resources

From the Microsoft Developer Network pages:

- [Sampel of XPath
  syntax](https://msdn.microsoft.com/en-us/library/ms256086(v=vs.110).aspx)
- [Sampel of using parser though script syntax will be slightly
  different, principle is
  same](https://msdn.microsoft.com/en-us/library/d271ytdx(v=vs.110).aspx)

From Wikipedia for Regular Expressions:
