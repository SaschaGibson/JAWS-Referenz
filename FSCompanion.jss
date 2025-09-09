; JAWS script file for the FSCompanion website

include "FSCompanion.jsm"
include "HjConst.jsh"
include "HjGlobal.jsh"

void function NameChangedEvent (handle hwnd, int objId, int childId, int nObjType, string sOldName, string sNewName)
; The Dictate button label and the Question Edit placeholder text change when Dictation starts.
; When this happens, quiet JAWS speech.
if (sOldName == scDictateButtonLabel || sOldName == scQuestionEditPlaceholder)
	StopSpeech()
	return
endIf
NameChangedEvent (hwnd, objId, childId, nObjType, sOldName, sNewName)
EndFunction