;FSReader script header file

const
;constants for posting messages:
	wm_command = 0x0111,
	wParam_PlayPause = 32771,
	wm_QueryStatus = 10024,
	wParam_AudioStatus = 0,
	wParam_RateStatus = 1,
	wParam_ReducePausesStatus = 2,
;Audio event constants:
	AudioStop = 0,
	AudioPlay = 1,
	AudioPause = 2,
;ControlID's:
	id_TableOfContentsTreeView = 59648,
	id_BookContentEdit = 59664
	
globals
	int giCurrentAudioState,
	int giUserTypingEcho,
	int giSilenceFocusChange,
	int gbLabelingGraphics,
	handle GlobalRealWindow
