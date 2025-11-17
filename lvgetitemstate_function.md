# Function: lvGetItemState

## Description

Detects the current selection state of the item within a ListView. Refer
to the return states for more information.

## Returns

Type: Int\
Description: LVIS_FOCUSED = 1. The item has the focus, so it is
surrounded by a standard focus rectangle. Although more than one item
may be selected, only one item can have the focus. LVIS_SELECTED = 2.
The item is selected. The appearance of a selected item depends on
whether it has the focus and also on the system colors used for
selection. LVIS_CUT = 4. The item is marked for a cut-and-paste
operation. LVIS_DROPHILITED = 8. The item is highlighted as a
drag-and-drop target.\

## Parameters

### Param 1:

Type: Handle\
Description: window handle of the List View.\
Include: Required\

### Param 2:

Type: Int\
Description: 1-based index of the item.\
Include: Required\

## Version

This function is available in the following releases:

1.  JAWS 5.10 and later
