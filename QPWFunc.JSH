; QuatroPro 9.0 Script Header File 
; Copyright 2010-2015 by Freedom Scientific, Inc.
; PerfectScript/Object Browser constants only  
const
QPObj="QuattroPro.PerfectScript",

;custom window types
wt_custom_cell=1,
wt_custom_cell_selected=2,
wt_custom_dialog=3

globals
object oQP,
string globalPriorSheetName,
string brlCellInfoCo,
string brlCellInfoColTitle,
string brlCellInfoRowTitle,
string brlCellInfoValue,
string brlCellInfoFormula,
string brlCellInfoStartCo,
string brlCellInfoStartValue,
string brlCellInfoStartColTitle,
string brlCellInfoStartRowTitle,
string brlCellInfoEndCo,
string brlCellInfoEndValue,
string brlCellInfoEndColTitle,
string brlCellInfoEndRowTitle,
string brlCellInfoMonitorText,
int iBrlDlgInfoCol,
int iBrlDlgInfoRow,
int iBrlDlgInfoAttrib,
string brlDlgInfoName,
string brlDlgInfoPageName,
string brlDlgInfoState,
string brlDlgInfoPrompt,
string brlDlgInfoType,
string brlDlgInfoValue,
int qpwBrlCurrentObj
