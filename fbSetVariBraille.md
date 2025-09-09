# fbSetVariBraille

## Description

Sets the firmness of dots on the display

## Usage

FSBRLAPI BOOL WINAPI fbSetVariBraille(HANDLE hDisplay,BYTE byFirmness);

## Parameters

### HANDLE hDisplay

A handle previously obtained from fbOpen.

### BYTE byFirmness

byFirmness - a value between 0 and 255. Larger values make the dots more
pronounced.

## Returns

BOOL: TRUE on success, FALSE on failure.
