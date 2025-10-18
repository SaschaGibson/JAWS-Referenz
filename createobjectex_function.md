# Function: CreateObjectEx

## Description

In applications such as Internet Explorer or those found in Microsoft
Office, launches an application under the control of JAWS, which is the
automation object. The difference between CreateObject and GetObject is
that GetObject creates a pointer to an automation object that already
exists, whereas CreateObject creates the automation object for the
application.

## Returns

Type: Object\
Description: The automation object associated with the program.\

## Parameters

### Param 1:

Type: String\
Description: Name of the COM class that can return an automation
object.\
Include: Required\

### Param 2:

Type: Int\
Description: TRUE = Same behavior as CreateObject. FALSE = Will always
force the use of CoCreateInstance instead of using GetObjectHelper when
JAWS is running as a service.\
Include: Required\

### Param 3:

Type: string\
Description: name of the manifest file that contains the Registration
Free COM information or the name of a .dll with a manifest embedded as a
resource. Providing this parameter allows creation of an object that
hasn\'t been registered. This parameter is supported in JAWS 10.0 and
beyond More information can be found at http://msdn.microsoft.com by
searching for \"Registration Free COM\"\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
