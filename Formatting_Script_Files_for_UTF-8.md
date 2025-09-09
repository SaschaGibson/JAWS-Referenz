# Overview

UTF-8 is an acronym for UCS Transformation Format --- 8-bit multibyte
character encoding for Unicode. ANSI is an acronym for American National
Standards Institute. For more technical information about the meanings
of these terms, please visit:

\
<http://en.wikipedia.org/wiki/UTF-8>\
and\
<http://en.wikipedia.org/wiki/ANSI>\
and\
<http://en.wikipedia.org/wiki/Unicode>

For our purposes, ANSI and UTF-8 refer to a method for reading and
writing files for JAWS to utilize where there are characters in the code
or in the files whose character values are higher than ASCII 127. ASCII
characters include all standard punctuation and alphanumeric characters
for Western European languages, as well as various other symbols. From
127 to 256, there are characters like smiley faces, Greek characters,
etc. Beyond 256 are over 109,000 Unicode characters, including Hebrew
characters, Cyrillic characters, etc. Files containing such characters
must be formatted properly in order to be interpreted by JAWS. So the
UTF-8 file format for the Script Manager supports many languages other
than English. This file format can even include characters that are used
in Western European languages but have accent marks like vowels with an
acute or umlaut mark.

For JAWS support to interpret UTF-8 file formats correctly, in the past,
localizers had to manipulate script files that included Unicode
characters one file at a time and by hand in order to save files with
Unicode characters properly in UTF-8 format. Otherwise, files containing
Unicode characters would wipe out those characters in when saving or
compiling files with the JAWS Script Manager. The UTF-8 implementation
for Freedom Scientific JAWS support via scripting should eliminate this
problem.

## Definitions

Script source related files are those with extensions:

- .jss - script source
- .hss - hidden script source
- .jsh - script header
- .hsh - hidden script header
- .jsm - script message
- .jsd - script documentation
- .sbl - speech symbols file
- .jbt - JAWS Braille table file
- .CHR - character substitution

Script binary files are those with the extension of .JSB. BOM (Byte
Order Mark) is a series of three specific bytes (written in hex as 0xEF,
0xBB, and 0xBF respectively) which if present at the beginning of a
file, indicates that the file is stored in UTF-8 format.

## Remarks

The Script Manager is not a hex text editor, the only way to test
whether a file is being read by JAWS in UTF-8 format is by inference.

Where UTF-8 is supported, the option in the Files menu of the Script
Manager called UTF-8 Format appears as "checked" when the script Manager
has read the file as a UTF-8 file.

If the Script Manager reads the file without the File menu option for
UTF-8 Format checked, the file is considered to be an ANSI file.

If the File menu option for UTF-8 Format does not appear at all in the
Files menu of Script Manager, it means that the current version/build of
JAWS being run does not support UTF-8. (Note: If the current
version/build of JAWS reader being run is supposed to support UTF-8 but
there is no File menu option for UTF-8 Format available at all when a
file is read or a new file created, no UTF-8 processing will be handled
by JAWS with respect to that file at compile time.

## Saving a UTF-8 Formatted Script File

### Notes

When you open a script file using Script Manager, JAWS assumes that the
file is formatted as an ANSI file. When you save the file, it is saved
as an ANSI file. Unless you explicitly enable UTF-8 formatting for the
current file, it is not saved as a UTF-8 file. Unless you direct it to
be saved elsewhere, it will be saved in your User\\Settings\\(Language)
folder.

If UTF-8 symbols are needed to appear on a Braille display, one or more
.jbt files may need to be formatted as UTF-8 files.

The following example illustrates how to reformat your .jbt file for
UTF-8:

1.  The .jbt file must temporarily replace the file whose name is
    identical in the Program Files folder for the current version of
    JAWS. Navigate to that folder. It's path will be something like,\
    C:\\Program Files\\Freedom Scientific\\JAWS\\xx.0
2.  Change the name of the file called "US_Unicode.jbt" to something
    like "#US_Unicode.jbt".
3.  Copy the file with the same name as the original file whose name you
    just changed into the current folder. You should now have a file
    called "US_Unicode.jbt" file in the current folder as well as the
    renamed one that originally is part of the current JAWS build.
4.  From within Script Manager with the .jbt file open, find the option
    in the Files menu called \"UTF-8 Format\". The option is unchecked
    by default.
5.  Press ENTER on the option to enable UTF-8 formatting for the current
    file.
6.  Change or add whatever UTF-8 symbol is desired in the file,
    following its exact correct syntax.
7.  Save the file.
8.  Unload and reload JAWS without rebooting.
9.  From now on, the UTF-8 symbol coded into the .jbt file should be
    recognized by JAWS and displayed in Braille properly because the
    .jbt file has been saved with UTF-8 formatting enabled.
