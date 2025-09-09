# Reserved Files

The screen reader reserves some settings files to govern its default
behavior, or for inclusion by other script files. These files include
the following:

## Default Settings Files

### Default.\*

When JAWS recognizes an application that has no specific settings or
customized scripts, it loads a default group of settings. The default
scripts and settings govern the vast majority of familiar JAWS behavior.
In fact, the default settings remain loaded even when JAWS finds
application-specific settings files. If any setting or script is not
overwritten by application-specific files, JAWS defers to the default
settings when deciding how to behave. Although the methodology JAWS
utilizes to decide how to behave appears to be straightforward, a good
understanding of how JAWS routes function calls is very useful. See the
function, GetScriptCallStack, in the JAWS Functions book of the
Reference Guide under the category book called Scripts to learn about
the stack flow of a function call in the JAWS Scripting language.

### Colors.INI

This file contains a list of RGB values paired with textual names. Any
time JAWS announces a text color, it refers to Colors.INI for the name.
Note: JAWS must be reloaded for changes to this file to take effect.

### JFW.INI (formerly symbols.ini)

This file contains textual names for ANSI symbols such as punctuation,
monitary symbols, special characters, etc. Any time JAWS speaks an ANSI
symbol, it refers to Symbols.INI for a name.

JFW.INI is divided into sections for several different hardware and
software synthesizers. The values for each entry within the sections
consist of the character symbol, the binary value for that symbol, and a
textual description. The \"SynthPunctuation\" key in each synthesizer
section tells JAWS whether it is JAWS or the assigned synthesizer that
should control speaking of punctuation. Set a value of 1 for JAWS or a
value of 0 for the synthesizer.

The \"Synonyms\" section allows JAWS to maintain a single set of symbol
names for an entire family of synthesizers. Keys refer to synthesizer
short names (noted for each installed synthesizer in JFW.INI). Values
refer to the synthesizer section names further down in Symbols.INI.

Note: The JFW.ini file is located in the Program Data\\Freedom
Scientific\\JAWS\\Version\\Settings\\INIT folder.

Note: JAWS must be reloaded for changes to this file to take effect.

### FlexibleWeb.db

This file is a database containing any rules you have created for
Flexible Web, a JAWS feature introduced in the initial release of JAWS
14. If you have not created any rules, the file is still created as a
placeholder for your rules. The file is located in the JAWS root folder
of the user\'s Settings\\(language) folder. It cannot be edited manually
and is intended to be updated only through the Flexible Web user
interface using the key layer command, JAWSKey+Space, x.

### SettingsCenter.ini and QuickSettings.his

These files are used specifically to maintain an accurate history of
changes made to Settings Center and Quick Settings through the JAWS user
interface. The files also update .jcf files when a JCF option is changed
that impacts a .jcf file. Updated SettingsCenter.ini and
QuickSettings.his files, as well as any updated .jcf files they impact
are placed in the JAWS root folder of the user\'s Settings\\(language)
folder. Never attempt to update a SettingsCenter.ini or
QuickSettings.his file manually.

## Useful Include Files

Certain JAWS Header files contain constants or global variable
definitions needed to add as \"Include\" statements to your own script
source files when customizing JAWS for any application. Any script
source file may include the following header files:

- HJConst.jsh
- HJGlobal.jsh
- common.jsm

For more information about how to include header files in your script
source files, see [Variables and
Constants.](../Variables_and_Constants.html)

### HJConst.JSH

This file contains definitions of the JAWS constants such as TRUE and
FALSE, standard window types, cursor types, JAWS settings, speech output
modes, etc. Add an \"Include\" statement for this file in any new JAWS
script source file to avoid compilation errors when copying code.

To learn more about the JAWS Script constants, see
[Constants](../Variables_and_constants/Constants.html)

### HJGlobal.JSH

This file contains declarations of the JAWS global variables. Add an
\"Include\" statement for this file in any new JAWS script source file
to avoid compilation errors when copying code.

To learn more about the JAWS Script variable types, see the following:

- [Non-Aggregate
  Variables,](../Variables_and_Constants/Non-Aggregate_Variables.html)
- [Collection Type,](../Variables_and_constants/Collection_type.html)
- [Array Type.](../Variables_and_Constants/Array_Type.html)

## Additional Resources

[Keywords and Non-Required
Keywords](../Keywords_and_Non-Required_Keywords.html)
