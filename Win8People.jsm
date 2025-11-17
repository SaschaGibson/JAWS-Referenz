;Copyright 2014-2015 Freedom Scientific, Inc.
;Freedom Scientific script message file for Windows 8.1 People modern application

const
;object names
	;on main screen:
		objn_Favorites_Group = "Favorites", ;parent to list of favorites
		objn_AllContacts_group = "All contacts",
	;Search edit box parent object name:
		objn_SearchBox_group = "Search",
	;Heading or page title in All Contacts:
		objn_AllContacts_heading = "All contacts", ;in English, same as objn_AllContacts_group from main screen
	;Ancestor object in dialog for account settings:
		objn_AccountSettingsFlyout_dialog = "Accounts settings flyout",
	;Add Favorites dialog:
		objn_PeopleList = "People", ;ancestor to list to choose from when adding favorites
		objn_SelectionBasket = "Selection Basket", ;ancestor to selection basket or grid where choices are placed
	;Add Picture, item picker window.
	;Go to person in contacts, press enter on button with their name, arrow to Add Picture, press Enter:
		objn_ItemPicker = "Item Picker", ;ancestor to picker basket
	;After twitter or facebook account is added,
	;dialog that appears when See All Notifications link is pressed:
		objn_Notifications_list = "Notifications", ;ancestor name of list
		objn_Photos_list = "Photos", ;ancestor name of list
	;In What's New dialog, tweet list item fragments:
		;The text which preceeds the name of the person posting will be trimmed from each entry.
		;If your language does not have a string of text which always appears before the name of the person posting,
		;then use empty quotes for the following message so that nothing is trimmed from each tweet:
			objn_tweetItem_prefixedText = "What's new update by ",
		;Preceding the actual text of each tweet:
			objn_tweetItem_ItSaid = "It said: ",
		;status messages about replies and favorites,
		;found at the end of each tweet that has not been favorited, liked, commented on or replied to:
			objn_tweetItem_NotFavorited = "Update has not been favorited", ;twitter status
			objn_tweetItem_NotRetweeted = "Update has not been retweeted", ;twitter status
			objn_tweetItem_NoReplies = "0 replies", ;twitter status
			objn_tweetItem_noLikes = "0 likes", ;facebook status
			objn_tweetItem_noComments = "0 comments", ;facebook status
	;Status bar showing count of characters in tweet or message edit field:
		objn_MessageCharacterCount_statusBar = "Message character count",
	;Ancestor object in dialog for Settings > Options:
		objn_optionsSettingsFlyout_dialog = "Settings Flyout",
	;dialog name for verification of account protection,
	;appears when setting up to allow people to use Microsoft Account:
		objn_HelpUsProtectYourAccount_dialog = "Help us protect your account"

Messages
@msgWin8PeopleAppName
Win8People
@@
;msgNoResults is the message to speak when a search yields no results.
;The search edit on the main screen is one of the search edits where this applies.
@msgNoResults
No results
@@
EndMessages
