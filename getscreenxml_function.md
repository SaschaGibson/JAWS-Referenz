# Function: GetScreenXML

## Description

This function obtains screen content as XML which may be processed by
the Microsoft MSXML Com Object. To use this XML, you will first need to
create an object instance to Microsoft\'s XML Com interface. Use the
following: CreateObject(\"msxml2.DOMDocument.6.0\"), or take a look at
HomeRowUIAObject.jss for code examples using XML. Optionally, do a
search on the Internet for help on data members for the Microsoft XML
object.

## Returns

Type: string\
Description: The screen content as XML.\

## Parameters

### Param 1:

Type: int\
Description: left\
Include: Optional\

### Param 2:

Type: int\
Description: top\
Include: Optional\

### Param 3:

Type: int\
Description: right\
Include: Optional\

### Param 4:

Type: int\
Description: bottom\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 14.00 and later
