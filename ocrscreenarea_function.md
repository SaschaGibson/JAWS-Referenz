# Function: OCRScreenArea

## Description

Performs optical character recognition on a given rectangular area of
the screen. The OCR processing is asynchronus. When the OCR operation is
complete, the OCRCompletedEvent will be sent. The OCR data is then
available to the JAWS cursor.

## Returns

Type: Int\
Description: a job ID. This ID may be used to cancel the OCR operation
in progress, or to identify a specific OCRScreenArea call in the
OCRCompletedEvent function. If the OCR is not successfully initiated,
the returned job ID is 0.\

## Parameters

### Param 1:

Type: int\
Description: left edge of the requested screen area.\
Include: Required\

### Param 2:

Type: int\
Description: top edge of the requested screen area.\
Include: Required\

### Param 3:

Type: int\
Description: right edge of the requested screen area.\
Include: Required\

### Param 4:

Type: int\
Description: bottom edge of the requested screen area.\
Include: Required\

### Param 5:

Type: int\
Description: primary language code. (English is 1033)\
Include: Required\

### Param 6:

Type: int\
Description: secondary language code. (English is 1033)\
Include: Required\

### Param 7:

Type: int\
Description: Flag set to use the Microsoft OCR Engine\
Include: Optional\

### Param 8:

Type: int\
Description: Microsoft OCR language code. (English is 1033)\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 13.0 and later
