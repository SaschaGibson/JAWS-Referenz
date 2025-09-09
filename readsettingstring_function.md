This function is available in the following releases:

1.  [JAWS 13.00-16.00](#_JAWS13.00-16.00)
2.  [JAWS 17.00 and later](#_JAWS17.00andlater)

# []{#_JAWS13.00-16.00} Function: ReadSettingString

## Description

Reads a string value from an ini style file or one of the transient
settings files for the specified file. An ini style file is a file
containing sections of keys with their values. The file that is read
from is identified by the FileType parameter and an optional FileName
parameter. For some values of the FileType parameter, FT_CURRENT_JCF,
FT_SHARED_CURRENT_JCF, and FT_JSI, for which a file name is required,
the value returned by GetActiveConfiguration will be used if a file name
is not provided via the FileName parameter. When FT_CURRENT_JCF is the
file type, and no file name is supplied, the domain-specific file will
be used if available.

## Returns

Type: string\
Description: The retrieved value or the default value if the key does
not exist in the given section.\

## Parameters

### Param 1:

Type: string\
Description: The name of the section containing the desired key value.
This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: string\
Description: The name of the key whose value is to be retrieved. This
value must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: string\
Description: The value that will be returned if the key cannot be
retrieved. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 4:

Type: int\
Description: One of the FileType (FT\_) constants that identify the type
of file and its location. The currently supported file types for reading
are as follows: FT_MODULE_INI: The INI file for the current product. For
JAWS this file is named JFW.INI. The module INI file is always located
in the same directory in which the product is installed. The FileName
parameter is ignored for this file type. FT_DEFAULT_JCF: The file
Default.JCF. The FileName parameter is ignored for this file type. When
reading from this file, the settings stored in the Default.JCF file
found in the user settings directory will be layered over the settings
stored in the Default.JCF file found in the shared settings directory.
FT_CURRENT_JCF: If available, the domain-specific jcf file. Otherwise,
any application JCF file. If the FileName parameter is not specified,
the value returned by GetActiveConfiguration will be used. When reading
from this file, the settings stored in the JCF file found in the user
settings directory will be layered over the settings stored in the JCF
file found in the shared settings directory. FT_JSI: A JSI file. If the
FileName parameter is not specified, the name of the current application
will be used. FT_SHARED_DEFAULT_JCF: The file Default.JCF found in the
shared settings directory. The FileName parameter is ignored for this
file type. When this file type is specified settings will only be read
from the copy of the file found in the shared settings directory.
FT_SHARED_CURRENT_JCF: Any application JCF file found in the shared
settings directory. If the FileName parameter is not specified, the
value returned by GetActiveConfiguration will be used. When this file
type is specified settings will only be read from the copy of the file
found in the shared settings directory.\
Include: Required\

### Param 5:

Type: int\
Description: One of the ReadSource (rs) constants defined in
HJConst.JSH. The possible values are as follows: rsStandardLayering -
causes standard layering behavior to be used, the setting will be read
from the transient focus file first, then the transient session file,
then the user settings file, and finally the shared settings file,
stopping at the first file in which the desired setting is found;
rsSession - the setting will be read from the transient session settings
file, no layering will be used; rsFocus - the setting will be read from
the transient focus settings file, no layering will be used;
rsNoTransient - the transient settings files will be ignored and the
setting will be read from the user settings file layered over the shared
settings file. Note that this parameter is ignored if the FileType
parameter is FT_MODULE_INI, FT_JSI, FT_SHARED_DEFAULT_JCF, or
FT_SHARED_CURRENT_JCF. If this parameter is not specified the default
value of rsStandardLayering will be used.\
Include: Optional\

### Param 6:

Type: string\
Description: The name of file to read. This value must either be a
variable or contained in quotes. It is unnecessary to specify the full
path of the file, only the file name need be specified, since the file
used will always be located in either the shared settings directory, the
user settings directory, or the personalized settings directory. The
FileType parameter is used to determine in which directory the file will
be searched for. If this parameter is not specified and a file name is
required for the specified file type, the value returned by
GetActiveConfiguration will be used. It is not necessary to specify the
file extension since the file extension that is appropriate for the
specified file type will be added automatically.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.00-16.00

# []{#_JAWS17.00andlater} Function: ReadSettingString

## Description

Reads a string value from an ini style file or one of the transient
settings files for the specified file. An ini style file is a file
containing sections of keys with their values. The file that is read
from is identified by the FileType parameter and an optional FileName
parameter. For some values of the FileType parameter, FT_CURRENT_JCF,
FT_SHARED_CURRENT_JCF, and FT_JSI, for which a file name is required,
the value returned by GetActiveConfiguration will be used if a file name
is not provided via the FileName parameter.

## Returns

Type: string\
Description: The retrieved value or the default value if the key does
not exist in the given section.\

## Parameters

### Param 1:

Type: string\
Description: The name of the section containing the desired key value.
This value must either be a variable or contained in quotes.\
Include: Required\

### Param 2:

Type: string\
Description: The name of the key whose value is to be retrieved. This
value must either be a variable or contained in quotes.\
Include: Required\

### Param 3:

Type: string\
Description: The value that will be returned if the key cannot be
retrieved. This value must either be a variable or contained in quotes.\
Include: Required\

### Param 4:

Type: int\
Description: One of the FileType (FT\_) constants that identify the type
of file and its location. The currently supported file types for reading
are as follows: FT_MODULE_INI: The INI file for the current product. For
JAWS this file is named JFW.INI. The module INI file is always located
in the same directory in which the product is installed. The FileName
parameter is ignored for this file type. FT_DEFAULT_JCF: The file
Default.JCF. The FileName parameter is ignored for this file type. When
reading from this file, the settings stored in the Default.JCF file
found in the user settings directory will be layered over the settings
stored in the Default.JCF file found in the shared settings directory.
FT_CURRENT_JCF: Any application JCF file. If the FileName parameter is
not specified, the value returned by GetActiveConfiguration will be
used. When reading from this file, the settings stored in the JCF file
found in the user settings directory will be layered over the settings
stored in the JCF file found in the shared settings directory. FT_JSI: A
JSI file. If the FileName parameter is not specified, the name of the
current application will be used. FT_SHARED_DEFAULT_JCF: The file
Default.JCF found in the shared settings directory. The FileName
parameter is ignored for this file type. When this file type is
specified settings will only be read from the copy of the file found in
the shared settings directory. FT_SHARED_CURRENT_JCF: Any application
JCF file found in the shared settings directory. If the FileName
parameter is not specified, the value returned by GetActiveConfiguration
will be used. When this file type is specified settings will only be
read from the copy of the file found in the shared settings directory.\
Include: Required\

### Param 5:

Type: int\
Description: One of the ReadSource (rs) constants defined in
HJConst.JSH. The possible values are as follows: rsStandardLayering -
causes standard layering behavior to be used, the setting will be read
from the transient focus file first, then the transient session file,
then the user settings file, and finally the shared settings file,
stopping at the first file in which the desired setting is found;
rsSession - the setting will be read from the transient session settings
file, no layering will be used; rsFocus - the setting will be read from
the transient focus settings file, no layering will be used;
rsNoTransient - the transient settings files will be ignored and the
setting will be read from the user settings file layered over the shared
settings file. Note that this parameter is ignored if the FileType
parameter is FT_MODULE_INI, FT_JSI, FT_SHARED_DEFAULT_JCF, or
FT_SHARED_CURRENT_JCF. If this parameter is not specified the default
value of rsStandardLayering will be used.\
Include: Optional\

### Param 6:

Type: string\
Description: The name of file to read. This value must either be a
variable or contained in quotes. It is unnecessary to specify the full
path of the file, only the file name need be specified, since the file
used will always be located in either the shared settings directory, the
user settings directory, or the personalized settings directory. The
FileType parameter is used to determine in which directory the file will
be searched for. If this parameter is not specified and a file name is
required for the specified file type, the value returned by
GetActiveConfiguration will be used. It is not necessary to specify the
file extension since the file extension that is appropriate for the
specified file type will be added automatically.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 17.00 and later
