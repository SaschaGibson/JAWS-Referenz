# Structured Braille Functionality

JAWS offers two methods for showing information on any Braille display
installed on your system: Line Mode and Structured Braille Mode.

Line Mode shows text on a Braille display literally as it appears on the
screen - white space and all. This may seem to be the most desirable on
the surface, but actually, it presents quite a challenge for Braille
users. Very often, information is formatted with a lot of spaces or tabs
so that it lines up in the most aesthetically visually pleasing manner.
The Braille reader may find it difficult at best to navigate the
information in a meaningful way, or to discern its format, due to the
extraneous white space that appears on the Braille display.

Structured Braille Mode parses information about the current object on
the screen so that it takes up as little room as possible on the Braille
display. Even on larger Braille displays that have 80 cells for showing
text, it is often difficult to show formatted information in a way that
it can be understood efficiently and quickly. Structured Braille
provides a means whereby the components of an object can be
\"structured\" to show the most information with the least amount of
characters.

Many types of objects lend themselves readily to a component-based
system for presenting information. Rather than displaying information
strictly in a linear manner. So again, Structured Braille uses a
consistent method to show as much information as possible about an
object while taking up as little room as possible on a Braille display.

Objects include textual information such as lists, tables, HTML elements
such as links and heading levels. But objects also include controls in
dialogs, such as buttons, list views, tree views, checkboxes, and so on.
Additionally, objects may have states such as being checked or
unchecked, being collapsed or expanded, etc.

The Freedom Scientific Scripting language, together with its internal
code, makes it possible to show many components of objects through
Structured Braille. And in fact, you can manipulate how many or how few
of the components are shown for any particular type of object.

JAWS ships with Structured Braille mode enabled by default. You can
toggle between Line and Structured modes from the PC keyboard or from
the Braille display with the keys assigned to handle this. Or you can
use the JAWS Settings Center user interface. In fact, you can use the
Settings Center to define specifically how much or how little of each
component you want shown.

Take time to examine some of the functions in the Braille script source
file that ships with the JAWS screen reader to see how functions work to
maximize the real estate of a Braille display while displaying as much
meaningful component information as possible.

## The .jbs File

JAWS handles Structured Braille components through the JAWS Braille
Structure (.jbs) files that ship with the screen reader. The default.jbs
file handles the most common types of objects, and application-specific
.jbs files handle many of the applications the screen reader supports.
These files are set up in a very specific format in order for the
components to be shown properly on your Braille display. You can edit
them manually through a text editor like the Script Manager, or your own
text editor. And you may utilize the many functions that ship with JAWS
to read from and write to such INI-style files, or to enhance for your
own purposes what the existing .jbs files do. You may even add your own
application-specific .jbs files other than those that ship with JAWS.

However, it is recommended that you do not change any of the .jbs files
that ship with JAWS in the Freedom Scientific root folder of the Shared
Settings\\(language) folder. Rather, if you wish to experiment manually
or through functions with any of these files, do so in your own user
Settings\\language) folder.

For more details on working with a .jbs file, see the topic under
Settings and Configurations called [Script File
Types.](Settings_and_Configurations/ScriptFileTypes.html)

## Components of Structured Braille

The control types and components recognized by Structured Braille are
quite numerous. Moreover, you may also add your own custom control types
for your own applications. You can work with the existing standard
control types and add your own custom components for them through
functions or through the JAWS Settings Center. And you can work with
many functions that let you manipulate what information components show,
and when they show that information.

When you add a custom control type, you add sections for custom controls
to the JBS file, in the form:

    [CustomControl1]
    [CustomControl2]
    ...

\
In the function, BrailleCallbackObjectIdentify, CustomControl1 evaluates
to WT_CUSTOM_CONTROL_BASE+1, CustomControl2 evaluates to
WT_CUSTOM_CONTROL_BASE+2, etc. WT_CUSTOM_CONTROL_BASE is a constant in
HJConst.jsh.

It is critical to understand that the standard control types are
numbered in a very specific manner tied to their subtype codes for the
most part. They have both internal and scripting references. Should you
attempt to add your own control type in hjConst.jsh, you will generate
very unpredictable Braille results.

### Valid Components

Components recognized by JAWS for customizing controls include:

- Name
- Type
- State
- Value
- Position
- Level
- ContainerName
- ContainerType
- dlgName
- dlgType
- dlgText
- dlgPageName
- Other
- LiveRegion

#### LiveRegion

As of the JAWS 18 December 2016 update and later, LiveRegion provides a
generic means for you to add the contents of an ARIA live region to data
for controls on a webpage. This is analogous to adding a screen frame, a
region of the visible screen, which has been available since JAWS 4.0.

An ARIA live region is a portion (often a region) of a webpage or web
application which is dynamically updated and whose content may be
automatically spoken. Such a region is typically used for providing
real-time status information on a webpage that may or may not be related
to the focused control. An example of this is the Google Sheets web
application. It uses a Live Region to present the data and coordinates
of the currently focused spreadsheet cell, while focus remains on a
control which inherently presents no meaning to the end user. Thus,
Google Sheets works for a speech user but would be totally unuseable for
a Braille user without a component such as LiveRegion.

The LiveRegion component is relevant only when a webpage or web
application has focus and the application hosting the webpage or web
application supports ARIA. Browsers that support ARIA include Internet
Explorer, Firefox, Chrome, or modern applications using a web interface.
When you add the LiveRegion component to a control type section of a JBS
file, the text of the specified ARIA live region is added to the Braille
structured data in the order specified by the component list, if that
control type gains focus on the webpage. The format of the component
name is "liveRegion", or "liveRegion:xxx" where xxx specifies the HTML
ID string attribute of a specific ARIA live region to include. If the
colon is omitted, the content of the last live region updated will be
included for the LiveRegion component of the structured data.

Note: By allowing the specification of an ID, multiple Live Regions may
be supported in multiple components for the same structured data - e.g.,
one tracking row totals and another tracking column totals in a
spreadsheet.

When Braille is updated, and a valid LiveRegion component exists, the
script function BrailleAddLiveRegion is called in processing of the
defined components for the focused control type, just as
BrailleAddObjectName might be called, etc. The parameters of the
BrailleAddLiveRegion function include the control type of the focused
control, the id of the LiveRegion, and the text of the LiveRegion. You
can use this information to fine-tune an overridden instance of
BrailleAddLiveRegion, just as JAWS scripts specific to certain
applications already do for the various BrailleAddObject functions.

### General Remarks about Structured Braille Components

Since the purpose of Structured Braille is mainly to take up as little
room as possible on your Braille display, some of the components shown
for an object abbreviate the information, and localizes the abbreviation
to the language in use. For example, a control that is of type button is
shown as \"btn\" in English. Note though that Structured Braille never
abbreviates the value or descriptive information, such as the name of a
file in an edit control.

You may arrange Components of a control to show or be hidden on your
Braille display. As of JAWS 15, the order in which components are shown
by default takes advantage of the status cells on most Braille displays.
So as of JAWS 15, the default arrangement of components is the type of
the control in the status cells, its state (if applicable), its name,
its value (if any), and its description (if available). If the control
is part of a dialog, the name of the dialog appears as the rightmost
component with the abbreviation, \"dlg\", following it.

For Microsoft Office ribbons in particular, if a hotkey is available, it
is displayed as the last component of a ribbon control. Dialog controls
however do not display their hot keys by default.

You can change whether components show, and how they are arranged on the
display, through the JAWS Settings Center user interface by checking or
unchecking them. You can even reverse the order in which dialog names
appear. Some examples of how a control is shown by default include:

- btn Open Open dlg - The Open dialog with focus on the Open button
- chk \< \> Bold Font dlg - Font dialog with focus on the Bold checkbox
  which is currently unchecked
- lrbn Bold btn Ctrl+B; Alt, H, 1 - lower ribbon Bold button in an
  Office application ribbon

Alternatively, you may edit a .jbs file manually. You may decide not
only to rearrange the order but to hide certain components altogether,
or to show ones that do not show by default, such as the hotkey
components for dialog controls. The following sections of this overview
explain how a .jbs file is arranged and how you may edit it manually to
suit your own needs.

## Sections of a .jbs File

A .jbs file is arranged by section. Each section name is contained in
brackets and represents a control type JAWS supports in Structured
Braille. As mentioned above, you may add custom control types for your
own controls as long as you also add script code in the function,
BrailleCallbackObjectIdentify, and the functions for the braille
components to handle the components. That is, if you need to create a
custom arrangement or component list for a particular control type in
your custom application, you may add custom control types as sections to
a .jbs file. and you may even add your own custom components.

### \[Component Aliases\]

This section is for component alias names as they appear in the JAWS
Settings Center user interface. They include items such as:

- dlgText=Dialog Text
- dlgPageName=Dialog Page Name
- dlgName=Dialog Name
- ContextHelp=Insert F1 Help
- urbn=Upper Ribbon
- lrbn=Lower Ribbon

The alias maps the component alias name to the script function that
controls the alias. The alias name, to the right of the equal sign, is
what appears in Settings Center. The entry to the left of the equals
sign is the function name suffix that scripts use to output the
component. The suffix is appended to the function, BrailleAddObject, to
get the full function name. So for example, for DlgText, the function
name is BrailleAddObjectDlgText.

If you need to add a custom component for your own application, add its
alias name in this section. So you could add something like,:\

    MyCustomButtonName=Custom Button

### \[State Aliases\]

This section is for component State Aliases as they appear in the JAWS
user interface. It contains information such as:

- csChecked=Checked
- csUnchecked=Unchecked
- csSubmenu=Submenu

### \[Control States\]

This section is for component Control States as they appear on the
Braille display when they are available. Not all states for controls
have Braille equivalents. Control states include information such as:

- csChecked=&ltx\>
- csUnchecked=\< \>
- csSubmenu=-\>
- csPressed=\<=\>

### Standard Control Types

The next sections are numbered by the subtype code of the control. For
example, the control subtype code for a standard button is 1. Therefore,
the section for button is called \[SubtypeCode1\]. A comment above the
bracketed section name clarifies its meaning. Other examples of standard
section names for control subtype codes include:

- \[SubtypeCode3\] - Edit. Note that multi-line edit controls always use
  line mode rather than Structured Braille mode if not in a dialog.
- \[SubtypeCode19\] - radio button
- \[SubtypeCode20\] - Checkbox
- \[SubtypeCode95\] - upper ribbon

### Custom Control Types

This section is for components to be mapped to standard component
categories for treatment by the internal code. For example, if you wish
a custom component to be treated as a control\'s value, the mapping
should be:\
CustomComponentName=Value

This affects how the JAWS user interface displays and allows you to show
or hide the display of a given component on your Braille display.
Examples of custom components would be something like for a table, as in
components for Table number/Row/Column (where the cursor is within a
table cell).

## Entries of a Section in a .jbs File

The map for each entry for a control type, whether standard or custom,
must include the key name of the entry, followed by an equals sign (=),
followed by whatever contents you wish the entry to have. Parts with
examples for each include:

- Components - a list separated by commas of the components to be
  included for the current control subtype.\
  Components=type,state,value,hotkey,description
- Type - the abbreviation to appear in the status cells representing the
  control type\
  Type=lrbn
- Removed - the information to be hidden if you prefer not to show it.
  This is usually left blank unless you have removed something through
  the JAWS Settings Center.\
  Removed=
- Displayname - the actual name to be shown in the JAWS Settings Center
  for the current control subtype.\
  DisplayName=Lower Ribbon
- AlignmentPriority - the order in which components should be arranged,
  starting from leftmost component to rightmost component.\
  AlignmentPriority=type,state,value

### Code Samples - Custom Controls

Below are two samples of how you would customize a control. First, a
customized lower ribbon control is shown, and then a custom control for
an object for which you have created your own information to be shown
when the cursor is on that object.

For the first example, note that the numbering here is the same as that
in the default.jbs file. The difference is that you are creating this
section in your own application-specific .jbs file and placing it in
your own user Settings\\(language) folder.

    ;Section for Custum Control 96, my special ribbon control.
    [subtypecode96]
    Components=Type,State,Value,Hotkey,Description
    Type=lrbn
    Removed=
    DisplayName=My Lower Ribbon
    AlignmentPriority=Type,State,Hotkey

The second example shows a custom control for your own custom control
type, not one normally associated with the standard control types. And
notice that the section for this object begins with the number 1. This
does not indicate that its subtype is button. Rather, it is the first
custom control in this special .jbs file that is associated with your
own custom application. Remember! You can create custom controls for
your own custom types as long as you add sections to the .jbs file for
the custom controls, and handle them with the function,
BrailleCallbackObjectIdentify, along with any custom component functions
as needed. Standard, that is, non-custom control types, must be one of
the recognized control subtype codes listed in hjConst.jsh. They have
specific numbers. You cannot add your own subtype code number and expect
JAWS to recognize that subtype code because JAWS uses the subtype code
numbers both in the Scripting language and internally.

    [Component Aliases]
    MyObjName=My Object Name
    MyObjValue=My Object Value

    ;for custom control 1, my custom control type
    [CustomControl1]
    Components=Type,MyObjName,MyObjValue
    Type=obj
    Removed=
    DisplayName=My Object
    AlignmentPriority=Type,MyObjName

To make your special custom control be recognized and work properly, you
need to overwrite the BrailleObjectCallbackIdentify function and add
your own special code in that function as it applies to your special
object. Then you need to write functions for your special object to be
applied by the callback function when the cursor in your application is
on the object.

For example, in Microsoft Word, there are special functions for the
objects that are footnotes and endnotes. These functions call the
BrailleAddString and other Braille functions to present a footnote or
endnote properly in Braille when the cursor lands on such an object in a
Microsoft Word documentt.

If Braille is showing the controls in structured mode, use
BrailleAddObjectName to show a customized name for a control. Structured
braille is used almost everywhere, except in multiline edits of a
document or in a command window. You can find examples of
BrailleAddObjectName in many script files. The WordBrl.jss and
Excelbraille.jss files contain this and many other functions customized
to handle specialized braille output for the Word and Excel
applications.

If you do customize adding a Braille component yourself (for example, by
using BrailleAddString in the BrailleAddObjectName function), you must
return true. Returning true indicates to JAWS that the scripts handled
the component so that the internal braille doesn\'t also attempt to
handle it. Always return by calling down the stack to the next
brailleAddObjectName to pass control to internal JAWS for handling
everything that you didn\'t handle yourself.

If you need to define special types of controls which aren\'t handled in
the normal way, for instance, you want to create an entirely new type of
Braille structure, you can use the BrailleCallbackObjectIdentify
function to tell Braille that this is a new type of control. If you
define a new type of control you must define the custom control in the
.JBS file for the application. You can see examples of this in word.jbs
and excel.jbs. But, if all you needd to do is tell Braille to use a
specific name for controls, you don\'t need to overwrite
BrailleCallbackObjectIdentify or define anything in the .JBS file.

Each type of component used by Braille - name, value, state, etc. - has
a function which can be overwritten to send specific text to the
display. Since Braille is so frequently updated, you want to make sure
that the code you add in the function for adding the component doesn\'t
tie up the system with too much processing.

For more details on working with Braille functions, and particularly
those that show information in Braille, see the summary in the JAWS
Functions book of the Reference Guide called [Braille
Output.](Reference_Guide/Braille_Output.html)
