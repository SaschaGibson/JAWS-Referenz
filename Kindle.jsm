; Copyright 2017 by Freedom Scientific, Inc.
; Freedom Scientific script message file for the Kindle PC app

Messages
;msgKindleAppName is given as the name of the loaded settings when Insert+Q is pressed.
@msgKindleAppName
Kindle
@@
;msgErr_SelectionNotAvailable is spoken when the user attempts to select text in the Kindle book page view.
@msgErr_SelectionNotAvailable
Selection not available
@@
;msgTopOfPage_L and msgBottomOfPage_L replace the cmsg36_L and cmsg37_L messages when Control+Home or Control+End are used in the book document.
;The messages are replaced because these movements go to the top or bottom of the page, not the file.
;Note that the default short messages are not replaced, since they merely say "top" or "bottom".
@msgTopOfPage_L
top of page
@@
@msgBottomOfPage_L
Bottom of page
@@
;msgBookPageViewScreenSensitiveHelp is spoken when Insert+F1 is pressed in the Kindle book document.
;%1 is the key assignment to perform a SayAll.
@msgBookPageViewScreenSensitiveHelp
This is the Kindle book document.
You can navigate using standard reading commands, or start reading by pressing %1.
@@
;msgMoveToLinkNotSupported is spoken when quick nav key for move to visited or unvisited links is used.
;Kindle does not currently support distinguishing visited from unvisited links.
;%1 is either cVMsgVisitedLinks1_L or cVMsgUnvisitedLinks1_L, depending on which type of navigation was attempted.
;note that cVMsgVisitedLinks1_L and cVMsgUnvisitedLinks1_L are the plural forms.
@msgMoveToLinkNotSupported
%1 are not yet supported by Kindle
@@
@msgEnteringLink
link
@@
@msgLeavingLink
exiting link
@@
;for msgQuickNavNotAvailableInEdgeForType,
;%1 is the type of quick key navigation which is unavailable for use in Edge.
@msgQuickNavNotAvailableInKindleForType_L
Quick navigation is not available in Kindle for %1
@@
@msgQuickNavNotAvailableInKindleForType_S
Not available in Kindle for %1
@@
@msgKindleSentenceNavigationNotSupported
Sentence navigation is not supported by Kindle.
@@
;for msgKindlePageChangeSinglePage
; %1 is the new page
@msgKindlePageChangeSinglePage
Page %1
@@
;for msgKindlePageChangeMultiplePages
; %1 is the new first page
;%2 is the new last page
@msgKindlePageChangeMultiplePages
Page %1 through %2
@@
@msgKindleSelectALinkNotSupported
List of links is not supported at this time.
@@
;msgEnteringAnnotation is announced when navigating by character into an annotation (comment)
@msgEnteringAnnotation
comment
@@
;msgLeavingAnnotation is announced when exiting an annotation
@msgLeavingAnnotation
exiting comment
@@
;msgEnteringHighlight is announced when navigating by character into text which has been highlighted
@msgEnteringHighlight
highlight
@@
;msgLeavingHighlight is announced when exiting a highlight
@msgLeavingHighlight
exiting highlight
@@
;for announcement of quicknav types.
@QuicknavElementDifferentElement
different element
@@
@QuicknavElementSameElement
same element
@@
@QuicknavElementRegions
regions
@@
@QuicknavElementArticles
articles
@@
@QuicknavElementFormElements
form elements
@@
@QuicknavElementLists
lists
@@
@QuicknavElementFrames
frames
@@
@QuicknavElementStartOfElement
start of element
@@
@QuicknavElementEndOfElement
end of element
@@
@QuicknavElementPlaceMarker
place markers
@@
@QuicknavElementVisitedLink
visited links
@@
EndMessages
