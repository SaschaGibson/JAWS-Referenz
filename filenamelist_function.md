This function is available in the following releases:

1.  [JAWS 5.00-22.00](#_JAWS5.00-22.00)
2.  [JAWS 23 and later](#_JAWS23andlater)

# []{#_JAWS5.00-22.00} Function: FileNameList

## Description

This function returns a delimited list of file names matching the
specified criteria. For example, to get a list of scheme files, pass in
\"\*.smf\" for the first parameter

## Returns

Type: String\
Description: a delimited list of file names matching the specified
criteria.\

## Parameters

### Param 1:

Type: String\
Description: sFileNameMask filename mask optionally including path
information. If no path is included, the settings/lang path is
prepended\
Include: Required\

### Param 2:

Type: String\
Description: sDelim the delimiter to separate filenames with. If no
delimiter is supplied, \\007 is used.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 5.00-22.00

# []{#_JAWS23andlater} Function: FileNameList

## Description

This function returns a delimited list of file names matching the
specified criteria. For example, to get a list of scheme files, pass in
\"\*.smf\" for the first parameter

## Returns

Type: String\
Description: a delimited list of file names matching the specified
criteria.\

## Parameters

### Param 1:

Type: String\
Description: sFileNameMask filename mask optionally including path
information. If no path is included, the settings/lang path is
prepended\
Include: Required\

### Param 2:

Type: String\
Description: sDelim the delimiter to separate filenames with. If no
delimiter is supplied, \\007 is used.\
Include: Optional\

### Param 3:

Type: String\
Description: callback an optional callback function for filtering each
file. The function is passed the basename of the file (i.e. without
extension) and it must return true to include it in the list, or false
to exclude it.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 23 and later
