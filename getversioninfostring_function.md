# Function: GetVersionInfoString

## Description

GetVersionInfoString gets a requested string from the version table of
an application.

## Returns

Type: String\
Description: The requested string.\

## Parameters

### Param 1:

Type: string\
Description: The path of the program for which you want the information.
You can get the path by using GetAppFilePath.\
Include: Required\

### Param 2:

Type: string\
Description: Identifier string specifying which piece of information is
requested. Identifiers must be contained within quotation marks. You can
use the following identifiers: Comments, CompanyName, FileDescription,
FileVersion, InternalName, LegalCopyright, LegalTrademarks,
OriginalFilename, PrivateBuild, ProductName, ProductVersion, or
SpecialBuild.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
