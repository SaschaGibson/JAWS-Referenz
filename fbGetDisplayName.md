# fbGetDisplayName

## Description

Obtains the name of the display

## Usage

FSBRLAPI BOOL WINAPI fbGetDisplayName(HANDLE hDisplay,LPSTR lpszName,
int nMaxChars);

## Parameters

### HANDLE hDisplay

A handle previously obtained from fbOpen.

### LPSTR lpszName

lpszName - buffer to receive the name of the display

### INT nMaxChars

nMaxChars - space available in lpszName. This should be set to at least
16.

## Returns

BOOL: TRUE on success, FALSE on failure.
