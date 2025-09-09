# Looping Functions

The Freedom Scientific Scripting language supports three major types of
looping functions:

- While-EndWhile
- For-EndFor
- ForEach-EndForEach

**CAUTION:** If you get into an infinite loop, you can dump JAWS.
Assuming that your code does not start running again when JAWS restarts,
you can modify your code and fix the problem with the infinite loop
before running the code again.

## Keywords: While-EndWhile

\

### Description

The While and EndWhile keywords begin and terminate a While loop. Follow
the While keyword by a conditional statement, optionally enclosed in
parentheses. As long as the condition(s) in that statement evaluate to
true, the loop allows a given set of actions to be performed repeatedly.

While loops may be nested, but each nesting level must begin and
terminate with the While-EndWhile keywords.

### Syntax

\

    While (Condition)
        Statement(s) ; Call functions.
    EndWhile

\

- Condition is the code that causes the loop to execute as long as it
  evaluates to true.
- Statement(s) are the actions to be performed as long as the loop
  continues.

\

### Remarks

You can use While loops to save space and programming time. However
loops can be dangerous. If the tested condition is not met at least
once, the code inside the loop never runs.

Most critical of all: You must take care to avoid creating an infinite
loop at run-time. Ensure that the tested condition eventually evaluates
to false. And ensure that any compound conditions for a While loop also
eventually evaluate to false.

Unlike For loops, While loops do not increment or decrement
automatically. So if you use an iterator in the test condition of the
While loop, you must initialize the iterator and take care to increment
or decrement the iterator inside the loop.

Never use a Pause statement from inside a While loop as it will cause
very unpredictable results or an infinite loop.

### Code Samples

The first code sample simply counts from 1 to 10 when the script is run
no matter where it is run from within the application. The second sample
adds a conditional test inside the loop. If that condition is met, the
function exits, thus terminating the loop in the function.

Of course, an even more efficient way to handle this scenario is never
to run the loop in the first place. So the third sample tests for the
condition first and returns if the conditions are true. This way, the
looping function is never called.

    Script MyLoopTest () ; no conditions inside the loop to bail out early.
    Var
        Int iCounter,
        String smsgDone

    smsgDone = "I'm done!"
    iCounter = 1 ; Initialize iterator.
    While iCounter <= 10
        SayInteger (iCounter)
        iCounter = iCounter+1
    EndWhile
    SayMessage (ot_JAWS_message,smsgDone)
    EndScript

    Script MyLoopTest () ; with a condition to bail out early if the key assigned to the script is pressed while a menu or dialog is active.
    Var
        Int iCounter,
        String smsgDone,
        String sDoneCounting,
        String sDoneEarly

    sDoneCounting = "done"
    sDoneEarly = "done early"
    smsgDone = "I'm %1!"
    iCounter = 1 ; Initialize iterator.
    While iCounter >= 1
    && iCounter <= 10
        SayInteger (iCounter)
        iCounter = iCounter+1
        ;Test to bail out early if a menu or dialog is active:
        If MenusActive ()
        || DialogActive ()
            SayFormattedMessage (ot_JAWS_message,FormatString(smsgDone,sDoneEarly))
            Return
        EndIf
    EndWhile
    SayFormattedMessage (ot_JAWS_message,FormatString(smsgDone,sDoneCounting))
    EndScript

    Script MyLoopTest () ; with a test to stop processing before ever calling the looping function if the key assigned to the script is pressed from an active menu or dialog.
    Var
        Int iCounter,
        String smsgDone,
        String sDoneCounting,
        String sDoneEarly

    sDoneCounting = "done"
    sDoneEarly = "done early"
    smsgDone = "I'm %1!"

    ;Test to bail out early if a menu or dialog is active:
    If MenusActive ()
    || DialogActive ()
        SayFormattedMessage (ot_JAWS_message,FormatString(smsgDone,sDoneEarly))
        Return
    EndIf

    iCounter = 1 ; Initialize iterator.
    While iCounter >= 1
    && iCounter <= 10
        SayInteger (iCounter)
        iCounter = iCounter+1
    EndWhile
    SayFormattedMessage (ot_JAWS_message,FormatString(smsgDone,sDoneCounting))
    EndScript

\

## Keywords: For, To, Descending, EndFor

\

### Description

The For and EndFor keywords begin and terminate a For loop. Follow the
For keyword by an iterator assigned to an integer range statement,
specifying the initial value through the final value of the iterator.

For loops may be nested, but every For loop must begin and terminate
with the For and EndFor keywords.

For loops allow a given set of actions to be performed repeatedly as
long as the iterator specified in the For loop ranges from the initial
value of the iterator through the final value. By default, the iterator
starts at the initial value and increments by 1 until it reaches the
final value. Using the optional Descending keyword specifies that the
iterator starts at the initial value and decrements by 1 until it
reaches the final value.

### Syntax

\

    For x = Start to End Descending
        Statements(s) ; Call functions.
    EndFor

\

- X is an integer variable to be iterated in the loop.
- Start is the initial value, either an integer variable or integer
  constant, of X in the loop.
- End is the final value, either an integer variable or integer
  constant, of X in the loop.
- Descending is an optional keyword, specifying that X should be
  decremented instead of incremented in the loop.

\

### Remarks

Like While loops, For loops may be used to save space and programming
time. However they can also be dangerous. If the iterator is set to an
initial value that is greater than the final value, and the iterator is
set to increment through the loop, the code inside the For loop is never
run. Likewise, if the iterator is set to an initial value that is less
than the final value, and the iterator is set to decrement through the
loop, the code inside the For loop is never run.

Most critical of all: Avoid creating an infinite loop at run-time. In a
typical For loop, you should not modify the iterator inside the loop;
instead, allow the For loop to increment or decrement the iterator
automatically. Do not modify the iterator inside the For loop so that it
never reaches the final value. If you want the iterator to decrement
instead of increment, you must initialize the iterator in order that the
starting value is greater than the ending value.

### Code Sample

The first code sample is a very simple For-EndFor loop that counts from
1 to 10. The second code sample reverses the count. the third code
sample has a condition inside the loop that halts counting early if it
is met.

    Script MyLoopTest () ; Count from 1 to 10.
    Var
        Int iStart,
        Int iEnd,
        String sMsgDone
    smsgDone = "I'm done!"
    iEnd = 10 ; final value of iterator
    For iStart = 1 to iEnd
        Sayinteger(iStart) ; iterates automatically.
    EndFor
    SayMessage (ot_JAWS_Message,smsgDone)
    EndScript

    Script MyLoopTest () ; Reverse the count.
    Var
        Int iStart,
        Int iEnd,
        String smsgDone

    smsgDone = "I'm done!"
    iEnd = 1
    For iStart = 10 to iEnd Descending
        Sayinteger(iStart)
    EndFor
    SayMessage (ot_JAWS_Message,smsgDone)
    EndScript

    Script MyLoopTest () ; with a condition to bail out early if the key assigned to the script is pressed twice quickly.
    Var
        Int iStart,
        Int iEnd,
        String smsgDone,
        String sDoneCounting,
        String sDoneEarly

    sDoneCounting = "done"
    sDoneEarly = "done early"
    smsgDone = "I'm %1!"
    iEnd = 10
    For iStart = 1 to iEnd
        Sayinteger(iStart)
        If isSameScript () ; Key assigned to script is pressed twice quickly.
            SayFormattedMessage (ot_JAWS_message,FormatString(smsgDone,sDoneEarly))
            Return
        EndIf
    EndFor
    SayFormattedMessage (ot_JAWS_Message,FormatString(smsgDone,sDoneCounting))
    EndScript

\

## Keywords: ForEach, In, EndForEach

\

### Description

The ForEach and EndForEach keywords begin and terminate a ForEach loop.
Follow a ForEach keyword by a string variable to access the keys for
each member of the collection, and the collection to be accessed.

ForEach loops allow enumerating each member of a collection through its
key. ForEach loops may be nested, but every ForEach loop must begin and
end with the ForEach and EndForEach keywords.

### Syntax

\

    ForEach k in col
        ... ;k is the key for each member.
        ... ;col[k] is the member in the collection matching the key.
        Statements()
    EndForEach

\

- K is a string variable that is the key for a member in the collection.
- Col is the collection to be accessed.
- Statement(s) are the actions (function calls) to be performed within
  the ForEach loop.

\

### Remarks

The ForEach loop accesses the members of the collection by alphabetical
order of the member keys.

The string variable contains the key for each member in the collection.
To access the collection member, use the name of the collection followed
by the key variable in square brackets.

### Code Sample

The below code sample names flowers by color and types each message on a
separate line into Notepad using ForEach looping. You save code
statements in the calling function by placing the initialization of each
flower\'s name and color into its own function. You save code statements
in the script by making the function that gathers the collection and
performs the loop. Also in this way, you may add other statements to the
script to call CollectionOfFlowers under one set of conditions and call,
for example, CollectionOfFruit, for a different condition.

Additionally, the extent of the collection in the function is determined
only by how many statements it has. If you make the collection bigger,
the ForEach loop does not need to change because it is already set to
handle however many items exist in the collection.

    Void Function FlowersInit(collection Flowers, String Name, String Color)
    ;Initialize each flower's name and color, ppassed by the calling function, CollectionOfFlowers.
    Let Flowers.Name = Name
    Let Flowers.Color = Color
    EndFunction

    Void Function CollectionofFlowers()
    Var
        Collection Plants,
        Collection Flowers,
        String Key,
        String smsgPlantInfo
    Let sMsgPlantInfo = "I am a %1 %2." ;%1 is the color, %2 is the name of each flower in the collection.

    Let Plants = new collection
    Let Flowers = new collection
    FlowersInit(Flowers,"lily","white")
    Let Plants.lily = Flowers
    Let Flowers = new collection
    FlowersInit(Flowers,"daffodil","yellow")
    Let Plants.daffodil = Flowers
    Let Flowers = new collection
    FlowersInit(Flowers,"orchid","purple")
    Let Plants.orchid = Flowers
    Let Flowers = new collection
    FlowersInit(Flowers,"iris","blue")
    Let Plants.iris = Flowers
    Let Flowers = new collection
    FlowersInit(Flowers,"rose","red")
    Let Plants.rose = Flowers
    Let Flowers = new collection

    ForEach Key in Plants
        SayFormattedMessage (ot_JAWS_message,FormatString(sMsgPlantInfo,
            Plants[key].Color,
            Plants[key].Name))
        TypeString(FormatString(sMsgPlantInfo,
            Plants[key].Color,
            Plants[key].Name)
            +CscBufferNewLine)
    EndForEach
    ;Remove the collections using built-in functions.
    CollectionRemoveAll (Flowers)
    CollectionRemoveAll (Plants)
    EndFunction

    Script MyLoopTest ()
    ;This script calls the function that names each flower in the collection by color.
    CollectionOfFlowers ()
    EndScript
