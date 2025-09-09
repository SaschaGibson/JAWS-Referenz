; Copyright 1995-2017 by Freedom Scientific, Inc.
; Freedom Scientific script file supporting the virtual keys input list.

include "hjconst.jsh"
include "hjglobal.jsh"
include "common.jsm"
include"VKeyboard.jsm"

const
;the following array has descriptions for each character in vKeyboard.jsm. If you add/subtract anything here be sure to do the equivalent to the descriptions.
symbol="���������������������������������������������������������������������������������������������"

Script VKSelect ()
var
	int iIndex,;For position in list
	string strTemp,
	string strListText
Let strListText = description+JAWS_DLG_LIST_SEPARATOR+
description1+JAWS_DLG_LIST_SEPARATOR+
description2+JAWS_DLG_LIST_SEPARATOR+
description3+JAWS_DLG_LIST_SEPARATOR+
description4+JAWS_DLG_LIST_SEPARATOR+
description5+JAWS_DLG_LIST_SEPARATOR
if ! strListText then
	return
EndIf
Let strListText = (stringChopRight (strListText, 1))
; now post the dialog
Let iIndex = dlgSelectItemInList (strListText, DLG_VKEYBOARD, true)
If iIndex <= 0 then
	return
EndIf
let strTemp = (StringSegment (symbol, LIST_ITEM_SEPARATOR, iIndex))
TypeString (strTemp)
EndScript

