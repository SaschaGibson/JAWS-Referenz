# Key Map Files

Key Map (.jkm) files contain a list of keystrokes assigned to JAWS
scripts. Below are a listing of the major sections that you may include
in a key map file with a brief explanation of the types of entries each
section may contain. Not every key map file need contain all the
sections discussed below. But all key map sections must refer to a
particular section in order that key map entries be honored.

New sections may be added to a key map file such as the default.jkm file
that ship with JAWS when new types of functionality and features are
included. So the below discussion may not include all the sections that
are currently in the JAWS version you are using. The list of sections
described here is a comprehensive, not all-inclusive, list.

If you need to disable a key manually from a key map file, you must
delete everything after the equals sign (=) on the line where the key is
defined. This is true regardless of what section contains the entry
where the key is defined. Always save such a modified file in your
User\\Settings\\(language) folder.

## Keyboard Layouts

A keyboard layout is a set of keystroke assignments designed to provide
the best fit for the design of a hardware keyboard. They include:

- Desktop (default)
- Laptop
- Classic Laptop
- Kinesis
- MAGic keyboard

You may switch to a keyboard layout other than the default Desktop
layout through the JAWS user interface. Find the \"Use Keyboard Layout\"
combo box in the \"Basics\" dialog under the \"Options\" menu of the
JAWS main window.

Each keyboard layout has a corresponding section in the key map file. In
addition, the \"common keys\" section contains entries used by all the
keyboard layouts. You should add most new keystroke entries to this
section.

## Braille Keys

Many common Braille displays have sections in the Default.JKM file.
Section names refer to Braille display short names, which are noted for
each installed Braille display in JFW.INI.

Braille displays often have keys that must be assigned to JAWS scripts.
Entries for Braille displays must be in the form of the word,
\"Braille\" followed typically by the word \"Dots\", followed by a dot
pattern for that display\'s unique keystroke assignments. However, where
a dot pattern is not needed or is only part of the key assignment, you
may use other keywords. These include words like, \"Wheel\",
\"Shift1\"/\"Shift2\", \"Advance1\"/\"Advance2\", and so on. It depends
on the keys that exist for that particular display.

Some examples of entries for the Freedom Scientific line of Focus®
Braille displays include:

- Braille Dot45 Chord=Tab
- Braille Dots 1 2 5 6 Chord=TouchCursor
- Braille Dots 1 2 4 5 6 Chord=SayAll
- Braille Advance2=BraillePanRight

As mentioned above, each entry for a Braille keystroke assignment must
begin with the word \"Braille\". The exact names of the Braille function
keys vary from manufacturer to manufacturer. For reference, when a key
is pressed on a Braille display while Keyboard Help is enabled, the JAWS
keyboard help announces the key name and what the key does on the
Braille display just as it announces the key names on a standard
keyboard.

## Virtual Keys

Use the virtual keys section of a key map file to specify those keyboard
commands available only when the JAWS Virtual cursor is active. For more
information on working with virtual cursors and virtual environments in
general, see [Implementing a Virtual Viewer
Window.](../Virtual_Viewer_Functions.html)

## Quick Navigation Keys

Typically, the keystrokes for JAWS commands assigned to scripts consist
of a modifier key like the **INSERT** key plus an alphanumeric key or a
navigation key like **UpArrow**. However, when assigning keystrokes to
scripts for navigating a virtual window where alphanumeric characters
have no native functionality, you may simply assign single keystrokes
(referred to as \"Quick keys\") to JAWS commands mnemonically. An HTML
window is an example of a window that JAWS usually virtualizes.

Place quick key assignments in the \"Quick Navigation Keys\" section of
a key map file. Note that Quick keys are disabled when JAWS enters forms
mode.

## Quick Navigation Keys Manager Data

Use this section to populate the list view in the JAWS user interface
for the Quick Navigation Keys Manager. The format of each item must be
as follows without the quotation marks used here for readability:\
\"Name of forward movement script\"\|\"Name of backwards movement
script\"=\"Text to be displayed in the column 0 of the list view\"

Note: The \"Text to be displayed in column 0 of the list view\" is
localizable.

## SayAll Keys

Keyboard commands placed in the \"SayAll Keys\" section of a key map
file function while JAWS is speaking as a result of a **SayAll**
command. Keystrokes specified in this section override standard
keystrokes while JAWS is reading. Examples include the right and left
arrow keys to fast forward and rewind through text as well as the PageUp
and PageDown keys to decrease and increase speech rate.

## The JAWS Key

The JAWS key serves as a movable modifier key for the JAWS commands.
Like other modifier keys, you must use this key in combination with
other keys. To include a JAWS modifier key, add the word \"JAWSKey\" to
any key map entry. Set the JAWSKey to the Insert, CapsLock, or
ScrollLock key in the JAWS user interface. Use the Settings Center
option called \"Keyboard\" for this purpose.

## Touch and Object Navigation

Since JAWS 15, the default.jkm file contains sections specifically for
the Windows 8 and above Touch and Object Navigation features. Unlike
other sections whose entries are typically a keystroke combination or
sequence, or a Braille dot pattern, entries in the Touch section of a
key map file are written as a number of fingers plus a gesture that JAWS
supports. For example,\
TwoFingers+FlickDown=TouchSayAll.\
For more information on working with Touch and Object Navigation scripts
and functions, see the summary and category book in the Functions book
of the Reference Guide called [Touch
Navigation.](../Reference_Guide/Touch_Navigation.html)

## Key Names

This section has entries that show the names used to designate keys. The
JAWS default.jkm file has an extensive list of entries in this section.
Key names are not case-sensitive. They include the Insert, CapsLock,
ScrollLock, and NumPad keys, for example. For a complete current
listing, see the JAWS default.jkm file.

## Modifiers

This section in the default.jkm file contains the entries that define
the modifier keys JAWS may use in conjunction with other keys. Modifier
keys include the Control and Alt keys, for example.

## Creating custom key map overlays

Since JAWS 15, you can define your own key map section and load or
unload it using script calls to the functions, LoadKeymapSection and
UnloadKeymapSection. If a key map is loaded by calling
LoadKeyMapSection, the key map remains loaded until it is unloaded by
calling UnloadKeymapSection, or until the configuration changes -
whichever happens first. The name of a key map to load must match a
section in the .jkm file, excluding the trailing portion of the section
name that specifies the section as a key map. For example,
LoadKeyMapSection (\"Custom\") loads the key map section called
\"\[Custom Keys\]\" in the .jkm file.
