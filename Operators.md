# Operators

The Freedom Scientific Scripting language supports the use of many
operators. Operators are grouped by usage at heading level 2 elements,
and each operator within that group is at a heading level 3 element
along with its relevant descriptive information. Where the name of the
operator is a punctuation character symbol or group of characters, it is
spelled out in parentheses after the character or group of characters.

Unless otherwise specified, the version where the operator was first
made available to the Scripting language was JAWS 4.5.

## Arithmetic Operators

### Operator: + (plus)

Use the + (plus) operator in equations to indicate addition or to
concatenate strings enclosed in quotation marks.

### Operator: - (minus)

Use the - (dash) minus operator in equations to indicate subtraction.

### Operator: \* (asterisk)

Use the \* (asterisk) operator in equations to indicate multiplication.

### Operator: / (slash)

The / slash operator is used in equations to indicate division.

### Operator: % (percent)

The result of the modulus operator (%) is the remainder when the first
operand is divided by the second.

## Comparison Operators

### Operator: == (double equal)

The == (double equal) operator asks whether the first condition is equal
to the second condition.

### Operator: != (is not equal to)

The != (exclamation mark equal to) operator asks whether the first
condition is not equal to the second condition.

### Operator: \>= (greater than or equal to)

The \>= (greater than or equal to) operator asks whether the first
condition is greater than or equal to the second condition.

### Operator: \> (greater)

The \> (greater than) operator asks whether the first condition is
greater than the second condition.

### Operator: \<= (less than or equal to)

The \<= (less than or equal to) operator asks whether the first
condition is less than or equal to the second condition.

### Operator: \< (less than)

The \< (less than) operator asks whether the first condition is less
than the second condition.

## Logical Operators

### Operator: && (double ampersand)

The && (double ampersand) operator asks whether the first condition is
true, and additionally whether the second condition is true.

### Operator: \|\| (double vertical bar)

The \|\| (double vertical bar) ) operator asks whether the first
condition is true, or if the second condition is true. If the first
condition is true, the second condition is not evaluated. It does not
matter which condition is true

### Operator: ! (Exclamation point)

The ! (exclamation mark) operator negates the expression to which it is
applied. It is equivalent to the \"not\" keyword.

## Bitwise Operators

### Operator: & (ampersand)

The & (ampersand) bitwise operator compares each bit of its first
operand to the corresponding bit of its second operand. If both bits are
1, the corresponding result bit is set to 1. Otherwise, the
corresponding result bit is set to 0.

The best example of how to use this operator is in the NewTextEvent
function in default.jss. In this function, it is used for a binary
comparison of two binary numerical values. The value of nAttibutes is a
multiple digit binary numerical value that indicates all the attributes
applying to the buffer string. Each attribute is indicated by whether a
certain bit in the byte is turned on. The & operator returns all values
that exist in both numerical values. For example, if the value of
nAttributes is 01001010, then the seventh bit in the result byte of
nAttributes & ATTRIB_HIGHLIGHT is set to 1 (ATTRIB_HIGHLIGHT = 64 or
01000000 binary). The second bit in the result byte of nAttributes &
ATTRIB_BOLD is set to 1 (ATTRIB_BOLD = 2 or 00000010 binary). The fourth
bit in the result byte of nAttributes & ATTRIB_UNDERLINE is set to 1
(ATTRIB_UNDERLINE = 8 or 00001000 binary). But the third bit in the
result byte of nAttributes & ATTRIB_ITALIC is set to 0 since
ATTRIB_ITALIC is 4 or 00000100 binary and the third bit in the
nAttributes byte is 0.

### Operator: \| (vertical bar)

The \| (bitwise vertical bar) operator compares each bit of its first
operand to the corresponding bit of its second operand. If either bit is
1, the corresponding result bit is set to 1. Otherwise, the
corresponding result bit is set to 0.

This operator does a bit-by-bit comparison of two numerical values which
is similar to that of the & operator. For example, the statement
00100110 \| 11000000 returns 11100110.

### Operator: \~ (tilde(

Use the \~ (tilde) operator with & and \| (the \"and\" and \"vertical
bar\")bitwise operators to mask off or exclude a bit from being
processed. A good example is in default.jss in the ObjStateChangedEvent
function in the following statement:\
IndicateControlState(iObjType,nState&\~(CTRL_CHECKED\|CTRL_UNCHECKED))\
The statement ensures that if the control is partially checked, the
unchecked and checked states are not processed and therefore not
indicated by JAWS.

### Operator \<\< (less than less than)

Bitwise left shift. Use to shift the bits in a bitwise pattern left.
Often, this is done to move a bit to a specific position in a bit set
before performing some other bitwise operation.

### Operator \>\> (greater than greater than)

Bitwise right shift. Use to shift the bits in a bitwise pattern right.
Often, this is done to move a bit to a specific position in a bit set
before performing some other bitwise operation.

## Miscellaneous Operators

### Operator: = (equals)

Use this operator to assign a value to a variable.

### Operator: . (dot)

Use the dot operator to assign or retrieve the name of an item in a
collection when the name of the item is known. For example, you can use
Months.January to access the item called January in the Months
collection. But you may not use The dot operator to access the name of
the item if the name of the item is enclosed in quotes, contained in a
variable, or is returned by a function call.

Version: This operator is available as of JAWS 11.

### Operator: New

Use the New operator to create an instance of an array of collection.
You must specify the size and dimensions of the array when creating a
new array and when creating an instance of the array.

Version: This operator is available as of JAWS 11.

### Operator: \[\] (left bracket, right bracket)

Use brackets to specify the size of an array when creating the array .
Also, you may use them to access elements of an array. If the array is
multi-dimensional, you must separate the index for each dimension by
commas. For example, \[3,5\] specifies the element on the third row and
fifth column of the array.

Additionally, use brackets to assign or retrieve the name of an item in
a collection if the name of the item is enclosed in quotes, contained in
a variable, or is returned by a function call.

Version: This operator is available as of JAWS 11.

### Operator: () (left-parenthesis right-parenthesis)

Use to enclose a parameter list for a function call, or to establish
order of precedence.
