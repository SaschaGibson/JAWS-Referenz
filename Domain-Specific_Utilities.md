# Domain-Specific Utilities

As of JAWS 17 and later, several of the Freedom Scientific utilities
allow for customizing by domain Web-based applications, even those not
specifically within a browser. The utilities supported for this type of
customization include:

- Dictionary Manager
- Keyboard Manager
- Settings Center
- Script Manager

Utilities such as the Frame Viewer and Graphics Labeler are not
customizable for specific domains and continue to behave as always. If
you do nothing to customize domain-specific settings, JAWS continues to
behave as always by default as well as for all supported applications.

## Domain Option in the Files menu of the Utilities

The Script, Keyboard, and Dictionary managers have a menu item added to
their respective File Menus to open or create domain-specific files.

### Dictionary Manager

When the active application is Web-based, the Dictionary Manager has a
menu item added to the File Menu that allows you to open the domain
dictionary file. This action creates the dictionary as needed and opens
it for you to customize just for that domain.

### Script Manager

The Script Manager also allows you to create or open an existing
domain-specific script source .jss file through the File Menu when the
current application is web-based, and allows for assigning a script key
in the domain-specific keymap .jkm file. When a script is assigned in a
domain script file, any key assignments made in the New Script or Script
Information dialogs writes the assignment to the domain keymap file.
When a script is deleted with a key binding, the Script Manager deletes
the key binding.

### Keyboard Manager

The Keyboard Manager allows you to open the domain-specific .jkm keymap
file through the File Menu when the current application is web-based.
When the active document is the domain keymap file, the right pane shows
domain, application, and default keystrokes, depending on the settings
of the Key Filter. For practical purposes, domain-specific keystrokes
are essentially an addition to the application keystrokes. Therefore,
when you select an application in the Key Filter and a domain file is
active, the keystrokes for the domain and application should be
displayed. When you add a keystroke through the Add Keystroke Action
dialog, the keystroke is added to the domain .jkm keymap file if a
domain-specific .jkm keymap file is active.

### Settings Center

When the current application is web-based, the Settings Center utility
adds a list item to the applications list. The list item includes the
file name followed by "(Domain)." Selecting this item creates the domain
settings as needed and opens the domain configuration file.

## ConfigNames.ini and .jcf Files

Your User\\Settings\\(Language) folder contains .jcf files for domains
you set through Settings Center, as well as a ConfigNames.ini file. The
domain-specific .jcf files are named by the domain name itself (e.g.,
www.freedomscientific.com.jcf. The ConfigNames.ini file contains a
section called \[ConfigNames\]. Entries in this file are of the form
domain-speicific .jcf filename followed by the Equals sign (=) followed
by the filename again (e.g.,\
www.freedomscientific.com.jcf=www.freedomscientific.com.jcf\
Note that domain-specific .jdf, .jkm, and .jsb files are not included in
the ConfigNames.ini file, only the domain-specific .jcf files you
create.
