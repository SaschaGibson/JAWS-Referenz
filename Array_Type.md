# Array Type Variables

## Keywords:

- IntArray
- StringArray
- HandleArray
- ObjectArray
- VariantArray
- New

\

## Description

An array is a data type that contains a fixed number of elements, and
whose elements are accessed by means of an integer index. Arrays are
created to hold the data type for which they are intended. For example,
IntArrays hold integers, StringArrays hold strings, etc. A VariantArray
holds data of type variant, which means that it may hold any data type.

After declaring an array, create it and specify the size of the array
using the keyword, New. The array is fixed to be the size specified at
the time it is created. Multiple dimensions may be created, and can be
separated with a comma.

You may access elements in an array by means of indices enclosed in
square brackets.

## Syntax

\
\

    Var
        TypeArray xArray
        Let xArray = new TypeArray(size)
        Let xArray[i] = value

    Var
        TypeArray xyArray
        Let xyArray = new TypeArray(sizeX,sizeY)
        Let xyArray[i,j] = value

\

- TypeArray is any of the types of arrays that may be created\--
  IntArray, StringArray, HandleArray, ObjectArray, or VariantArray.
- XArray is an array variable being declared and created. It is a
  one-dimensional array.
- Size is the number of elements in the one-dimensional array xArray.
- XyArray is an array variable being declared and created. It is a
  one-dimensional array.
- SizeX is the number of elements in the first dimension of the
  one-dimentional array xyArray.
- SizeY is the number of elements in the second dimension of the
  one-dimensional array xyArray.
- I is an index into the array.
- J is an index into the second dimension of the one-dimensional array.
- Value is a value assigned to an element of the array.

\
\

## Remarks

Declaring the array does not create it. Creation of the array must be
done by means of the New statement.

A VariantArray can contain items of any type. Collections can be
elements of an array if that array is of type VariantArray. The script
code should take care to manage the types of data in variant arrays
appropriately.

Arrays are always passed to functions by reference.

Assigning one array to another will result in two variables referring to
the same array.

There is no compile-time error if the wrong number of index expressions
is specified for an array, or if an index attempts to access outside the
bounds of the array.

There is also no runtime error notification, but the error may cause
JAWS to lock. Therefore, take care to avoid illegal index references.

## Code Sample

The below nonsense example shows the power of arrays and in fact of the
VariantArray type.

    Messages
    ;For sMsgGemInfo, %1 is the gem type, %2 the jewelry, %3 the occasion, %4 the number, and %5 the shape
    @sMsgGemInfo
    %5 %1 %2s for the %4 %3s

    @@
    EndMessages

    Script TestArrays ()
    ArrayOfGemsCollections()
    EndScript

    Void Function GmsInit(Collection Gms, String Name, string Type, String Occasion, Int Number, String Shape)
    Let Gms.Name = Name
    Let Gms.Type = Type
    Let Gms.Occasion = Occasion
    Let Gms.Number = Number
    Let Gms.Shape = Shape
    EndFunction

    Void Function ArrayOfGemsCollections()
    Var
        VariantArray Gems,
        Collection gms,
        Int i,
        String sMessage

    Let Gems = new variantArray[5]
    Let gms = new collection
    gmsInit(gms,"emerald","pendant","birthday",6,"oval")
    Let Gems[1] = gms
    Let gms = new collection
    GMSInit(gms,"diamond","ring","engagement",7,"square-cut")
    Let Gems[2] = gms
    Let gms = new collection
    GMSInit(gms,"sapphire","bracelet","anniversary",9,"round")
    Let Gems[3] = gms
    Let gms = new collection
    GMSInit(gms,"ruby","pairs of earring","graduation",8,"tear-drop")
    Let Gems[4] = gms
    Let gms = new collection
    GMSInit(gms,"pearl","necklace","wedding",20,"cultured")
    Let Gems[5] = gms
    Let gms = new collection
    For i = 1 to 5
        SayFormattedMessage(ot_line,
            FormatString(sMsgGemInfo,
                Gems[i].name,
                Gems[i].type,
                Gems[i].occasion,
                Gems[i].Number,
                Gems[i].Shape)
        )
    EndFor
    For i = 1 to 5
            Let sMessage = FormatString(sMsgGemInfo,
                Gems[i].name,
                Gems[i].type,
                Gems[i].occasion,
                Gems[i].Number,
                Gems[i].Shape)
        TypeString (sMessage+cscBufferNewLine)
    EndFor
    EndFunction
