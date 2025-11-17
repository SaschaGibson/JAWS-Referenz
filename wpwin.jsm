; JAWS 7.10 Message File for Wordperfect object model.
; Copyright (C) 1999-2021 by Freedom Scientific BLV Group, LLC.
; Special thanks for reference information from Marco Zehe OmniPc Germany and original constants from Joe Stephen.

const
; Window names
wnWP3 = "Thesaurus",

;keystrokes
sc_1 = "bold",
sc_2 = ",",
scRow = "Row",
scColumn = "Column",
; next two constants used for phonetic spelling due to chars being obtained from
;Object Model and not OSM
alphabet="abcdefghijklmnopqrstuvwxyz",
phoneticDefinitions="Alpha,Bravo,Charlie,Delta,Echo,Foxtrot,Golf,Hotel,India,Juliet,Kilo,Leama,Mike,November,Oscar,Papa,Quebec,Romeo,Sierra,Tango,Uniform,Victor,Whisky,XRay,Yanky,Zulu",
; strings used in Window Name and string contains
wnWP5="Font Properties",
; Eloquence Language strings
eloqAmericanEnglish="American English",
eloqBritishEnglish="British English",
eloqFrench="French",
eloqGerman="German",
eloqItalian="Italian",
eloqCastilianSpanish="Castilian Spanish",
eloqLatinAmericanSpanish="Latin American Spanish",
; String that is included in paragraphs when certain formatting attributes are used
scBogusChars = "€€€",
; used to compare against first table cell, usually A1
scFirstTableCellCoordinates = "A1",



;UNUSED_VARIABLES

wnWP19="Paragraph Border/Fill"

;END_OF_UNUSED_VARIABLES

messages
; messages for Tables and cells
@WPMsgCellFill_L
Cell Fill %1
@@
@WPMsgCellFill_S
Fill %1
@@
@WpMsgFillButton_L
Button
@@
@WpMSGFillFive_L
5
@@
@WPMsgNoFill_L
None
@@
@WPMsgTextIsSkewed_L
%1 text is Skewed
@@
@WPMsgTextNotSkewed_L
%1 text is normal
@@
@WPMsgTableIsSquaredRow_L
first row is square
@@
@WPMsgTableIsNotSquaredRow_L
first row is not square
@@
@WPMsgSkewedJoinedCorners_l
Skewed Table has Joined corners
@@
@WPMsgNoSkewedJoinedCorners_L
Skewed Table has no Joined corners
@@
@wpMsgSkewedInformation_L
column skewed text angle is %1
Row skewed text angle is %1
%3
%4
%5
%6
@@
; messages for the default table styles.
@WPMsgTableStyle_L
Table Style %1
@@
@WPMsgCellStyle_L
Cell Style %1
@@
@WPMsgTableStyle1_L
None
@@
@WPMsgTableStyle2_L
No Lines No Border
@@
@WPMsgTableStyle3_L
No Lines Columns
@@
@WPMsgTableStyle4_L
No Lines Header
@@
@WPMsgTableStyle5_L
No Lines Totals
@@
@WPMsgTableStyle6_L
No Lines Separator
@@
@WPMsgTableStyle7_L
Single Lines
@@
@WPMsgTableStyle8_L
Single Double Border
@@
@WPMsgTableStyle9_L
Single Bold Title
@@
@WPMsgTableStyle10_L
Single No Border
@@
@WPMsgTableStyle11_L
Single Underline
@@
@WPMsgTableStyle12_L
Single Open
@@
@WPMsgTableStyle13_L
Double Border Header
@@
@WPMsgTableStyle14_L
Double Border Bold
@@
@WPMsgTableStyle15_L
Double Border Title
@@
@WPMsgTableStyle16_L
Double Border Mixed
@@
@WPMsgTableStyle17_L
Double Border Totals
@@
@WPMsgTableStyle18_L
Header Fill Single
@@
@WPMsgTableStyle19_L
Header Fill Title
@@
@WPMsgTableStyle20_L
Header Fill Double
@@
@WPMsgTableStyle21_L
Header Fill Column
@@
@WPMsgTableStyle22_L
Column Fill Single
@@
@WPMsgTableStyle23_L
Column Fill Header
@@
@WPMsgTableStyle24_L
Column Fill Totals
@@
@WPMsgTableStyle25_L
Column Fill Title
@@
@WPMsgTableStyle26_L
Column Fill Color
@@
@WPMsgTableStyle27_L
Row Fill Single
@@
@WPMsgTableStyle28_L
Row Fill Columns
@@
@WPMsgTableStyle29_L
Row Fill Headers
@@
@WPMsgTableStyle30_L
Ledger Header
@@
@WPMsgTableStyle31_L
Ledger Title
@@
@WPMsgTableStyle32_L
Ledger Open
@@
@WPMsgTableStyle33_L
Fancy Justify
@@
@WPMsgTableStyle34_L
Fancy Labels
@@
@WPMsgTableStyle35_L
Fancy Fills
@@
@WPMsgTableStyle36_L
Fancy Totals
@@
@WPMsgTableStyle37_L
Fancy Shadows
@@
@WPMsgTableStyle38_L
Fancy Open
@@
@WPMsgTableStyle39_L
Fancy Headers
@@
@WPMsgTableStyle40_L
Fancy Buttons
@@
@WPMsgTableStyle41_L
Skewed Top Left
@@
@WPMsgTableStyle42_L
Skewed Left Up
@@
@msgRowHasHeader
Row Header
@@
@WPMsgTableNoStyle_L
None
@@
@WPMsgTableSize_L
has %1 columns by %2 Rows
@@
@msgOutOfTable1_L
out of table
@@
@msgNotInATable1_L
The cursor is not within a table.
@@
@msgTableLastCell1_L
Last cell in table
@@
@msgTableLastCell1_S
Last cell
@@
@MsgWarningCreateCells1_L
Warning! Pressing tab here will add an extra row to this table.
@@
@msgWarningCreateCells1_S
Pressing tab here will add an extra row
@@
;for msgCellWidth1_L, %1=width in points of table cell
@msgCellWidth1_L
cell width: %1
@@
@msgCellLocked1_L
cell locked.
@@
@msgCellLocked1_S
locked.
@@
;for msgCellAlignment1_L/S, %1=cell's vertical alignment description
@msgCellAlignment1_L
cell vertical alignment is %1
@@
@msgCellAlignment1_S
vertical alignment %1
@@
@msgHasFormula1_L
cell has formula.
@@
@msgHasFormula1_S
has formula.
@@
@msgIgnored1_L
cell ignored when calculating.
@@
@msgIgnored1_S
ignored when calculating.
@@
;for msgCellJustification1_L/S, %1=cell justification description
@msgCellJustification1_L
cell justification is %1
@@
@msgCellJustification1_S
justification %1
@@
@msgCellTop1_L
 top
@@
@msgCellBottom1_L
 bottom
@@
@msgCellCenter1_L
 center
@@
;for msgTextColumn1_L, %1=newspaper column number
@msgTextColumn1_L
text column %1
@@
;for msgTextColumn2_L, %1=newspaper type, %2 Current column number and
; %3=number of columns
@msgTextColumn2_L
%1 columns %2 of %3
@@
@MsgLeavingTextColumns_L
Leaving  %1 columns
@@
@msgSpace1_L
space
@@
;for msgWPUToP1, %1=whole part of number, %2=decimal part of number
;This is used in WPUnitsToPoints function in wpwin.hss
@msgWPUToP1
%1.%2 points
@@
;for msgWPUToP2, %1=whole part of number
;This is used in WPUnitsToPoints function in wpwin.hss
@msgWPUToP2
%1 points
@@
;for msgPage1_L, %1=page number
@msgPage1_L
page %1
@@
@msgJustificationLeft1_L
Left justified
@@
@msgJustificationCenter1_L
Centered
@@
@msgJustificationRight1_L
Right justified
@@
@msgJustificationFull1_L
fully justified
@@
;for msgParagraphOutlineLevel1_L/S, %1=paragraph outline level
@msgParagraphOutlineLevel1_L
Paragraph outline level: %1
@@
@msgParagraphOutlineLevel1_S
outline level: %1
@@
;for msgStyle1_L, %1=style name
@msgStyle1_L
style: %1
@@
@msgBorderedParagraph1_L
bordered paragraph
@@
@msgOutOfBorderedParagraph1_L
out of bordered paragraph
@@
@msgBorderedPage1_L
bordered page
@@
@msgOutOfBorderedPage1_L
out of bordered page
@@
@msgBorderedColumn_L
bordered Column
@@
@msgOutOfBorderedColumn_L
out of bordered Column
@@
; describe border messages
@WPMsgBorderSpacingOnly_L
Spacing only
@@
@WPMsgBorderSingle_L
Single
@@
@WPMsgBorderDouble_L
Double
@@
@WPMsgBorderDashed_L
Dashed
@@
@WPMsgBorderDotted_L
Dotted
@@
@WPMsgBorderHeavy_L
Heavy
@@
@WPMsgBorderHeavyDouble_L
Heavy Double
@@
@WPMsgBorderThick_L
Thic
@@
@WPMsgBorderExtraThick_L
Extra Think
@@
@WPMsgBorderThinThick_L
Thin Thick
@@
@WPMsgBorderThickThin_L
Thick Thin
@@
@WPMsgBorderThickTopBottom_L
Thick Top Bottom
@@
@WPMsgBorderButton_L
Button
@@
@WPMsgBorderButtonTopLeftLine_L
Button Top Left
@@
@WPMsgBorderButtonBottomRightLine_L
Button Bottom Right
@@
@WPMsgBorderColumnBorderBetween_L
Column Border Between
@@
@WPMsgBorderColumnBorderAll_L
Column Border All
@@
@WPMsgBorderTableDefaultLine
Default Table
@@
@WPMsgBorderNone_L
None
@@
; font descriptions:
; used for reporting of Font
;for msgFontIs1_L/S, %1=font name, %2=font size in points
@msgFontIs1_L
font is %1 %2
@@
@msgFontIs1_S
font %1 %2
@@
@msgBold1_L
bold
@@
@msgItalic1_L
italic
@@
;for msgUnderline1_L, %1=underline style description
@msgUnderline1_L
%1 underline
@@
@msgDoubleUnderline1_L
double underline
@@
; Underline Styles:
@msgUnderline2_L
Solid
@@
@msgUnderline3_L
Dotted
@@
@msgUnderline4_L
Dashed
@@
@msgUnderline5_L
DashDot
@@
@msgUnderline6_L
DashDotDot
@@
@msgUnderline7_L
Wavy
@@
@msgUnderline8_L
Thick
@@
@msgFine1_L
fine
@@
@msgSmall1_L
small
@@
@msgSmallCaps1_L
small caps
@@
@msgLarge1_L
large
@@
@msgVeryLarge1_L
very large
@@
@msgExtraLarge1_L
extra large
@@
@msgOutline1_L
outline
@@
@msgRedline1_L
red line
@@
@msgShaddow1_L
shaddow
@@
@msgStrikeOut1_L
strikeout
@@
@msgSubscript1_L
subscript
@@
@msgSuperscript1_L
superscript
@@
@msgNone1_L
none
@@
; WordPerfect Reveal Code descriptions:
@WPRCMsg1_L
[HSpace]
@@
@WPRCMsg2_L
[-Soft Hyphen]
@@
@WPRCMsg3_L
[-Hyphen]
@@
@WPRCMsg4_L
[Hyph SRt]
@@
@WPRCMsg5_L
[Dorm HRt]
@@
@WPRCMsg6_L
[End Cntr/Align]
@@
@WPRCMsg7_L
[Cancel Hyph]
@@
@WPRCMsg8_L
[THrt-SPg]
@@
@WPRCMsg9_L
[THrt-SCol]
@@
@WPRCMsg10_L
[THrt]
@@
@WPRCMsg11_L
[TSRt-SPg]
@@
@WPRCMsg12_L
[TSrt-SCol]
@@
@WPRCMsg13_L
[TSRt]
@@
@WPRCMsg14_L
[Tbl Off-SPg]
@@
@WPRCMsg15_L
[Tbl Off]
@@
@WPRCMsg16_L
[HRow-HPg]
@@
@WPRCMsg17_L
[Row-SPg]
@@
@WPRCMsg18_L
[Row-SCol]
@@
@WPRCMsg19_L
[Row]
@@
@WPRCMsg20_L
[Cell]
@@
@WPRCMsg21_L
[HPg]
@@
@WPRCMsg22_L
[HCol-SPg]
@@
@WPRCMsg23_L
[HCol]
@@
@WPRCMsg24_L
[HRt-SPg]
@@
@WPRCMsg25_L
[HRt-SCol]
@@
@WPRCMsg26_L
[HRt]
@@
@WPRCMsg27_L
[SRt-SPg]
@@
@WPRCMsg28_L
[SRt-SCol]
@@
@WPRCMsg29_L
[SRt]
@@
@WPRCMsg30_L
[Top Mar]
@@
@WPRCMsg31_L
[Lft Mar]
@@
@WPRCMsg32_L
[Ln Height]
@@
@WPRCMsg33_L
[Dec/Align Char]
@@
@WPRCMsg34_L
[Ref Count]
@@
@WPRCMsg35_L
[Header A]
@@
@WPRCMsg36_L
[Footnote]
@@
@WPRCMsg37_L
[Count Set]
@@
@WPRCMsg38_L
[Count Meth]
@@
@WPRCMsg39_L
[Count Disp]
@@
@WPRCMsg40_L
[Count Inc]
@@
@WPRCMsg41_L
[Count Dec]
@@
@WPRCMsg42_L
[Char Style]
@@
@WPRCMsg43_L
[MRG: BEEP]
@@
@WPRCMsg44_L
[Box]
@@

@WPRCMsg45_L
[Hd Back Tab]
@@
@WPRCMsg46_L
[Ext Large On]
@@
@WPRCMsg47_L
[Ext Large Off]
@@
@WPRCMsg48_L
[Bot Mar]
@@
@WPRCMsg49_L
[Rgt Mar]
@@
@WPRCMsg50_L
[Ln Spacing]
@@
@WPRCMsg51_L
[Thousands Sep]
@@
@WPRCMsg52_L
[Header B]
@@
@WPRCMsg53_L
[Count Disp] (left)
@@
@WPRCMsg54_L
[MRG: BREAK]
@@
@WPRCMsg55_L
[Box] (custom)
@@
@WPRCMsg56_L
[Very Large On]
@@
@WPRCMsg57_L
[Very Large Off]
@@
@WPRCMsg58_L
[Suppress]
@@
@WPRCMsg59_L
[Col Def: Off]
@@
@WPRCMsg60_L
[Lft HZone]
@@
@WPRCMsg61_L
[Undrln Space]
@@
@WPRCMsg62_L
[Ref Box]
@@
@WPRCMsg63_L
[Footer A]
@@
@WPRCMsg64_L
[Endnote]
@@
@WPRCMsg65_L
[Pg Num Set]
@@
@WPRCMsg66_L
[Pg Num Inc]
@@
@WPRCMsg67_L
[Pg Num Dec]
@@
@WPRCMsg68_L
[MRG: CANCELOFF]
@@
@WPRCMsg69_L
[Large On]
@@
@WPRCMsg70_L
[Large Off]
@@
@WPRCMsg71_L
[Pg Num Pos]
@@
@WPRCMsg72_L
[Col Border]
@@
@WPRCMsg73_L
[Rgt HZone]
@@
@WPRCMsg74_L
[Undrln Tab]
@@
@WPRCMsg75_L
[Footer B]
@@
@WPRCMsg76_L
[Sec Pg Num Set]
@@
@WPRCMsg77_L
[Sec Pg Num Meth]
@@
@WPRCMsg78_L
[Sec Pg Num Inc]
@@
@WPRCMsg79_L
[Sec Pg Num Dec]
@@
@WPRCMsg80_L
[MRG: CANCELON]
@@
@WPRCMsg81_L
[Graph Line]
@@
@WPRCMsg82_L
[Small On]
@@
@WPRCMsg83_L
[Small Off]
@@
@WPRCMsg84_L
[Back Tab]
@@
@WPRCMsg85_L
[Cntr Cur Page]
@@
@WPRCMsg86_L
[Tabin Set]
@@
@WPRCMsg87_L
[HAdv]
@@
@WPRCMsg88_L
[Ref Pg]
@@
@WPRCMsg89_L
[Watermark A]
@@
@WPRCMsg90_L
[Chap Num Set]
@@
@WPRCMsg91_L
[Chap Num Meth]
@@
@WPRCMsg92_L
[Pg Num Disp]
@@
@WPRCMsg93_L
[Chap Num Inc]
@@
@WPRCMsg94_L
[Chap Num Dec]
@@
@WPRCMsg95_L
[Paragraph Style On]
@@
@WPRCMsg96_L
[MRG: CONTINUE]
@@
@WPRCMsg97_L
[Fine On]
@@
@WPRCMsg98_L
[Fine Off]
@@
@WPRCMsg99_L
[Cntr Pgs]
@@
@WPRCMsg100_L
[Just]
@@
@WPRCMsg101_L
[VAdv]
@@
@WPRCMsg102_L
[Watermark B]
@@
@WPRCMsg103_L
[Vol Num Set]
@@
@WPRCMsg104_L
[Vol Num Meth]
@@
@WPRCMsg105_L
[Vol Num Inc]
@@
@WPRCMsg106_L
[Vol Num Dec]
@@
@WPRCMsg107_L
[MRG: DATE]
@@
@WPRCMsg108_L
[Suprscpt On]
@@
@WPRCMsg109_L
[Suprscpt Off]
@@
@WPRCMsg110_L
[Wid/Orph]
@@
@WPRCMsg111_L
[Hyph On]
@@
@WPRCMsg112_L
[Index]
@@
@WPRCMsg113_L
[Ref Sec Pg]
@@
@WPRCMsg114_L
[Sec Pg Num Disp]
@@
@WPRCMsg115_L
[Style]
@@
; note left is 2013
; note left is 2013
@WPRCMsg116_L
[MRG: DEFAULT]
@@
@WPRCMsg117_L
[Subscpt On]
@@
@WPRCMsg118_L
[Subscpt Off]
@@
@WPRCMsg119_L
[Footnote Space]
@@
@WPRCMsg120_L
[Leading Adj]
@@
@WPRCMsg121_L
[ToA]
@@
@WPRCMsg122_L
[Footnote Num Set]
@@
@WPRCMsg123_L
[Footnote Num Meth]
@@
@WPRCMsg124_L
[Footnote Num Inc]
@@
@WPRCMsg125_L
[Footnote Num Dec]
@@
@WPRCMsg126_L
[MRG: DISPLAYSTOP]
@@
@WPRCMsg127_L
[Outline On]
@@
@WPRCMsg128_L
[Outline Off]
@@
@WPRCMsg129_L
[Endnote Space]
@@
@WPRCMsg130_L
[Gen Txt On]
@@
@WPRCMsg131_L
[Target]
@@
@WPRCMsg132_L
[Ref Chap]
@@
@WPRCMsg133_L
[Endnote Num Set]
@@
@WPRCMsg134_L
[Endnote Num Meth]
@@
@WPRCMsg135_L
[Chap Num Disp]
@@
@WPRCMsg136_L
[Endnote Num Inc]
@@
@WPRCMsg137_L
[Endnote Num Dec]
@@
@WPRCMsg138_L
[Paragraph Style Off]
@@
@WPRCMsg139_L
[MRG: ELSE]
@@
@WPRCMsg140_L
[Italic On]
@@
@WPRCMsg141_L
[Italic Off]
@@
@WPRCMsg142_L
[Footnote Min]
@@
@WPRCMsg143_L
[Gen Txt Off]
@@
@WPRCMsg144_L
[Subdoc]
@@
@WPRCMsg145_L
[Ln Num Set]
@@
@WPRCMsg146_L
[Ln Num Meth]
@@
@WPRCMsg147_L
[MRG: ENDSWITCH]
@@
@WPRCMsg148_L
[Shadw On]
@@
@WPRCMsg149_L
[Shadw Off]
@@
@WPRCMsg150_L
[Endnote Min]
@@
@WPRCMsg151_L
[Para Spacing]
@@
@WPRCMsg152_L
[Mrk Txt TOC On]
@@
@WPRCMsg153_L
[Ref Vol]
@@
@WPRCMsg154_L
[Vol Num Disp]
@@
@WPRCMsg155_L
[Open Style: Open]
@@
@WPRCMsg156_L
[MRG: ENDFIELD]
@@
@WPRCMsg157_L
[Redln On]
@@
@WPRCMsg158_L
[Redln Off]
@@
@WPRCMsg159_L
[Footnote Num Each Pg]
@@
@WPRCMsg160_L
[First Ln Ind]
@@
@WPRCMsg161_L
[Mrk Txt TOC Off]
@@
@WPRCMsg162_L
[Open Style: Close]
@@
@WPRCMsg163_L
[MRG: ENDFOR]
@@
@WPRCMsg164_L
[Dbl Und On]
@@
@WPRCMsg165_L
[Dbl Und Off]
@@
@WPRCMsg166_L
[Footnote Cont Msg]
@@
@WPRCMsg167_L
[Lft Mar Adj]
@@
@WPRCMsg168_L
[Ref Para]
@@
@WPRCMsg169_L
[MRG: ENDIF]
@@
@WPRCMsg170_L
[Bold On]
@@
@WPRCMsg171_L
[Bold Off]
@@
@WPRCMsg172_L
[Footnote Txt Pos]
@@
@WPRCMsg173_L
[Rgt Mar Adj]
@@
@WPRCMsg174_L
[MRG: ENDRECORD]
@@
@WPRCMsg175_L
[StkOut On]
@@
@WPRCMsg176_L
[StkOut Off]
@@
@WPRCMsg177_L
[Footnote Sep Ln]
@@
@WPRCMsg178_L
[Subdoc Begin]
@@
@WPRCMsg179_L
[Ref Footnote]
@@
@WPRCMsg180_L
[Footnote Num Disp]
@@
@WPRCMsg181_L
[MRG: ENDWHILE]
@@
@WPRCMsg182_L
[Und On]
@@
@WPRCMsg183_L
[Und Off]
@@
@WPRCMsg184_L
[Binding Width]
@@
@WPRCMsg185_L
[Para Border]
@@
@WPRCMsg186_L
[Subdoc End]
@@
@WPRCMsg187_L
[MRG: NEXT]
@@
@WPRCMsg188_L
[Sm Cap On]
@@
@WPRCMsg189_L
[Sm Cap Off]
@@
@WPRCMsg190_L
[Pg Border]
@@
@WPRCMsg191_L
[Hidden Txt]
@@
@WPRCMsg192_L
[Ref Endnote]
@@
@WPRCMsg193_L
[Endnote Num Disp]
@@
@WPRCMsg194_L
[MRG: NEXTRECORD]
@@
@WPRCMsg195_L
[Hd Left Tab]
@@
@WPRCMsg196_L
[Paper Sz/Typ]
@@
@WPRCMsg197_L
[MRG: PAGEOFF]
@@
@WPRCMsg198_L
[Left Tab]
@@
@WPRCMsg199_L
[Labels Form]
@@
@WPRCMsg200_L
[Ln Num]
@@
@WPRCMsg201_L
[MRG: PAGEON]
@@
@WPRCMsg202_L
[...Hd Left Tab]
@@
@WPRCMsg203_L
[Dbl-sided Printing]
@@
@WPRCMsg204_L
[Force]
@@
@WPRCMsg205_L
[...Left Tab]
@@
@WPRCMsg206_L
[Subdivided Pg]
@@
@WPRCMsg207_L
[Endnote Placement]
@@
@WPRCMsg208_L
[MRG: QUIT]
@@
@WPRCMsg209_L
[Delay]
@@
@WPRCMsg210_L
[Ptr Cmnd]
@@
@WPRCMsg211_L
[Delay Codes]
@@
@WPRCMsg212_L
[Def Mark]
@@
@WPRCMsg213_L
[Kern]
@@
@WPRCMsg214_L
[MRG: RETURN]
@@
@WPRCMsg215_L
[MRG: RETURNCANCEL]
@@
@WPRCMsg216_L
[Pg Num Fmt]
@@
@WPRCMsg217_L
[Color]
@@
@WPRCMsg218_L
[MRG: RETURNERROR]
@@
@WPRCMsg219_L
[Char Shade change]
@@
@WPRCMsg220_L
[MRG: REWRITE]
@@
@WPRCMsg221_L
[Font] %1
@@
@WPRCMsg222_L
[MRG: STEPOFF]
@@
@WPRCMsg223_L
[Footer Sep]
@@
@WPRCMsg224_L
[Font Size] %1
@@
@WPRCMsg225_L
[MRG: STEPON]
@@
@WPRCMsg226_L
[Lang]
@@
@WPRCMsg227_L
[MRG: STOP]
@@
@WPRCMsg228_L
[Comment]
@@
@WPRCMsg229_L
[MRG: PROCESSOFF]
@@
@WPRCMsg230_L
[Dot Lead Char]
@@
@WPRCMsg231_L
[Cond EOP]
@@
@WPRCMsg232_L
[Date]
@@
@WPRCMsg233_L
[Date Fmt]
@@
@WPRCMsg234_L
[Wrd/Ltr Spacing]
@@
@WPRCMsg235_L
[Just Lim]
@@
@WPRCMsg236_L
[Bookmark]
@@
@WPRCMsg237_L
[Block Pro On]
@@
@WPRCMsg238_L
[Block Pro Off]
@@
@WPRCMsg239_L
[Pause Ptr]
@@
@WPRCMsg240_L
[OvrStrk]
@@
@WPRCMsg241_L
[Tbl Def]
@@
@WPRCMsg242_L
[Filename]
@@
@WPRCMsg243_L
[Bar Code]
@@
@WPRCMsg244_L
[MRG: ASSIGN]
@@
@WPRCMsg245_L
[Hd Left Ind]
@@
@WPRCMsg246_L
[Sound]
@@
@WPRCMsg247_L
[MRG: assign]
@@
@WPRCMsg248_L
[MRG: CALL]
@@
@WPRCMsg249_L
[Mrg: call]
@@
@WPRCMsg250_L
[Hypertext On]
@@
@WPRCMsg251_L
[MRG: CAPS]
@@
@WPRCMsg252_L
[Mrg: caps]
@@
@WPRCMsg253_L
[Hypertext Off]
@@
@WPRCMsg254_L
[MRG: SWITCH]
@@
@WPRCMsg255_L
[Mrg: switch]
@@
@WPRCMsg256_L
[MRG: CASEOF]
@@
@WPRCMsg257_L
[Hd Left/Right Ind]
@@
@WPRCMsg258_L
[Mrg: caseof]
@@
@WPRCMsg259_L
[Link Begin]
@@
@WPRCMsg260_L
[MRG: CHAINMACRO]
@@
@WPRCMsg261_L
[Link End]
@@
@WPRCMsg262_L
[Mrg: chainmacro]
@@
@WPRCMsg263_L
[Macro Func]
@@
@WPRCMsg264_L
[MRG: CHAINFORM]
@@
@WPRCMsg265_L
[Mrg: chainform]
@@
@WPRCMsg266_L
[Formatted Pg Num]
@@
@WPRCMsg267_L
[MRG: CHAR]
@@
@WPRCMsg268_L
[...Hd Center on Mar]
@@
@WPRCMsg269_L
[Hd Center On Mar]
@@
@WPRCMsg270_L
[Mrg: char]
@@
@WPRCMsg271_L
[Hidden On]
@@
@WPRCMsg272_L
[MRG: CODES]
@@
@WPRCMsg273_L
[Hidden Off]
@@
@WPRCMsg274_L
[Mrg: codes]
@@
@WPRCMsg275_L
[Flt Cell On]
@@
@WPRCMsg276_L
[MRG: COMMENT]
@@
@WPRCMsg277_L
[Flt Cell Off]
@@
@WPRCMsg278_L
[Mrg: comment]
@@
@WPRCMsg279_L
[MRG: CTON]
@@
@WPRCMsg280_L
[Mrg: cton]
@@
@WPRCMsg281_L
[MRG: DOCUMENT]
@@
@WPRCMsg282_L
[Hd Cnter on Pos]
@@
@WPRCMsg283_L
[Mrg: document]
@@
@WPRCMsg284_L
[MRG: EMBEDMACRO]
@@
@WPRCMsg285_L
[Mrg: embedmacro]
@@
@WPRCMsg286_L
[MRG: FIELD]
@@
@WPRCMsg287_L
[Mrg: field]
@@
@WPRCMsg288_L
[MRG: FIELDNAMES]
@@
@WPRCMsg289_L
[Mrg: fieldnames]
@@
@WPRCMsg290_L
[MRG: FIRSTCAP]
@@
@WPRCMsg291_L
[Hd Center Tab]
@@
@WPRCMsg292_L
[Mrg: firstcap]
@@
@WPRCMsg293_L
[Center Tab]
@@
@WPRCMsg294_L
[MRG: FORNEXT]
@@
@WPRCMsg295_L
[...Hd Center Tab]
@@
@WPRCMsg296_L
[Mrg: fornext]
@@
@WPRCMsg297_L
[...Center Tab]
@@
@WPRCMsg298_L
[MRG: FOREACH]
@@
@WPRCMsg299_L
[Mrg: foreach]
@@
@WPRCMsg300_L
[MRG: GETSTRING]
@@
@WPRCMsg301_L
[Mrg: getstring]
@@
@WPRCMsg302_L
[MRG: GO]
@@
@WPRCMsg303_L
[Mrg: go]
@@
@WPRCMsg304_L
[MRG: IF]
@@
@WPRCMsg305_L
[Mrg: if]
@@
@WPRCMsg306_L
[MRG: IFBLANK]
@@
@WPRCMsg307_L
[Mrg: ifblank]
@@
@WPRCMsg308_L
[MRG: IFEXISTS]
@@
@WPRCMsg309_L
[Mrg: ifexists]
@@
@WPRCMsg310_L
[MRG: IFNOTBLANK]
@@
@WPRCMsg311_L
[Mrg: ifnotblank]
@@
@WPRCMsg312_L
[MRG: INSERT]
@@
@WPRCMsg313_L
[Mrg: insert]
@@
@WPRCMsg314_L
[MRG: KEYBOARD]
@@
@WPRCMsg315_L
[Mrg: keyboard]
@@
@WPRCMsg316_L
[MRG: LABEL]
@@
@WPRCMsg317_L
[Mrg: label]
@@
@WPRCMsg318_L
[MRG: ASSIGNLOCAL]
@@
@WPRCMsg319_L
[Mrg: assignlocal]
@@
@WPRCMsg320_L
[MGR: LOOK]
@@
@WPRCMsg321_L
[Mrg: look]
@@
@WPRCMsg322_L
[MRG: MRGCMND]
@@
@WPRCMsg323_L
[Mrg: mrgcmnd]
@@
@WPRCMsg324_L
[MRG: NESTDATA]
@@
@WPRCMsg325_L
[Mrg: nestdata]
@@
@WPRCMsg326_L
[MRG: NESTFORM]
@@
@WPRCMsg327_L
[Mrg: nestform]
@@
@WPRCMsg328_L
[MRG: NESTMACRO]
@@
@WPRCMsg329_L
[Mrg: nestmacro]
@@
@WPRCMsg330_L
[MRG: NTOC]
@@
@WPRCMsg331_L
[Mrg: ntoc]
@@
@WPRCMsg332_L
[MRG: ONCANCEL]
@@
@WPRCMsg333_L
[Mrg: oncancel]
@@
@WPRCMsg334_L
[MRG: ONERROR]
@@
@WPRCMsg335_L
[Mrg: onerror]
@@
@WPRCMsg336_L
[MRG: PROMPT]
@@
@WPRCMsg337_L
[Mrg: prompt]
@@
@WPRCMsg338_L
[MRG: STATUSPROMPT]
@@
@WPRCMsg339_L
[Mrg: statusprompt]
@@
@WPRCMsg340_L
[MRG: STRLEN]
@@
@WPRCMsg341_L
[Mrg: strlen]
@@
@WPRCMsg342_L
[MRG: STRPOS]
@@
@WPRCMsg343_L
[Hd Flush Right]
@@
@WPRCMsg344_L
[Mrg: strpos]
@@
@WPRCMsg345_L
[MRG: SUBSDATA]
@@
@WPRCMsg346_L
[...Hd Flush Right]
@@
@WPRCMsg347_L
[Mrg: subsdata]
@@
@WPRCMsg348_L
[MRG: SUBSFORM]
@@
@WPRCMsg349_L
[Mrg: subsform]
@@
@WPRCMsg350_L
[MRG: SUBSTR]
@@
@WPRCMsg351_L
[Mrg: substr]
@@
@WPRCMsg352_L
[MRG: SYSTEM]
@@
@WPRCMsg353_L
[Mrg: system]
@@
@WPRCMsg354_L
[MRG: TOLOWER]
@@
@WPRCMsg355_L
[Mrg: tolower]
@@
@WPRCMsg356_L
[MRG: TOUPPER]
@@
@WPRCMsg357_L
[Mrg: toupper]
@@
@WPRCMsg358_L
[MRG: VARIABLE]
@@
@WPRCMsg359_L
[Mrg: variable]
@@
@WPRCMsg360_L
[MRG: WAIT]
@@
@WPRCMsg361_L
[Hd Right Tab]
@@
@WPRCMsg362_L
[Mrg: wait]
@@
@WPRCMsg363_L
[Right Tab]
@@
@WPRCMsg364_L
[MRG: WHILE]
@@
@WPRCMsg365_L
[...Hd Right Tab]
@@
@WPRCMsg366_L
[Mrg: while]
@@
@WPRCMsg367_L
[...Right Tab]
@@
@WPRCMsg368_L
[MRG: POSTNET]
@@
@WPRCMsg369_L
[Mrg: postnet]
@@
@WPRCMsg370_L
[Hd Dec Tab]
@@
@WPRCMsg371_L
[Dec Tab]
@@
@WPRCMsg372_L
[...Hd Dec Tab]
@@
@WPRCMsg373_L
[...Dec Tab]
@@


;UNUSED_VARIABLES

@WPMsgTableBorderStyle_L
Table Border Style %1
@@
@WPMsgTableBorderStyle_S
Border Style
@@
@wpMsgTableAlternateFillOff_L
Table Alternate Fill Off
@@
@wpMsgTableAlternateFillOff_S
Alternate Fill Off
@@
@wpMsgTableAlternateFillColumn_L
Table Alternate Fill Column
@@
@WpMsgTableAlternateFillColumn_S
Alternate Fill Column
@@
@WpMsgTableAlternateFillRow_L
Table Alternate Fill Row
@@
@wpMsgTableAlternateFillRow_S
Alternate Fill Row
@@
@msgUnknownBorderStyle1_L
Unknown border style
@@

;END_OF_UNUSED_VARIABLES

endMessages