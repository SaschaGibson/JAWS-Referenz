# Keyboard Functions

A Keyboard function returns information about the keyboard in use, what
keys are pressed, the state of keys being pressed, etc. JAWS uses this
information to determine what to speak and display in Braille, for
comparison purposes, and so on.

Many scripts that ship with JAWS fall into the Keyboard category.
However, the present topic focuses on functions related to the keyboard
since scripts are typically bound to key assignments.

Some examples of Keyboard functions include:

- KeyIsSpaceBar
- IsKeyWaiting
- GetKeyState
- GetLastKeyPressTime
- PassKeyThrough
- TypeKey

For a complete listing of Keyboard functions, see the topics in this
category book of the Reference Guide.

In the early days of the Freedom Scientific Scripting language, it was
commonplace to use braces to surround intentional key presses to be
performed as part of a script or function. This has not been standard
practice for many years. It is discouraged because there are functions
available to facilitate typing keys within a script or function that are
much more reliable and avoid hard coding.

## Code Sample

Some people have a difficult time pressing more than two keystrokes
simultaneously. In the below code sample, the script passes the
**CONTROL+A** key combination to the TypeKey function in order to select
all the text in the document if there is no selected text.

    Script MyKeyboardFunctionTest ()
    If GetWindowClass (GetFocus ()) == cwc_edit
    && ! DialogActive ()
        If GetSelectedText () == cscNull ; There is no selected text.
            TypeKey (cksSelectAll,1) ; CTRL+A from the PC keyboard
            PerformScript SaySelectedText ()
        EndIf
    EndIf
    EndScript
