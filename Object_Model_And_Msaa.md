# Object Model and MSAA Functions

An Object Model and MSAA function returns information about a specific
object, such as its name, value, type code or subtype code, state, etc.
JAWS uses this information to determine whether to speak and display it
in Braille.

Some examples of Object Model and MSAA functions include:

- SayFocusedObject
- SayObjecttypeAndText
- GetObjectName
- GetObjectSubtypeCode
- GetObjectValue
- GetUIAObjectFocusItem
- ComRelease

For a complete listing of Object Model and MSAA functions, see the
topics in this category book of the Reference Guide.

## Code Sample 1

In the below code sample, the SayObjectTypeAndText function is
overwritten in the Notepad.jss script source file from the function in
default.jss. The overwritten function indicates the current object
subtype code in a nonsense message when the related Object Model and
MSAA event fires.

Note that even when the Notepad document edit window gains focus, this
overwritten function is called and indicates the multi-line edit subtype
code of 66. Object information is not necessarily restricted to dialog
controls.

    Void Function SayObjectTypeAndText (Optional Int nLevel)
    Var
        String smsgObjectSubtypeCode

    smsgObjectSubtypeCode = "My object subtype code is %1."
    smsgObjectSubtypeCode = FormatString (smsgObjectSubtypeCode, IntToString (GetObjectSubtypeCode (nLevel)))
    SayObjectTypeAndText (nLevel)
    SayFormattedMessage (ot_help, smsgObjectSubtypeCode)
    EndFunction

## Code Sample 2

Prior to JAWS 19, the behavior of the ComRelease function when it just
had one parameter was equivalent to assigning the argument to a null
object variable. So it was equivalen to state:\

    ComRelease(obj)
    obj=null

In order to make ComRelease non blocking, it has to be called with a
second parameter, KeepFromBlocking set to TRUE. Since the main purpose
of ComRelease is to be able to make non-blocking release calls, starting
with JAWS 19, the KeepFromBlocking parameter\'s default value is TRUE.
So:\

    ComRelease(obj)

\
will behave as if it was called as:\

    ComRelease(obj, true)

\
and\

    ComRelease(obj, false)

\
will perform with the old behavior:\

    obj=null

## Additional Resources

See the General Scripting Concepts book topics:

- [Objects](../Objects.html)
- [Object Model and MSAA
  Events](../Events/Object_Model_and_MSAA_Events.html)
