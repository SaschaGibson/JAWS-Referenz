# Function: TULSwitchToRuleSet

## Description

This function switches the TextUnitLocator module to use the named rule
set for the currently active cursor. If the name is empty, the default
rules set for the current cursor and window class will be used. When
switching to the default, the following search is performed: attempt to
switch to a set for the current cursor and window class, if not found,
switch to the rule for the current cursor, if not found, switch to the
default rule. See default.jcf sections whose names begin with
TextUnitRuleSet for details. The string following the first part of the
section name is used as the rule set name for this function. For
example, to switch to the rule set for the section whose name is
\"TextUnitRuleSet joe\", use TULSwitchToRuleSet(\"joe\"). See
default.jcf for details about the keys for a rule.

## Returns

Type: int\
Description: TRUE or FALSE depending on whether the switch succeeded.\

## Parameters

### Param 1:

Type: string\
Description: of rule to switch active cursor to or empty string to
switch back to default for current situation.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 8.00 and later
