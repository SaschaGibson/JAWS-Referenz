# Tables Functions

A Tables function provides or returns information about activities
caused by user interaction or automatically updated by an event. JAWS
uses this information to determine whether to speak and display
information in Braille, for comparison purposes, and so on.

Many scripts that ship with JAWS fall into the category of Tables, such
as any of the scripts for moving from one table cell to another, for
example. However, the focus of the present discussion is on functions
related to Tables that you may call from your own scripts or that you
may overwrite from those in default.jss or from the built-in functions.

Some examples of Tables functions include:

- InTable
- GetCell
- GetCellCoordinates
- GetColumnText
- GetRowText

For a complete listing of Tables functions, see the topics in this
category book of the Reference Guide.

## Code Sample

In the below code sample, the script checks to see whether the virtual
cursor is within a table. If it is, JAWS speaks and flashes in Braille
on demand the number of columns and rows contained in the current table
from anywhere inside the table.

Take care when working with the Chrome.jss script source file because it
already contains scripts and functions by default that ship with JAWS.
Place your sample code at the very bottom of the file. And make sure to
remove this overwritten Chrome.jss and its associated overwritten
Chrome.jsb and Chrome.jkm files from your user Settings\\(language)
folder when done testing. It is assumed that the script is being
processed in the Chrome.jss script source file and compiled in the
Chrome.jsb script binary file.

To set up the example, from Google Chrome, open a Web page known to
contain tables. Run the script from within a table and from outside a
table. If the script is run outside a table, JAWS gives you an error
message. Otherwise, JAWS provides you with the information about how
many rows and columns the current table has.

    Script MyTableTest ()
    Var
        String sTableInfo,
        String sTableNum,
        String sCols,
        String sRows

    If !InTable ()
        SayMessage (ot_error,cmsgNotInTable_l, cmsgNotInTable_s)
        Return
    EndIf
    ; For sTableInfo, %1 is the table number, %2 the number of columns, and %3 the number of rows.
    sTableInfo = "Table %1 has %2 columns and %3 rows."
    sTableNum = IntToString (GetTableIndex ())
    sCols = IntToString (GetCurrentRowColumnCount ())
    sRows = IntToString (GetTableRowCount ())
    SayFormattedMessage (ot_user_requested_information,
        FormatString (sTableInfo, sTableNum, sCols, sRows))
    EndScript
