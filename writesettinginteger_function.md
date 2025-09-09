This function is available in the following releases:

1.  [JAWS 13.00-16.00](#_JAWS13.00-16.00)
2.  [JAWS 17.00 and later](#_JAWS17.00andlater)

# []{#_JAWS13.00-16.00} Function: WriteSettingInteger

## Description

Writes an integer value to an ini style file. An ini style file is a
file containing sections of keys with their values. The file that is
written to is identified by the FileType parameter and an optional
FileName parameter. For some values of the FileType parameter,
FT_CURRENT_JCF and FT_JSI, for which a file name is required, the value
returned by GetActiveConfiguration will be used if a file name is not
provided via the FileName parameter.

## Returns

Type: int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: The name of the section where the key and value will be
written. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: string\
Description: The name of the key that will hold the value. This value
must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: int\
Description: The value that will be written to the given key.\
Include: Required\

### Param 4:

Type: int\
Description: One of the FileType (FT\_) constants that identify the type
of file and its location. The currently supported file types for writing
are as follows: FT_DEFAULT_JCF: The file Default.JCF. The FileName
parameter is ignored for this file type. When writing to this file, the
changes will always be written to either the copy of Default.JCF found
in the user settings directory or one of the transient settings files
for Default.JCF, depending on the value of the WriteDestination
parameter. The copy of Default.JCF found in the shared settings
directory will never be modified. FT_CURRENT_JCF: Any application JCF
file. If the FileName parameter is not specified, the value returned by
GetActiveConfiguration will be used. When writing to this file, the
changes will always be written to either the copy of the JCF file found
in the user settings directory or one of the transient settings files
for the JCF file, depending on the value of the WriteDestination
parameter. The copy of the JCF file found in the shared settings
directory will never be modified. FT_JSI: A JSI file. If the FileName
parameter is not specified, the value returned by GetActiveConfiguration
will be used. The changes will always be written to the
PersonalizedSettings subdirectory of the user settings directory. The
file types FT_MODULE_INI, FT_SHARED_DEFAULT_JCF, and
FT_SHARED_CURRENT_JCF are not supported by WriteSettingInteger.\
Include: Required\

### Param 5:

Type: int\
Description: One of the WriteDestination (wd) constants defined in
HJConst.JSH. The possible values are as follows: wdUser - indicates that
the setting should be saved to the user settings file; wdSession -
indicates that the setting should be saved to the transient session
settings file; wdFocus - indicates that the setting should be saved to
the transient focus settings file. Note that this parameter is ignored
if the FileType parameter is FT_JSI. If this parameter is not specified
the default value of wdUser will be used.\
Include: Optional\

### Param 6:

Type: string\
Description: The name of file to write to. This value must either be a
variable or contained in quotes. It is unnecessary to specify the full
path of the file, only the file name need be specified, since the file
used will always be located in either the user settings directory or the
personalized settings directory. The FileType parameter is used to
determine in which directory the file will be placed. If this parameter
is not specified and a file name is required for the specified file
type, the value returned by GetActiveConfiguration will be used. It is
not necessary to specify the file extension since the file extension
that is appropriate for the specified file type will be added
automatically.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.00-16.00

# []{#_JAWS17.00andlater} Function: WriteSettingInteger

## Description

Writes an integer value to an ini style file. An ini style file is a
file containing sections of keys with their values. The file that is
written to is identified by the FileType parameter and an optional
FileName parameter. For some values of the FileType parameter,
FT_CURRENT_JCF and FT_JSI, for which a file name is required, the value
returned by GetActiveConfiguration will be used if a file name is not
provided via the FileName parameter. For FT_CURRENT_JCF, if a file name
is not supplied, the domain-specific file will be used if available.
Otherwise, the application\'s jcf file will be used.

## Returns

Type: int\
Description: TRUE if successful, FALSE otherwise.\

## Parameters

### Param 1:

Type: string\
Description: The name of the section where the key and value will be
written. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: string\
Description: The name of the key that will hold the value. This value
must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: int\
Description: The value that will be written to the given key.\
Include: Required\

### Param 4:

Type: int\
Description: One of the FileType (FT\_) constants that identify the type
of file and its location. The currently supported file types for writing
are as follows: FT_DEFAULT_JCF: The file Default.JCF. The FileName
parameter is ignored for this file type. When writing to this file, the
changes will always be written to either the copy of Default.JCF found
in the user settings directory or one of the transient settings files
for Default.JCF, depending on the value of the WriteDestination
parameter. The copy of Default.JCF found in the shared settings
directory will never be modified. FT_CURRENT_JCF: Any domain-specific
JCF file. If not found, the application jcf file will be used. If the
FileName parameter is not specified, the value returned by
GetActiveConfiguration will be used. When writing to this file, the
changes will always be written to either the copy of the JCF file found
in the user settings directory or one of the transient settings files
for the JCF file, depending on the value of the WriteDestination
parameter. The copy of the JCF file found in the shared settings
directory will never be modified. FT_JSI: A JSI file. If the FileName
parameter is not specified, the value returned by GetActiveConfiguration
will be used. The changes will always be written to the
PersonalizedSettings subdirectory of the user settings directory. The
file types FT_MODULE_INI, FT_SHARED_DEFAULT_JCF, and
FT_SHARED_CURRENT_JCF are not supported by WriteSettingInteger.\
Include: Required\

### Param 5:

Type: int\
Description: One of the WriteDestination (wd) constants defined in
HJConst.JSH. The possible values are as follows: wdUser - indicates that
the setting should be saved to the user settings file; wdSession -
indicates that the setting should be saved to the transient session
settings file; wdFocus - indicates that the setting should be saved to
the transient focus settings file. Note that this parameter is ignored
if the FileType parameter is FT_JSI. If this parameter is not specified
the default value of wdUser will be used.\
Include: Optional\

### Param 6:

Type: string\
Description: The name of file to write to. This value must either be a
variable or contained in quotes. It is unnecessary to specify the full
path of the file, only the file name need be specified, since the file
used will always be located in either the user settings directory or the
personalized settings directory. The FileType parameter is used to
determine in which directory the file will be placed. If this parameter
is not specified and a file name is required for the specified file
type, the value returned by GetActiveConfiguration will be used. It is
not necessary to specify the file extension since the file extension
that is appropriate for the specified file type will be added
automatically.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.00 and later
