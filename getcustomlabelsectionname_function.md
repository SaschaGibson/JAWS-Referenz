# Function: GetCustomLabelSectionName

## Description

This allows scripts used in the process of creating a custom label to
obtain the section name for the current document. Typically the section
name is just \[CustomLabels\] but in the case of MSWord, where the
labels are stored in a file named after the attached template, the
section name may also be \[CustomLabels docname.doc\] where docname.doc
refers to the specific document. thus, MSWord may define template level
and document level custom labels.

## Returns

Type: string\
Description: the section name containing custom labels for this
document.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 9.0 and later
