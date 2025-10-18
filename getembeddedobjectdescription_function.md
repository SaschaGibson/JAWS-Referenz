# Function: GetEmbeddedObjectDescription

## Description

Used to get the description of an object embedded within another object.
Usually, this applies to objects, such as links, which may be embedded
within a text object. Presently, this function will only return success
when focus is on a text object with a role of IA2_ROLE_PARAGRAPH. At
this time, the only application implementing such objects is in Lotus
Notes 8. This function is available after JAWS 8, update 1.

## Returns

Type: string\
Description: Description of the embedded object at the cursor position.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 8.0 and later
