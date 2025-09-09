# Appendix D: Naming JAWS Settings Files

Each time you start an application, JAWS determines what configuration
files to load. Prior to JAWS 5.0, JAWS used the name of the executable
file to retrieve and load the appropriate configuration files. JAWS uses
only the first portion of the executable file name i.e. the part of the
file without the extension. For example, when you started Microsoft®
Word 2007, the actual executable file name is winword.exe. JAWS uses
only the first part of the file, winword, to locate and load into memory
all configuration files for Word from the settings folder. JAWS loads
these files on top of the set of default files already in memory.

Many times, the names of those files are not indicative of the actual
application. For example, the configuration manager file for Internet
Explorer® 9 is Ieframe.jcf. The name of the file gives no indication of
the actual program with which JAWS associates the file. This naming
convention makes it difficult at times to locate the correct files for a
particular application when its name is not clear.

## The Confignames.ini File

JAWS 5.0 and later uses an ini style file to equate more meaningful
names with the executable file name. JAWS uses the Confignames.ini file
to retrieve a more understandable name for a given application. This
file can be found in your JAWS shared settings folder. The file contains
aliases that are associated with the hard-to-remember executable file
names. For example, when you run the Settings Center from within
Internet Explorer 8 or 9, the file name JAWS displays in the title bar
is Internet Explorer.jcf instead of Ieframe.jcf. As you browse the JAWS
settings folder using Windows® Explorer, you will see the same aliases
there as you would in the title bar of a given JAWS manager as well.

## Loading the Correct Files

Each time you start an application, JAWS uses the Confignames.ini file
to determine if an alias exists for the application. If JAWS finds an
alias in this file, then JAWS uses the alias to locate all the
corresponding configuration files for the application. If no alias
exists in the file, then JAWS uses the executable name of the
application to locate all the corresponding configuration files.

For example, when you start Internet Explorer 9, JAWS notes the
applications executable file name, Ieframe.dll, less the extension. JAWS
must then search the Confignames.ini file for an entry containing
Ieframe. When JAWS finds the entry, the alias of Internet Explorer is
noted. JAWS then looks in the settings folder for all configuration
files beginning with Internet explorer. When JAWS finds all the
corresponding files, they are loaded into memory.

## Adding Your Own Aliases

As you customize JAWS to work with new applications, JAWS continues to
use the applications executable file name to create the various
configuration files. However, you can add your own entries to the
Confignames.ini file to give those hard-to-remember configuration files
more meaningful names. When you add a new entry to this file, you must
provide two pieces of information:

- application executable name les the extension
- alias to be used In place of the application name

If you are unsure of the exact name of the applications executable file,
press **INSERT+Q** and JAWS speaks the settings file currently in use
along with the applications executable file name. If the applications
executable file name is hard to understand, you can press **INSERT+Q**
twice in succession to display the settings file in use information in
the virtual viewer. Since you are adding an entry to the Confignames.ini
file, your entry must follow a specific format. The applications
executable name appears first. The executable name does not include the
file extension. Following the executable name is the equals sign (=).
You then type the alias for the executable file name. For example, the
entry for Internet Explorer looks like the following:

> ieframe=Internet Explorer

To add a new entry to the Confignames.ini file, do the following:

1.  Open the Confignames.ini file in your favorite text editor such as
    Notepad or TextPad.
2.  Press **CTRL+END** to move to the bottom of the file.
3.  Add the new entry using the format of: executable name(less the
    extension)=alias.\>
4.  Save the file.

**NOTE:** You must add the alias to the Confignames.ini file before
using any one of the JAWS managers from within a new application.
Failure to do so causes JAWS to use the executable name for any files
created before the entry is added.

 

  ------------------------------------------- -- ---
  [Back](javascript:window.history.go(-1);)       
  ------------------------------------------- -- ---
