# Function: NavigationQuickKeysManager

## Description

This function opens the Navigation Quick Keys Manager which allows the
user to modify the key assignments for the Quick Navigation Scripts that
are available in Internet Explorer, Mozilla Firefox, Adobe Reader,
Microsoft Word, and Microsoft Outlook. The Navigation Quick Keys Manager
can run in three modes that are specified by the nMode parameter. In the
first mode (nMode = 0), the Navigation Quick Keys Manager allows the
user to edit the key assignments for the Quick Navigation Scripts that
are available in HTML and PDF documents. In the second mode (nMode = 1),
the Navigation Quick Keys Manager allows the user to edit the key
assignments for the Quick Navigation Scripts that are available in
Microsoft Word Documents. In the third mode (nMode = 2), the Navigation
Quick Keys Manager allows the user to edit the key assignments for the
Quick Navigation Scripts that are available in Microsoft Outlook.

## Returns

Type: int\
Description: Returns TRUE if the NavigationQuickKeysManager function was
able to display the Navigation Quick Keys Manager dialog box. Returns
False otherwise. Note: This function returns without waiting for the
user to close the Navigation Quick Keys Manager dialog box.\

## Parameters

### Param 1:

Type: int\
Description: Specifies the mode that the Navigation Quick Keys Manager
should run in. If this parameter is set to 0, the Navigation Quick Keys
Manager will allow the user to edit the key assignments for the Quick
Navigation Scripts that are available in HTML and PDF documents. If this
parameter is set to 1, the Navigation Quick Keys Manager will allow the
user to edit the key assignments for the Quick Navigation Scripts that
are available in Microsoft Word documents. If this parameter is set to
2, the Navigation Quick Keys Manager will allow the user to edit the key
assignments for the Quick Navigation Scripts that are available in
Microsoft Outlook. Any other value will cause the
QuickNavigationKeysManager to fail.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 10.0 and later
