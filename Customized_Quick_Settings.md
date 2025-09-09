# Customized Quick Settings

As of JAWS 11.0, the JAWS user interface for changing options in its
many features changed from the Configuration Manager dialogs to the
Settings Center dialog. In JAWS 13.0, this concept was extended with the
introduction of the \"Quick Settings\" feature. This user interface
replaced the AdjustJAWSOptions dialog available in prior versions of
JAWS, providing easier navigation and searching of the myriad options
JAWS offers. The older functions for developing AdjustJAWSOptions dialog
remained in the product for legacy reasons.

The Freedom Scientific Scripting language supports customization of
Quick Settings using special files and functions. To distinguish the
files used for quick settings from other types of script files, there
are two files with special extensions:

- .qs - Quick Settings XML file containing all the information required
  to populate the Quick Settings user interface
- .qsm - the associated Quick Settings XML message file containing all
  help messages for the user interface

A set of Quick Settings files must have the filename for the application
to which the set belongs. So as with any other application-specific
script files you develop, name your customized quick Settings files
accordingly. For example, if your script source file has the name,
MyApp.jss, then its associated Quick Settings files (if they exist)
should have names like MyApp.qs and MyApp.qsm. Both .qs and .qsm files
must exist in order for JAWS to process your customized Quick Settings
correctly at run-time.

Data passed between the QuickSettings user interface and JAWS scripts is
in XML format. You must use the Script Manager or another text editor
that supports working with XML in order to edit existing XML files, or
to create your own .qs and .qsm files.

In addition, the Scripting language provides numerous functions to
assist with the manipulation of Quick Settings XML files. To use these
functions in your own script source file, you must add the following
statement after any \"Include\" statements at the top of your script
source file:

    Import QuickSet.jsd

For more details on working with the \"Import\" directive, see [Import
Directive.](Compiler_Directive/Import_Directive.html)

For more information about working with compiler directives in general,
see [Compiler Directives.](Compiler_Directives.html)

The functions for working with Quick Settings files are all located in
the QuickSet.jsd file that ships with JAWS in the root folder of the
shared settings\\(language) folder. You may also refer to the
QuickSet.jss script source file located in the same folder to see how to
apply functions for Quick Settings, and to the ddefault.qs and
default.qsm files to see exactly how to format a Quick Settings .qs and
.qsm file. Some examples drawn from these files are shown below.

When the user toggles an option within the Quick Settings user
interface, JAWS saves the user\'s settings in user-specific
configuration (.jcf or .mcf) files and at times also in .jsi or .ini
files. The user-specific JAWS configuration files are located in the
JAWS root folder of the user\'s Settings\\(language) folder. Any
user-specific .jsi files are located in the PersonalizedSettings folder,
which is under the JAWS root folder of the user\'s Settings\\(language)
folder. Some .ini files - for example, those for voice settings, are
located in the JAWS root folder of the user\'s Settings folder.

The .jcf, .jsi and .ini files all have section names whose entries apply
to a particular type of setting. So it is critical that the .qs and .qsm
files correctly indicate to what section a setting belongs and which
functions or events apply to a setting.

## The QS File

JAWS ships with numerous .qs files for various applications. The
default.qs file contains the settings available to all applications JAWS
supports.

If you are creating Quick Settings for your own applications, the .qs
XML file you create must contain the following parts that must be coded
properly for JAWS to process the file:

### Category

A category is the heading for a group of settings, representing the tree
node in the Quick Settings user interface. Each category contains a list
of settings. Categories can be nested to any depth.

The .qs file must contain descriptions of each category and its
contents. A category is represented by an ID, a unique string within the
.qs file. The syntax for naming IDs is "CategoryName.SettingName". If a
category is nested, you must use the full category path in the ID name.

For example, GeneralOptions.UserVerbosity is the ID User Verbosity
setting under the category of General Options.

### Settings

A setting is represented by an ID. Like a category, a setting must have
a unique string within the .qs file. A setting also must have an
associated type that dictates how the user interface displays the
setting at run-time. The types supported include:

- List - to display a list of values, one of which may be selected.
- Boolean - to display an option that may be toggled On or Off.
- Information - to display the resultant of a setting. For example, to
  have the JAWS user interface display that cell monitoring is ON, use
  the information type for the setting to display which cell is being
  monitored.

A setting can be static or dynamic. For a static setting, the scripts do
not determine the list of possible values of the setting. You can make a
setting static by associating a setting section and a setting name. But
within a static setting, both the section name and the file name may be
dynamic.

The section name can be a variable set in the variable block. Variable
blocks contain variables that you may substitute for names. A variable
has an associated callback function to populate its value. When the
QuickSettings feature loads, it calls the associated callback function
and populates the variable.

A setting is dynamic if the scripts must supply its value or set of
values rather than the value or values being stored in the .qs file. A
setting can be enabled or disabled dynamically.

You may make a setting dynamic by associating callback events in the
setting. When a dynamic setting needs to be loaded, JAWS requests a
possible list of values from the callback event. Every time the user
toggles a dynamic setting, the callback event is notified. The callback
event is responsible for writing the setting.

A setting can have a list of dependent settings. When the setting value
changes, each of the dependent settings is called to update its value
based on the value of the parent setting.

You may also set variables as dependent entries in the .qs file. But
there can be only one level of dependency processing. So if there are
any dependents of the dependents, they are not called.

### SettingsFile Section

JAWS uses the .jcf, .jsi, and .ini files to read setting changes and
write to update those settings based on user interaction. The .jcf,
.jsi, and .ini files have section names whose entries must correspond to
the appropriate type of setting being read or written. For example, if
the setting in the .qs file is not related to a .jcf option or a value
event, you must specify the SettingsFile section accordingly. Section
names may be for Non-JCFOptions, OSM, etc.

The section called \"NonJCFOptions\" is used for scripted settings which
are not known to the internals of JAWS. These are settings that are
unknown to the internal functions, SetJCFOption and GetJCFOption. So,
for a non-JcFOption setting, the syntax is:

    &ltSettingsFile Section="NonJCFOptions" Name="MySettingFunction"/>

For a setting that belongs to the OSM section, the syntax is:

    &ltSettingsFile Section="OSM" Name="MyOSMSettingFunction"/>

For a setting that belongs to read/write events, the syntax is:

    &ltSettingsFile ReadValuesEvent="GetMySettingsFunction" WriteValuesEvent="setMySettingsFunction"/>

## The QSM File

The .qsm file allows you to associate label text and help text based on
the ID of the category or the setting in the .qs file. The IDs must
match. At run-time, the quick settings merges any application-specific
settings with the default.qs and default.qsm files. JAWS Quick Settings
user interface places your application-specific categories at the top of
the tree. Likewise, if your application-specific .qsm file is adding to
an existing category, whatever that .qsm file adds appears at the
beginning of the existing category.

You may format messages you plan to pass as parameters in functions that
read to and write from a .qs file as XML messages. Rather than trying to
remember the exact XML syntax for a parameter that you must pass to a
.qs XML function, it is easier to generate messages with meaningful
names such that the text of the messages have all the correct
formatting. For detailed examples, refer to the QuickSet.jss file that
ships with JAWS. These are the files used by the default.qs file.

## Code Samples for Messages

The below code samples show how to create messages with proper XML
formatting. These are drawn from the QuickSet.jss file, the default
script source file for the default.qs and default.qsm files - all of
which ship with JAWS.

    Messages
    @ListReadResponseStart
    &ltReadResponse ID="ListItems">
    @@
    @ListValuesStart
    &ltListValues SettingsID="%1" SelectIndex="%2">
    @@
    @ListValue
    &ltListValue Text="%1"/>
    @@
    @ListValuesEnd
    </ListValues>
    @@
    @ListReadResponseEnd
    </ReadResponse>
    @@
    ;\037 is the % character used to keep from interfering with formatted strings.
    @VariableReadResponse
    &ltReadResponse ID="VariableResult">
    &ltVariableValue ID="\037%1\037" Value="%2" />
    </ReadResponse>
    @@
    EndMessages

## Functions for Working with QS XML Files

Below is a sampling of the list of functions you may use to read from
and write to .qs XML files for your own application-specific settings.
For the complete list, refer to the QuickSet.jsd file that ships with
JAWS.

### Function: qsxmlMakeBooleanState

#### Description

This function returns the proper state string for use with Quick
Settings xml since atomic types and values in xml are case-sensitive.

#### Syntax

qsxmlMakeBooleanState (nJAWSState)

nJAWSState is an integer value representing either TRUE or FALSE.

#### Returns

A string for the xml state (without the quotes) that represents the
JAWS-usable TRUE/FALSE state constants.

### Function: qsxmlMakeList

#### Description

Use to format xml creating list of available options to submit to the
QuickSettings engine.

#### Syntax

qsxmlMakeList (SettingID, nSelectIndex, ListItems, nArraySize, Optional
bDisabledSetting)

- SettingID is a string representing the ID that came as a parameter to
  your custom callback function.
- nSelectIndex is an integer value representing the item in the array to
  make the default list position.
- ListItems is a StringArray representing the array of items, or
  available settings, for the callback function. Most common list items
  are integers or strings written to xml as strings.
- nArraySize is an integer value representing the size or elements count
  in the listItems array.
- Optional bDisabledSetting is an integer value you may set to TRUE to
  add the attribute to disable the setting. This leaves it in the window
  but renders it unavailable.

#### Returns

A string representing the QuickSettings callback function\'s response
string for list items callbacks.

### Function: qsxmlMakeBoolean

#### Description

Use to format xml creating the state of the checkbox to submit to the
QuickSettings engine. Is used for settings of type Boolean which
correspond to check boxes in QuickSettings.

#### Syntax

qsxmlMakeBoolean (SettingID, State, Optional bDisabledSetting)

- SettingID is a string representing the Setting ID given as parameter
  to the callback function.
- State is a string representing either the string literal \"true\" or
  \"false\" for xml formatting.
- Optional bDisabledSetting is an integer value you may set to TRUE to
  add the attribute to disable the setting. This leaves it in the window
  but renders it unavailable.

#### Returns

A string representing the xml for the boolean callbacks.

### Function: qsxmlMakeVariable

#### Description

This function returns xml format for the callback function associated
with a variable in the qs xml.

#### Syntax

qsxmlMakeVariable (SettingsID, sValue

- SettingID is a string representing the ID supplied as parameter to
  your custom callback function.
- sValue is a string representing the variable\'s value.

#### Returns

A string representing the xml for the callback function associated with
the variable.

### Function: GetNonJCFOption

#### Description

Gets the \"NonJCF\" setting, similar to GetJCFOption except that the
settings are gotten from the NonJCFOptions section of the JCF file. Just
like GetJCFOption, the load order is: Get from application-specific
file, and if not present, get from default file. Uses standard JAWS
Settings layering.

#### Syntax

GetNonJCFOption (sOption, Optional nReadSource)

- sOption is a string representing the string name of the option to
  retrieve, this is the key name.
- Optional nReadSource is an integer representing the source from which
  to read: Constants in hjConst.jsh: rsStandardLayering, rsSession,
  rsFocus, or rsNoTransient

#### Returns

An integer representing the value of the setting in the current or
default jcf file but only if it is in the NonJCFOptions section.

### Function: LoadNonJcfOptions

#### Description

Loads settings from the default and application JCF files that are in
the NonJCFOptions section. These are settings which are implemented
solely through scripts, and are therefore unknown to internal JAWS
functions. LoadNonJCFOptions should run each time an application gains
focus so that script-implemented options in the JCF file load along with
internal JCF options. If a script has customized options for an
application, overwrite this function to load the application\'s
customized options and then call this function for default handling of
script-implemented options.
