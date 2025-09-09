# Function: IsSameScript

## Description

Determines if the current script has been called two or more times in a
row without any intervening scripts being called and with no more than
500 milliseconds between each call. Using this function allows a script
to act differently depending upon the number of consecutive times it has
been called. A script is called whenever a key assigned to it has been
pressed.

## Returns

Type: Int\
Description: The number of times the script has repeated, 0 means it has
not repeated.\

## Parameters

No Parameters

## Version

This function is available in the following releases:

1.  JAWS 4.51 and later
