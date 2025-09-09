# Function: SayAllStarted

## Description

This function is called by the built in script function SayAll just
before the Speak method of the SAYALL object is called for the first
time. It is intended that this function be overridden in a given
application\'s scripts to provide a method of performing actions (such
as setting JCF options) just before a Say All is started. This
complements the preexisting SayAllStoppedEvent which is called whenever
a Say All process is stopped.

## Returns

Type: Void\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 11.0 and later
