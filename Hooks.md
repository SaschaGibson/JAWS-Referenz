# Hooks

You may utilize hooks in your scripts. An example of a hook you may use
often without realizing that it is a hook occurs whenever you instruct
JAWS to spell each word or pronounce each character phonetically as you
navigate by word or character until you press a different key.

Whenever you add a hook, you must also remove it. Otherwise, JAWS cannot
determine when to remove the hook.

For a complete list of hook types, see the HJConst.JSH header file that
ships with JAWS.

## Using Default Hooks

Although you may certainly create your own, you may use any of the
default hook functions in your scripts. Some of the hook functions
include:

- KeyboardHelpHook
- PhoneticSpellHook
- SpellWordHook
- CharacterValueHook

A Hook function returns an integer value of TRUE for the hook function
if the script is allowed to execute, or it returns an integer value of
FALSE for the hook function if the script is not allowed to execute.

## AddHook

\

### Description

This function installs a hook function. When a hook of type script is in
place, it is called right before every script is run, and it is passed
the name of the script that activates the hook. If the script is
attached to a frame, the frame name is also passed to the hook function.

### Syntax

AddHook (HookType, FunctionName)

- HookType is an integer value representing The type of hook to be
  installed. For example, use HK_SCRIPT for a script type hook, or
  HK_EVENT_TRACE for an event trace hook.
- FunctionName is a string of characters enclosed in quotation marks or
  a variable containing the name of a function to be installed as a
  hook.

## RemoveHook

\

### Description

This function removes a hook function put in place by AddHook.

### Syntax

RemoveHook (HookType, FunctionName)

- HookType is an integer value representing the type of hook to be
  removed. You must use the same hook type that you used in the AddHook
  for this parameter.
- FunctionName is a string enclosed in quotation marks or a variable
  containing the name of the function to be removed as a hook.

## Code Sample

The below code sample assigns the two nonsense scripts to the left and
right arrow keys. If the left or right arrow keys are pressed two or
more times quickly, the character under the cursor is announced,
followed by the word, \"hello\". Pressing any other key removes the
nonsense hook. the nonsense hook is performed by the user-defined
nonsense function called \"MyHook\".

    Int Function MyHook (String ScriptName)
    If ScriptName == "MyHookTestForward" then
        SayMessage (ot_message,"hello")
        NextCharacter()
        SayCharacter()
        Return False
    EndIf
    If ScriptName == "MyHookTestBackward" then
        SayMessage (ot_message,"hello")
        PriorCharacter()
        SayCharacter()
        Return False
    EndIf
    RemoveHook (HK_SCRIPT, "MyHook")
    Return TRUE
    EndFunction

    Script MyHookTestForward ()
    If IsSameScript () >= 2
        AddHook (hk_Script,"MyHook")
        Return
    EndIf
    PerformScript SayNextCharacter()
    EndScript

    Script MyHookTestBackward ()
    If IsSameScript () >= 2
        AddHook (hk_Script,"MyHook")
        Return
    EndIf
    PerformScript SayPriorCharacter ()
    EndScript
