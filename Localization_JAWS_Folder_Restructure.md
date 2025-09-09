# Localization: JAWS Folder Restructure

**Special Note:**\
Please read the below explanations thoroughly. More restructuring has
occurred in versions of JAWS since JAWS 17 to reduce duplication of
files for multi-language builds of the product.

Since JAWS 17, the Freedom Scientific Scripting language file structure
has been updated in the Shared root and ProgramData folders to
facilitate localizing message strings and constants to a desired
language. This file structure has no effect on your ability to customize
scripts though. For example, when you add an Include statement for a
known file such as HJConst.jsh, JAWS can still determine how to find
that file so that your script source .jss file compiles properly into a
binary .jsb file.

The Script Manager is able to find files in the structure for you. But
if you are using a different text editor and you need to examine an
existing source file, message file, or header file, the file structure
in the JAWS 17 and later Shared folder is explained below. Each of the
folders in the file structure contains a folder whose name corresponds
to the three-letter abbreviation of the currently installed build of
JAWS. If the build you have installed is a non-English build that
includes both English and say, Spanish, for the JAWS UI, or you have
installed several languages, each of the below described folders will
contain as many folders whose names correspond to the three-letter
abbreviations of the languages your build of JAWS supports (e.g., Enu
and Esn for an English/Spanish build of JAWS). For the explanations
below, it is assumed you have an English U.S. build of JAWS installed.
Therefore, you will have Enu folders and other folders in the
AllUsers\\Freedom Scientific\\JAWS\\Version root folder and the
ProgramData\\Freedom Scientific\\JAWS\\Version folders as follows:

- Locale - This folder contains an Enu folder which in turn contains a
  folder for JAWS Help .chm files, another for Manuals, and another
  called Resources. All the files in these folders are in English. It is
  unlikely that you will need to access the Locale for any reason. but
  if you do, please see the section below that specifically discusses
  the contents of the Locale folder.
- Scripts - This is the folder you may access the most if you need to
  find a particular file. Like the Locale folder, it contains an Enu
  folder. In it are all the documentation .jsd, key map .jkm, and
  Braille structure .jbs files with which you may already be familiar.
  At the same level as the Enu folder, you will find all the source
  .jss, message .jsm, and header .jsh files along with the binary .jsb
  compiled files that ship with JAWS.
- Settings - Like the other two major folders, Settings also contains an
  Enu folder in which are all the configuration .jcf files and the
  folders for PersonalizedSettings, Rules, Sounds, etc., as well as the
  symbol .sbl files for the myriad speech synthesizers. These are all
  files that ship with JAWS. At the same level as the Enu folder are
  other folders:
  - Init is used to help JAWS keep track of what file to access and when
    to do so for various tasks.
  - SymbolDescriptions contains files for the various languages
    supported by JAWS. These files contain descriptions for characters
    and symbols defined by the Unicode standard that are not already
    spoken by speech synthesizers. Take great care if you elect to edit
    these files since they require UTF-8 formatting when they are saved.
    For more information about UTF-8 formatting, see\
    [Formatting Script Files for
    UTF-8.](Formatting_Script_Files_For_UTF-8.html)
  - In JAWS 18, the .sbl and .chr files were moved out of the
    language-specific folder to avoid duplication of the same files in
    each language-specific folder.
  - VoiceProfiles is the folder that may be of most interest to script
    developers in this particular set of folders. It contains all the
    voice profile .vpf files that ship with JAWS.

## [Custom Localization](#Custom%20Localization){#h2_Custom Localization}

PO and MO files are part of the JAWS install process for non-English
languages. These files are used to ensure that JAWS messages appearing
in the JAWS UI or elsewhere are properly localized to the languages you
have installed. But if you have your own custom scripts or a need to
customize these files, tools are available online for modifying PO
files. Find the POEdit Gettext Translations Editor at:
[PoEdit.net.](https://poedit.net/)

### DialogLayouts and LC_MESSAGES Subfolders

When you have a non-English build of JAWS installed or several languages
installed, the Locale folder mentioned above that is in
ProgramData\\Freedom Scientific\\JAWS\\(version)\\Locale contains a
folder for each installed language: One is the Enu (english folder), the
others are the folders whose three-letter abbreviation correspond to the
languages installed. The language-specific folders in turns contain
subfolders including DialogLayouts and LC_MESSAGES. Assuming you have
and are familiar with the tools used to customize PO files, you can use
those tools to modify the existing messages or to add your own, then
build the corresponding MO files to be used by JAWS.

Caveat: Whenever a repair or update to JAWS is performed, you will lose
these customized versions of the .po and .mo files unless you have the
appropriate compiled scripts that use your localization instructions.
See

## Finding Files with the Script Manager

To find the builtin.jsd file, for example, which resides in the Shared
folder, you need to find it within the folder structure. When you choose
the \"Open Shared\" option from the Files menu of the Script Manager,
use the File types combo box to select All Files. Then use the folder
view control in the dialog to navigate to the correct folder where .jsd
files now reside. For an English build of JAWS, this is within the Enu
folder. The process is just like the manner in which you find files in
the Open dialog of Notepad or any other standard application.

## Compiling Older Script Sets or Localizing Script Sets with JAWS 17 and Later

You may have customized scripts prior to JAWS 17 that you wish to add to
the current version of JAWS and/or that you need to customize further in
the current version of JAWS. Or you may have your own localized
instructions you wish JAWS to detect. To do this, you need to use a
special \";#Pragma\" comment in your script source file. The comment
should not be inside a specific script or function.

A scripting language pragma is a specially formatted comment that begins
with \";#pragma.\" The new pragma is usePoFile pragma. This pragma may
be used to specialize whether or not insPushLocalizedString instructions
are inserted by the compiler. The supported values are as follows:

- 0, false, no, off: Do not insert the localization instructions.
- 1, true, yes, on: Insert the localization instructions. This is the
  default if the usePOFile pragma is not used.

Thus, when the following line is found in the script source .jss file,
the script compiler will not insert the localization instructions, and
therefore the compiled script binary .jsb file will be
backwards-compatible.\

     ;#pragma usePoFile 0 ; Do not use localization instructions. 

\
On the other hand, when you use the comment:\

     ;#pragma usePoFile 1 ; Use localization instructions. 

\
you ensure that JAWS 17 or later localization instructions are honored.

Again, only use this special comment when:

- You need scripts to be backwards-compatible and also you need another
  set to honor localization instructions later than JAWS 17.
- You have custom scripts that make use of your own additions to the .po
  and .mo files mentioned in the section above called [Custom
  Localization.](#h2_Custom%20Localization)

If all you need are scripts for JAWS 17 and later, or you do not have
custom localizations to consider, you can just compile in the usual way
without the need for the ;#Pragma comment at all.
