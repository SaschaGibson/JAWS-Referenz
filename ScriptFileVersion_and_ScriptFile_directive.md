# Keywords: ScriptFileVersion and ScriptFile

## Description

The ScriptFileVersion and ScriptFile statements direct the compiler to
lock the version of the script source file to a specific version of the
product.

## Syntax

ScriptFileVersion Number\
Number is the only version of JAWS where the scripts should run.

ScriptFile \"filename\"\
Filename is the script source and associated binary files that should
run exclusively in the specific version of JAWS referred to by the
number in the ScriptFileVersion statement.

The following example statements ensure that the only default.jss and
its associated default.jsb that run in JAWS 2020 are only those files
that contain these statements. If you replaced these files with another
default.jss and default.jsb - say from a prior version of JAWS, those
files wil not work in JAWS 2020.

    ScriptFileVersion 2020
    ScriptFile "Freedom Scientific Default Script"

## Remarks

Do not employ either of the directivs referred to above unless you are
very certain that the script set should be run only in that version of
JAWS.
