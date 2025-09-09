;Corresponding header file for
;Open Book Script File, OBU.jss


CONST
;the following should only be translated if the order of the "Preferences" names are reversed,
;example of usage: "Beginner Preferences" if your translation reners the name as "Preferences beginner" than change from 1 to 2.
	MessageSegment = 1,
	;Windows Classes, non-translatable
	wcObuClass = "AfxFrameOrView42",
;The following two text strings appear on the status bar in the main body of an Openbook document:
	wn_HELP_TEXT = "press f1",
	wn_LINE = "Line",
	wn_BRL_MAN = "Braille Manager",
	wn2 = "Braille Options",
	wnFocusOptions = "Advanced Braille Display Options",
	wn_FlashMessages = "Flash Messages",
	wn_Preferences = "Preferences",
	wn22 = "Cursor Settings",
	wnBM = "Braille Marking",
	wn_dotpatterns = "Dot Patterns"

;EndConst
Messages
;BrailleBuildLine post message for Exact View
@msgExactViewLine
Exact View
@@
@msgGraphic
graphic
@@
;BrailleBuildStatus Post message for Exact View
@msgExactViewStatus
evg
@@
@msgSsh_Obutil_default_brl_disply_combo
Use this combo box to select the Braille Display you want active when
you start OpenBook. If no Braille Display is installed, the combo box
defaults to No Display. To install or add a Braille Display, press the
TAB key to move to the Add Braille Display button or press ALT+B.
@@
@msgSsh_Obutil_modify_settings_btn
Press ENTER or SPACEBAR on this button to modify the connection settings
used by the Braille display currently shown in the Default Braille
Display combo box.
@@
@msgSsh_Obutil_translation_table_combo
Braille Translation Tables provide Braille translations for print
characters of a particular language. Use this combo box to select the
Braille translation table that corresponds to the language you speak.
For instance, the United States typically uses the Table US437, which is
the default.
@@
@msgSsh_Obutil_Brl_load_error_chkbox
If this check box is checked, OpenBook notifies you if the default Braille
Display Driver is not loading when you start OpenBook. This error results
when your Braille Display is not working properly, when your Braille
Display is turned off, or when your Braille Display is not connected
to your computer properly.
@@
@msgSsh_Obutil_add_display_btn
Select this button to add a Braille display for use with OpenBook.
@@
@msgSsh_Obutil_advanced_btn
Select this button to open a dialog containing more advanced Braille settings.
@@
@msgSsh_Obutil_advanced_brl_dsply_settings_btn
Select this button with SPACEBAR to adjust settings for your Focus or PACMate Braille display.
@@
@msgSsh_Obutil_G2_Trans_chkbox
If this check box is checked, contracted Braille is displayed on your Braille display. This check box is cleared by default.
If you select this check box, it is recommended that you do not choose Fixed Increment user panning because OpenBook may split the Braille contractions on either
edge of the display.
Choose either Automatic or Best Fit user panning to keep OpenBook from splitting Braille contractions.
@@
@msgSsh_Obutil_G2_expand_word_chkbox
If this check box is checked, and the braille translator is
enabled, the word at the Braille cursor location is displayed in
computer Braille. If the translator is enabled and this
check box is cleared, the Braille cursor rests at the beginning
of the word and only moves as you navigate from word to word. It
is helpful to check this option when editing documents while in
contracted braille mode.

This check box is checked by default.
@@
@msgSsh_Obutil_suppress_capital_signs
Supress capital signs check box:
In contracted Braille, OpenBook indicates capital letters
by preceeding them with the DOT 6 character. If you select this
check box, OpenBook does not use capital indication in order to
preserve space on your Braille display. This check box is
cleared by default.
@@
@msgSsh_Obutil_attribute_rotation_combo
In attribute mode, all attributes assigned to a block of text are
indicated by a letter or symbol. When multiple attributes are
assigned to the same block of text, the Braille display cycles
through each of them. This setting determines the rate at which
this cycling occurs. The default setting is 1000 milliseconds.
@@
@msgSsh_Obutil_flash_msgs_btn
Braille Flash Messages are short announcements that appear on
your Braille display for only a few seconds. These messages can
include errors, status information, help balloons and other
information. Choose the Flash Messages button to customize how
OpenBook displays Braille Flash Messages.
@@
@msgSsh_Obutil_user_pan_mode_combo
Panning with your Braille display generally moves the display to the left or right by the length of the display.
You do this by pressing a panning key on your Braille display. Select Best Fit to ensure that words are not cut off when panning.
Select Fixed Increment to ensure your Braille display always pans the exact number of cells specified in the Fixed Panning Increment edit box.
Select Maximize Text to show the maximum amount of text that can fit on your Braille display.
Select Automatic to allow OpenBook to choose the best method for showing text on your Braille display.
The default selection is Automatic
@@
@msgSsh_Obutil_fixed_panning_increment_edit
This edit box indicates the number of cells a Braille display moves when panning. The default setting is determined by the number of cells on the active
Braille display.
@@
@msgSsh_Obutil_autoadvance_increment_combo
Select the length of time (in milliseconds) that you want OpenBook
to wait before panning your Braille display while you are
reading in Auto Advance mode. You can choose any value between
500 to 20,000 milliseconds. 1,000 milliseconds are equivalent to
1 second. The default interval is 5000 milliseconds.
@@
@msgSsh_Obutil_autopan_mode_combo
Auto pan mode combo box:
This setting determines how the content of the Braille display is updated when the active cursor moves outside the area currently displayed.
Select Off to turn off automatic panning. If you select Minimal, OpenBook pans the Braille display just enough to show the next word at the location of the
active cursor.
If you select Match User Panning, OpenBook pans the Braille display using the same method specified in the User Pan list.
If you select To Middle, OpenBook keeps the word at the location of the active cursor in the center of the Braille display.
If you select Maximize Text after Cursor, OpenBook pans the display so that text that appears after the location of the active cursor is shown on the Braille
display.
If you select Maximize Text before Cursor, OpenBook pans the display so that text that appears before the location of the active cursor is shown on the Braille
display.
Select Automatic to allow OpenBook to choose the best method for showing text on your Braille display.
The default selection is Automatic.
@@
@msgSsh_Obutil_active_follows_brl_chkbox
If checked, the Braille cursor and the active cursor are linked
together. When you move the Braille cursor, the active cursor
also moves. However, you cannot move the Braille cursor where the
active cursor cannot move. For example, with the PC cursor active,
you cannot read down to the status line of a window. This setting
is not checked by default.
@@
@msgSsh_Obutil_brl_follows_active_chk
If checked, the Braille cursor follows as you move the active cursor, but is not limited to where the active cursor can move.
For example, when moving through a dialog, the Braille cursor moves to each control as you TAB to it.

In Structured mode, the Braille cursor always follows the active cursor, even if you do not select this check box.
This setting is checked by default.
@@
@msgSsh_Obutil_enable_brl_autodetect_chkbox
This check box specifies if OpenBook attempts to automatically detect Braille devices attached to your system.
  This check box is checked by default.
@@
@msgSsh_Obutil_8dot_brl_chkbox
Check this box if you want to have text displayed in 8 dot Braille. In 8 dot Braille mode, OpenBook uses dots 7 and 8 on your Braille display to indicate capitalization
and special symbols in computer Braille. This option is checked by default.
@@
@msgSsh_Obutil_brl_sleep_chkbox
If checked, the Braille driver is disabled. Use Sleep Braille
Mode to disable Braille for a specific application.

This setting is not checked by default.
@@
@msgSsh_Obutil_word_wrap_chkbox
If you select this check box, OpenBook does not split a word that is too large to be shown on the Braille display.
When you pan to the next increment, you can read the word in its entirety.
If you clear this check box, OpenBook displays as much of the word as possible, but a portion may be cut off.
OpenBook shows the remainder of the word when you pan to the next increment.
This check box is selected by default.
@@
@msgSsh_Obutil_cursor_settings_btn
This button opens a dialog that allows you to specify the dots to
indicate cursors. Cursor specifications apply in all Braille
modes where a cursor is displayed.
@@
@msgSsh_Obutil_brl_marking_options_btn
Select this button with SPACEBAR to adjust settings for which text attributes are marked in Braille.
@@
@msgSsh_Obutil_status_cell_position_rdb
Use these radio buttons to determine if the informational Status Cells are located on the left or right end of the display, or choose to not display them
at all.
Left is the default setting.
@@
@msgSsh_Obutil_reading_start_position
Specify the start cell for display of information.
Use the Reading Line edit spin boxes to only display information within the portion of the display you wish to use.
The default setting is determined by the location of the Status Cells.
@@
@msgSsh_Obutil_reading_end_position
Specify the end cell for display of information
Use the Reading Line edit spin boxes to only display information within the portion of the display you wish to use.
The default setting is determined by the location of the Status Cells, and the length of the display.
If you wish to use this option, you must first set the status cells to be shown at the right end of the display.
@@
@msgSsh_Obutil_dotfirmness
Use this slider to specify the firmness of Braille dots on the Focus or PAC Mate Portable Braille display. There are five levels of firmness.
@@
@msgSsh_Obutil_rapidreading_chkbox
Check this box if you want your Focus or PAC Mate Portable Braille display to use only 20 Braille cells.
Limiting the Braille display to 20 cells may increase your reading speed.
When this option is checked, the Placement of Status Cells radio buttons and Reading Line edit spin boxes are disabled,
so before enabling this control, you must set the status cells to be shown on the right end of the display.
This check box is cleared by default.
@@
@msgSsh_Obutil_flashmessage_timeout_combo
Select the length of time (in milliseconds) that you want
Braille Flash Messages to remain on your Braille display. You
can choose a value between zero and 30,000 milliseconds. 1,000
milliseconds are equivalent to 1 second. Select Manually Clear
Only, if you want OpenBook to keep the message on the display until
you press a cursor routing button. The default interval is 5000
milliseconds.
@@
@msgSsh_Obutil_flashmessages_enable_chkbox
Select this check box if you want OpenBook to announce information
by using Braille Flash Messages. Clear this check box to disable
Braille Flash Messages. This check box is selected by default.
@@
@msgSsh_Obutil_message_prefix_chkbox
If you select this check box and your Braille display does not have any status cells, OpenBook displays a special prefix before Braille Flash Messages to distinguish
them from screen text. This prefix is a three-letter abbreviation that indicates the source of the message. This check box is selected by default. If your
Braille display has status cells, OpenBook uses those to indicate that the text is a Braille Flash Message regardless of whether you select this check box.
Clear this check box if you do not want to use this feature.
@@
@msgSsh_Obutil_flashmessage_verbosity_rdbtns
Select one of the radio buttons in the Verbosity Level area to
determine how much information OpenBook displays using Braille Flash
Messages. Beginner level displays the most information, while
Advanced displays the least amount of information. You can
customize each verbosity level by using the Preferences buttons.
The default verbosity level is Beginner.
@@
;for %1 = the string segment value of MessageSegment, see top of this message file. It is to equate the name of the preferences being changed.
@msgSsh_Obutil_verbosity_preferences#btn
Choose this button to specify which items you want OpenBook to
display using Braille Flash Messages when the %1 verbosity
level is selected.
@@
@msgSsh_Obutil_items_to_check_lbx
In the Items to be Brailled list, select which items OpenBook displays using Braille Flash Messages. These items are based on Speech Output Types and include
application start messages, error messages, help balloons, JAWS messages, smart help messages, status information, tool tips, tutor messages, and user
requested information. This list also shows the text OpenBook uses to represent each item on your Braille display as a Flash Message prefix.
@@
@msgSsh_Obutil_flashmessage_length_rbtn_grp
In this area, you can choose between short or long message
length. For example, when you select text and press CTRL+C to
copy it to the Clipboard, OpenBook displays, "Copied," when using
short messages. If you have selected long messages, OpenBook
displays, "Copied selected text to clipboard."
@@
@msgSsh_Obutil_modify_brl_text_btn
This button allows you to change how OpenBook indicates the selected
item on your Braille display. For example, the Braille Flash
Message for a help balloon is "bln." To change the
representation for an item, select it in the list and then
choose Modify Braille Text. Type the new text that you want to
represent this item and then choose OK.
@@
@msgSsh_Obutil_dotpatterns_listbox
This list box lists the attributes for which dot patterns can be
modified. Once the desired attribute is selected, TAB to move to
the other controls in this dialog to specify the dot patterns to
use to indicate the selected item.
@@
@msgSsh_Obutil_dotPattern_edit
Use this edit box to specify the dot pattern for the item
currently selected in the Pattern Type list box. Each digit in
this edit box represents a dot on a refreshable Braille display.
You may use any combination of dots 1 through 8. Type each dot
with no spaces or dashes between them.
@@
@msgSsh_Obutil_cursorTypes_listbox
This list box lists the cursors for which settings can be
modified. Once the desired cursor is selected, press TAB to move
to the other controls in this dialog to specify the settings to
use for the selected item.
@@
@msgSsh_Obutil_cursor_dotPattern_edit
Use this edit box to specify the dot pattern for the item
currently selected in the Cursor Types list box. Each digit in
this edit box represents a dot on a refreshable Braille display.
The default setting for each cursor tipe is dots 78.
@@
@msgSsh_Obutil_Braille_Cursor_UpDownBlinking_rbtn_grp
Use this group of radio buttons to control how OpenBook displays the active cursor.
If you select the Blinking radio button, the dots indicating the cursor are raised and lowered at a set increment.
Otherwise, the dots always remain either up or down, depending on which option you select.
The Blinking radio button is selected by default.
@@
@msgSsh_Obutil_cursor_blink_rate_edit
This field contains the speed in milliseconds at which the cursor
on the Braille display should blink. To indicate a blinking
cursor, the dots raise and lower at regular intervals. Setting
this option to different blinking rates for each cursor can help
you determine which cursor is active. The default setting for
this option is 500.
@@
@msgSsh_Obutil_marking_options_highlight
When checked, a Braille display indicates highlighted text with
raised dots 7 and 8.  This setting is checked by default.
@@
@msgSsh_Obutil_marking_options_bold
When checked, a Braille display indicates bold text with raised
dots 7 and 8.  By default, this setting is not checked.
@@
@msgSsh_Obutil_marking_options_underline
When checked, a Braille display indicates unerlined text with raised
dots 7 and 8.  By default, this setting is not checked.
@@
@msgSsh_Obutil_marking_options_italic
When checked, a Braille display indicates italicized text with raised
dots 7 and 8.  By default, this setting is not checked.
@@
@msgSsh_Obutil_marking_options_strikeout
When checked, a Braille display indicates struck out text with raised
dots 7 and 8.  By default, this setting is not checked.
@@
@msgSsh_Obutil_TREEVIEW
Lists all of the braille displays currently installed in OpenBook and which one is set as the default. Use the arrow keys to select a display and TAB to Device Properties to view additional information.
@@
@msgSsh_Obutil_PROPERTIES
Displays the device properties for the currently selected display. Use the arrow keys to read the text.
@@
@msgSsh_Obutil_PortEdcbo
Use the arrow keys to select the port your braille display is connected to on your PC, such as USB. The types of ports listed depend on what display you are adding.
@@
@msgSsh_Obutil_LISTVIEW
Lists all of the braille displays supported by OpenBook. Use the arrow keys to locate the braille display you want and press the SPACEBAR to check or uncheck it. When checked, the display will be added and when unchecked, it will be removed. You can add or remove as many displays as you want.
@@
@msgSsh_Obutil_Description
Provides a brief description of the selected braille display. Use the arrow keys to read the text.
@@
@msgSsh_Obutil_ManageDevices
Select this button to add, remove, or change settings for a braille display.
@@
@msgSsh_Obutil_BackBtn
Go to the previous screen.
@@
@msgSsh_Obutil_NextBtn
Go to the next screen.
@@
@msgSsh_Obutil_PrimaryDevice
Use the arrow keys to select the braille display you want to be the default display.
@@
@msgSsh_Obutil_enable_translator_chkbox
If this check box is checked, contracted braille is displayed on your braille display. If you select this check box, it is recommended that you do not choose Fixed Increment user panning because OpenBook may split the braille contractions on either edge of the display.
Choose either Automatic or Best Fit user panning to keep OpenBook from splitting Braille contractions.

This check box is unchecked by default.
@@
@msgSsh_Obutil_contracted_english_braille_rdb
OpenBook has the ability to do braille contractions and braille translation in either Contracted English Braille or Unified English Braille (UEB).
Select this radio button to configure OpenBook for Contracted English Braille.

Contracted English Braille is the default selection.
@@
@msgSsh_Obutil_unified_english_braille_rdb
OpenBook has the ability to do braille contractions and braille translation in either Contracted English Braille or Unified English Braille (UEB).
Select this radio button to configure OpenBook for UEB.

Contracted English Braille is the default selection.
@@
@msgSsh_Obutil_braille_presentation_and_panning_combobox
@@


;UNUSED_VARIABLES

@msgSsh_Obutil_brl_dot_patterns_btn
This button opens a dialog with controls for you to specify which
dots indicate attributes. These attribute settings apply only in
attribute mode.
@@
@msgSsh_Obutil_FinishBtn
Select this button to save changes when adding, removing, or modifying settings for a braille display.
@@

;END_OF_UNUSED_VARIABLES

EndMessages
