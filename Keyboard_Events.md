# Keyboard Events

A Keyboard Event function provides information about PC keyboard or
Braille display keyboard user interaction. The information may include
key names, whether the key press is coming from a PC keyboard or from a
Braille display, the key scan code, etc. JAWS uses this information for
comparison purposes, and so on.

A key scan code is a number (or sequence of numbers) sent by a computer
keyboard to the operating system on your computer. The scan code reports
what key is being pressed. Each and every key on your keyboard, whether
it is a standard PC keyboard, a fancy wireless keyboard, or a keyboard
that is part of your Braille display is assigned a unique scan code.

Some examples of Keyboard Event functions include:

- KeyPressedEvent
- KeymapChangedEvent
- QuickKeyNavigationModeChanged

For a complete listing of Keyboard Event functions, see the category
book in the JAWS [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, the KeyPressedEvent function is overwritten
for Notepad to announce the number of the key scan code of any key you
press from the Notepad main edit window. It is assumed that the function
is being processed in a Notepad.jss script source file and compiled in
the Notepad.jsb script binary file.

This test can serve as a method to obtain the key scan code for a
particular key so that you may utilize that scan code for comparison
purposes in KeyPressedEvent or elsewhere. For example, you may place the
key scan code information into a global variable and use that variable
in some other function or in a script where you want JAWS to speak or
display something in Braille.

Key scan codes can vary according to localization. So do not assume that
any key code will be the same for all localizations. For example, for US
English, the key scan code for **ENTER** is 28. But this may not be the
case for other localizations.

Suppose you want JAWS to speak a special message when the **ENTER** key
is pressed. First run the code sample to determine what the key scan
code is for **ENTER**. For purposes of the example, we assume the
standard US English key scan code set. so **ENTER** is 28. Assuming
this, you can change the condition in the function (or in some other
function or script) so that when the key is pressed, JAWS indicates your
special message. This can be very useful when an application uses common
keys in nonstandard ways, such as for a Call Center or other customized
application.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Globals
        Int gbEnterKeyWasPressed

    Void Function KeyPressedEvent (int nKey, string strKeyName, int nIsBrailleKey, int nIsScriptKey)
    Var
        String msgEnter

    msgEnter = "Hello, I am the Enter key."

    KeyPressedEvent (nKey, strKeyName, nIsBrailleKey, nIsScriptKey)
    If ! (DialogActive ()
    || MenusActive ()) ; Neither a dialog or a menu is active.
        If GetObjectSubtypeCode () == wt_Multiline_edit
            SayInteger (nKey)
            If nKey == Key_Enter ; 28
                SayMessage (ot_smart_Help, msgEnter)
                Let gbEnterKeyWasPressed = TRUE
                Return
            EndIf
        EndIf
        Let gbEnterKeyWasPressed = FALSE
    EndIf
    Let gbEnterKeyWasPressed = FALSE
    EndFunction

## Additional Resources

For a complete discussion of the Freedom Scientific Scripting language
support for keyboard management - including key maps, hook, and key
layering functions, see [Key Management.](../Key_Management.html)

For more details on working with key scan codes, refer to the Microsoft
Developer Network in the section called [Key Scan
Codes.](http://msdn.microsoft.com/en-us/library/aa299374(v=vs.60).aspx)
