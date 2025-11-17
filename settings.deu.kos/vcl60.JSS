

Void Function AutoStartEvent ()


stopspeech()
saystring("LMZ und die JAWS-Anpassungen bis Version 1.0.7 werden geladen. Bitte warten.")
pause()


EndFunction

Script HROPlanLesen ()

RouteJAWSToPc ()
JAWSCursor ()
PerformScript JAWSHome()
SayLine ()
PerformScript PCCursor()

EndScript


Script HROSprungInListe ()
var
	int x

Pause()
Pause()

TabKey ()
NextLine ()
Pause ()

let x=0
while (x<12)
	TabKey ()
	let x=x+1
endwhile


StopSpeech ()


EndScript

Script HROPause ()
var
	int x, 
	string t 
	
delay(50)
;let t = "%USERPROFILE%"
;let t = "Desktop\termin.pdf"
;let t = "C:\Users\roemhild\Desktop"
;typeString (t)
;StopSpeech ()


EndScript