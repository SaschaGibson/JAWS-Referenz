; Build 4.51.
; Quicken Deluxe 2003 Script Header File
; Copyright 2010-2015 by Freedom Scientific, Inc.
; Written by Joseph K Stephen
; Modified for QW 2003 by Jim Snowbarger, a.k.a.  The SnowMan  November 2002
; Build QW400137 last modified on March 14, 2001

const
kiQWVer2000=9,
ksConfigQuicken98="qw98",
ksDefaultScriptFile="default",
ksQWScriptFileCurrent="qw",
; Custom window types for braille:
Custom_wt_DataSheet=1,
; Window Classes
wc_QWLabel="QWLabel",
wc_static="Static",
wc_QWMDIToolbar="QW_MDI_TOOLBAR",
wc_QFRAME="QFRAME",
wc_QWmdi="QWMDI",
wc_MDIClient="MDIClient",
wc_QREdit="QREdit",
wc_editComboList="QFlistbox",
wc_edit="Edit",
wc_QWListViewer="QWListViewer",
wc_tabToolbar="QW_Tab_Toolbar",
wc_bagToolbar="QW_BAG_TOOLBAR",
wc_listBox="ListBox",
wc_Calculator="QuikMathP",
; wc_ie5Class="Internet Explorer_server",
wc_ie5class = "QWHtmlView",
wc_shellDocObjectView="Shell DocObject View", ; for HTML support
wc_shellEmbedding="Shell Embedding",
wc_report="QWReportSubwindow",
wc_QWHTMLView="QWHTMLView", ; HTML which doesn't use the ie 5 server window
wc_snapHolder="QWSnapHolder",
wc_1 = "QFHoldClass",
app_qhi="QHI.EXE",
cId_SuggestedItemsList=132,
cId_itemDesc=0, ; edit control
cId_itemCategory=1, ; combobox
btn_returnToListView="Return to List View",
; Control Ids of controls requiring special attention, ie which do not have their prompts spoken automatically
; new user setup dialog second screen
cId_businessRadioButton1=1108,
cId_businessRadioButton2=1109,
; Account Setup dialog
cId_yesRadioButton=102,
cId_noRadioButton=103,
; Reconcile opening dialog
cId_recOpenBal=100,
cId_RecServiceEdit=102,
cId_RecHelpBtn=32765,
cId_recBalancesStart=107,
cId_recBalancesEnd=112,
; Loan Calculator information
cId_loanAmount=48,
cId_loanAmtPrompt=32,
cId_loanPaymentPerPeriodPrompt=36,
cId_loanCalculatedAmount=64,
; refinance calculator
cId_refinance1=38,
cId_refinance2=114,
cId_refinance3=39,
cId_refinance4=115,
cId_refinance5=42,
cId_refinance6=116,
cId_refinance7=43,
cId_refinance8=117,
; Savings Calculator
cId_savingsOpeningBalance=48,
cId_savingsOpeningBalancePrompt=32,
cId_savingsContributionPrompt1=35,
cId_savingsContributionPrompt2=66,
cId_savingsContribution=51,
cId_savingsEndingBalancePrompt=36,
cId_savingsCalculatedAmount=64,
; College Calculator
cId_CollegeAnnualCost=48,
cId_collegeAnnualCostPrompt=32,
cId_collegeAnnualContributionPrompt=37,
cId_collegeAnnualContribution=53,
cId_collegeCurrentSavingsPrompt=35,
cId_collegeCalculatedAmount=64,
; Retirement Calculator
cId_retirementAnnualIncome=55,
cId_retirementAnnualIncomePrompt=39,
cId_retirementAnnualContributionPrompt=34,
cId_retirementAnnualContribution=50,
cId_retirementCurrentSavingsPrompt=32,
cId_retirementCalculatedAmount=64,
; Write Checks screen:
cId_WCEndingBalance = 3035,
cId_WCDate=2000,
cId_WCPayee=2001,
cId_WCAmount=2002,
cId_WCAddressLine1=2023,
cId_WCAddressLine5=2027,
cId_WCMemo=2003,
cId_WCMessage=2004, ; optional field not always available, see Edit/Options/Write Checks
cId_WCCategory=2020,
cId_WCChecksSummaryList = 7000,
; Split Transaction Window
cId_SWCategory=1001,
cId_SWMemo=1002,
cId_SWAmount=1124,
cId_SplitTotalLabel=241,
cId_SplitTotalAmount=242,
cId_RemainderLabel=258,
cId_remainderAmount=203,
cId_transactionTotalLabel=259,
cId_transactionTotalAmount=204,
; appears always to be descriptive:
cId_descriptiveStatic=65535,
; TR means transaction register screen
kiTRDateMin=4, ; from left 
kiTRNumMin=54, ; from left
kiTRRefMin=54, ; from left
kiTRPayeeMin=120, ; from left
kiTRPaymentMin=309, ; from right 
kiTRDecreaseMin=200, ; from right
kiTRCLRMin=220, ; from right
kiTRDepositMin=201, ; from right
kiTRIncreaseMin=108, ; from right
kiTRCategoryMin=134, ; from left
kiTRCategoryMinOneLine=250, ; from left
kiTRMemoMin=222, ; from left
; height of each transaction set
kiTRTransHeight=34, ; transaction two lines is 34 pixels high regardless of res during testing.
kiTRTransHeightOneLine=18, ; when in one line display
kiInvestmentFudge=15,
kiTRTwoLineTopOffset=7, ; distance from cursor to top of current trans in two line display mode when cursor is on first line of transaction
kiTROneLineTopOffset=2, ; when in oneline mode, normal offset of cursor from top of current trans 
kiTRFirstTransactionOffset = 59, ; top of real window to first transaction
LoanScheduleDelim=" ", ;for delimiting the listbox items in the loan repayment schedule 
loanScheduleFieldCount=4, ; four fields in each list entry 
loanScheduleFirstEntryIndicator="%", ; for determining if we are on the first entry in the listbox.
loanSchedulePaymentColumn=1,
loanSchedulePrincipalColumn=2,
loanScheduleInterestColumn=3,
loanScheduleBalanceColumn=4

globals
	string QWGlobalRealWindowName,
	int QWMonitorAccountList,
	int QWSaveCursorRow,
	int QWSaveCursorCol,
	int QWWatchForNewText, 
	int QWControlTypeverbosity,
	int QWStaticPromptVerbosity,
	int QWCheckedStatusVerbosity,
	handle qwGlobalDataSheetHandle,
	int giQWFirstTime,
	string gsAlternativeBrailleRepresentation, ; used for Brailling fields which are not correctly tracked by JFW in certain screens
	int giSuppressRowNumbers, ; when in grids such as the split transaction window
	int giSuppressColumnTitles, ; when in grids  
	int giFocusChangeTriggered,
	int giSuppressEcho, ; used to suppress doublespeaking of highlighted text.
	int giSuppressHighlightInQREdit,
	int giInLink,
	int giNotEditCombo, ; custom control, sometimes edit combo, sometimes edit only
	int giSwitchedFromDLL,
; these globals are redeclared here for compilation reasons only but are the same globals as defined in default.jss
	int WindowClosed,
	int ClipboardTextChanged,
	int QWInhibitYesNoPrompts,
	int QWSpeakRadioButtons,
	string QWLastStaticText,
	int QWTabkeyFID,  ; a function ID for when tab key doesn't work
	int QWMonth,  ; used in the Monthly budget summary
	handle QWLastKnownFocus ; used to recover focus when it gets lost.
 