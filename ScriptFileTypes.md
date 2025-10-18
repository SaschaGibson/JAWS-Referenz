# Script File Types

JAWS stores settings files in the product\'s root folder mostly under
the settings\\(language) folder. Most of the files are written in the
familiar INI file format. With the exception of binary files (those with
extension jsb), and with caution, you may edit all scripting settings
files as follows:

- with a text editor such as TextPad, NotePad++, or Notepad,
- with the JAWS Script Manager,
- or through the various \"managers\" provided directly by JAWS.

Whenever you plan to edit a script file that exists in the shipping
version of JAWS directly through a text editor, you should back up the
original files in a safe place. This ensures that you can restore files
to their original state if you happen to edit a file\'s content in a way
that causes unpredictable results.

If your script files require entries with Unicode characters, you must
save them with UTF-8 formatting enabled. For more information on UTF-8
formatting, see [Formatting Script Files for
UTF-8.](../Formatting_Script_Files_for_UTF-8.html)

## Definitions of Extensions for Script File Types

Following is a list of definitions for script file types by extension
supported by the JAWS Scripting language. Each file type extension is
followed by a brief description of how it is used.

For more information on the use of header files and on variables and
constants, see\
[Variables and Constants,](../Variables_and_Constants.html) and
[Non-Aggregate
Variables,](../Variables_and_Constants/Non-Aggregate_Variables.html)\
and [Constants.](../Variables_and_Constants/Constants.html)

### JBD - JAWS Braille Display

Used by the Papenmeier Braille displays. Their names generally begin
with the prefix BrailleX. JAWS itself does not use these files, but they
are needed by the BrailleX manager that comes with the Papenmeire
displays.

### JBS - JAWS Braille Structure

Structured mode settings for JAWS output to Braille displays. To make
changes to these settings, choose the \"Define Structured Mode\...\"
button from the \"Braille Settings\" dialog in the JAWS Settings Center
.

For more information on Structured Braille, see the topic called
[Structured Braille Functionality.](../Structured_Braille.html)

### JCF - JAWS Configuration File

JAWS configuration settings for verbosity, text processing, keyboard
processing, HTML options, window class reassignments, custom highlight
options, etc. To make changes to .jcf files, use the Run JAWS Managers
dialog, or Settings Center and Quick Settings dialogs.

You may edit .jcf files from within your script source files with
functions like GetJCFOption_function and SetJCFOption respectively.

### JSI - JAWS Script Initialization

Generated under certain circumstances when a change is made to Quick
Settings for a specific application. the file is located in the
PersonalizedSettings folder under the root folder of the JAWS
user\\Settings\\(language) folder. the file\'s name is based on the
application where it was generated. In other words, there is no
default.jsi. But there are files like Word_MyDocument.docx.jsi. Such
files are located in folders like C:\\Users\\MyName\\Freedom
Scientific\\JAWS\\(Vversion
number)\\Settings\\(language)\\PersonalizedSettings.

To prevent unpredictable results, it is not recommended that you edit
.jsi files manually. However, it is possible and often practical to read
from and write to .jsi files through script or function calls in your
script source code. If you do, take care to consider the impact on the
QuickSettings.his and SettingsCenter.ini files and even any .jcf files
that may be associated with that .jsi file.

### JDF - JAWS Dictionary File

Alternative pronunciations for words or characters that are not already
pronounced correctly by the synthesizer. To edit dictionary entries in
an existing .jdf file or to create a new .jdf file, use the JAWS
Dictionary Manager.

You may edit .jdf files directly. Make entries one per line with the
match text on the left and the replace text on the right. The match text
should be the exact mispronounced word or characters, and the replace
text should be a phonetically spelled representation of how the match
text should be pronounced. Use the \".\" delimiter to begin and end each
entry as well as for the left and right parts of each entry .

Note: JAWS processes Dictionary rules for all the text it reads.
Therefore, be judicious in adding entries to the JAWS dictionary files
in order to avoid slower responsiveness while navigating. Adding
dictionary rules only for the applications where they are needed also
helps to shorten processing time.

### JGF - JAWS Graphics File

A list of numeric graphic specifiers paired with textual descriptions
for each. When JAWS encounters a labelled graphic, it speaks the
assigned text description. If a Braille textual description is also
assigned for a numeric graphic specifier, JAWS displays that graphic
label on any attached Braille display. To add to or edit graphics, use
the Graphics Labeler (**JAWSKey+g**), or use the Auto-graphics labler,
**JAWSKey+Ctrl+g**.

You can edit a graphics file manually. See how the file should be
structured by examining the default.jgf file that ships with JAWS to
understand how entries should be delimited and how the file sections
should be managed. A .jgf file contains sections for various graphic
resolutions as well as a section for symbols.

### JFD - JAWS Frame Definition

Contains the definition for customized frames. the file is located in
the root folder of the JAWS user\\Settings(language) folder. The name of
the file is based on the application where the frame was created. For
example, if the file is created in the Textpat application, its .jfd
file is called Textpad.jfd.

You may utilize the JAWS user interface to create a frame with the key
combinations **JAWSKey+LeftBracket** to set the upper left corner and
**JAWSKey+RightBracket** to set the bottom right corner of an arbitrary
rectangle on the screen. With the JAWS dialog that results from these
actions, you may then enter a frame name, synopsis, and description much
like you do in the Script Manager when generating new scripts and
functions. You may even add a keystroke assignment so that the frame is
acted upon by JAWS - for example, in response to an event or to a user
pressing that keystroke combination. If you add a key assignment to a
frame definition, that assignment is added to the application\'s .jkm
file. The Synopsis and Description fields for the frame definition
ensure that keyboard help for that key assignment is available to the
user upon request.

You may also edit a .jfd manually. But take care to follow the exact
syntax of the file to avoid unpredictable results.

### JFF - JAWS Frame File

Contains all the information associated with customized frames with
respect to how JAWS should act upon them. The file is located in the
root folder of the JAWS user\\Settings\\(language) folder. The name of
the file is based on the application where the frame was created. For
example, if the file is created in the Textpat application, its .jff
file is called Textpad.jff.

The information contained in the file is sectioned in brackets with the
name given to each frame that has been created. Following the name of
the frame in brackets on separate lines are the specifics about the
frame: whether it should be silent, spoken, Brailled, and upon what
conditions or events, etc.

You may also edit a .jff manually. But take care to follow the exact
syntax of the file to avoid unpredictable results.

### JKM - JAWS Key Map

A list of keystrokes assigned to JAWS scripts. To add, remove, or change
key assignments, use the Keyboard Manager, **JAWSKey+8**.

You may edit key map files directly. For more detailed information on
working with key map files, see [JAWS Key Map
Files.](../Key_Management/KeyMap.html)

### JSB - JAWS Script Binary

Binary files created by the JAWS compiler from JAWS Script Source (.jss
or .hss) files. Such binary files are loaded each time an application
receives focus by moving to the Windows foreground. JAWS uses compiled
binary files because they execute more quickly than interpreted script
text. Binary files may not be edited manually in any way. They are not
available to a text editor.

### JSD - JAWS Script Documentation

Generated by the JAWS Script Manager whenever scripts or functions are
created in a script source (.jss or .hss) file. using the Script
Manager. These files include very specific information about the name,
synopsis, and description of each script or function in the associated
source file. Optionally, they may even contain category information
related to the type of script or function being documented. The synopsis
and description entries for a script are used to provide JAWS Keyboard
help. So be careful to create meaningful documentation for these
entries.

You may create/edit a .jsd file manually. In fact, you must do so if you
are creating script source files through a text editor other than the
JAWS Script Manager to ensure complete and accurate documentation of
your scripts and functions, and to ensure that any scripts tied to key
assignments have meaningful keyboard help.

### JSS - JAWS Script Source\<

JAWS script source code. Once scripts and functions have been added to a
file of this type, use the JAWS compiler to compile the script set into
binary (.jsb) format.

You may use the JAWS Script Manager to create/edit script source files.
Compile source files by pressing Ctrl+s from the script Manager.
Assuming that your source code compiles without errors, the .jss, a
.jsd, and .jsb files of the same root name as your source file are all
added to the root folder of the JAWS user\\settings\\(language) folder.

Alternatively, you may use a text editor like TextPad to create and edit
script source code. This means that you will need to utilize command
line commands or compile statements available through your text
editor\'s user interface pointing to the JAWS compiler in order to
compile that source code.

### HSS - Hidden Script Source\<

Hidden JAWS script source code has not been used in shipping JAWS for
some time. But you may wish to keep your personal customized code
private for professional reasons. Once scripts and functions have been
added to a file of this type, use the JAWS compiler to compile the
script set into binary (.jsb) format. Again, hidden source files are
typically not included in the script set exposed to the user, only the
resulting binary (.jsb) file. But all the information that applies to
exposed script source (.jss) files applies to hidden source ffiles with
respect to \"Include\" statements, formatting for UTF-8, etc.

Another way to handle the use of hidden source files for a script set is
to utilize \"Use\" or \"Import\" statements in the exposed script source
(.jss) file. These statements assume that the hidden source files have
compiled correctly and are available as binary (.jsb) files to be
compiled along with the exposed .jss file. For more information on
\"Include\", \"Use\", and \"Import\" statements, see [Compiler
Directives.](../Compiler_Directives.html)

### JSH - JAWS Script Header

Definitions for variables and constants to be used throughout your
script source files. \"Include\" statements in your script source files
are necessary for header files to be available at run-time and properly
compiled.

### HSH - Hidden Script Header

Hidden definitions for variables and constants to be used throughout
your script source files. Typically, hidden header files are not exposed
in the script set of your files. Hidden header files are typically not
included in the script set exposed to the user, only the resulting
binary (.jsb) file. But \"Include\" statements in your script source
files (both .jss and .hss) are necessary for hidden header files to be
available at run-time and properly compiled.

### JSM - JAWS Script Message

Definitions for message constants to be used throughout your script
source files. \"Include\" statements in your script source files are
necessary for message files to be available at run-time and properly
compiled.

### INI Files

Numerous types of .ini files ship with JAWS. The files are located in
different folders on your system, depending on their purpose. The
SettingsCenter.ini file, for example, is one that should never be edited
manually.

To prevent unpredictable results, it is not recommended that you edit
.ini files manually. However, it is possible and often practical to read
from and write to .ini files through script or function calls in your
script source code.

### HIS History

Used to hold history information for settings changes made through the
JAWS user interface. To prevent unpredictable results, you should never
edit These files manually.

### QS Quick Settings

Used to hold Quick Settings definitions. These files work in conjunction
with their associated .qsm files. A .qsm file is written in XML and so
has a different structure from the .jsm files that are added to script
source files by \"Include\" statements.

### QSM quick Settings Message

Message file specifically for Quick Settings options. These files work
in conjunction with their associated .qs files. A .qsm file is written
in XML and so has a different structure for message constants from the
.jsm files that are added to script source files by \"Include\"
statements. For more details on how to utilize .qsm files, see
[Customized Quick Settings.](../Customized_Quick_Settings.html)

### SBL - Speech Symbols File

Used to look up language information for a specified synthesizer, or to
load the JAWS default speech symbols file when no synthesizer symbols
file exists for the synthesizer in effect. The .sbl files contain
entries for symbols (mainly punctuation). JAWS processes how and even
whether symbols are pronounced depending on the punctuation level in
effect.

JAWS ships with many speech symbols files for supported speech
synthesizers. Just as the folders containing scripts and configuration
files are named with language abbreviations, the .sbl files support
languages like: enu (English), deu (German), esn (Spanish). The list of
synthesizers and languages JAWS supports is robust and growing,
including most Western european languages with their Latin alphabets but
also those with Cyrilic alphabets like Russian. Also supported are
numerous Asian languagess such as: Japanese, Chinese (Cantonese and
Mandarin), and right-to-left languages like Arabic and Hebrew.

You may edit an .sbl manually, but be careful to follow the syntax shown
in the file exactly to prevent unpredictable results. An .sbl file is
broken into sections, each of which lists the symbols for a particular
language that synthesizer supports. For example, if you want to add an
entry to the eloq.sbl (Eloquence synthesizer symbols file), you first
must find the section for the language (American English, Castilian
Spanish, etc.) where you want to add your entry. Then move to the end of
that language section and add your entry consecutively to whatever other
symbols already exist for that language section of the .sbl file.

Note: you cannot create a new language section in an .sbl file for a
language that is not supported by that file\'s synthesizer.

Finally, if the symbol you are adding is a Unicode character, you must
save the .sbl file with UTF-8 formatting enabled.

In JAWS 17, .sbl files were relocated to language-specific folders
within the Shared root folder for JAWS: C:\\ProgramData\\Freedom
Scientific\\JAWS\\17.0\\Scripts(language) folder. This actually caused
duplication of these files for non-English builds of the product. So
since JAWS 18 and later, .sbl files were relocated to the Shared root
folder: C:\\ProgramData\\Freedom Scientific\\JAWS\\Version\\Settings.
This removes the duplication of the files in language-specific folders.

### CHR - Character Substitution

Used since JAWS 15 to process character substitutions (spelling and/or
pronunciation corrections) for certain spoken behaviors in the languages
supported by the speech synthesizer in effect. Each .chr file bears the
name of its associated speech synthesizer (e.g.,
VocalizerExpressive.chr). But not all synthesizers require associated
.chr files.

Unlike an .sbl file, a .chr file may contain entries that are not
symbols. Entries may be alphanumeric characters as well. JAWS processes
how characters are pronounced under certain circumstances regardless of
the punctuation level in effect.

The .chr files that ship with JAWS since JAWS 15 are located in the JAWS
root folder in the Settings\\(language) folder.

In JAWS 17, .chr files were relocated to language-specific folders
within the Shared root folder for JAWS: C:\\ProgramData\\Freedom
Scientific\\JAWS\\17.0\\Scripts(language) folder. This actually caused
duplication of these files for non-English builds of the product. So
since JAWS 18 and later, .chr files were relocated to the Shared root
folder: C:\\ProgramData\\Freedom Scientific\\JAWS\\Version\\Settings.
This removes the duplication of the files in language-specific folders.

You may edit a .chr manually, but be careful to follow the syntax shown
in the file exactly to prevent unpredictable results. A .chr file is
broken into sections, each of which lists characters to be substituted
for a particular language that synthesizer supports. For example, if you
want to add an entry to the VocalizerExpressive.chr file, you first must
find the section for the language (American English, Castilian Spanish,
etc.) where you want to add your entry. Then move to the end of that
language section and add your entry consecutively to whatever other
entries already exist for that language section of the .chr file.

Within each language section, entries correspond to characters to be
processed with substitutions. The key part of each entry is represented
in one of two ways: the desired character entered directly, or a Unicode
sequence representing the desired character (e.g., U+201C for Left
Double Quotation Mark). For each entry, the value is the string to be
substituted for the character. For example, the string to be substituted
for a Left Double Quotation Mark could be \"Left Double Quote\" instead
in English and whatever is appropriate in say, Spanish. But you must
make each entry in the relevant language section of the file.

Note: You cannot create a new language section in a .chr file for a
language that is not supported by that file\'s synthesizer.

The behaviors JAWS may process using .chr files occur when the user:

- invokes any spelling command : word, line, to or from cursor, etc.
- invokes a command to speak the current character.
- navigates by character with left/right arrow keys.
- types characters, and typing ecdho is set either to Characters or to
  Characters and Words.

Finally, you must format a .chr file as an INI-style file with UTF-8
formatting enabled.

### VPF - Voice Profile

Since JAWS 16.0 and later, .vpf files have been used to support the
enhanced language switching capabilities for speech synthesizers. JAWS
stores the Voice Profiles .vpf files in the JAWS root folder under the
settings\\(VoiceProfiles) folder. The moment you make any adjustment to
a voice profile, a file is created in your own
User\\Settings\\VoiceProfiles folder with all the correct section names
and entries for your customized voice profiles. Each speech synthesizer
has its own voice profile file.

The sections of a Voice Profile .vpf file include:

- Options - used to define profile defaults.
- Context sections - formatted as three-letter language abbreviation
  followed by a dash, followed by a context name (e.g., \[ENU-PCCursor\]
  is for English United States PCCursor voice).
- Sections for Voice Aliases - formatted as three-letter language
  abbreviations followed by the term, voice alias (e.g., \[enu-Voice
  Aliases\]).
- Language Aliases - used In order to support language detection on the
  internet ISO 639/3066 language codes as well as Microsoft and other
  variants of these.
- Voice Alias Translations - used to localize Voice Alias names (e.g.,
  \[enu-UI Voice Alias translation\]).
- Default Voice Aliases - used to define the default for each voice
  alias.

### JBT - JAWS Braille Table

Used to look up Braillle symbols for the Braille format in use for the
current JAWS session. This file governs how Braille symbols and what
sets of symbols are displayed in Braille. For example, if the
US_Unicode.jbt is in effect, all Unicode characters available in that
file become possible to display in Braille as applications are run that
may present such symbols. The .jbt files are located in the Freedom
Scientific folder for the specific version of JAWS running in the
Program Files folder of your system.

A .jbt Braille table may specify up to 7 dot pattern cells per unicode
character. Make each entry for any symbol or Unicode character you are
adding as a special cell dot pattern on a separate line.

You may edit a .jbt file manually, but be careful to follow the syntax
shown in the file exactly to prevent unpredictable results. The file is
broken into sections (sets of symbols), each of which lists the entries
for that set (i.e., ANSI, Unicode Greek, etc. in the US-Unicode.jbt
file). Make sure to add any entries at the end of the existing set of
symbols for the correct set.

Finally, if the entry you are adding is a Unicode character, you must
save the .jbt file with UTF-8 formatting enabled.

### RUL and QRY - Rule and Query

Specifically used for the JAWS Research-It feature. For detailed
information on how to customize these types of files, see [Creating
Research It Rules.](../Creating_ResearchIt_Rules.html)

### SBAK - Settings Backup

Since JAWS 18 and later, you have been able to create settings backup
files for restoring user settings from another version of the product,
or merging user settings to another system with the same version. This
process is similar to the older process called Merge that allowed you to
merge user settings from a prior version of JAWS to a current version.
The Merge feature was removed in JAWS 17 due to a major relocation
refactor. This was necessary to speed up the localization process for
the growing number of languages JAWS supports. Starting with JAWS 18 and
later, .sbak files provide an even more robust process for backing up
and restoring user settings for whatever language you have installed.

## Additional Resources

[Settings Files](../Settings_and_Configurations/SettingsFiles.html)

[Reserved Files.](../Settings_and_Configurations/ReservedFiles.html)

[Calling Scripts and Functions](../Calling_Scripts_and_Functions.html)
