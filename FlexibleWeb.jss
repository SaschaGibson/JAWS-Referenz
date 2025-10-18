;Copyright 1995-2015 Freedom Scientific, Inc.

include "hjconst.jsh"
include "hjglobal.jsh"
include "FlexibleWeb.jsm"

script DoFlexibleWebDialog()
if (!SupportsFlexibleWeb())
	Say(msgFlexibleWebNotSupported, OT_JAWS_MESSAGE )
	return
endIf
if ( IsFormsModeActive() )
	SayMessage (OT_JAWS_MESSAGE , msgFlexibleWebFormsMode)
	return
EndIf
if ( ! IsVirtualPCCursor() )
	Say( msgFlexibleWebVirtualCursor, OT_JAWS_MESSAGE )
	return
EndIf
if ! IsFlexibleWebEnabled()
	var int result = ExMessageBox(
		msgFlexibleWebDisabledText, msgFlexibleWebDisabledDialogTitle,
		MB_YESNO|MB_DEFBUTTON1);
	if result != IDYES
		return
	EndIf	
	EnableFlexibleWeb( true )
EndIf
DoFlexibleWebDialog()
EndScript

void function PlayFlexibleWebSound()
PlaySound( FindJAWSSoundFile( "ascend.wav" ) );
EndFunction

void function FlexibleWebChangesWereMade( int startReading )
		PlayFlexibleWebSound()
	
	if ! ( startReading ) return endIf
	if ShouldSayAllOnDocumentLoad()
		SayAll();
	else
		SayLine();
	EndIf
EndFunction
