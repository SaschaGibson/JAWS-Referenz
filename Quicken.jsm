; JAWS Build 4.51
; Quicken Deluxe 2003 Script Message File
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Written by Joseph K Stephen
; Modified for QW 2003 by Jim Snowbarger, A.K.A. The SnowMan
; Build QW3710536 last modified on October 3, 2000

const
;Keystrokes
ks1 = "alt+downarrow",  ;To open list boxes
ks2 = "alt+uparrow",
ks3 = "control+pageup",
ks4 = "control+pagedown",
KeyCode_enter = 28,
; comparisons
scComma=",",
scColon=":",
scNextCheckNum = "Next Check Num",
scHidden = "Hidden",
scMemoBeforeCategory="Memo/Category", ; used to determine if the memo field is displayed before or after the category field in the registers.
scDateFirst1="Date Num",
scDateFirst2="Date Ref",
scWelcome="Welcome to the Planning Center", ; Planner welcome
scAction="Action",
scSecurity="Security",
scLoanViewIdentifier=": View Loans",
scAssetLiabilityIdentifier1="Asset", ; this is more general than loan view and test should be placed after that test
scAssetLiabilityIdentifier2="Liability", ; this is more general than loan view and test should be placed after that test
scInvestmentIdentifier="Investment", ; for investment accounts
scWriteChecksViewIdentifier = "Write Checks: ",
scBalance="Balance",
scCurrentBalance="Current Balance",
scEndingBalance="Ending Balance",
scOpeningBalance="Opening Balance:",
scOnlineBalance = "Online Balance",
scTotal="Total",
scSpending = "Spending",
scBudget = "Budget: ",  ; part of budget setup window name
scAnalyze = "Analyze: ", ; part of budget analyze window name
; next three are part of the budget setup screen window names
scMonthlyAverage = "Monthly average",
scQuarterlyAverage = "Quarterly average",
scYearlyAverage = "Yearly average",
; Month names for the analyze window in budget setup
; this is just month abbreviations all smashed together
scMonths = "JanFebMarAprMayJunJulAugSepOctNovDec",

; Part of the statement summary window name in the reconcile screen
scStatementSummary = "Statement Summary: ",

; Graphic Names, must match the jfg file
gn_Security = "security",
gn_Collapsed = "collapsed",
gn_Expanded = "expanded",

; Window Names
wn_InvestingCenter = "Investing Center",
wn_ChooseCategories = "Choose Categories",
wn_CloseSymbol = "close symbol",  ; name of the graphic
wn_MonthlyBudgetAmount = "Monthly Budget Amount",
wn_MonthlySummary = "Monthly Summary",
wn_MonthlyBudgetSummary = "Monthly Budget Summary",
wn_Amount = "Amount",
wn_Message = "Message",
wn_QuickenHome = "Quicken Home",
wn_EditFuturePaychecks = "Edit Future Paychecks",
wn_EditCurrentPaycheck = "Edit Current Paycheck and Enter into Register",
wn_EditCurrentTransaction = "Edit Current Transaction and Enter into Register",
wn_SetUpBills = "Set Up Bills",
wn_EndingBalance = "Ending Balance",
wn_FinancialInstitution = "Financial Institution",
WN_QuickEntry2003 = "QuickEntry 2003",
wn_newUserSetup="Get Started with Quicken 2003",
wn_QuickenGuidedSetup = "Quicken Guided Setup",
wn_creatingNewFile="Creating New File",
wn_createNewAccount="Create New Account",
wn_accountSetup="Account Setup",
wn_accountList = "Account List",
wn_loanSetup="Loan Setup",
wn_quicken2000forWindows="Quicken 2000 for Windows",
wn_quicken2001forWindows="Quicken 2001 for Windows",
wn_newCategory="New Category",
wn_myFinances="My Finances",
wn_splitTransactionWindow="Split Transaction Window",
wn_calculator="Quicken Calc",
wn_addressBook="Address Book",
wn_planning="Planning",
wn_onlineSetup="Online Setup",
wn_reconcile="Reconcile",
wn_loanCalculator="Loan Calculator",
wn_refinanceCalculator="Refinance Calculator",
wn_savingsCalculator="Savings Calculator",
wn_collegeCalculator="College Calculator",
wn_retirementCalculator="Retirement Calculator",
wn_CreateScheduledTransaction = "Create Scheduled Transaction",
wn_ScheduledTransactionList = "Scheduled Transaction List",
wn_Schedule="Schedule",
wn_WelcomeToQHI="Welcome To ...",

; month names, retain the "|" separator symbols
; used in the budget, Monthly Summary sheet
MonthNames = "January|February|March|April|May|June|July|August|September|October|November|December|Total",




;UNUSED_VARIABLES

scBanking="Banking : ",
scYes = "Yes",
scNo = "No",
scOK = "OK",
scCancel = "Cancel",
scNext = "Next",
scBack = "Back",
scAddAccount = "Add Account",
wn_quickEntry2001="QuickEntry 2001",
wn_quickEntry2000="QuickEntry 2000",
wn_productRegistration="Product Registration"

;END_OF_UNUSED_VARIABLES

messages
@QWMsgHelp1_L
The listbox portion of an edit combo is active.
Use up and down to select an entry.
@@
@QWMsgHelp1_S
The listbox portion of an edit combo is active.
Use up and down to select an entry.
@@
;for QWMsgHelp2_L/S, %1=button names
@QWMsgHelp2_L
Press %KeyFor(ListButtonActivate) to access a list of the following buttons: %1, associated with this list.
@@
@QWMsgHelp2_S
Press %KeyFor(ListButtonActivate) to access %1 buttons.
@@
;for QWMsgHelp3_L/S, %1=single button name
@QWMsgHelp3_L
Press %KeyFor(ListButtonActivate) to activate the %1 button associated with this list.
@@
@QWMsgHelp3_S
Press %KeyFor(ListButtonActivate) to activate the %1 button.
@@
@QWMsgHelp4_L
Use alt+up arrow to close the listbox.
Press tab to move to the next control.
@@
@QWMsgHelp4_S
alt+up arrow to close listbox.
tab to move to the next control.
@@
;for QWMsgHelp5_L/S, %1=focused field's name
@QWMsgHelp5_L
This is the Write Checks View.
this is the %1 field.
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
Use the Tab and Shift Tab keys to move between the Check fields and option buttons.
@@
@QWMsgHelp5_S
Write Checks View
%1 field
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
Use the Tab and Shift Tab keys to move between the Check fields and option buttons.
@@
@QWMsgHelp6_L
This is the Split Transaction Window.
It is set out like a spreadsheet with three columns and 30 rows.
Use Tab and Shift Tab to move between columns and Up and Down Arrow to move between rows.
When you enter amounts in the Amounts Column, Quicken automatically calculates the remaining balance and fills in the following row's amount which you can then edit.
use alt down arrow to open the listbox associated with this field.
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
@@
@QWMsgHelp6_S
This is the Split Transaction Window.
It is set out like a spreadsheet with three columns and 30 rows.
Use Tab and Shift Tab to move between columns and Up and Down Arrow to move between rows.
When you enter amounts in the Amounts Column, Quicken automatically calculates the remaining balance and fills in the following row's amount which you can then edit.
use alt down arrow to open the listbox.
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
@@
;for QWMsgHelp7_L/S, %1=focused field's name
@QWMsgHelp7_L
This is the Register Screen.
this is the %1 field.
Use left and right arrows and standard editing keys to edit text in this field.
@@
@QWMsgHelp7_S
Register Screen
%1 field
Use left and right arrows and standard editing keys to edit text in this field.
@@
@QWMsgHelp8_L
Use alt down arrow to open the listbox associated with this field.
@@
@QWMsgHelp8_S
alt down arrow to open listbox.
@@
@QWMsgHelp9_L
This screen is set out like a spreadsheet with one transaction per line.
@@
@QWMsgHelp9_S
This screen is set out like a spreadsheet with one transaction per line.
@@
@QWMsgHelp10_L
This screen is set out like a spreadsheet
except that each transaction takes up two rows.
@@
@QWMsgHelp10_S
This screen is set out like a spreadsheet
except that each transaction takes up two rows.
@@
;for QWMsgHelp11_L/S, %1=the transaction count from the top of the window (nott the top of the register)
@QWMsgHelp11_L
To move between the transaction fields and the option buttons for the current transaction, Use Tab and Shift Tab.
To move from transaction to transaction, Use the up and down arrow keys.
This transaction is number %1 from the top of the window.
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
@@
@QWMsgHelp11_S
To move between the transaction fields and the option buttons for the current transaction, Use Tab and Shift Tab.
To move from transaction to transaction, Use the up and down arrow keys.
To hear hotkey help for this screen use  %KeyFor(hotkeyHelp).
This transaction is number %1 from the top of the window.
@@
;for QWMsgHelp13_L/S, %1=datasheet prompt,
;%2=list of fields in each row of datasheet
@QWMsgHelp13_L
This is the reconcile accounts screen.
this is the %1 MultiSelect DataSheet
Each row contains the following fields: %2
Use the up and down arrow keys to move from row to row.
Use the spaceBar to mark transactions to reconcile.
When you mark a transaction, focus automatically moves to the next transaction in the list.
	Use Tab to move to the next Control
@@
@QWMsgHelp13_S
reconcile accounts screen.
%1 MultiSelect DataSheet
Each row contains the following fields: %2.
Use the up and down arrow keys to move from row to row.
Use the spaceBar to mark transactions to reconcile.
When you mark a transaction, focus automatically moves to the next transaction in the list.
@@
@QWMsgHelp14_L
This is a DataSheet.
@@
@QWMsgHelp14_S
This is a DataSheet.
@@
;for QWMsgHelp15_L/S, %1=list of fields in each datasheet row
@QWMsgHelp15_L
Each row contains the following fields: %1.
@@
@QWMsgHelp15_S
Each row contains the following fields: %1.
@@
@QWMsgHelp16_L
The DataSheet currently contains no data.
@@
@QWMsgHelp16_S
DataSheet contains no data.
@@
@QWMsgHelp17_L
Use the up and down arrow keys to move from row to row.
@@
@QWMsgHelp17_S
Use the up and down arrow keys to move from row to row.
@@
@QWMsgHelp18_L
	Use Tab to move to the next Control
@@
@QWMsgHelp18_S
@@
@QWMsgHelp19_L
This is a report.
To repeat the current screen use  %KeyFor(sayWindowPromptAndText).
To read the prior or next screen use Page Up and Page Down.
@@
@QWMsgHelp19_S
This is a report.
To repeat the current screen use  %KeyFor(sayWindowPromptAndText).
To read the prior or next screen use Page Up and Page Down.
@@
@QWMsgHelp20_L
This Quicken screen uses an Internet Explorer window.
@@
@QWMsgHelp20_S
This Quicken screen uses an Internet Explorer window.
@@
@QWMsgHelp21_L
To hear hotkey help for this screen use  %KeyFor(HotKeyHelp).
@@
@QWMsgHelp21_S
To hear hotkey help for this screen use  %KeyFor(HotKeyHelp).
@@
@QWMsgHelp22_L
This is a Quicken Planner.
To speak the planner window use  %KeyFor(sayWindowPromptAndText).
To speak the prior or next screen use Page up and Page Down.
To select a planner link on the current screen use  %KeyFor(selectALink).
Text maybe in columns so you may wish to review this screen with the JAWS cursor.
To hear hotkey help for this screen use  %KeyFor(HotKeyHelp).
@@
@QWMsgHelp22_S
This is a Quicken Planner.
To speak the planner window use  %KeyFor(sayWindowPromptAndText).
To speak the prior or next screen use Page up and Page Down.
To select a planner link on the current screen use  %KeyFor(selectALink).
Text maybe in columns so you may wish to review this screen with the JAWS cursor.
To hear hotkey help for this screen use  %KeyFor(HotKeyHelp).
@@
@QWMsgHelp23_L
To select a planner link on the current screen use  %KeyFor(selectALink).
To list the toolbar buttons use  %KeyFor(toolbarButtonsList).
@@
@QWMsgHelp23_S
select planner link on current screen %KeyFor(selectALink)
list toolbar buttons %KeyFor(toolbarButtonsList)
@@
@QWMsgHelp24_L
To announce the column title and row number of the current cell use  %KeyFor(readWordInContext).
To say balances on this screen use  %KeyFor(balancesSay).
To list the toolbar buttons use  %KeyFor(toolbarButtonsList).
@@
@QWMsgHelp24_S
announce column title and row number of the current cell %KeyFor(readWordInContext)
say balances %KeyFor(balancesSay)
list toolbar buttons %KeyFor(toolbarButtonsList)
@@
@QWMsgHelp25_L
To move up one transaction and hear a summary of fields, press %KeyFor(RegPriorEntrySummarize)
To move down one transaction and hear a summary of fields, press %KeyFor(RegNextEntrySummarize)
To move up one page and hear a summary of fields in the new transaction, press %KeyFor(RegPageUpSummarize)
To move down one page and hear a summary of fields in the new transaction, press %KeyFor(RegPageDownSummarize)
To Summarize the current transaction, press %Keyfor(SummarizeDataSheetFields)
To announce the column title and Transaction count from top of window use  %KeyFor(readWordInContext).
To say balances on this screen use  %KeyFor(balancesSay).
To hear running balance as of the current entry, press %KeyFor(TransactionBalanceSay).
To list the toolbar buttons use  %KeyFor(toolbarButtonsList).
To select a tab use  %KeyFor(selectTab).
To see a list of controls inside this data sheet, press %KeyFor(ListButtonActivate).
To select other non-toolbar buttons use  %KeyFor(GraphicsList).
@@
@QWMsgHelp25_S
announce column title and Transaction count from top of window %KeyFor(readWordInContext)
say balances %KeyFor(balancesSay)
list toolbar buttons %KeyFor(toolbarButtonsList)
select tab %KeyFor(selectTab)
List controls inside this data sheet, press %KeyFor(ListButtonActivate)
select other non-toolbar buttons %KeyFor(GraphicsList)
@@
@QWMsgHelp26_L
To say balances on this screen use  %KeyFor(balancesSay).
To switch panes use f6.
@@
@QWMsgHelp26_S
say balances %KeyFor(balancesSay)
switch panes f6
@@
@QWMsgHelp27_L
To say balances on this screen use  %KeyFor(balancesSay).
To list the toolbar buttons use  %KeyFor(toolbarButtonsList).
To List controls inside this data sheet, press %KeyFor(ListButtonActivate)
To select other non-toolbar buttons use  %KeyFor(GraphicsList).
@@
@QWMsgHelp27_S
say balances %KeyFor(balancesSay)
list toolbar buttons %KeyFor(toolbarButtonsList)
List controls inside this data sheet, press %KeyFor(ListButtonActivate)
select other non-toolbar buttons %KeyFor(GraphicsList)
@@
@QWMsgHelp28_L
Many data sheets contain controls which do not appear in the tab order.
To see a list of controls inside this data sheet,  press %keyfor(ListButtonActivate).
@@
@QWMsgHelp28_S
To see a list of controls inside this data sheet,  press %keyfor(ListButtonActivate).
@@
@QWmsg_AccountListHelp
This is the accounts list.  Use up and down arrow to select an account.
@@
@msgSetUpBillsHelp_L
This is the screen where you set up your recurring bills.  This screen is set up like a table of rows and columns.  Each bill occupies a single row.
The columns represent the various fields in a recurring bill.
The colum titles are: %1.
Press the tab key to move from one field to the next in the current bill.  When you press tab on the last field of the current bill, Quicken will advance to the first field of the next bill.
After the last field of the final bill, you can tab to the control buttons.  Or, you can up arrow to the top bill and press shift+tab.
To delete a bill, do not use the delete button.  Instead,  use up and down arrows to select the bill you want to delete.
Then, route JAWS to PC and use the right mouse button to access the context menu, and choose delete.
Press escape to close this message.
@@
@msgQuickenGuidedSetupHelp
This is the Quicken Guided Setup Help.
Use alt+p and alt+n to go to previous and next steps respectively.
Use the tab and shift tab keys to move from field to field in the current step.
The shift tab key may not operate when focused on some data sheets.  You will need to,
use the tab key to move around the circle the other direction to access the prior field.
One of the data sheets lists all the steps in the setup process.
When you press up or down arrow while focused on the list of steps, you are immediately taken to the first field in that step.
You will need to shift tab back to the list of steps to continue manipulating the list.
@@
@msgWKeysHelp1_L
To Go to the register use Control R
To Go to Write Checks use Control W
To Go to Financial Calendar use Control K
To Go to View Loans use Control H
To Go to Currency List use Control Q
To QuickZoom a report amount use Control Z
To Get Help on the current window use F1
To go to the Previous window use Alt Left arrow
To go to the Next window use Alt Right arrow
To go to My Finances Center use Alt Home
To move between fields or columns use Tab and Shift Tab
To move to the beginning of a field use Home
To go to the First field in transaction or window, or first report row use Home twice
To go to the First transaction in window use Home three times
To go to the First transaction in register use Home four times
To go to the First transaction or upper left page of report use Control Home
To move to the End of a field use End
To go to the Last field in transaction or window, or last report row use End twice
To go to the Last transaction in window use End three times
To go to the Last transaction in register use End four times
To go to the Last transaction or lower right page of report use Control End
To go to the Next window or check use PgDn
To go to the Previous window or check use PgUp
To go to the Next month use Control PgDn
To go to the First day of the month use Control PgUp
To move up or down a row use Up or Down Arrows
To Back up a file use Control B
To Open a file use Control O
To Select an account use Control A
To Select a category use Control C
To Select a class use Control L
To Copy a field in the register use Control Ins
To Cut a field in the register use Shift Del
To Paste a field in the register use Shift Ins
To Delete a transaction or split line use Control D
To Find a transaction use Control F
To Go to a new transaction use Control N
To Set up or pay a scheduled transaction use Control J
To Insert a transaction use Control I
To Memorize a transaction use Control M
To Print use Control P
To Access the Memorized Transaction List use Control T
To Scroll up or down the QuickFill list (after you start typing in the Payee field) use Control up arrow or Control down arrow
To Enter a transaction use Enter or Control Enter
To Open the Split Transaction window use Control S
To Close the Split Transaction window use Control Enter
To Go to the other side of a transfer transaction use Control X
To Select an account to transfer to use  Control C
To Void a transaction use Control V
To Go to Portfolio View use Control U
To Select a security use Control Y
@@
@msgWKeysHelp1_S
register Control R
Write Checks Control W
Financial Calendar Control K
View Loans Control H
Currency List Control Q
QuickZoom a report amount Control Z
Help on current window F1
Previous window Alt Left arrow
Next window Alt Right arrow
My Finances Center Alt Home
move between fields or columns Tab and Shift Tab
beginning of a field Home
First field in transaction or window, or first report row Home twice
First transaction in window Home three times
First transaction in register Home four times
First transaction or upper left page of report Control Home
End of a field End
Last field in transaction or window, or last report row End twice
Last transaction in window End three times
Last transaction in register End four times
Last transaction or lower right page of report Control End
Next window or check PgDn
Previous window or check PgUp
Next month Control PgDn
First day of the month Control PgUp
move up or down a row Up or Down Arrows
Back up a file Control B
Open a file Control O
Select an account Control A
Select a category Control C
Select a class Control L
Copy a field in the register Control Ins
Cut a field in the register Shift Del
Paste a field in the register Shift Ins
Delete a transaction or split line Control D
Find a transaction Control F
create a new transaction Control N
Set up or pay a scheduled transaction Control J
Insert a transaction Control I
Memorize a transaction Control M
Print Control P
Access the Memorized Transaction List Control T
Scroll up or down the QuickFill list (after you start typing in the Payee field) Control up arrow or Control down arrow
Enter a transaction Enter or Control Enter
Open the Split Transaction window Control S
Close the Split Transaction window Control Enter
other side of a transfer transaction Control X
Select an account to transfer to  Control C
Void a transaction Control V
Portfolio View Control U
Select a security Control Y
@@
@msgVPCHelp1_L
For a List of all Links on this page press %KeyFor(SelectALink).
To move forward in the page past links to a body of text press %KeyFor(MoveToNextNonLinkText).
To update the screen view  to the location of the Virtual Cursor press %KeyFor(RefreshScreen).
To jump to the first control on a form press %KeyFor(FocusToFirstField).
To toggle Virtual Cursor mode on or off press %KeyFor(VirtualPcCursorToggle).
When you land on a control  and wish to turn on forms mode to input information  press %KeyFor(Enter).
To turn Virtual Cursor back on press %KeyFor(PcCursor).
For specific help at any time on this page press %KeyFor(ScreenSensitiveHelp).
@@
@msgVPCHelp1_S
list links %KeyFor(SelectALink)
move past links to text %KeyFor(MoveToNextNonLinkText)
update screen %KeyFor(RefreshScreen)
first form control %KeyFor(FocusToFirstField)
toggle Virtual Cursor %KeyFor(VirtualPcCursorToggle)
turn on forms mode %KeyFor(Enter)
turn Virtual Cursor back on %KeyFor(PcCursor)
screen sensitive help %KeyFor(ScreenSensitiveHelp)
@@
  ;for msgIEHTMLHelp1_L/S, %1=number of links, %2=number of frames,
  ;%3=number of forms and %4=page title
@msgIEHTMLHelp1_L
The current page contains %1 links, %2 frames and %3 forms.
The page title is %4
@@
@msgIEHTMLHelp1_S
%1 links
%2 frames
%3 forms.
title=%4
@@
;for QWMsgListHasButton1_L/S, %1=button name
@QWMsgListHasButton1_L
Press %KeyFor(ListButtonActivate) to activate the %1 button associated with this list.
@@
@QWMsgListHasButton1_S
Press %KeyFor(ListButtonActivate) to activate the %1 button.
@@
;for QWMsgListHasMultipleButtons1_L/S, %1=list of button names
@QWMsgListHasMultipleButtons1_L
Press %KeyFor(ListButtonActivate) to access a list of the following buttons: %1, associated with this list.
@@
@QWMsgListHasMultipleButtons1_S
Press %KeyFor(ListButtonActivate) to access %1 buttons.
@@
@QWMsgListButtonCantActivate1_L
The button associated with this list can't be activated.
@@
@QWMsgListButtonCantActivate1_S
Can't activate button.
@@
@QWMsgQuicken1_L
Quicken 2003 scripts version 1.2
@@
@QWMsgOutOfLink1
out of link
@@
@QWMSGNotOnALink1_L
The JAWS cursor is not on a link
@@
@QWMSGNotOnALink1_S
not on a link
@@
@QWMsgSelectATab1_L
Select a Tab
@@
@QWMsgTabToolbarNotFound1_L
Tab toolbar not found
@@
@QWMsgTabToolbarNotFound1_S
not found
@@
@QWMsgTabNotFound1_L
 tab not found
@@
@QWMsgTabNotFound1_S
 not found
@@
@QWMsgDataSheet1_L
DataSheet
@@
@QWMsgDataSheet1_S
DataSheet
@@
@QWMsgMultiselectDataSheet1_L
MultiSelect DataSheet
@@
@QWMsgMultiselectDataSheet1_S
MultiSelect DataSheet
@@
@QWMsgZeroItems1_L
zero items
@@
@QWMsgZeroItems1_S
zero items
@@
@QWMsgToolbarNotVisible1_L
toolbar not visible
@@
@QWMsgToolbarNotVisible1_S
not visible
@@
@QWMsgToolbarButtons1_L
Select a Toolbar Button
@@
;for QWMsgNotFound1_L, %1=button name
@QWMsgNotFound1_L
%1 not found
@@
@QWMsgPriorWindow1_L
prior window
@@
@QWMsgNextWindow1_L
next window
@@
@QWMsgMyFinances1_L
My Finances
@@
;for QWMsgTransaction1_L, %1=transaction number from top of window
@QWMsgTransaction1_L
transaction %1
@@
;Register field prompts
@QWMsgTRDate1_L
Date
@@
@QWMsgTRRef1_L
Ref
@@
@QWMsgTRPayee1_L
Payee
@@
@QWMSGTRCategory1_L
Category
@@
@QWMsgTRMemo1_L
Memo
@@
@QWMsgTRCLR1_L
Clr
@@
@QWMsgTRDecrease1_L
Decrease
@@
@QWMsgTRIncrease1_L
Increase
@@
; Write Checks View Prompts
@QWMsgWCDate1_L
Date
@@
@QWMsgWCPayee1_L
Payee
@@
@QWMsgWCAmount1_L
Dollar Amount
@@
;for QWMsgWCAddressLine1_L, %1=address line number
@QWMsgWCAddressLine1_L
Address line %1
@@
@QWMsgWCMemo1_L
Memo
@@
@QWMsgWCCategory1_L
Category
@@
@QWMsgWCMessage1_L
Message
@@
@QWMsgSWCategory1_L
Category
@@
@QWMsgSWMemo1_L
Memo
@@
@QWMsgSWAmount1_L
Amount
@@
@QWMsgSelectALink1_L
Select a Link
@@
@QWMSGPlannerLinks1_L
Planner links:
@@
@QWMsgNoLinks1_L
No links
@@
@QWMsgWarningScrollScreen1_L
Warning, you must use Control Page up or down to scroll the screen as this control is not currently visible even though it has focus.
@@
@QWMsgDataSheetEmpty1_L
no data
@@
@QWMsgDataSheetEmpty1_S
no data
@@
; Quicken Home Inventory graphical dialog
@QWMsgHomeInventory1
Quicken Home Inventory
Create an inventory of your entire home in about an hour.
Make a list of everything in case you ever need it for insurance claims.
Track your valuables and equipment, with model and serial numbers.
Track your assets so you can update your net worth in Quicken.
Create reports showing what you have, where it all is, and how much it's worth.
@@
@QWMsgHomeInventory2
Item Description
@@
@QWMsgHomeInventory3
Item Category
@@
@QWMsgSelectListButton1
Select a button
@@
@msgNoLinks1_L
No links found in document
@@
@msgFieldNotFound1_L
Input field not found
@@
@msgWrittenSoFar
Written so far
@@
@msgEndingBalance
Ending balance
@@
@msgNotInADataSheet
Not focused in a data sheet
@@
@msgToolsListAbandon
Press escape to close without executing any control
@@
@msgControlNameFailedToReappear
control name failed to reappear
@@
@msgNoControlsFound
No controls were found
@@
@msgShiftTabStuck
The shift tab key does not presently operate  when focused on this data sheet.
Instead, press the tab key  until you reach the field you want.
@@
@msgPromptVerbosity
Speak Static Prompts
@@
@msgControlTypeVerbosity
Speak Control Type
@@
@msgCheckedStatusVerbosity
Say Checked in multiSelect boxes
@@
@msgVerbosity0
No
@@
@msgVerbosity1
Yes
@@
@msgBalanceNotFound
Balance Not Found
@@
@msgEndOfList
End of list
@@
@msgMBSHelp
This is the monthly budget summary screen.  It is layed out like a spreadsheet.
Use Left and right arrows to move between months.  The total is at the far right.
Use up and down arrows to move between summary items for the current month.
Use the SayWord command to repeat the value of the current cell.
To hear details for a particular month, arrow to that month and press enter.
After reviewing the details, press control+f4 to close the details window.
For a summary of Hot keys, press %KeyFor(HotKeyHelp)
@@
@msgMBSHotKeyHelp
This is hot key help for the Monthly Budget Summary sheet.
To move to the prior month, press LeftArrow
To move to the next month, press RightArrow
To hear the Prior item in the sheet for this month, press UpArrow
To hear the next item in the sheet for this month, press DownArrow
To repeat the current item, press JAWSKey plus 5 on the NumPad
To hear the totals for all months listed for the current item, press JAWSKey+UpArrow.
To hear the total for the current line item, press JAWSKey+PageDown
To view details for a particular month, arrow to that month and press enter.
@@
@msgMBDHelp
This is the monthly budget details screen, showing the amounts for each item in your budget.
Use up and down arrows to explore the list of details and hear the associated dollar amounts.
Press Control+f4 to close the details window.
For a summary of Hot keys, press %KeyFor(HotKeyHelp)
Press escape to close this window.
@@
@msgMBSetupHelp1
This is the budget setup screen.  This button is one of a group
of 5 buttons which function like a tab selection, and allow you to choose
from the various types of categories in your budget.
Use the up and down arrow keys to select the desired tab.
Changing this selection will change the list of controls available as you use the tab and shift tab keys.
Press tab to move away from this group of buttons.
Press escape to close this message.
@@
@msgMBSetupHelp2
This is the budget setup screen.  This list box lets you use up and down arrow
to select the category to be edited.
The average amount for each item, for the time period specified in the Totals combo box,
is displayed, along with the category name.
Once a selection is made, tab to the other controls.
You will find an edit box where you can type in the average value for this category.
Or, if you choose to enter monthly details, you will find a series of 12 edit boxes, in which you can place the amount for
this category for each month.
Press escape to close this message.
@@

@msgMBDHotKeyHelp
This is hot key help for the Monthly Budget details sheet.
to review the items in the list, Press up and down arrows
To close the details list, press %KeyFor(CloseWindow)
Press escape to close this message.
@@

@msgCalculatorHotkeyHelp_L
Following is a list of hot keys for use with the Quicken Calculator.
To hear the current entry, or the most recent result, press %KeyFor(CalcDisplayResult)
To store the current result in memory, press %Keyfor(CalcStoreMemory).
To Recall a result from memory, press %KeyFor(CalcRecallMemory)
To clear the memory, press %KeyFor(CalcClearmemory)
To clear the entry presently in progress, press %KeyFor(CalcClearEntry)
To clear the present display, press %Keyfor(CalcClearDisplay)
To copy the current result to the clipboard, press %KeyFor(CalcCopyToClipboard)
To indicate the last number typed was a percentage, press %KeyFor(CalcPercent)
Press Escape to close this message.
@@
@msgCalculatorHotkeyHelp_S
hot keys for use with the Quicken Calculator.
current entry or most recent result, %KeyFor(CalcDisplayResult)
store current result in memory, %Keyfor(CalcStoreMemory).
Recall memory, %KeyFor(CalcRecallMemory)
clear memory, %KeyFor(CalcClearMemory)
clear present entry %KeyFor(CalcClearEntry)
clear display %KeyFor(CalcClearDisplay)
copy result to clipboard %KeyFor(CalcCopyToClipboard)
percent %KeyFor(CalcPercent)
Press escape to close this message.
@@
@msgCalcPercent
Percent
@@
@msgCalcCopyToClipboard
Copy To Clipboard
@@
@msgClearEntry
Clear Entry
@@
@msgClearDisplay
Clear Display
@@
@msgStoreMemory
Store Memory
@@
@msgRecallMemory
recall Memory
@@
@msgClearMemory
Clear Memory
@@
@msgCalculatorHelp
This is the Quicken Calculator.  You can enter calculations using the numbers on the numbers row.
It is a basic four function calculator with a  single memory.
You can use the asterisk to multiply, the dash for subtraction, the plus for addition, and slash for divide.
Press enter to perform the entered calculation.
Other controls exist to clear, store and recall the single memory.
You can copy the current result to the clipboard.  This action will return focus to Quicken itself.
Once in Quicken, you can press the normal paste clipboard command to paste the result in the field with focus.
Or, you can alt tab to any other application and paste the result as well.
To review a list of Hot keys for the calculator, press %Keyfor(HotKeyHelp).
Press escape to close this message.
@@
@msgNotOnAMonth
Use the left and right arrow keys to choose  a month, then press enter
@@
; for closing a document window
@msgClosing
Closing %1
@@
; for the budget analyze bar graph monitor
; this is what you say when the value of the bar graph is 0
@msgZero
Zero
@@
@msgBudgetAnalyzeHelp1
Budget Analysis for the %1 category.
This screen appears when you click the Analyze button for a given category in the budget screen.
It shows the actual expendatures of the selected category for each month.
The screen is layed out with the months listed across the bottom of the graph.  The bar graphs, showing the value
for each month, extend upward from the month names.
To learn the value for a given month, activate the JAWS cursor, and cursor to the desired month name.
Then, press the reed bar graph value key to hear the value for that month.
Check the hot key help for the key to use with your installation.
If there was no expense for this category in that month, there will be a slight delay, then %product% will say zero.
@@
@msgBudgetAnalyzeHotKeyHelp1
Hot keys for the budget Analyze screen
To read the bar graph for a month, activate the JAWS cursor, place it on the name of the month of interest
and press
%Keyfor(SaySentence)
Press escape to close this message.
@@
@msgInvestingCenterHelp
This is the Investing Center. It is comprised of a data sheet,
along with various combo boxes which allow you to choose what is displayed in the data sheet.
Use the up and down arrows to set the combo boxes to the desired value. then tab to the data sheet
If focus is taken from Quicken, or from this window, it is often necessary to reestablish the combo box values again
before tabbing  back to the data sheet.
Because of peculiar interactions between Quicken and %product%, screen refreshes, JAWSKey+escape are also frequently
necessary.
In the Data sheet, arrow up and down to hear the various entries.
When on an account, use right or left arrow to expand or
collapse that account.
If the account is expanded, you can press down arrow to explore the list of securities in that account.
Each security may have one or more lots.  A lot, is a group of shares of that security acquired in a single purchase.
To explore the lots for a given security, down arrow to the security.  Route %product% ToPC.
then, press the left mouse button on the graphic which is labeled "security", just to the left of the security name.
Click that graphic a second time to collapse the lots.
If you wish to explore details about a security, Position to that security, route %product% to pc, and left click on the
security name itself.  Press control+f4 to close the window that results.
To have %product% attempt to interpret the current line of the data sheet for each of the collumn headers,
press control+shift+UpArrow.
@@
@msgInvestingCenterHotKeyHelp1
Hot keys for use in the data sheet in the investing center:
Expand an account to show it's securities, press RightArrow.
Collapse an account to hide it's securities, press Left Arrow.
To toggle showing or hiding of the lots, press left or right arrow on a security name.
To hear column headers and associated amounts from the current line, press %KeyFor(SummarizeDataSheetFields).
To access to toolBar, press %KeyFor(ToolbarButtonsList)
Press escape to close this message.
@@


; For announcing when an item in a multiSelect listbox is checked
@msgChecked
Checked
@@
@msgPaymentsAndChecks
Payments and Checks
@@
@msgDeposits
Deposits
@@
@msgQWRSpeakFieldLabels_yes
Speak registry field labels
@@
@msgQWRSpeakFieldLabels_no
Do not speak registry field labels
@@
@msgQWRSpeakFieldLabels
Summarize Registry Line
@@
@msgNotInARegistry
You must be in one of the transaction registers to use this key stroke
@@
@msgLearningTheRegistry
Scanning
@@


;UNUSED_VARIABLES

@msgAppStart1_L
To hear the %product% help topic for Quicken Deluxe 2000/2001 press %keyFor(screenSensitiveHelp) twice quickly.
@@
@msgAppStart1_S
%product% help topic for Quicken %keyFor(screenSensitiveHelp) twice quickly.
@@
@QWMSGTRNum1_L
Num
@@
@QWMsgTRPayment1_L
Payment
@@
@QWMsgTRDeposit1_L
Deposit
@@
@msgFindingToolBarItems_l
Finding Tools
@@
@msgNoHotKeyHelp
There is no hot key help for this item.
@@
@msgLevel
[Level
@@
@msgName
Name:
@@
@msgBottomOfWindow
Bottom Of Window
@@
@msgPercentGain
% Gain
@@
@msgBlank
blank
@@

;END_OF_UNUSED_VARIABLES

endMessages
