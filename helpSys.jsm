;JAWS  Help System feature Support
;Copyright 1995-2015 Freedom Scientific, Inc.
; Used to speak/Braille treeviews of books and topics as well as the Index and Search 
;pages of the HTML Help Systems correctly
; This module should be used by hhctrl.jss, msoHelp.jss and windows help.jss and 
;any other script file which implements support for a similar help system.

const
	scOpen="open",
	scClosed="closed",
	scContents = "Contents",

;Control ID Constants translators ignore
	ID_INDEX_EDIT = 3003,
	ID_INDEX_LIST = 222,
	ID_INDEX_BUTTON = 3006,
	ID_indexTopicsFound=3044,
	ID_SEARCH_EDIT = 3024,
	ID_SEARCH_BUTTON = 3015,
	ID_SEARCH_LISTVIEW = 3013,
	ID_searchDisplayButton=3015

messages
;Names for the two lists.  These names are spoken i.e. hardcoded by us.
@msgIndexList
Index Keywords
@@
@msgTopicsFound
Topics Found
@@
@msgSearchList
Search Results
@@
@msgIndexEdit
Index Keyword
@@
; screen sensitive help messages for search and index pages
@msgIndexEditHelp
Type in keywords for the information you want to find.
To move through the list of topics, press UP or DOWN ARROW.
To display the selected topic, press ENTER.
To move to and read the information,  press F6.

To navigate between the Contents, Index, Search, and Glossary pages, press CTRL+TAB.
@@
@msgIndexListHelp
To move to the topic, press F6.
To move through the list, use the Arrow keys and press ENTER on keywords.
If there are multiple matching topics, select from the list, press ENTER and press F6.
@@
@msgIndexDisplayHelp
To view the topic, press SPACEBAR, then press F6.
@@
@msgTopicsFoundHelp
To cycle through the list, use the Arrow keys. 
To select a topic, press ENTER, then press F6 to move to it.
@@
@msgSearchEditHelp
Use the Search edit box to type in keywords for the information you want to find.
To list the topics,  press ENTER .
To move to the searched results, press TAB.
To move through the searched results, press UP or  DOWN ARROW.
To navigate between the Contents, Index, Search, and Glossary pages, press CTRL+TAB.
@@
@msgSearchListTopicsHelp
To move through the search results, use the Arrow keys.
To select a topic, press ENTER.
To move to the topic window and read it, press F6.
@@
@msgSearchResultsHelp
To move through the results, use the Arrow keys.
To select a topic, press ENTER, then press F6 to move to it.
@@
@msgSearchDisplayHelp
To display the selected topic from the Search Results list, press SPACEBAR or ENTER.
@@
; screen sensitive help messages for topic pane
@msgHelpTopicText
This is a help topic.
To review this information, you may use all standard reading keys.
@@
;%1=number of links greater than 1
@msgWithLinks
This topic contains %1 links.
For a list of these links, use %KeyFor(selectALink).
@@
@msgOneLink
This topic contains one link.
To select or move to this link, use %KeyFor(selectALink).
@@
@msgNoLinks
There are no links in this topic.
@@
@msgHelpTopicSamePageLink
This is a link that points to another location in the same help topic.
To move to this information now, press enter or to continue, use your reading keys.
@@
@msgHelpTopicLink
this is a link that points to a different help topic.
To activate the link and switch to the new help topic, press enter  or to continue, use your reading keys.
@@
;%1=treeview level
@msgTreeviewHelp
The Contents Page lists books within a tree view. 
You are currently at level %1.
To move through books and their topics, press UP or DOWN ARROW,
or press the first letter of a book or topic name.
To open a book, press RIGHT ARROW or ENTER. 
To close a book or move to the previous level, press LEFT ARROW.
To display the contents of the selected topic, press ENTER. 
To move to and read the topic, press F6.
To navigate between the Contents, Index, Search, and Glossary pages, press CTRL+TAB. 
@@
;Book and topic messages
; %1=name of book, %2=open or closed
@msgBook
%1 book %2
@@
; %1=name of topic
@msgTopic
topic %1
@@
;%1=book name, %2=opened or closed
@msgBrlBook
%1 book %2
@@
; %1=name of topic
@msgBrlTopic
%1 topic
@@
; note other heading messages are in ie.jsm
@msgHelpTopicHeadingHelp
For a list of the headings in this topic, press %keyFor(SelectAHeading).  
@@
endMessages