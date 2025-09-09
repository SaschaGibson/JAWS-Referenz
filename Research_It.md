# Research It Functions

A Research It function provides or returns information about script
activities caused by user interaction. JAWS uses this information to
determine whether to speak and display information in Braille, for
comparison purposes, and so on.

Some scripts that ship with JAWS fall into the category of Research It,
such as the script for ResearchIt, for example. However, the focus of
the present discussion is on functions related to Research It that you
may call from your own scripts or that you may overwrite from those in
default.jss or from the built-in functions.

Some examples of Research It functions include:

- IterateLookupModules
- LRL_Dialog
- LRL_GetFirstLookupModule

For a complete listing of Research It functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script determines the number of Research
It Lookup module and rule sets currently in use, and displays the list,
along with the primary Lookup module rule set in the Virtual Viewer for
you to read as you prefer.

It is assumed that the script is being processed in the Notepad.jss
script source file and compiled in the Notepad.jsb script binary file.

To set up the example, first run the script from Notepad without making
any changes to the default Research It rules. Then use the JAWS user
interface to change the number of modules and rule sets you want
displayed in your list whenever you invoke the Research It dialog. Also,
change the primary Lookup module to something other than the default.
(You can always return everything to their default values later.)

Finally, run the script again from Notepad to see your changes reflected
in the Virtual Viewer.

    Messages
    ; For msgModulesInfo, %1 is the number of module rule sets, %2 their names, and %3 the name of the primary module rule set, if it exists.
    @msgModuleInfo
    I am using %1 rule sets. They are:

    %2
    My primary Lookup module rule set is %3.
    @@
    EndMessages

    Script MyResearchItModules ()
    Var
        Int iNum, ; number of modules found.
        String sNum, ; the number converted to a string.
        String szModuleNames, ; provided by reference.
        String szRuleSets, ; Provided by reference.
        String sDefaultModule, ; provided by reference.
        String sDefaultRule, ; rule set of primary if exists, provided by reference.
        String sText

    iNum = IterateLookupModules (szModuleNames, szRuleSets)
    If ! iNum
        Return ; none found.
    EndIf
    sNum = IntToString (iNum)
    szRuleSets = StringReplaceChars (szRuleSets, "\007", cscBufferNewLine)
    If LRL_GetPrimaryLookupModule (sDefaultModule, sDefaultRule) ; a primary module and rule set was found.
        SText = FormatString (msgModuleInfo, sNum, szRuleSets, sDefaultRule)
    Else
        sDefaultRule = "not found"
        SText = FormatString (msgModuleInfo, sNum, szRuleSets, sDefaultRule)
    EndIf
    EnsureNoUserBufferActive ()
    UserBufferAddFormattedMessage (sText + cscBufferNewLine + cscBufferNewLine + cmsgBuffExit)
    UserBufferActivate ()
    JAWSTopOfFile ()
    SayAll ()
    EndScript

## Additional Resources

For more details about working with Research It rules, see the summary
in the General Scripting Concepts book called [Creating research It
Rules.](../Creating_ResearchIt_Rules.html)

For more details on working with the Virtual Viewer, see the summary in
the General Scripting Concepts book called [Implementing a Virtual
Viewer Window.](../Virtual_Viewer_Functions.html)
