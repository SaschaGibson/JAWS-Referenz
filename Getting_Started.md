# Getting Started

The Freedom Scientific Developer Network is divided into three major
books for your convenience. they include:

- [General Scripting Concepts](General_Scripting_Concepts.html)
- [Reference Guide](Reference_Guide.html)
- [FS Braille Display API](FS_Braille_Display_API.html)

The General Scripting Concepts book includes many topic areas, many of
which have further summaries for complex concepts such as Compiler
Directives. Each topic area has its own summary page with links to
related information where appropriate, and many of the summaries include
code samples.

The Reference Guide contains all the functions exposed in the Freedom
Scientific Scripting language. The book is divided into category books
of related scripts and functions. To facilitate finding what you need
quickly and efficiently, each category book has its own summary with
code samples where appropriate.

The FS Braille Display API book contains information about the functions
specific to working with Braille displays. Since this topic falls
outside the standard scripting functions, this information is in its own
book for ease of use.

Note: JAWS ships with the ability for you to customize scripts out of
the box. You do not need a special build of the product but you must
have administrative rights on your installed version and be using an
Administrator user account in order to take advantage of this powerful
tool.

## Writing Script Files with Script Manager or a Text Editor

### Editing

Create or edit JAWS Script Source (.JSS) files from within any text
editor. If you are new to scripting, you may find it easiest to use the
JAWS Script Manager to create and edit script files because this text
editor provides many helpful tools for navigating through a script file.
Starting with JAWS 2020, the Script Manager provides an even more robust
set of tools for creating your own script sets. Tools include:

- Shift+F1 - Using a keystroke at the cursor where a function is located
  to have that function\'s details shown to you in a popup window you
  can review and dismiss with ESC.
- Inserting built-in functions.
- Formatting scripts.
- Providing script language help.
- Writing and synchronizing the script documentation.
- Formatting the script file for UTF-8 encoding.

You may learn about scripting by choosing the JAWS \"Help Topics\" item
from the \"Help\" menu.

Activate the Script Manager from within any application by one of the
following methods:

1.  Press INSERT+0.
2.  Press INSERT+F2 for the JAWS \"Run Managers\" dialog. Navigate
    through the list until Script Manager is selected, and then press
    ENTER.

As mentioned above, starting with JAWS 2020, if you want to see the
details for a function within a script, you can press Shift+F1 while
your cursor is on the name of the function. For example, bring up the
Notepad.jss file. It already has functions within it. Move to any
function call within a script or function and place your cursor at the
function call name. Pressing Shift+F1 shows you that function\'s
details. Dismiss the function\'s details with Esc. You are back in the
.jss source file.

### Naming

Script files follow the same naming and location conventions as most
JAWS Settings files. Storing script files in the
JAWS\\Settings\\(Language) folder ensures that all necessary include
files are present at compile time. By default, the JAWS Script Manager
creates files with the same root name as the active application
executable, and places them into the Jaws\\Settings\\(Language) folder.

## Compiling Script Files

The JAWS Script Manager compiles an active script file whenever the
\"Save\" option is selected from the \"File\" menu. The compiler gives
the resulting binary file the same root name as the script source file,
and places it in the same folder. JAWS will load the new binary file the
next time the application with the same root name gains focus by moving
into the Windows foreground.

If you choose to edit script source files with a text editor instead of
the Script Manager, use the application \"SCompile.exe\", located in the
JAWS program folder to compile them from the command line. Call
\"SCompile\", passing in script source file names. The compiler accepts
wild cards;, so many source files may be compiled with one command.

## Formatting for UTF-8 Encoding

UTF-8 is an acronym for UCS Transformation Format --- 8-bit multibyte
character encoding for Unicode. ANSI is an acronym for American National
Standards Institute. For more technical information about the meanings
of these terms, and how to format script files for UTF-8, see
[Formatting Script Files for
UTF-8.](Formatting_Script_Files_For_UTF-8.html)

## IME Support

JAWS can make Input Method Editors (IME) accessible. These special types
of editors allow you to input from the keyboard into documents
containing characters belonging to languages such as Chinese, Japanese,
and Korean. In order for JAWS to support IME, you must install a text
service compatible with Microsoft Text Services Framework (TSF). The
installer is called FSTxtSvc.MSI, and it installs the Freedom Scientific
Text Service (FSTxtSvc). Note that this text service is not installed by
default for languages other than Chinese, Japanese, and Korean. For more
information about this highly specialized area so that you may work with
localized custom scripts for the languages mentioned above, please
contact the Director of Localization at Freedom Scientific.
