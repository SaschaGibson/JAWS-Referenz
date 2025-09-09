# Keyword: ;#Pragma UsePoFile

## Description

You may have customized scripts prior to JAWS 17 that you wish to add to
the current version of JAWS and/or that you need to customize further in
JAWS 17 or later. To do this, you need to use a special \";#Pragma\"
comment in your script source file.

**Note:** The comment should not be inside a specific script or
function.

A scripting language pragma is a specially formatted comment that begins
with \";#pragma.\" The pragma comment introduced in JAWS 17 is
usePoFile. This comment may be used to specialize whether or not
insPushLocalizedString instructions are inserted by the compiler. The
supported values are as follows:

- 0, false, no, off: Do not insert the localization instructions.\<
- 1, true, yes, on: Insert the localization instructions. This is the
  default if the usePOFile pragma is not used.

Thus, when the following line is found in the script source .jss file,
the script compiler will not insert the localization instructions, and
therefore the compiled script binary .jsb file will be
backwards-compatible.

    ;#pragma usePoFile 0 ; Do not use localization instructions.

On the other hand, when you use the following comment, you ensure that
JAWS 17 localization instructions are honored.

    ;#pragma usePoFile 1 ; Use localization instructions.

To be clear, the only time you need to use this special comment is when
you need scripts to be backwards-compatible and also you need another
set to honor JAWS 17 localization instructions. If all you need are
scripts for JAWS 17 and later, you can just compile in the usual way
without the need for the ;#Pragma comment at all.
