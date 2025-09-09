# fbWrite

## Description

Writes information in Braille on the display

## Usage

FSBRLAPI BOOL WINAPI fbWrite(HANDLE hDisplay,int nStart,int nLen,LPBYTE
lpbyDots);

## Parameters

### HANDLE hDisplay

hDisplay - a handle previously obtained from fbOpen.

### INT nStart

nStart - a 0-based offset from the beginning of the display at which to
begin writing.

### INT nLen

nLen - the number of cells to write.

### LPBYTE lpbyDots

lpbyDots - an array of dot patterns nLen bytes long. Each byte of this
pattern represents Braille dots in the standard notation where bit0
corresponds to dot1, bit 1 to dot2, etc.

## Returns

BOOL: TRUE on success, FALSE on failure. The most likely cause of error
is that the combination of the nStart and nLen parameters are such that
more cells are being output than will fit on the display.
