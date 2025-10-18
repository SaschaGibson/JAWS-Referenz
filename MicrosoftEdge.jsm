; Copyright 2017 by Freedom Scientific, Inc.
; Freedom Scientific script message file for Microsoft Edge

const
;StrVirtHTMLDlgLst is for the Virtual HTML Features dialog specific to Edge, which contains a subset of the items in cStrVirtHTMLDlgLst1:
	StrVirtHTMLDlgLst = "Form Fields List|Headings List|Links List"

Messages
;msgMicrosoftEdgAppName is used in the Insert+Q script
@msgMicrosoftEdgAppName
Microsoft Edge
@@
@msgEnteringApplicationRegion
entering application 
@@
@msgEnteringNamedApplicationRegion
entering %1 application 
@@
@msgLeavingApplicationRegion
exiting application 
@@
@msgEnteringArticleRegion
entering article 
@@
@msgEnteringNamedArticleRegion
entering %1 article 
@@
@msgLeavingArticleRegion
exiting article 
@@
@msgEnteringBannerRegion
entering banner 
@@
@msgEnteringNamedBannerRegion
entering %1 banner 
@@
@msgLeavingBannerRegion
exiting banner 
@@
@msgEnteringComplementaryRegion
entering complementary 
@@
@msgEnteringNamedComplementaryRegion
entering %1 complementary
@@
@msgLeavingComplementaryRegion
exiting complementary 
@@
@msgEnteringContentInfoRegion
entering contentinfo
@@
@msgEnteringNamedContentInfoRegion
entering %1 contentinfo
@@
@msgLeavingContentInfoRegion
exiting contentinfo
@@
@msgEnteringFormRegion
entering form
@@
@msgEnteringNamedFormRegion
entering %1 form
@@
@msgLeavingFormRegion
exiting form 
@@
@msgEnteringMainRegion
entering main
@@
@msgEnteringNamedMainRegion
entering %1 main
@@
@msgLeavingMainRegion
exiting main
@@
@msgEnteringNavigationRegion
entering navigation
@@
@msgEnteringNamedNavigationRegion
entering %1 navigation
@@
@msgLeavingNavigationRegion
exiting navigation
@@
@msgEnteringRegion
entering region
@@
@msgEnteringNamedRegion
entering %1 region
@@
@msgLeavingRegion
exiting region
@@
@msgEnteringSearchRegion
entering search
@@
@msgEnteringNamedSearchRegion
entering %1 search
@@
@msgLeavingSearchRegion
exiting search
@@
@msgEnteringLink
link
@@
@msgLeavingLink
exiting link
@@
@msgEnteringHeading
heading %1
@@
@msgLeavingHeading
exiting heading
@@
;for msgQuickNavNotAvailableInEdgeForType,
;%1 is the type of quick key navigation which is unavailable for use in Edge.
@msgQuickNavNotAvailableInEdgeForType_L
Quick navigation is not available in Edge for %1
@@
@msgQuickNavNotAvailableInEdgeForType_S
Not available in Edge for %1
@@
;msgDifferentElementQuickNavType is used in msgQuickNavNotAvailableInEdgeForType messages
@msgDifferentElementQuickNavType
Different element
@@
;msgSameElementQuickNavType is used in msgQuickNavNotAvailableInEdgeForType messages
@msgSameElementQuickNavType
same element
@@
;msgNonLinkTextQuickNavType is used in msgQuickNavNotAvailableInEdgeForType messages
@msgNonLinkTextQuickNavType
nonlink text
@@
;msgComboControlQuickNavTypes is used for the name of the type when quick navigation fails
;and error messages are spoken, such as cvmsgNoElements_L
@msgComboControlQuickNavTypes
ComboBoxes or edit combos
@@
;msgSelectFromListForTypeNotAvailableInEdge is spoken when Control+Insert+QuickNav letter is used to bring up a list of types
;where selection from a list is not available and is not planned to be supported.
;%1 is the plural name of the type.
@msgSelectFromListForTypeNotAvailableInEdge
Selection from a list is not available in Edge for %1
@@
;msgSelectFromListForTypeNotYetAvailableInEdge is spoken when Control+Insert+QuickNav letter is used to bring up a list of types
;where selection from a list is not yet available but is planned to be supported.
;%1 is the plural name of the type.
@msgSelectFromListForTypeNotYetAvailableInEdge
Selection from a list is not yet available in Edge for %1
@@
;msgPlacemarkerNotAvailableInEdge is spoken when the user tries to set, say or navigate to a placemarker.
@msgPlacemarkerNotAvailableInEdge
Placemarkers are not available in Edge
@@
;msgSelectTextBetweenMarkedPlaceAndCurrentPositionNotAvailableInEdge is spoken when the script SelectTextBetweenMarkedPlaceAndCurrentPosition is used.
@msgSelectTextBetweenMarkedPlaceAndCurrentPositionNotAvailableInEdge
Select text between marked place and current position is not available in Edge
@@
;msgJumpToLineNotAvailableInEdge is spoken when the user attempts to jump to or return jump from line.
@msgJumpToLineNotAvailableInEdge
Jump to line is not available in Edge
@@
;msgSmartNavNotAvailableInEdge is spoken when the user attempts to toggle smart navigation.
@msgSmartNavNotAvailableInEdge
Smart navigation is not available in Edge
@@
;msgVirtualCursorSelectionNotYetSupportedInEdge is spoken when selection is attempted with the virtual cursor active.
@msgVirtualCursorSelectionNotYetSupportedInEdge
Selection using the virtual cursor is not yet supported in Edge.
@@
;msgScreenSensitiveHelpEdgeVirtualDocumentGeneral is taken from cmsgScreenSensitiveHelpVirtualDocumentGeneral, 
;but with information changed or removed where features work differently or are not supported.
@msgScreenSensitiveHelpEdgeVirtualDocumentGeneral
This is an Edge browser document.
You can use the standard %product% reading commands or Navigation Quick Keys to navigate and read this document. %product% can also
display lists of certain elements on this page. For example, you can press INSERT+F7 for a list of links, INSERT+F6 for a list of headings, or INSERT+F5
for a list of form fields.

Semi auto Forms Mode is on. This means that when focus moves to an edit field, %product% automatically turns on Forms Mode so that you can immediately type text in the edit field. Forms Mode will turn off when you exit the edit field.
Press ESC or NUMPAD PLUS to manually exit Forms Mode.
@@
;msgMoveToLinkNotSupported is spoken when quick nav key for move to visited or unvisited links is used.
;Edge does not currently support distinguishing visited from unvisited links.
;%1 is either cVMsgVisitedLinks1_L or cVMsgUnvisitedLinks1_L, depending on which type of navigation was attempted.
;note that cVMsgVisitedLinks1_L and cVMsgUnvisitedLinks1_L are the plural forms.
@msgMoveToLinkNotSupported
%1 are not yet supported by Edge
@@
;msgVirtualPCCursorToggleNotSupportedInEdge is spoken when the script to toggle the virtual PC cursor is used, insert+Z
@msgVirtualPCCursorToggleNotSupportedInEdge
The virtual PC cursor cannot be toggled off in Edge
@@
;msgNotificationBarHelp is spoken as help text after speaking an alert from the notification bar:
@msgNotificationBarHelp
Press Alt+N to move to the notification bar
@@
;msgSpeakCurrentNotificationBarText_error is used by script SpeakCurrentNotificationBarText when UIA initialization fails.
;This is here for safety, the failure is not actually expected to occur.
@msgSpeakCurrentNotificationBarText_error
Unable to detect any notifications
@@
;msgSpeakCurrentNotificationBarText_NoneFound is spoken by script SpeakCurrentNotificationBarText when no notifications exist.
@msgSpeakCurrentNotificationBarText_NoneFound
No notifications
@@
;msgWindowsFeedbackHubAppName is the application name as reported by the GetMetroAppName function.
;Insert+Q uses GetMetroAppName to report the running application, you can see what it reports for this string.
;msgWindowsFeedbackHubAppName is used to compare the running application name when the Feedback Hub application loads the MicrosoftEdge scripts.
;The MicrosoftEdge scripts load when the Announcements area of Feedback Hub displays content in a web page,
;and in this circumstance we announce msgEnteringWebPage.
@msgWindowsFeedbackHubAppName
Microsoft.WindowsFeedbackHub
@@
;msgEnteringWebPage is announced when the MicrosoftEdge scripts load and the application is Windows Feedback Hub.
@msgEnteringWebPage
Entering web page
@@
;msgEnteringButton is announced when navigating by character over a button that does not have a defined label and can be navigated.
@msgEnteringButton
button
@@
;msgLeavingButton is announced when exiting a button that can be navigated by character.
@msgLeavingButton
exiting button
@@
EndMessages
