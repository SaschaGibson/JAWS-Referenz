# Settings and Configurations

## Script File Types

The Freedom Scientific Scripting language stores script files in the
product\'s root folder mostly under the settings\\(language) folder.
Most of the files are written in the familiar INI file format. With the
exception of binary files (those with extension jsb), and with caution,
you may edit most script files with a text editor such as TextPad or
NotePad, with the JAWS\'s own Script Manager, or through the various
\"managers\" (utilities) provided directly by JAWS.

When you plan to edit a script file that exists in the shipping version
of JAWS through a text editor, you should back up the original files in
a safe place. This ensures that you can restore files to their original
state if you happen to edit a file\'s content in a way that causes
unpredictable results.

For more details on the definitions of Script File Types, see [Script
File Types.](../Docs/Settings_and_Configurations/ScriptFileTypes.html)

## Settings Files

JAWS stores application-specific information such as the JAWS
configuration settings, graphic labels, and frame definitions in
settings files. All JAWS settings files are located in the root folder
of the JAWS settings\\(language) folder. For more details on how
settings files are utilized by JAWS and for brief descriptions of what
each one contains, see [Settings
Files.](../Docs/Settings_and_Configurations/SettingsFiles.html)

## Reserved Files

JAWS reserves some settings files to govern its default behavior, or for
inclusion by other script files. For more details on which files are
reserved and how they are utilized by JAWS, see [Reserved
Files.](../Docs/Settings_and_Configurations/ReservedFiles.html)

## Folders for Settings And Configuration Files

JAWS ships with several sub folders you may customize. The default
subfolders are located in the JAWS root folder under the shared
Settings\\(language) folder. Depending on how your folders are set to
display in windows Explorer, the subfolders may appear in a different
order from the order presented here.

When you customize settings, none of them are placed in the shared JAWS
folders. Instead, depending on the type of customization, JAWS may place
your changes from default settings in the user Settings\\(language)
folder, and/or in one of the subfolders whose names also appear in the
shared Settings\\(language) folder. In other words, sometimes, both The
user Settings\\(language) folder and one of the subfolders contain your
changes. The only exceptions are the Transient-Focus and
Transient-session subfolders. Those never appear at all in the shared
Settings\\(language) folder because of how they are used. The subfolders
in the Settings\\(language) folder include:

- PersonalizedSettings - Contains any .jsi files that ship with the
  JAWS. when you customize your location for use with Research It, a
  MyLocation.ini file is created in this folder. When you use the JAWS
  Find command on a virtualized document or Website, a FindData.ini file
  is created in this folder.
- As of JAWS 17, merging from prior versions of JAWS was disabled due to
  the JAWS folder restructure. Instead, JAWS began providing a much more
  flexible user interface for backing up and restoring, and even
  migrating settings from a prior version of the product. But this all
  assumes the product is not older than JAWS 17. The Import/Export and
  Migrate utility accounts for the file restructure in JAWS 17 and
  later.
- PlaceMarkers - contains any temporary or permanent placemarkers you
  create for a given Website.
- Sounds - contains all the .wav sounds that ship with JAWS. If you
  customize a .wav sound, or generate a Speech and Sounds scheme or
  Dictionary Manager sound customization that includes a sound .wav
  file, JAWS places them in this folder.
- RuleSets - contains any customized rule sets you create for Research
  It. the .rul and .qry files that ship with JAWS always remain in the
  shared Settings\\(language)\\RuleSets subfolder.
- Transient-Focus - used for Quick Settings changes to store the
  settings that have the Restore Setting when Focus Changes persistence
  level.
- Transient-Session - used for Quick Settings changes to store the
  settings that have the Restore Setting when JAWS exits persistence
  level.

Note: Persistence levels is a concept introduced in JAWS 13.0. It allows
you more flexibility in whether a setting change should be transient or
permanent. By default, changes made through the JAWS Quick Settings user
interface are permanent. but you may change the persistence level of any
setting through the context menu for any option in the Quick Settings
user interface. The subfolders, Transient-Focus and Transient-session in
your user settings\\(language) folder store files related to persistency
levels.

## Additional Resources

For more information on Research It, see [Creating Research It
Rules.](Creating_ResearchIt_Rules.html)

For more information on Quick Settings, see [Customized Quick
Settings.](Customized_Quick_Settings.html)

For more information on the JAWS 17 and later folder restructure, see
[Localization: JAWS Folder
Restructure.](Localization_JAWS_Folder_Restructure.html)
