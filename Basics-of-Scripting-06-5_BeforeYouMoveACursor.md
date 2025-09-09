# 6.5 Before You Move a Cursor

After you activate a cursor you should save its location. This ensures
that the cursor is restored to the correct position on the screen after
your script is performed. For example, when you are using the JAWS
cursor to access a specific button within an application, you want it to
stay there because you need to perform a left mouse click. If you write
a script that moves the JAWS cursor without saving it first, then you
must move the JAWS cursor back to the button after your script is
finished. The end result is that you are left with the wrong cursor
activated and in the wrong place.

You also need to route the cursor to the active application window. This
action ensures the cursor you are using to read specific information is
in the correct window. This is important as the JAWS and invisible
cursors can be anywhere on your screen. So it is always a good idea to
move these cursors to the active application. Otherwise, moving the
cursor may yield unexpected results.

## Saving the Cursor

You can use the SaveCursor built-in function to save the cursor and its
location. The SaveCursor function notes the active cursor and its
present location. You can call this function after activating any of the
cursors such as the JAWS cursor. The following block of code illustrates
the use of the SaveCursor function:

JAWSCursor (); activate the JAWS cursor\
SaveCursor (); save the JAWS cursor and its location

You can call the SaveCursor function multiple times in a script, after
each cursor you activate. This is called \"stacking saved cursors.\" The
following code example illustrates the use of multiple SaveCursor
function calls:

JAWSCursor () ; activate the JAWS cursor\
SaveCursor () ; save the JAWS cursor and its location\
InvisibleCursor () ; activate the invisible cursor\
SaveCursor () ; save the invisible cursor and its location

## Restoring Saved Cursors

After you perform your script and JAWS finds one or more saved cursors,
JAWS restores them automatically. When you save multiple cursors, JAWS
restores the cursors in reverse order.

You can also use the RestoreCursor built-in function when you need to
restore a specific cursor before your script finishes. This function is
useful when you need to save a cursor first, perform an action with that
cursor, and restore it before the script finishes.

### Example 1: Using the RestoreCursor function

PCCursor () ; activate the PC cursor\
SaveCursor () ; save the pc cursor\
JAWSCursor () ; activate the JAWS cursor\
SaveCursor () ; save the JAWS cursor\
; reading statements go here\
RestoreCursor (); restore the JAWS cursor

In the above example, the RestoreCursor function restores the last saved
cursor. In this case, the RestoreCursor function restores the JAWS
cursor since it was the last cursor saved.

## Routing the Cursors

The PC cursor is generally the active cursor in most applications. When
you need to access information outside of the boundaries of the PC
cursor, you need to route either the JAWS or Invisible cursor to the
location of the PC cursor. When you route either cursor, you have a
starting point that you know exists within the active application.

### Routing the JAWS Cursor

You can use the built-in function, RouteJAWSToPC to move the JAWS cursor
to the location of the PC cursor. This function repositions the JAWS
cursor to the exact position of the PC cursor. This function also moves
the mouse pointer to the location of the insertion point or selection
highlight.

However, this function does not activate the JAWS cursor. Any cursor
movement functions used in your script will move the active cursor
instead of the JAWS cursor. If you want the JAWS cursor to move you must
activate it first.

#### Example 2: Using the RouteJAWSToPC function

JAWSCursor (); activate the JAWS cursor\
SaveCursor (); save the JAWS cursor and its location\
RouteJAWSToPC (); move the JAWS cursor to the location of the PC cursor

In the above example, the JAWS cursor is first activated and then saved.
The RouteJAWSToPC function moves the JAWS cursor from its current
location to the location of the PC cursor. At this point, you can use
some of the cursor movement functions to move the JAWS cursor. See [6.6
Moving the Cursor](06-6_MovingTheCursor.htm) for more information on
cursor movement functions.

### Routing the Invisible Cursor

You can use the built-in function, RouteInvisibleToPC, to move the
invisible cursor to the location of the PC cursor. This function
repositions the Invisible cursor to the exact position of the PC cursor.
Unlike the JAWS cursor, the Invisible cursor is not connected to the
mouse pointer, so the function does not move the mouse pointer.

If you want to move the Invisible cursor you must also activate it
first.

#### Example 3: Using the RouteInvisibleToPC function

InvisibleCursor (); activate the Invisible cursor\
SaveCursor (); save the location of the invisible cursor\
RouteInvisibleToPC (); move the Invisible cursor to the PC cursor

In the above example, the Invisible cursor is activated then saved. The
RouteInvisibleToPC function then moves the Invisible cursor to the exact
location of the PC cursor. Now that the Invisible cursor is in the
active window, you can use cursor movement commands to read information
contained within the window.

 

  ---------------------------------------------------------- -- -------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](06-6_MovingTheCursor.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------------
