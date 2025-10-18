# Settings Files

JAWS stores application-specific information such as the JAWS
configuration settings, graphic labels, frame definitions, etc. in
settings files. All JAWS settings files are located in the root folder
of the JAWS settings\\(language) folder. See [Script File
Types](../Settings_and_Configurations/ScriptFileTypes.html) which
provides a list of settings file types and brief descriptions of the
information each contains.

JAWS loads settings files that have the same root name as an application
executable. For example, if the executable name for the TextPad
application is \"textpad.exe\", JAWS loads the script settings files
named \"textpad.\*\" whenever the TextPad application receives focus by
moving into the Windows foreground.

Additionally, JAWS reserves some settings files to govern its default
behavior, or for inclusion by other script files. See [Reserved
Files](ReservedFiles.html) to read more about reserved files.

Since JAWS 17 and later, you can create domain-specific settings .jcf
files as well as domain-specific dictionary .jdf and scripts in jss,
.jsd, and compiled .jsb files, which may include domain-specific key map
.jkm files. For more information, see\
[Domain-specific Utilities.](../Domain-Specific_Utilities.html)
