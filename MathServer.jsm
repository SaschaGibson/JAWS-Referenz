; Copyright 2014-2015 by Freedom Scientific, Inc.

messages
@msgMathServerAppFileName
Math Viewer
@@
; the following strings represent navigation modes for different types of math content
; equations contain fractions, exponents (superscripts), square roots, parentheses, etc.
; Examples: x + y = z, E = mc^2
@msgEquationNavigation
equation navigation
@@
; stacks are elementary math notation for performing addition, subtraction,
; multiplication, and division problems by hand, usually by grade school students.
@msgStackNavigation
stack navigation
@@
; Long division navigation is the elementary math notation specifically for division problems.
@msgLongDivisionNavigation
long division navigation
; Tables (or matrixes) are data laid out in grids
@@
@msgTableNavigation
table navigation
@@
; a partial expression is a component of a larger equation.
@msgNoNextSubEquation
No more terms at this level of the current expression
@@
@msgNoPriorSubequation
No prior terms at this level of the current expression
@@
; equations may be broken down into groups of smaller and smaller expressions
; We refer to the highest or top level as the equation or full expression
; The parts of the equation are referred to as partial expressions.
; The parts of the partial expression are referred to as terms
@msgNoParentSubequation
No higher levels for the current expression
@@
@msgNoChildSubequation
No lower levels for the current expression
@@
; Stacks, elementary math notation for addition, subtraction, multiplication, and division,
; contain rows and columns like tables.
@msgNoStackNextRow
no next stack row
@@
@msgNoStackPriorRow
no prior stack row
@@
@msgNoStackNextColumn
no next stack column
@@
@msgNoStackPriorColumn
no prior stack column
@@
; the following messages which contain the word "already"
; are spoken when the user performs a keystroke which would 
; navigate them to the location they are at already .
@msgAlreadyOnStackFirstColumn
already on first stack column
@@
@msgAlreadyOnStackLastColumn
already on last stack column
@@
@msgAlreadyOnStackFirst
already at beginning of stack
@@
@msgAlreadyOnStackLast
already at end of stack
@@
@msgNotInTable
Not in a table
@@
@msgNoTableNextRow
no next table row
@@
@msgNoTablePriorRow
no prior table row
@@
@msgNoTableNextColumn
no next table column
@@
@msgNoTablePriorColumn
no prior table column
@@
@msgAlreadyOnTableFirstColumn
already on first table column
@@
@msgAlreadyOnTableLastColumn
already on last table column
@@
@msgAlreadyOnTableFirst
already at beginning of table
@@
@msgAlreadyOnTableLast
already at end of table
@@
@msgAlreadyOnFirstEquationElement
already on first equation element
@@
@msgAlreadyOnLastEquationElement
already on last equation element
@@
; As mentioned above, equations can be broken down into
; smaller and smaller components.
; The smallest components possible are called "leaf nodes".
; Think of a tree: the largest component, the trunk, splits into branches;
; and the branches split into leaves, which are the smallest possible
; subcomponents of the tree (for our purposes anyway).
; In the Math Viewer, one may navigate from leaf node to leaf node
; without having to first navigate to any larger, parent components.
@msgAlreadyOnFirstEquationLeafElement
already on first equation leaf element
@@
@msgAlreadyOnLastEquationLeafElement
already on last equation leaf element
@@
; the following message is spoken when using an equation navigation key command
; in table navigation mode.
@msgNoTableNavigationInEquationMode
no table navigation in equation mode
@@
@msgScreenSensitiveHelpMathEquationNavigation
Use the arrow keys to navigate the expressions within this equation.
To close the Math Viewer, press Escape.
@@
@msgScreenSensitiveHelpMathStackNavigation
Use the arrow keys to move between the columns and rows of this arithmetic problem.
To close the Math Viewer, press Escape.
@@
@msgScreenSensitiveHelpMathLongDivisionNavigation
Use the arrow keys to navigate the columns and rows of this long division problem.
Use Tab and Shift+tab to move between the divisor, divident and quotient.
To close the Math Viewer, press Escape.
@@
@msgScreenSensitiveHelpMathTableNavigation
Use the arrow keys to navigate the columns and rows of this tabular math problem. 
Use Control + Up and Down Arrow to navigate between alignment points within table cells. 
Alignment points are usually used when two equations are stacked one on top of the other. 
To close the Math Viewer, press Escape.
@@
@msgScreenSensitiveHelpMathCATNavigation
Use ARROW keys along with modifier keys (CTRL and SHIFT) to navigate the elements of this math expression.
To close the Math Viewer, press ESC.
@@
@msgHotKeyHelpMathEquationNavigation
To move between parts of the expression, use the left and right arrow keys.
To focus in on a partial expression , press DownArrow.
To return to the whole expression, press UpArrow.
To read all the partial expressions at the current level, press the Say Line command.
To read the current partial expression or term, press the Say Word or Say Character command.
From within the Math Viewer, press Escape or Alt+F4 to exit.
@@
@msgHotKeyHelpMathStackNavigation
To move between the columns, press the left and right arrow keys.
To move between the rows of each column, press the up and down arrow keys.
To read the currently selected item in the column, press the Say Word or Say Character command.
To read the current row from left to right, press the Say Line command.
From within the Math Viewer, press Escape or Alt+F4 to exit.
@@
@msgHotKeyHelpMathLongDivisionNavigation
To navigate between divisor, dividend and quotient, use Tab and Shift+Tab.
To move between columns in the focused area, press the left and right arrow keys.
To move between rows in the focused area, press the up and down arrow keys.
To read the current row, press the SayLine command.
To read the current cell in the row, press the Say Word or Say Character command.
From within the Math Viewer, press Escape or Alt+F4 to exit.
@@
@msgHotKeyHelpMathTableNavigation
To move between cells in the current row, press the left and right arrow keys.
To move between rows, press the up and down arrow keys.
To say the selected cell, press the Say Word or Say Character command.
To read the current row, press the Say Line command.
To move between alignment points in the selected table cell, press Control with the up or down arrow keys.
Alignment points are usually used when two equations are stacked one on top of the other.
Visually, there are points in the two equations which should be aligned vertically for clarity because the aligned points are related to one another mathematically.
From within the Math Viewer, press Escape or Alt+F4 to exit.
@@
@msgHotKeyHelpMathCATNavigation
To move between elements of the expression, use the LEFT and RIGHT ARROW keys.
To focus in on a part within an element, press DOWN ARROW and then RIGHT or LEFT ARROW.
Use CTRL+LEFT or CTRL+RIGHT ARROW to move to a different element.
To return to the whole expression, press UP ARROW.
To read all the partial expressions at the current level, use the Say Line command.
To read the current partial expression or term, use the Say Word or Say Character command.
When in a table and focused on a table cell, use CTRL+ALT+ARROW keys to move among table cells.
In tables, use the Current Character or Current Word command to hear the current row/column information.
Press BACKSPACE anywhere within the current element to move back one element within the current math expression.
Press CTRL+1 through 0 on the number row to set a place marker at a specific element within the current math expression.
Press 1 through 0 on the number row to move to the element of a place marker you have set in the current math expression.
Press SHIFT+1 through 0 on the number row to read but not move to the element of a placemarker you have set.
Press CTRL+SHIFT+1 through 0 on the number row to describe the element of a placemarker you have set with more information about the current element.
Press ESC or ALT+F4 to exit the math viewer and return to where you were last.
@@
@msgHotKeyHelpBraille
The routing buttons and panning keys on your Braille display function similar to how they would anywhere else.
Press a routing button to move the cursor to that location in the math expression.
Use the panning keys to scroll left and right through the math expression.
@@
@msgMathViewerTutorHelp
To navigate use the arrow keys.
To close the math viewer press escape.
@@
@msgTutorHelpMathEquationNavigation
To move between partial expressions, press the arrow keys.
To interact with a table, press Enter.
@@
@msgTutorHelpMathCatEquationNavigation
To review the expression use the ARROW keys.
Press INSERT+H to list additional commands. 
@@
@msgTutorHelpMathStackNavigation
To move between rows and columns, use the arrow keys.
@@
@msgTutorHelpMathLongDivisionNavigation
To navigate between divisor, dividend and quotient, use Tab and Shift+Tab.
To move between rows and columns, use the arrow keys.
@@
@msgTutorHelpMathTableNavigation
To move between cells, use the arrow keys.
To return to the parent equation, press Escape.
@@
@msgWordInContextErrorMathViewer
Not available outside of tables in the Math Viewer.
@@
EndMessages