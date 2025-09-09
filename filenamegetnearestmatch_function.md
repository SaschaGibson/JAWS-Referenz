# Function: FilenameGetNearestMatch

## Description

This function looks for a file whose name most closely matches the
supplied name. The function uses the second two parameters to narrow the
search. This function is most useful in locating JSI files to associate
settings with documents whose settings maybe similar, indicated by
similar file names eg Excel monthly reports.

## Returns

Type: String\
Description: The nearest matching filename to the one specified.\

## Parameters

### Param 1:

Type: String\
Description: The filename (including optional path). If the path is not
specified the script directory is assumed.\
Include: Required\

### Param 2:

Type: Int\
Description: specifies the minimum number of characters of the
filename\'s prefix which must match, eg if you are only interested in
jsi files starting with excel\_ then the value of this parameter would
be 6.\
Include: Required\

### Param 3:

Type: Int\
Description: Set this to true if the extention must match.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
