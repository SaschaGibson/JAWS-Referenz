# Keyword: ;#Pragma StringComparison

## Description

The ;#Pragma StringComparison directive is used to determine how string
comparisons with the == and != operators should be processed by the
compiler. A ;#Pragma statement must be followed either by the keywords,
\"StringComparison full\" or \"StringComparison partial\" without
quotation marks. Place the statements outside of any script or function
code in a script source file.

## Syntax

    ;#Pragma StringComparison Full
    Or
    ;#Pragma StringComparison Partial

- The semicolon and number sign (;#) are the first two characters of the
  keyword, ;#Pragma.
- ;#Pragma StringComparison Full directs the compiler to process any
  string comparisons with the == and != operator fully.
- ;#Pragma StringComparison Partial directs the compiler to process any
  string comparisons with the == and != operators only until the shorter
  of the two strings is matched.

## Code Samples

\

### Set to Full

    ;#Pragma StringComparison Full

    Script TestStrings()
    Var
        String sMyName,
        String sYourName,
        String sMsgMatch,
        String sMsgNoMatch
    let sMyName="Mary Smith"
    let sYourName = "Mary Smith-Jones"
    let sMsgMatch = "Found it!"
    let sMsgNoMatch = "Not found"
    If sMyName == sYourName then
        SayMessage(ot_JAWS_message,sMsgMatch) ; should not work with ;#Pragma StringComparison set to Full
    else
        SayMessage(ot_JAWS_message,sMsgNoMatch) ; should work because ;#Pragma StringComparison set to Full
    EndIf
    EndScript

\

### Set to Partial

    ;#Pragma StringComparison Partial

    Script TestStrings()
    Var
        String sMyName,
        String sYourName,
        String sMsgMatch,
        String sMsgNoMatch
    let sMyName="Mary Smith"
    let sYourName = "Mary Smith-Jones"
    let sMsgMatch = "Found it!"
    let sMsgNoMatch = "Not found"
    If sMyName == sYourName then
        SayMessage(ot_JAWS_message,sMsgMatch) ; should work with ;#Pragma StringComparison set to Partial
    else
        SayMessage(ot_JAWS_message,sMsgNoMatch) ; should not work because ;#Pragma StringComparison set to Partial
    EndIf
    EndScript

\

## Remarks

Since JAWS 13, all string comparisons using the == and != operators
behave as if the ;#Pragma StringComparison functionality were set to
full. This is default behavior. But prior to JAWS 13, string comparisons
were processed such that the comparison ended when the shorter of the
two strings matched the longer of the two.

The scripter may direct the compiler as to how to process string
comparisons: ;#Pragma StringComparison set to full or set to partial. If
set to full, succeeding string comparisons using the == and != operators
ensure that the compiler processes string comparisons fully regardless
of which is shorter. If set to partial, the compiler processes string
comparisons using the older method used in versions prior to JAWS 13.
