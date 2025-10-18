# Function: VisualStudioGetAddinObject

## Description

Works around a bug in Visual Studio 2010 where a script can\'t call any
methods on an AddIn retrieved from the VisualStudio AddIns collection.
The AddIn thus retrieved provides information like the name and ProgId
of the AddIn, and a function called GetObject that provides an IDispatch
interface to the AddIn itself. This function does the job of the
AddIn.GetObject method were it not to be broken.

## Returns

Type: object\
Description: that gives access to the public methods of the Connect
object implemented by the AddIn\

## Parameters

### Param 1:

Type: object\
Description: An AddIn object as retrieved from the VisualStudio AddIns
collection.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 12.0 and later
