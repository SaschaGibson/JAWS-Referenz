This function is available in the following releases:

1.  [JAWS 4.51-18.0](#_JAWS4.51-18.0)
2.  [JAWS 21.0 and later](#_JAWS21.0andlater)
3.  [JAWS 19.0-20.0](#_JAWS19.0-20.0)

# []{#_JAWS4.51-18.0} Function: SayObjectTypeAndText

## Description

Speaks the name and type of the object located at the current cursor\'s
location. It is the most reliable way of obtaining such information. It
should be used instead of SayWindowTypeAndText which has been retained
for backward compatibility. The two functions are similar, but
SayObjectTypeAndText is able to handle objects supported by MSAA, and
the case where multiple objects are contained within the same window.
When this function is used, it marks the text it reads so that the Say
Highlighted Text and Say NonHighlighted Text functions do not repeat the
same information when they are triggered.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 4.51-18.0

# []{#_JAWS21.0andlater} Function: SayObjectTypeAndText

## Description

Speaks the name and type of the object located at the current cursor\'s
location. It is the most reliable way of obtaining such information. It
should be used instead of SayWindowTypeAndText which has been retained
for backward compatibility. The two functions are similar, but
SayObjectTypeAndText is able to handle objects supported by MSAA, and
the case where multiple objects are contained within the same window.
When this function is used, it marks the text it reads so that the Say
Highlighted Text and Say NonHighlighted Text functions do not repeat the
same information when they are triggered.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

### Param 2:

Type: int\
Description: if not supplied, assumed to be true.\
Include: Optional\

### Param 3:

Type: Int\
Description: Optional parameter used to indicate whether or not the line
should be highlighted by the Visual Tracking, ZoomText or Fusion as the
text is being spoken. The possible values are as follows: If the
parameter is not present or is equal to false, do nothing; If the
parameter is true, highlight the object being spoken. NOTES: (1) This
functionality is not currently supported in all applications. (2) The
highlight rectangles will only be drawn if Visual Tracking is enabled or
ZoomText/Fusion is running.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 21.0 and later

# []{#_JAWS19.0-20.0} Function: SayObjectTypeAndText

## Description

Speaks the name and type of the object located at the current cursor\'s
location. It is the most reliable way of obtaining such information. It
should be used instead of SayWindowTypeAndText which has been retained
for backward compatibility. The two functions are similar, but
SayObjectTypeAndText is able to handle objects supported by MSAA, and
the case where multiple objects are contained within the same window.
When this function is used, it marks the text it reads so that the Say
Highlighted Text and Say NonHighlighted Text functions do not repeat the
same information when they are triggered.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: Which object in the hierarchy should be spoken. 0, which is
the default, refers to the object with focus. 1 refers to the parent of
the focus object, 2 refers to the grandparent, etc.\
Include: Optional\

### Param 2:

Type: int\
Description: if not supplied, assumed to be true.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 19.0-20.0
