# fbGetFirmwareVersion

## Description

Obtains the firmware version

## Usage

FSBRLAPI BOOL WINAPI fbGetFirmwareVersion(HANDLE hDisplay,LPSTR
lpszVersion,int nMaxChars);

## Parameters

### HANDLE hDisplay

A handle previously obtained from fbOpen.

### LPSTR lpszVersion

lpszVersion - buffer to receive the version info

### INT nMaxChars

nMaxChars - space available in lpszVersion. This should be set to at
least 16.

## Returns

BOOL: TRUE on success, FALSE on failure.
