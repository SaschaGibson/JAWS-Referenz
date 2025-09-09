CONST
;String Compares:
	scBack = "< back",
	scPeriod = ".",  ;sentence delimiter for static text
	scElipsis = "...",  ;button text elipsis
;window classes:
	wcCustomDialog = "TMainForm",
	wcTTabSheet = "TTabSheet",
	wcTPageControl = "TPageControl",
	wcTMemo = "TMemo",
;window names:
	wnBackButton = "< Back",
	wnAbout = "About",
	wnWelcomeScreen = "WelcomeScreen",
	wnActivationMethodScreen = "ActivationMethodScreen",
	wnInternetActivationScreen = "InternetActivationScreen",
	wnFaxMailActivationScreen = "FaxMailActivationScreen",
	wnTelephoneActivationScreen = "TelephoneActivationScreen",
	wnKeyboardFileActivationScreen = "KeyboardFileActivationScreen",
	wnFinishScreen = "FinishScreen",
	wnFinishedButton = "Finished",



;UNUSED_VARIABLES

	scCustomerServiceNum = "444-4443",
	scFaxNum = "803-8001",
	scEmail = "e-mail",
	wcRadioButton = "TRadioButton",
	wnPleaseWait = "Please Wait",
	wnDropInActivationScreen = "DropInActivationScreen"

;END_OF_UNUSED_VARIABLES

messages
@msgBack
Back
@@
@msgFolder
folder
@@
@msgName
*Name
@@
@msgCity
*City
@@
@msgCountry
*Country
@@
@msgAppName
Freedom Scientific Client Activator
@@
;msgPositionInGroup is a custom version of the string returned by the PositionInGroup function.
;we use this custom version to script around the problem with the radio buttons positioned in reverse order.
;%1 is the index
;%2 is the count
@msgPositionInGroup
%1 of %2
@@
@msgHotKeyHelp_FolderButton
An Activation License code can be stored in a file. Use this button to browse for a file that contains your Activation License code. After you open the file, the code it contains is inserted into the Activation License Code edit box.
@@


;UNUSED_VARIABLES

@msgLockInformation
Product ID
Locking Code

@@
@msgLockMessage
Press %KeyFor(Tab) to move between the fields and read the information.
@@
@msgInternetDialog
type in your 20-digit authorization number now
@@
@msgKeyboardDialog
enter the activation code you received
@@

;END_OF_UNUSED_VARIABLES

EndMessages
	