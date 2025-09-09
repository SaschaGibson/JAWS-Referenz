# FS Braille Display API

The FSBrlDspAPI provides a high-level API for communicating with Freedom
Scientific\'s current line of Braille displays.

## Installation Instructions

Install the file called FSBrlDspAPI.DLL into the Windows\\System32
folder as a shared component. The DLL contains an accurate version
resource. Never install an older version of this DLL on top of one that
already exists in the Windows\\System32 folder.

FSBrlDspAPI supports displays connected via serial or USB. For Windows
XP in particular, a file called FSBRLDSP.SYS must be in the
Windows\\System32 folder in order that USB connections work properly.

The Focus Braille displays require Firmware 1.05 or later in order to
function properly with USB.

## DLL Functions

The DLL functions are all described, each in their own topics in this
Reference Guide as follows:

- fbOpen
- fbClose
- fbConfigure
- fbWrite
- fbGetCellCount
- fbGetDisplayName
- fbGetFirmwareVersion
- fbBeep
- fbSetVariBraille

Note: All functions support GetLastError to obtain more information
about the cause of errors. Standard Windows error codes are used
exclusively.
