; Copyright 2015 Freedom Scientific, Inc.
;object model header file for Windows Media Player 11

const
;VB constants:
	VBTrue = 0xffffffff,
;play state enumeration:
	PlayState_Undefined = 0,
	PlayState_Stopped = 1,
	PlayState_Paused = 2,
	PlayState_Playing = 3,
	PlayState_ScanForward = 4,
	PlayState_ScanReverse = 5,
	PlayState_Buffering = 6,
	PlayState_Waiting = 7,
	PlayState_MediaEnded = 8,
	PlayState_Transitioning = 9,
	PlayState_Ready = 10,
	PlayState_Reconnecting = 11

globals
	object oWMP
