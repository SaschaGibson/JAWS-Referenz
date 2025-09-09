# Redirecting Function Calls Using Scope

The scope qualifier is used to specify the location where JAWS should
search for a function or script. Unqualified function calls behave
exactly as in the standard calling hierarchy for calling scripts and
functions.

The syntax for using scope qualifiers is this: To call a specific
instance of a script or function, precede its name by the basename of
the file in which it resides, followed by two colons (::). If the base
name contains spaces, replace the spaces in the call with the underline
character (\_).

Be careful when specifying scope. If you restrict a function to a
specific scope, all of the calls made from that function are also
restricted to that scope. For instance, if you make the following
restriction:

    Default::FocusChangedEvent (hwndFocus, hwndPrevFocus)

\
then any function calls in the default FocusChangedEvent are also
restricted to default.

Also be careful when specifying scope that you do not bypass any
functions that may be layered in script binary (jsb) files between your
script file and default. For instance, in a Microsoft Word script,
specifying

    Default::GetCustomTutorMessage ()

\
would skip over the version of that function in the Office script binary
(jsb) file. that binary file is part of the Microsoft Word script set.
Generally, when restricting scope, it is safer to restrict it to Self
rather than to Default unless you are sure that default is really the
intended scope.

The search for a qualified name only occurs within the scope of the file
to which the qualification refers. So if you call Default::SayString
from within an application script source file, only default.jsb is
searched for SayString. If that function also exists within the
application script source file, it is ignored.

In addition to specifying a qualification by script file name, you may
also specify that a built-in function be called. For example,

    Builtin::SayLine ()

specifies that the built-in SayLine function be called, not an
overwritten SayLine function.

You may use as a qualifier, meaning that the name of the current script
file should be searched. So, if you are writing script code in
\"MyApplication.jss\", the following are identical qualifiers specifying
that the search for SayCell should begin in the \"MyApplication.jsb
script binary file:

    MyApplication::SayCell ()
    Self::SayCell ()
