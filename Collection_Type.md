# Collection Type Variables

## Description

Collection New

A collection is a data type that may contain members of any type, and
whose members are accessed by means of a key. Members of a collection
need not be of the same data type as each other. After declaring a
collection, create it using the keyword, New.

Items of a collection spring into existence the first time they are
assigned. Assigning a collection member to a value makes that member\'s
type the type of the value being assigned. Each member in a collection
has a key of type string, and each member can contain a value of any
data type.

You may access members of a collection by using the dot operator
followed by the key name, or by the key as a string enclosed in square
brackets.

## Syntax

\
\

    Var collection col
        Let col = new collection
        Let col.item = value

\

- Col is a collection variable being declared and created.
- Item is the name (or key) of a member in the collection being created.
- Value is the value being assigned to a member of the collection.

## Remarks

Declaring a collection does not create it. You must create the
collection by means of the New statement.

Collection members are stored in alphabetical order of the member keys.
If you know the name (or key) of a member in a collection, you can
assign or retrieve that name (or key) using the dot operator. If the
name (or key) of a collection member is enclosed in quotes or is
contained in a variable, you must access that member using the variable
name or quoted string enclosed inside square brackets instead of using
the dot operator.

Collections are always passed to functions by reference.

Assigning one collection to another results in two variables referring
to the same collection.

When retrieving a collection member into another variable, the script
code must ensure that the value retrieved is stored in the appropriate
type of variable. Retrieving a nonexistent item does not generate an
error.

## Code Sample

    Script TestCollections ()
    CollectionOfFruitCollections()
    EndScript

    Void Function FRTINIT(Collection Frt, String Type, string Prep, String Cut)
    Let Frt.Type = Type
    Let Frt.Prep = Prep
    Let Frt.Cut = Cut
    EndFunction

    Void Function CollectionOfFruitCollections()
    Var
        Collection Fruit,
        Collection frt,
        String key,
        String sMsgFruitInfo

    sMsgFruitInfo = "%2 and %3 the %1."
    Let Fruit = new collection
    Let frt = new collection
    FRTINIT(frt,"Bananas","peel","slice")
    Let Fruit.Bananas = frt
    Let frt = new collection
    FRTINIT(frt,"Apples","core","slice")
    Let Fruit.Apples = frt
    Let frt = new collection
    FRTINIT(frt,"Strawberries","sugar","halve")
    Let Fruit.Strawberries = frt
    Let frt = new collection
    FRTINIT(frt,"Oranges","peel","section")
    Let Fruit.Oranges = frt
    Let frt = new collection
    FRTINIT(frt,"Pears","peel","slice")
    Let Fruit.Pears = frt
    Let frt = new collection
    FRTINIT(frt,"Cherries","hull","chop")
    Let Fruit.Cherries = frt
    Let frt = new collection
    ForEach key in Fruit
        SayFormattedMessage(ot_line,
            FormatString(sMsgFruitInfo,
                Fruit[key].Type,
                Fruit[key].Prep,
                Fruit[key].Cut))
    EndForEach
    EndFunction
