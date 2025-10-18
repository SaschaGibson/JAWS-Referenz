# Function: SkimRead

## Description

Skimreading allows the user to read out certain portions of a document
while skipping over irrelevant information. The Skimreading mode maybe
specified along with an optional text expression which determines which
information is read.

## Returns

Type: Void\

## Parameters

### Param 1:

Type: int\
Description: Modes are defined in HJConst.jsh and include srmOff
(equivalent to a SayAll), srmFirstLineOfParagraph (just read the first
line of each paragraph), srmFirstSentenceOfParagraph (just the first
sentence of each paragraph) or srmTextMatchingRegularExpression (read
just the units of text which match the supplied Regular Expression.\
Include: Optional\

### Param 2:

Type: int\
Description: TRUE to indicate JAWS is skimming, a beep will be heard
every 20 units skimmed. The unit will depend on the current SayAll
mode.\
Include: Optional\

### Param 3:

Type: string\
Description: Is a regular expression defining what text should be
present or absent in the text unit in order for it to be spoken. Some
examples include Joe\|Blogs\|Fred (read units including the names Joe,
Blogs or Fred), Joe&\~BLogs (text units containing Joe but not Blogs),
etc. See the documentation for the full regular expression syntax as it
is very powerful.\
Include: Optional\

### Param 4:

Type: int\
Description: when srmTextMatchingRegularExpression is used, the text
unit to which the rule is applied and the unit spoken on a match.\
Include: Optional\

### Param 5:

Type: int\
Description: if true, does not read each match but adds the text to the
User Buffer and presents all matches at once when the SkimRead is
stopped or completes (JAWS 6.10 and higher) defaults to FALSE.\
Include: Optional\

### Param 6:

Type: int\
Description: use attrib constants in hjConst.jsh\
Include: Optional\

### Param 7:

Type: string\
Description: use empty string (or don\'t pass) for any text color\
Include: Optional\

### Param 8:

Type: string\
Description: use empty string (or don\'t pass) for any back color\
Include: Optional\

### Param 9:

Type: int\
Description: if TRUE or not supplied, the text string will be treated as
a regular expression as in prior versions of JAWS, if FALSE, a simple
case insensitive check for text inclusion of the string will be
performed.\
Include: Optional\

## Version

This function is available in the following releases:

1.  JAWS 6.00 and later
