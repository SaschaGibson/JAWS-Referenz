; Copyright 2021 by Freedom Scientific, Inc.

include "HjConst.jsh"
include "common.jsm"

script ControlDownArrow ()
typeKey (cksControlDownArrow)
endScript

script ControlUpArrow ()
typeKey (cksControlUpArrow)
endScript

script ScriptFileName ()
; spotify is name of company, no need for a language file just for this:
ScriptAndAppNames (GetActiveConfiguration ())
endScript
