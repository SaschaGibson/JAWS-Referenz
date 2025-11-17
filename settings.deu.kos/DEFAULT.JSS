; Copyright 1995-2024 by Freedom Scientific, Inc.
; Freedom Scientific default script file

; If you want to modify default.jss, ensure that the lines for ScriptFileVersion and for ScriptFile do not appear in the default script files saved to your user settings.
; If your user default script file include the ScriptFileVersion line and if that file is migrated to a different version of JAWS,
; JAWS will fail to load the default scripts when its version does not match the JAWS version.
; In general, any time you modify a script file from shared and save into the user area,
; the script file in the user area should only contain the functions or scripts which you wish to customize.
; Your customized scripts and functions should contain only the customized code to be executed,
;  then they should call the script or function from the shared area when the customized situation does not apply.
; By following this set of rules, you greatly minimize the risk of failing to receive updates to the shared scripts.
;Do not localize the following two lines:
;ScriptFileVersion 26

ScriptFile "Freedom Scientific Default Script"

use "default.jsb"
; use "BETA_Inspect.jss"

