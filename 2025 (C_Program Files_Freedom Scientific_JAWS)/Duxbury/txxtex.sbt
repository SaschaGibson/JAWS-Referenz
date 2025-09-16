| txxtex.sbt 3;6 txx->LaTeX converter
| 1;1 2007-9-13/2007-10-24 J E Sullivan prototype for demonstration
| 2;1 2011-05-13/jes: expand for real use in DBT
| 2;2 2012-05-25/26/jes: added a large number of direct symbol
|     conversions (see end);
|     introduce logic to start/stop math mode in the absence of [ts] ... [te];
|     discard artificial emphasis markers ({{...}}).
| 2;3 2012-09-24/jes: Change to more standard way of issuing text to be treated
|     as comments in LaTeX - i.e. use the % ... {eol} method (see msg to Caryn
|     today re the \comment{...} method now being discontinued;
|     implement [fsN], [flN], [flsN], [flNN] and [feN] as recognized commands to
|     the extent actually needed for Nemeth/British/French math export
| 2;4 2012-10-04/jes: Provide for balancing \) if math mode still open at end
|     (so LaTeX parse requirement is satisfied)
| 2;5 2014-01-04/jes: Add rules so that "bar over" simple items (digits &
|     Roman and Greek letters) are given "\overline{}" treatment (which is
|     generally preferable to "\bar{}" per Web article);
|     regularize encoding of bytes not "ASCII printable" (like clnbts)
| 2;6 2014-01-18/jes: Provide ways for forcing new line etc. in math mode in
|     response to DBT codes, and in general enhance format code options;
|     cease generating "comments" for style refs
| 2;6a 2014-01-27/cln: chg hard space from "medium" to "thick" for Scientific
|     Viewer (patch for initial DBT 11.2 release)
| 2;7 2014-02-27/jes: Support simple "dot over" cases, e.g. for recurring
|     decimals indicated that way (uses \dot{} function, supported by SN)
| 2;8 2018-05-04/dfh: Added support for many European accented letters
| 3;1 2020-11-15/16/16/jes: Accommodate special markings from new txxtxa.btb
|     preprocessing step (which generalizes the bar over [overline] and
|     dot over handling as well)
| 3;2 2020-12-01/jes: Use \sim i.s.o. \sptilde for tilde as it is apparently
|     more widely supported;
|     add additional supported over/under structures
| 3;3 2021-03-11/pjs: Use \circ i.s.o. \Circle as it is apparently more
|     widely supported
| 3;4 2021-04-23/cln: Add rules for math-separation and math-TextInMath styles
|     and state 6 for text within math
|     2021-05-07/10/jes: Treat math style start/end like ts/te (ex1000)
| 3;5 2023-10-29/11-02/pjs: Add U+215x vulgar fractions; update output
|     for other vulgar fractions
| 3;6 2024-04-04/cln: handle styles math-separation and OneWordBridge, states 7 and 8 respectively, along with 9 and 10 if started from state 3.
|  ---
| states (math/text mode same for both DBT and LaTeX except as noted):
|   1 in text (not math mode)
|   2 in math mode at first level only
|   3 in math mode at level >1 (stacking)
|   4 in command being treated as default in text mode
|   5 in command being treated as default in (DBT) math mode (any level) (but
|     LaTeX text mode for the command itself temporarily)
|   6 within \text{ ... }
|    7 - in math-separation style
|    8 - in OneWordBridge style but not in math-separation style
|    7 - in math-separation style started from state 3
|    8 - in OneWordBridge style but not in math-separation style and started from state 3
|  -1 in text being totally passed over (style refs) in text mode
|  -2 in text being totally passed over (style refs) in math mode
| fixed declaration at beginning
|256~\documentclass{article}|013|010\begin{document}|013|010~
| fixed declaration at end if not in math mode
|257~|013|010\end{document}|013|010~1~
| fixed declaration at end if still in math mode (state 2 or 3)
|257~\)|013|010\end{document}|013|010~2~
|257~\)|013|010\end{document}|013|010~3~
| fixed declaration at end if in state 4 or 5 (error - partial command at end)
|257~|013|010\end{document}|013|010~4~
|257~|013|010\end{document}|013|010~5~
| space/eol handling added 2020-11-15:
 ~ ~1~ | in text mode, just copy
 ~ ~7~ | in text mode, just copy
 ~ ~9~ | in text mode, just copy
 ~\, ~2~ | in math mode top level
 ~\, ~3~ | in math mode lower levels
|013|010~|013|010~1~ | in text mode, just copy
|013|010~\,|013|010~2~ | in math mode top level
|013|010~\,|013|010~3~ | in math mode lower levels
|010~|010~1~ | in text mode, just copy
|010~\,|010~2~ | in math mode top level
|010~\,|010~3~ | in math mode lower levels
| 2012-05-26/jes: pro tem, discard artificial emphasis markers:
{{]bold}}~~
{{bold-wd>}}~~
{{bold>}}~~
{{bold[}}~~
{{]bold}}~~
{{]sans}}~~
{{sans-wd>}}~~
{{sans>}}~~
{{sans[}}~~
{{]sans}}~~
{{]italic}}~~
{{italic-wd>}}~~
{{italic>}}~~
{{italic[}}~~
{{]italic}}~~
{{]uline}}~~
{{uline-wd>}}~~
{{uline>}}~~
{{uline[}}~~
{{]uline}}~~
| recognized command processing
|028tcs|031~~1~
|028tcs|031~~
|028tce|031~~1~
|028tce|031~~
|028es|~para.|031~\par ~1~
|028es|~para.|031~\par ~7~
|028es|~para.|031~\par ~9~
|028es|~para.|031~\)|013|010\par |013|010\(~ | math
|028ee|~para.|031~\par ~1~
|028ee|~para.|031~\par ~7~
|028ee|~para.|031~\par ~9~
|028ee|~para.|031~\)|013|010\par |013|010\(~ | math
|028es|~~~1~-1~(~ | text
|028es|~~~7~-1~(~ | text
|028es|~~\)~~-2~(~ | math
|028ee|~~~1~-1~(~ | text
|028ee|~~\)~~-2~(~ | math
|028>|031~\par ~1~ | tab to "paragraph" in text
|028>|031~\par ~7~ | tab to "paragraph" in text
|028>|031~\par ~9~ | tab to "paragraph" in text
|028>|031~\;\;\;~ | tab to several "thick" spaces in math
|028<|031~\par ~1~ | newline to "paragraph" in text
|028<|031~\par ~7~ | newline to "paragraph" in text
|028<|031~\par ~9~ | newline to "paragraph" in text
|028<|031~\)|013|010|013|010\(~ | newline to skipped line
|028l|031~\par ~1~ | newline to "paragraph" in text
|028l|031~\par ~7~ | newline to "paragraph" in text
|028l|031~\par ~9~ | newline to "paragraph" in text
|028l|031~\)|013|010\(~ | math
|028p|031~\par ~1~ | paragraph to "paragraph" in text
|028p|031~\par ~7~ | paragraph to "paragraph" in text
|028p|031~\par ~9~ | paragraph to "paragraph" in text
|028p|031~\)|013|010\par |013|010\(~ | math
|028ts|031~\(~1~2~
|028ts|031~~2~3~(~ | nesting unlikely but allowed
|028ts|031~~3~~(~
|028te|031~~1~ | anomalous
|028te|031~\)~2~1~
|028te|031~~3~~)~
|028es|~math|031|028es|~math-separation|031~~1~7~
|028es|~math|031 |028tcs|031|028ts|031 |028es|~math-separation|031~~1~7~
|028es|~math|031|028tcs|031|028ts|031 |028es|~math-separation|031~\)~1~7~
 |028es|~math-separation|031~\) ~2~7~
 |028es|~math-separation|031~\) ~3~9~
|028es|~math|031 |028tcs|031|028ts|031 ~\(~1~2~
|028es|~math|031 |028tcs|031|028ts|031~\(~1~2~
|028es|~math|031|028tcs|031|028ts|031 ~\(~1~2~
|028es|~math-separation|031|028es|~onewordbridge|031~~2~7~
|028es|~math-separation|031|028es|~onewordbridge|031~~3~9~
|028es|~onewordbridge|031~~7~
|028es|~onewordbridge|031~~9~
 |028es|~onewordbridge|031~ \)~2~8~
 |028es|~onewordbridge|031~ \)~3~10~
|028es|~onewordbridge|031~\)~2~8~
|028es|~onewordbridge|031~\)~3~10~
|028ee|~math-separation|031~\(~7~2~
|028ee|~math-separation|031~\(~9~3~
|028es|~math-separation|031~\)~2~7~
|028es|~math-separation|031~\)~3~9~
|028ee|~onewordbridge|031|028tcs|031|028ts|031 ~ \(~8~2~
|028ee|~onewordbridge|031|028tcs|031|028ts|031 ~ \(~10~3~
|028ee|~onewordbridge|031 ~ \(~8~2~
|028ee|~onewordbridge|031 ~ \(~10~3~
|028ee|~onewordbridge|031~~7~
|028ee|~onewordbridge|031~~9~
|028es|~onewordbridge|031~ ~7~
|028es|~onewordbridge|031~9~
|028fs|031~\(\frac{~1~2~
|028fs|031~\frac{~2~3~(~
|028fs|031~\frac{~3~~(~
| fsN, flN & feN are forcing forms for Nemeth multi-level fractions and mixed nos.
|028fs0|031~\(\frac{~1~2~
|028fs0|031~\frac{~2~3~(~
|028fs0|031~\frac{~3~~(~
|028fs1|031~\(\frac{~1~2~
|028fs1|031~\frac{~2~3~(~
|028fs1|031~\frac{~3~~(~
|028fs2|031~\(\frac{~1~2~
|028fs2|031~\frac{~2~3~(~
|028fs2|031~\frac{~3~~(~
|028fl|031~~1~
|028fl|031~}{~2~
|028fl|031~}{~3~
| 2012-09-24/jes: fl0 and fls0 not strictly needed, included for good measure
|028fl0|031~~1~
|028fl0|031~}{~2~
|028fl0|031~}{~3~
|028fl1|031~~1~
|028fl1|031~}{~2~
|028fl1|031~}{~3~
|028fl2|031~~1~
|028fl2|031~}{~2~
|028fl2|031~}{~3~
| 2012-09-24/jes: flNN forms used for forcing in French math
|028fl00|031~~1~
|028fl00|031~}{~2~
|028fl00|031~}{~3~
|028fl01|031~~1~
|028fl01|031~}{~2~
|028fl01|031~}{~3~
|028fl10|031~~1~
|028fl10|031~}{~2~
|028fl10|031~}{~3~
|028fl11|031~~1~
|028fl11|031~}{~2~
|028fl11|031~}{~3~
|028fls0|031~~1~
|028fls0|031~}{~2~
|028fls0|031~}{~3~
|028fls1|031~~1~
|028fls1|031~}{~2~
|028fls1|031~}{~3~
|028fls2|031~~1~
|028fls2|031~}{~2~
|028fls2|031~}{~3~
|028fe|031~~1~
|028fe|031~}\)~2~1~
|028fe|031~}~3~~)~
|028fe0|031~~1~
|028fe0|031~}\)~2~1~
|028fe0|031~}~3~~)~
|028fe1|031~~1~
|028fe1|031~}\)~2~1~
|028fe1|031~}~3~~)~
|028fe2|031~~1~
|028fe2|031~}\)~2~1~
|028fe2|031~}~3~~)~
|028sqrts|031~\(\sqrt{~1~2~
|028sqrts|031~\sqrt{~2~3~(~
|028sqrts|031~\sqrt{~3~~(~
|028sqrte|031~~1~
|028sqrte|031~}\)~2~1~
|028sqrte|031~}~3~~)~
|028ps|031~\(^{~1~2~
|028ps|031~^{~2~3~(~
|028ps|031~^{~3~~(~
|028pe|031~~1~
|028pe|031~}\)~2~1~
|028pe|031~}~3~~)~
| marked [os~] & [bar] rules added 2020-11-15/16 ff.:
|028os|~]|031|239B|028oe|031~}~ | right arrow above
|028os|~]|031|241K|028oe|031~}~ | dot above
|028os|~]|031|028bar|031|028oe|031~}~ | bar above with redundant [os]...[oe]
|028os|~]|031|236E|028oe|031~}~ | line above (=bar)
|028bar|~]|031~}~ | bar above
|028os|~]|031|239@|028oe|031~}~ | left arrow above 2020-12-01
|028os|~]|031|239D|028oe|031~}~ | bidirectional arrow above 2020-12-01
|028os|~]|031|242B|028oe|031~}~ | arc/hat above 2020-12-01
|028os|~]|031|~|028oe|031~}~ | tilde above 2020-12-01
|028os|031~\(^{~1~2~
|028os|031~^{~2~3~(~
|028os|031~^{~3~~(~
|028oe|031~~1~
|028oe|031~}\)~2~1~
|028oe|031~}~3~~)~
|028bs|031~\(_{~1~2~
|028bs|031~_{~2~3~(~
|028bs|031~_{~3~~(~
|028be|031~~1~
|028be|031~}\)~2~1~
|028be|031~}~3~~)~
| marked [us] rules added 2020-11-16 ff.:
|028us|~]|031|236E|028ue|031~}~ | line below
|028us|~]|031|239@|028ue|031~}~ | left arrow below 2020-12-01
|028us|~]|031|239D|028ue|031~}~ | bidirectional arrow below 2020-12-01
|028us|~]|031|239B|028ue|031~}~ | right arrow below 2020-12-01
|028us|~]|031|242B|028ue|031~}~ | arc/hat below 2024-5-15
|028us|031~\(_{~1~2~
|028us|031~_{~2~3~(~
|028us|031~_{~3~~(~
|028ue|031~~1~
|028ue|031~}\)~2~1~
|028ue|031~}~3~~)~
|028ixrts|031~\(\sqrt[~1~2~
|028ixrts|031~\sqrt[~2~3~(~
|028ixrts|031~\sqrt[~3~~(~
|028ixrtd|031~~1~
|028ixrtd|031~]{~2~
|028ixrtd|031~]{~3~
|028ixrte|031~~1~
|028ixrte|031~}\)~2~1~
|028ixrte|031~}~3~~)~
| other commands are just turned into paragraph breaks & comments for now - eventually
|   there should be fewer and fewer such cases
|028~ \par % ~1~4~(~
|028~\)|013|010\par  % ~~5~(~
|031~|013|010~4~~)~ | was in text mode, so stay
|031~|013|010\(~5~~)~ | was in math mode, so resume
|031~ ~-1~~)~ | end-style was in text mode, so stay (just space)
|031~ \(~-2~~)~ | end-style was in math mode, so resume after space
.|031~ \par ~-1~~)~ | end-fmt-style was in text mode, so stay after par
.|031~ \par \(~-2~~)~ | end-fmt-style was in math mode, so resume after par
| direct symbol conversions added 2012-05-25:
|029~~ | (assisted-hyphenation code) - discard
| cln, \: is not honored by Scientific Viewer; use \; instead
| |030~\:~ | (hard space code) - render as "medium" space
|030~\;~ | (hard space code) - render as "thick" space
!~!~ | 0021 0021 Exclamation mark {!}
#~\#~ | 0023 0023 Number sign {#}
$~\$~ | 0024 0024 Dollar sign {$}
%~\%~ | 0025 0025 Percent sign {%}
&~\&~ | 0026 0026 Ampersand {&}
(~(~ | 0028 0028 Left parenthesis {(}
)~)~ | 0029 0029 Right parenthesis {)}
*~*~ | 002a 002a Asterisk {*}
+~$+$~1~
+~+~ | 002b 002b Plus sign {+}
,~,~ | 002c 002c Comma {,}
-~-~ | 002d 002d Hyphen-minus {-}
.~.~ | 002e 002e Full stop {.}
/~/~ | 002f 002f Solidus {/}
:~:~1~ | 003a 003a Colon {:}
:~:~4~ | 003a 003a Colon {:}
:~:~5~ | 003a 003a Colon {:}
:~\colon ~ | 003a 003a Colon {:}
;~;~ | 003b 003b Semicolon {;}
<~$<$~1~
<~<~ | 003c 003c Less-than sign {<}
=~$=$~1~
=~=~ | 003d 003d Equals sign {=}
>~$>$~1~
>~>~ | 003e 003e Greater-than sign {>}
?~?~ | 003f 003f Question mark {?}
@~@~ | 0040 0040 Commercial at {@}
[~\lbrack ~ | 005b 005b Left square bracket {[}
\~$\backslash $~1~
\~\backslash ~ | 005c 005c Reverse solidus {\}
]~\rbrack ~ | 005d 005d Right square bracket {]}
| 2012-05-26/jes: following apparently not OK with MikTeX:
| ^~\sphat ~ | 005e 005e Circumflex accent {^}
^~*u005e*~ | 005e 005e Circumflex accent {^}
_~\_~ | 005f 005f Low line {_}
`~*u0060*~ | 0060 0060 Grave accent {`}
{~\{~ | 007b 007b Left curly bracket {{}
||~||~ | 007c 007c Vertical line {|}
}~\}~ | 007d 007d Right curly bracket {}}
|~~|~~1~ | 007e 007e Tilde {~}
|~~|~~4~ | 007e 007e Tilde {~}
|~~|~~5~ | 007e 007e Tilde {~}
|~~\sim ~ | 007e 007e Tilde {~} 2020-12-01
|173~*u00a1*~ | 00a1 00a1 Inverted exclamation mark
|155~$\cent $~1~
|155~\cent ~ | 00a2 00a2 Cent sign
|245#~$\pounds $~1~
|245#~\pounds ~ | 00a3 00a3 Pound sign {British pound sterling (|156)}
|245$~*u00a4*~ | 00a4 00a4 Currency sign*
|157~$\yen $~1~
|157~\yen ~ | 00a5 00a5 Yen sign
|245&~*u00a6*~ | 00a6 00a6 Broken bar*
|245'~*u00a7*~ | 00a7 00a7 Section sign {Section mark}
|245(~*u00a8*~ | 00a8 00a8 Diaeresis*
|170~$\neg $~1~
|170~\neg ~ | 00ac 00ac Not sign
|245.~$\circledR $~1~
|245.~\circledR ~ | 00ae 00ae Registered sign*
|245/~*u00af*~ | 00af 00af Macron*
|248~*u00b0*~ | 00b0 00b0 Degree sign
|2451~$\pm $~1~
|2451~\pm ~ | 00b1 00b1 Plus-minus sign {plus or minus}
|2452~*u00b2*~ | 00b2 00b2 Superscript two*
|2453~*u00b3*~ | 00b3 00b3 Superscript three*
|2454~*u00b4*~ | 00b4 00b4 Acute accent*
|2455~$\Micro $~1~
|2455~\Micro ~ | 00b5 00b5 Micro sign*
|2456~*u00b6*~ | 00b6 00b6 Pilcrow sign {paragraph mark}
|249~*u00b7*~ | 00b7 00b7 Middle dot
|2459~*u00b9*~ | 00b9 00b9 Superscript one*
|245<~\(\frac{1}{4}\)~ | 00bc 00bc Vulgar fraction one quarter*
|245=~\(\frac{1}{2}\)~ | 00bd 00bd Vulgar fraction one half*
|245>~\(\frac{3}{4}\)~ | 00be 00be Vulgar fraction three quarters*
|168~*u00bf*~ | 00bf 00bf Inverted question mark
|247~$\times $~1~
|247~\times ~ | 00d7 00d7 Multiplication sign {X shape, i.e. cross or "times"}
|245p~$\eth $~1~
|245p~\eth ~ | 00f0 00f0 Latin small letter eth
|246~$\div $~1~
|246~\div ~ | 00f7 00f7 Division sign {line between two dots}
|156|133~\`{A}~ | U+00C0 -- uppercase A with GRAVE
|156|160~\'{A}~ | U+00C1 -- uppercase A with ACUTE
|156|131~\^{A}~ | U+00C2 -- uppercase A with CIRCUMFLEX
|245C~\|~{A}~ | U+00C3 -- uppercase A with TILDE
|142~\"{A}~ | U+00C4  -- uppercase A with DIAERESIS
|143~\mathring{A}~ | U+00C5  -- uppercase A with RING ABOVE
|146~\AE~ | U+00C6  -- uppercase AE
|128~\c{C}~ | U+00C7  -- uppercase C with CEDILLA
|156|138~\`{E}~ | U+00C8 -- uppercase E with GRAVE
|144~\'{E}~ | U+00C9  -- uppercase E with ACUTE
|156|136~\^{E}~ | U+00CA -- uppercase E with CIRCUMFLEX
|156|137~\"{E}~ | U+00CB -- uppercase E with DIAERESIS
|156|141~\`{I}~ | U+00CC -- uppercase I with GRAVE
|156|161~\'{I}~ | U+00CD -- uppercase I with ACUTE
|156|140~\^{I}~ | U+00CE -- uppercase I with CIRCUMFLEX
|156|139~\"{I}~ | U+00CF -- uppercase I with DIAERESIS
|245P~\DH~ | U+00D0  -- uppercase letter eth
|165~\|~{N}~ | U+00D1  -- uppercase N with TILDE
|156|149~\`{O}~ | U+00D2 -- uppercase O with GRAVE
|156|162~\'{O}~ | U+00D3 -- uppercase O with ACUTE
|156|147~\^{O}~ | U+00D4 -- uppercase O with CIRCUMFLEX
|245U~\|~{O}~ | U+00D5 -- uppercase O with TILDE
|153~\"{O}~ | U+00D6  -- uppercase O with DIAERESIS
|245X~\l{O}~ | U+00D8 -- uppercase O with STROKE
|156|151~\`{U}~ | U+00D9 -- uppercase U with GRAVE
|156|163~\'{U}~ | U+00DA -- uppercase U with ACUTE
|156|150~\^{U}~ | U+00DB -- uppercase U with CIRCUMFLEX
|154~\"{U}~ | U+00DC  -- uppercase U with DIAERESIS
|245]~\'{Y}~ | U+00DD -- uppercase Y with ACUTE
|245^~\TH~ | U+00DE -- uppercase THORN
|245_~\ss~ | U+00DF -- lowercase SHARP S
|133~\`{a}~ | U+00E0  -- lowercase a with GRAVE
|160~\'{a}~ | U+00E1  -- lowercase a with ACUTE
|131~\^{a}~ | U+00E2  -- lowercase a with CIRCUMFLEX
|245c~\|~{a}~ | U+00E3 -- lowercase a with TILDE
|132~\"{a}~ | U+00E4  -- lowercase a with DIAERESIS
|134~\mathring{a}~ | U+00E5  -- lowercase a with RING ABOVE
|145~\ae~ | U+00E6  -- lowercase aE
|135~\c{c}~ | U+00E7  -- lowercase c with CEDILLA
|138~\`{e}~ | U+00E8  -- lowercase e with GRAVE
|130~\'{e}~ | U+00E9  -- lowercase e with ACUTE
|136~\^{e}~ | U+00EA  -- lowercase e with CIRCUMFLEX
|137~\"{e}~ | U+00EB  -- lowercase e with DIAERESIS
|141~\`{i}~ | U+00EC -- lowercase i with GRAVE
|161~\'{i}~ | U+00ED  -- lowercase i with ACUTE
|140~\^{i}~ | U+00EE  -- lowercase i with CIRCUMFLEX
|139~\"{i}~ | U+00EF  -- lowercase i with DIAERESIS
|164~\|~{n}~ | U+00F1  -- lowercase N with TILDE
|149~\`{o}~ | U+00F2  -- lowercase o with GRAVE
|162~\'{o}~ | U+00F3  -- lowercase o with ACUTE
|147~\^{o}~ | U+00F4  -- lowercase o with CIRCUMFLEX
|245u~\|~{o}~ | U+00F5 -- lowercase o with TILDE
|148~\"{o}~ | U+00F6  -- lowercase o with DIAERESIS
|245x~\l{o}~ | U+00F8 -- lowercase o with STROKE
|151~\`{u}~ | U+00F9  -- lowercase u with GRAVE
|163~\'{u}~ | U+00FA  -- lowercase u with ACUTE
|150~\^{u}~ | U+00FB  -- lowercase u with CIRCUMFLEX
|129~\"{u}~ | U+0 0F:  -- lowercase u with DIAERESIS
|245}~\'{y}~ | U+00FD -- lowercase Y with ACUTE
|245|~~\th~ | U+00FE -- lowercase THORN
|152~\"{y}~ | U+00FF  -- lowercase Y with DIAERESIS
|1780~\={A}~ | U+0100 -- uppercase A with MACRON
|1781~\={a}~ | U+0101 -- lowercase a with MACRON
|1782~\u{A}~ | U+0102 -- uppercase A with BREVE
|1783~\u{a}~ | U+0103 -- lowercase a with BREVE
|1784~\k{A}~ | U+0104 -- uppercase A with OGONEK
|1785~\k{a}~ | U+0105 -- lowercase a with OGONEK
|1786~\'{C}~ | U+0106 -- uppercase C with ACUTE
|1787~\'{c}~ | U+0107 -- lowercase c with ACUTE
|1788~\^{C}~ | U+0108 -- uppercase C with CIRCUMFLEX
|1789~\^{c}~ | U+0109 -- lowercase c with CIRCUMFLEX
|178:~\.{C}~ | U+010A -- uppercase C with DOT ABOVE
|178;~\.{c}~ | U+010B -- lowercase c with DOT ABOVE
|178<~\v{C}~ | U+010C -- uppercase C with CARON
|178=~\v{c}~ | U+010D -- lowercase c with CARON
|178>~\v{D}~ | U+010E -- uppercase D with CARON
|178?~\v{d}~ | U+010F -- lowercase d with CARON
|178@~\DJ~ | U+0110 -- uppercase D with STROKE
|178A~\dj~ | U+0111 -- lowercase d with STROKE
|178B~\={E}~ | U+0112 -- uppercase E with MACRON
|178C~\={e}~ | U+0113 -- lowercase e with MACRON
|178D~\u{E}~ | U+0114 -- uppercase E with BREVE
|178E~\u{e}~ | U+0115 -- lowercase e with BREVE
|178F~\.{E}~ | U+0116 -- uppercase E with DOT ABOVE
|178G~\.{e}~ | U+0117 -- lowercase e with DOT ABOVE
|178H~\k{E}~ | U+0118 -- uppercase E with OGONEK
|178I~\k{e}~ | U+0119 -- lowercase e with OGONEK
|178J~\v{E}~ | U+011A -- uppercase E with CARON
|178K~\v{e}~ | U+011B -- lowercase e with CARON
|178L~\^{G}~ | U+011C -- uppercase G with CIRCUMFLEX
|178M~\^{g}~ | U+011D -- lowercase G with CIRCUMFLEX
|178N~\u{G}~ | U+011E -- uppercase g with BREVE
|178O~\u{g}~ | U+011F -- lowercase g with BREVE
|178a~$\imath $~1~
|178a~\imath ~ | 0131 0131 Latin small letter dotless i
|179e~*u01b5*~ | 01b5 01b5 Latin capital letter z with stroke
|180g~$\jmath $~1~
|180g~\jmath ~ | 0237 0237 Latin small letter dotless j
|181v~*u02c6*~ | 02c6 02c6 Modifier letter circumflex accent
|181w~*u02c7*~ | 02c7 02c7 Caron
|181|136~*u02d8*~ | 02d8 02d8 Breve
|181|137~*u02d9*~ | 02d9 02d9 Dot above
|181|138~*u02da*~ | 02da 02da Ring above
|181|140~*u02dc*~ | 02dc 02dc Small tilde
|2270~$\grave $~1~
|2270~\grave ~ | 0300 0300 Combining grave accent
|2271~$\acute $~1~
|2271~\acute ~ | 0301 0301 Combining acute accent
|2272~$\hat $~1~
|2272~\hat ~ | 0302 0302 Combining circumflex accent
|2273~$\tilde $~1~
|2273~\tilde ~ | 0303 0303 Combining tilde
|2274~$\bar $~1~
|2274~\bar ~ | 0304 0304 Combining macron
|2275~$\overline $~1~
|2275~\overline ~ | 0305 0305 Combining overline
|2276~$\breve $~1~
|2276~\breve ~ | 0306 0306 Combining breve
|2277~$\dot $~1~
|2277~\dot ~ | 0307 0307 Combining dot above
|2278~$\ddot $~1~
|2278~\ddot ~ | 0308 0308 Combining diaeresis
|2279~*u0309*~ | 0309 0309 Combining hook above
|227:~$\mathring $~1~
|227:~\mathring ~ | 030a 030a Combining ring above
|227<~$\check $~1~
|227<~\check ~ | 030c 030c Combining caron
|227@~*u0310*~ | 0310 0310 Combining candrabindu
|227A~*u0311*~ | 0311 0311 Combining inverted breve
|227B~*u0312*~ | 0312 0312 Combining turned comma above
|227E~*u0315*~ | 0315 0315 Combining comma above right
|227J~*u031a*~ | 031a 031a Combining left angle above
|227S~*u0323*~ | 0323 0323 Combining dot below
|227\~*u032c*~ | 032c 032c Combining caron below
|227]~*u032d*~ | 032d 032d Combining circumflex accent below
|227^~*u032e*~ | 032e 032e Combining breve below
|227_~*u032f*~ | 032f 032f Combining inverted breve below
|227`~$\utilde $~1~
|227`~\utilde ~ | 0330 0330 Combining tilde below
|227a~$\underbar $~1~
|227a~\underbar ~ | 0331 0331 Combining macron below
|227b~$\underline $~1~
|227b~\underline ~ | 0332 0332 Combining low line
|227c~*u0333*~ | 0333 0333 Combining double low line
|227h~$\not $~1~
|227h~\not ~ | 0338 0338 Combining long solidus overlay
|227j~*u033a*~ | 033a 033a Combining inverted bridge below
|227o~*u033f*~ | 033f 033f Combining double overline
|227v~*u0346*~ | 0346 0346 Combining bridge above
|226A~*u0391*~ | 0391 0391 Greek capital letter alpha
|226B~*u0392*~ | 0392 0392 Greek capital letter beta
|226C~$\Gamma $~1~
|226C~\Gamma ~ | 0393 0393 Greek capital letter gamma
|226D~$\Delta $~1~
|226D~\Delta ~ | 0394 0394 Greek capital letter delta
|226E~*u0395*~ | 0395 0395 Greek capital letter epsilon
|226F~*u0396*~ | 0396 0396 Greek capital letter zeta
|226G~*u0397*~ | 0397 0397 Greek capital letter eta
|226H~$\Theta $~1~
|226H~\Theta ~ | 0398 0398 Greek capital letter theta
|226I~*u0399*~ | 0399 0399 Greek capital letter iota
|226J~*u039a*~ | 039a 039a Greek capital letter kappa
|226K~$\Lambda $~1~
|226K~\Lambda ~ | 039b 039b Greek capital letter lamda
|226L~*u039c*~ | 039c 039c Greek capital letter mu
|226M~*u039d*~ | 039d 039d Greek capital letter nu
|226N~$\Xi $~1~
|226N~\Xi ~ | 039e 039e Greek capital letter xi
|226O~*u039f*~ | 039f 039f Greek capital letter omicron
|226P~$\Pi $~1~
|226P~\Pi ~ | 03a0 03a0 Greek capital letter pi
|226Q~*u03a1*~ | 03a1 03a1 Greek capital letter rho
|226S~$\Sigma $~1~
|226S~\Sigma ~ | 03a3 03a3 Greek capital letter sigma
|226T~*u03a4*~ | 03a4 03a4 Greek capital letter tau
|226U~$\Upsilon $~1~
|226U~\Upsilon ~ | 03a5 03a5 Greek capital letter upsilon
|226V~$\Phi $~1~
|226V~\Phi ~ | 03a6 03a6 Greek capital letter phi
|226W~*u03a7*~ | 03a7 03a7 Greek capital letter chi
|226X~$\Psi $~1~
|226X~\Psi ~ | 03a8 03a8 Greek capital letter psi
|226Y~$\Omega $~1~
|226Y~\Omega ~ | 03a9 03a9 Greek capital letter omega
|226a~$\alpha $~1~
|226a~\alpha ~ | 03b1 03b1 Greek small letter alpha
|226b~$\beta $~1~
|226b~\beta ~ | 03b2 03b2 Greek small letter beta
|226c~$\gamma $~1~
|226c~\gamma ~ | 03b3 03b3 Greek small letter gamma
|226d~$\delta $~1~
|226d~\delta ~ | 03b4 03b4 Greek small letter delta
|226e~$\varepsilon $~1~
|226e~\varepsilon ~ | 03b5 03b5 Greek small letter epsilon
|226f~$\zeta $~1~
|226f~\zeta ~ | 03b6 03b6 Greek small letter zeta
|226g~$\eta $~1~
|226g~\eta ~ | 03b7 03b7 Greek small letter eta
|226h~$\theta $~1~
|226h~\theta ~ | 03b8 03b8 Greek small letter theta
|226i~$\iota $~1~
|226i~\iota ~ | 03b9 03b9 Greek small letter iota
|226j~$\kappa $~1~
|226j~\kappa ~ | 03ba 03ba Greek small letter kappa
|226k~$\lambda $~1~
|226k~\lambda ~ | 03bb 03bb Greek small letter lamda
|226l~$\mu $~1~
|226l~\mu ~ | 03bc 03bc Greek small letter mu
|226m~$\nu $~1~
|226m~\nu ~ | 03bd 03bd Greek small letter nu
|226n~$\xi $~1~
|226n~\xi ~ | 03be 03be Greek small letter xi
|226o~*u03bf*~ | 03bf 03bf Greek small letter omicron
|226p~$\pi $~1~
|226p~\pi ~ | 03c0 03c0 Greek small letter pi
|226q~$\rho $~1~
|226q~\rho ~ | 03c1 03c1 Greek small letter rho
|226r~$\varsigma $~1~
|226r~\varsigma ~ | 03c2 03c2 Greek small letter final sigma
|226s~$\sigma $~1~
|226s~\sigma ~ | 03c3 03c3 Greek small letter sigma
|226t~$\tau $~1~
|226t~\tau ~ | 03c4 03c4 Greek small letter tau
|226u~$\upsilon $~1~
|226u~\upsilon ~ | 03c5 03c5 Greek small letter upsilon
|226v~$\varphi $~1~
|226v~\varphi ~ | 03c6 03c6 Greek small letter phi
|226w~$\chi $~1~
|226w~\chi ~ | 03c7 03c7 Greek small letter chi
|226x~$\psi $~1~
|226x~\psi ~ | 03c8 03c8 Greek small letter psi
|226y~$\omega $~1~
|226y~\omega ~ | 03c9 03c9 Greek small letter omega
|226|128~$\varbeta $~1~
|226|128~\varbeta ~ | 03d0 03d0 Greek beta symbol
|226|129~$\vartheta $~1~
|226|129~\vartheta ~ | 03d1 03d1 Greek theta symbol
|226|130~*u03d2*~ | 03d2 03d2 Greek upsilon with hook symbol
|226|133~$\phi $~1~
|226|133~\phi ~ | 03d5 03d5 Greek phi symbol
|226|134~$\varpi $~1~
|226|134~\varpi ~ | 03d6 03d6 Greek pi symbol
|226|136~$\Qoppa $~1~
|226|136~\Qoppa ~ | 03d8 03d8 Greek letter archaic koppa
|226|137~$\qoppa $~1~
|226|137~\qoppa ~ | 03d9 03d9 Greek small letter archaic koppa
|226|138~$\Stigma $~1~
|226|138~\Stigma ~ | 03da 03da Greek letter stigma
|226|139~$\stigma $~1~
|226|139~\stigma ~ | 03db 03db Greek small letter stigma
|226|140~$\digamma $~1~
|226|140~\digamma ~ | 03dc 03dc Greek letter digamma
|226|141~$\digamma $~1~
|226|141~\digamma ~ | 03dd 03dd Greek small letter digamma
|226|142~$\Koppa $~1~
|226|142~\Koppa ~ | 03de 03de Greek letter koppa
|226|143~$\koppa $~1~
|226|143~\koppa ~ | 03df 03df Greek small letter koppa
|226|144~$\Sampi $~1~
|226|144~\Sampi ~ | 03e0 03e0 Greek letter sampi
|226|145~$\sampi $~1~
|226|145~\sampi ~ | 03e1 03e1 Greek small letter sampi
|226|160~*u03f0*~ | 03f0 03f0 Greek kappa symbol
|226|161~$\varrho $~1~
|226|161~\varrho ~ | 03f1 03f1 Greek rho symbol
|226|164~*u03f4*~ | 03f4 03f4 Greek capital theta symbol
|226|165~$\epsilon $~1~
|226|165~\epsilon ~ | 03f5 03f5 Greek lunate epsilon symbol
|226|166~$\backepsilon $~1~
|226|166~\backepsilon ~ | 03f6 03f6 Greek reversed lunate epsilon symbol
|182X~*u0428*~ | 0428 0428 Cyrillic capital letter sha*
|2360~*u2000*~ | 2000 2000 En quad*
|2361~$\quad $~1~
|2361~\quad ~ | 2001 2001 Em quad*
|2362~*u2002*~ | 2002 2002 En space*
|2363~*u2003*~ | 2003 2003 Em space*
|2364~*u2004*~ | 2004 2004 Three-per-em space*
|2365~*u2005*~ | 2005 2005 Four-per-em space*
|2366~*u2006*~ | 2006 2006 Six-per-em space*
|2367~*u2007*~ | 2007 2007 Figure space*
|2369~*u2009*~ | 2009 2009 Thin space*
|236:~*u200a*~ | 200a 200a Hair space*
|236;~*u200b*~ | 200b 200b Zero width space*
|236@~*u2010*~ | 2010 2010 Hyphen*
|236B~*u2012*~ | 2012 2012 Figure dash*
|236C~*u2013*~ | 2013 2013 En dash*
|236D~*u2014*~ | 2014 2014 Em dash*
|236E~*u2015*~ | 2015 2015 Horizontal bar {or conversation bar}
|236F~$\||$~1~
|236F~\||~ | 2016 2016 Double vertical line*
|236G~*u2017*~ | 2017 2017 Double low line*
|236P~$\dagger $~1~
|236P~\dagger ~ | 2020 2020 Dagger*
|236Q~$\ddagger $~1~
|236Q~\ddagger ~ | 2021 2021 Double dagger*
|236R~*u2022*~ | 2022 2022 Bullet*
|236U~*u2025*~ | 2025 2025 Two dot leader*
|236V~$\ldots $~1~
|236V~\ldots ~ | 2026 2026 Horizontal ellipsis*
|236b~$\prime $~1~
|236b~\prime ~ | 2032 2032 Prime*
|236c~$\second $~1~
|236c~\second ~ | 2033 2033 Double prime*
|236d~$\third $~1~
|236d~\third ~ | 2034 2034 Triple prime*
|236e~$\backprime $~1~
|236e~\backprime ~ | 2035 2035 Reversed prime*
|236f~*u2036*~ | 2036 2036 Reversed double prime*
|236g~*u2037*~ | 2037 2037 Reversed triple prime*
|236h~*u2038*~ | 2038 2038 Caret*
|236k~*u203b*~ | 203b 203b Reference mark*
|236l~*u203c*~ | 203c 203c Double exclamation mark*
|236p~$\cat $~1~
|236p~\cat ~ | 2040 2040 Character tie*
|236s~*u2043*~ | 2043 2043 Hyphen bullet*
|236t~*u2044*~ | 2044 2044 Fraction slash*
|236v~*u2047*~ | 2046 2047 Right square bracket with quill*
|236|170~*u207a*~ | 207a 207a Superscript plus sign*
|236|171~*u207b*~ | 207b 207b Superscript minus*
|236|172~*u207c*~ | 207c 207c Superscript equals sign*
|236|173~*u207d*~ | 207d 207d Superscript left parenthesis*
|236|174~*u207e*~ | 207e 207e Superscript right parenthesis*
|237:~*u208a*~ | 208a 208a Subscript plus sign*
|237;~*u208b*~ | 208b 208b Subscript minus*
|237<~*u208c*~ | 208c 208c Subscript equals sign*
|237=~*u208d*~ | 208d 208d Subscript left parenthesis*
|237>~*u208e*~ | 208e 208e Subscript right parenthesis*
|237\~*u20ac*~ | 20ac 20ac Euro sign
|237|128~$\lvec $~1~
|237|128~\lvec ~ | 20d0 20d0 Combining left harpoon above*
|237|129~$\vec $~1~
|237|129~\vec ~ | 20d1 20d1 Combining right harpoon above*
|237|130~*u20d2*~ | 20d2 20d2 Combining long vertical line overlay*
|237|131~*u20d3*~ | 20d3 20d3 Combining short vertical line overlay*
|237|132~*u20d4*~ | 20d4 20d4 Combining anticlockwise arrow above*
|237|134~$\LVec $~1~
|237|134~\LVec ~ | 20d6 20d6 Combining left arrow above*
|237|135~$\vec $~1~
|237|135~\vec ~ | 20d7 20d7 Combining right arrow above*
|237|136~*u20d8*~ | 20d8 20d8 Combining ring overlay*
|237|137~*u20d9*~ | 20d9 20d9 Combining clockwise ring overlay*
|237|138~*u20da*~ | 20da 20da Combining anticlockwise ring overlay*
|237|139~$\dddot $~1~
|237|139~\dddot ~ | 20db 20db Combining three dots above*
|237|140~$\ddddot $~1~
|237|140~\ddddot ~ | 20dc 20dc Combining four dots above*
|237|141~*u20dd*~ | 20dd 20dd Combining enclosing circle*
|237|142~*u20de*~ | 20de 20de Combining enclosing square*
|237|143~*u20df*~ | 20df 20df Combining enclosing diamond*
|237|145~$\overleftrightarrow $~1~
|237|145~\overleftrightarrow ~ | 20e1 20e1 Combining left right arrow above*
|2382~$\mathbb{C}$~1~
|2382~\mathbb{C}~ | 2102 2102 Double-struck capital c
|2387~$\Euler $~1~
|2387~\Euler ~ | 2107 2107 Euler constant
|238:~$\mathcal{g}$~1~
|238:~\mathcal{g}~ | 210a 210a Script small g
|238;~$\mathcal{H}$~1~
|238;~\mathcal{H}~ | 210b 210b Script capital h
|238<~$\mathfrak{H}$~1~
|238<~\mathfrak{H}~ | 210c 210c Black-letter capital h
|238=~$\mathbb{H}$~1~
|238=~\mathbb{H}~ | 210d 210d Double-struck capital h
|238>~*u210e*~ | 210e 210e Planck constant
|238?~$\hslash $~1~
|238?~\hslash ~ | 210f 210f Planck constant over two pi
|238@~$\mathcal{I}$~1~
|238@~\mathcal{I}~ | 2110 2110 Script capital i
|238A~$\Im $~1~
|238A~\Im ~ | 2111 2111 Black-letter capital i
|238B~$\mathcal{L}$~1~
|238B~\mathcal{L}~ | 2112 2112 Script capital l
|238C~$\ell $~1~
|238C~\ell ~ | 2113 2113 Script small l
|238E~$\mathbb{N}$~1~
|238E~\mathbb{N}~ | 2115 2115 Double-struck capital n
|238H~$\wp $~1~
|238H~\wp ~ | 2118 2118 Script capital p
|238I~$\mathbb{P}$~1~
|238I~\mathbb{P}~ | 2119 2119 Double-struck capital p
|238J~$\mathbb{Q}$~1~
|238J~\mathbb{Q}~ | 211a 211a Double-struck capital q
|238K~$\mathcal{R}$~1~
|238K~\mathcal{R}~ | 211b 211b Script capital r
|238L~$\Re $~1~
|238L~\Re ~ | 211c 211c Black-letter capital r
|238M~$\mathbb{R}$~1~
|238M~\mathbb{R}~ | 211d 211d Double-struck capital r
|238T~$\mathbb{Z}$~1~
|238T~\mathbb{Z}~ | 2124 2124 Double-struck capital z
|238V~$\tcohm $~1~
|238V~\tcohm ~ | 2126 2126 Ohm sign
|238W~$\mho $~1~
|238W~\mho ~ | 2127 2127 Inverted ohm sign
|238X~$\mathfrak{Z}$~1~
|238X~\mathfrak{Z}~ | 2128 2128 Black-letter capital z
|238Y~*u2129*~ | 2129 2129 Turned greek small letter iota
|238[~$\Angstroem $~1~
|238[~\Angstroem ~ | 212b 212b Angstrom sign
|238\~$\mathcal{B}$~1~
|238\~\mathcal{B}~ | 212c 212c Script capital b
|238]~$\mathfrak{C}$~1~
|238]~\mathfrak{C}~ | 212d 212d Black-letter capital c
|238_~$\mathcal{e}$~1~
|238_~\mathcal{e}~ | 212f 212f Script small e
|238`~$\mathcal{E}$~1~
|238`~\mathcal{E}~ | 2130 2130 Script capital e
|238a~$\mathcal{F}$~1~
|238a~\mathcal{F}~ | 2131 2131 Script capital f
|238b~$\Finv $~1~
|238b~\Finv ~ | 2132 2132 Turned capital f
|238c~$\mathcal{M}$~1~
|238c~\mathcal{M}~ | 2133 2133 Script capital m
|238d~$\mathcal{o}$~1~
|238d~\mathcal{o}~ | 2134 2134 Script small o
|238e~$\aleph $~1~
|238e~\aleph ~ | 2135 2135 Alef symbol
|238f~$\beth $~1~
|238f~\beth ~ | 2136 2136 Bet symbol
|238g~$\gimel $~1~
|238g~\gimel ~ | 2137 2137 Gimel symbol
|238h~$\daleth $~1~
|238h~\daleth ~ | 2138 2138 Dalet symbol
|238|128~\(\frac{1}{7}\)~ | 2150 2150 vulgar fraction one seventh
|238|129~\(\frac{1}{9}\)~ | 2151 2151 vulgar fraction one ninth
|238|130~\(\frac{1}{10}\)~ | 2152 2152 vulgar fraction one tenth
|238|131~\(\frac{1}{3}\)~ | 2153 2153 vulgar fraction one third
|238|132~\(\frac{2}{3}\)~ | 2154 2154 vulgar fraction two thirds
|238|133~\(\frac{1}{5}\)~ | 2155 2155 vulgar fraction one fifth
|238|134~\(\frac{2}{5}\)~ | 2156 2156 vulgar fraction two fifths
|238|135~\(\frac{3}{5}\)~ | 2157 2157 vulgar fraction three fifths
|238|136~\(\frac{4}{5}\)~ | 2158 2158 vulgar fraction four fifths
|238|137~\(\frac{1}{6}\)~ | 2159 2159 vulgar fraction one sixth
|238|138~\(\frac{5}{6}\)~ | 215a 215a vulgar fraction five sixths
|238|139~\(\frac{1}{8}\)~ | 215b 215b vulgar fraction one eighth
|238|140~\(\frac{3}{8}\)~ | 215c 215c vulgar fraction three eighths
|238|141~\(\frac{5}{8}\)~ | 215d 215d vulgar fraction five eighths
|238|142~\(\frac{7}{8}\)~ | 215e 215e vulgar fraction seven eighths
|239@~$\leftarrow $~1~
|239@~\leftarrow ~ | 2190 2190 Leftwards arrow
|239A~$\uparrow $~1~
|239A~\uparrow ~ | 2191 2191 Upwards arrow
|239B~$\rightarrow $~1~
|239B~\rightarrow ~ | 2192 2192 Rightwards arrow
|239C~$\downarrow $~1~
|239C~\downarrow ~ | 2193 2193 Downwards arrow
|239D~$\leftrightarrow $~1~
|239D~\leftrightarrow ~ | 2194 2194 Left right arrow
|239E~$\updownarrow $~1~
|239E~\updownarrow ~ | 2195 2195 Up down arrow
|239F~$\nwarrow $~1~
|239F~\nwarrow ~ | 2196 2196 North west arrow
|239G~$\nearrow $~1~
|239G~\nearrow ~ | 2197 2197 North east arrow
|239H~$\searrow $~1~
|239H~\searrow ~ | 2198 2198 South east arrow
|239I~$\swarrow $~1~
|239I~\swarrow ~ | 2199 2199 South west arrow
|239J~$\nleftarrow $~1~
|239J~\nleftarrow ~ | 219a 219a Leftwards arrow with stroke
|239K~$\nrightarrow $~1~
|239K~\nrightarrow ~ | 219b 219b Rightwards arrow with stroke
|239L~*u219c*~ | 219c 219c Leftwards wave arrow
|239M~*u219d*~ | 219d 219d Rightwards wave arrow
|239N~$\twoheadleftarrow $~1~
|239N~\twoheadleftarrow ~ | 219e 219e Leftwards two headed arrow
|239O~*u219f*~ | 219f 219f Upwards two headed arrow
|239P~$\twoheadrightarrow $~1~
|239P~\twoheadrightarrow ~ | 21a0 21a0 Rightwards two headed arrow
|239Q~*u21a1*~ | 21a1 21a1 Downwards two headed arrow
|239R~$\leftarrowtail $~1~
|239R~\leftarrowtail ~ | 21a2 21a2 Leftwards arrow with tail
|239S~$\rightarrowtail $~1~
|239S~\rightarrowtail ~ | 21a3 21a3 Rightwards arrow with tail
|239T~$\mapsfrom $~1~
|239T~\mapsfrom ~ | 21a4 21a4 Leftwards arrow from bar
|239U~$\MapsUp $~1~
|239U~\MapsUp ~ | 21a5 21a5 Upwards arrow from bar
|239V~$\mapsto $~1~
|239V~\mapsto ~ | 21a6 21a6 Rightwards arrow from bar
|239W~$\MapsDown $~1~
|239W~\MapsDown ~ | 21a7 21a7 Downwards arrow from bar
|239X~*u21a8*~ | 21a8 21a8 Up down arrow with base
|239Y~$\hookleftarrow $~1~
|239Y~\hookleftarrow ~ | 21a9 21a9 Leftwards arrow with hook
|239Z~$\hookrightarrow $~1~
|239Z~\hookrightarrow ~ | 21aa 21aa Rightwards arrow with hook
|239[~$\looparrowleft $~1~
|239[~\looparrowleft ~ | 21ab 21ab Leftwards arrow with loop
|239\~$\looparrowright $~1~
|239\~\looparrowright ~ | 21ac 21ac Rightwards arrow with loop
|239]~$\leftrightsquigarrow $~1~
|239]~\leftrightsquigarrow ~ | 21ad 21ad Left right wave arrow
|239^~$\nleftrightarrow $~1~
|239^~\nleftrightarrow ~ | 21ae 21ae Left right arrow with stroke
|239_~$\lightning $~1~
|239_~\lightning ~ | 21af 21af Downwards zigzag arrow
|239`~$\Lsh $~1~
|239`~\Lsh ~ | 21b0 21b0 Upwards arrow with tip leftwards
|239a~$\Rsh $~1~
|239a~\Rsh ~ | 21b1 21b1 Upwards arrow with tip rightwards
|239b~$\dlsh $~1~
|239b~\dlsh ~ | 21b2 21b2 Downwards arrow with tip leftwards
|239c~$\drsh $~1~
|239c~\drsh ~ | 21b3 21b3 Downwards arrow with tip rightwards
|239d~*u21b4*~ | 21b4 21b4 Rightwards arrow with corner downwards
|239e~*u21b5*~ | 21b5 21b5 Downwards arrow with corner leftwards
|239f~$\curvearrowleft $~1~
|239f~\curvearrowleft ~ | 21b6 21b6 Anticlockwise top semicircle arrow
|239g~$\curvearrowright $~1~
|239g~\curvearrowright ~ | 21b7 21b7 Clockwise top semicircle arrow
|239h~*u21b8*~ | 21b8 21b8 North west arrow to long bar
|239i~*u21b9*~ | 21b9 21b9 Leftwards arrow to bar over rightwards arrow to bar
|239j~$\circlearrowleft $~1~
|239j~\circlearrowleft ~ | 21ba 21ba Anticlockwise open circle arrow
|239k~$\circlearrowright $~1~
|239k~\circlearrowright ~ | 21bb 21bb Clockwise open circle arrow
|239l~$\leftharpoonup $~1~
|239l~\leftharpoonup ~ | 21bc 21bc Leftwards harpoon with barb upwards
|239m~$\leftharpoondown $~1~
|239m~\leftharpoondown ~ | 21bd 21bd Leftwards harpoon with barb downwards
|239n~$\upharpoonright $~1~
|239n~\upharpoonright ~ | 21be 21be Upwards harpoon with barb rightwards
|239o~$\upharpoonleft $~1~
|239o~\upharpoonleft ~ | 21bf 21bf Upwards harpoon with barb leftwards
|239p~$\rightharpoonup $~1~
|239p~\rightharpoonup ~ | 21c0 21c0 Rightwards harpoon with barb upwards
|239q~$\rightharpoondown $~1~
|239q~\rightharpoondown ~ | 21c1 21c1 Rightwards harpoon with barb downwards
|239r~$\downharpoonright $~1~
|239r~\downharpoonright ~ | 21c2 21c2 Downwards harpoon with barb rightwards
|239s~$\downharpoonleft $~1~
|239s~\downharpoonleft ~ | 21c3 21c3 Downwards harpoon with barb leftwards
|239t~$\rightleftarrows $~1~
|239t~\rightleftarrows ~ | 21c4 21c4 Rightwards arrow over leftwards arrow
|239u~$\updownarrows $~1~
|239u~\updownarrows ~ | 21c5 21c5 Upwards arrow leftwards of downwards arrow
|239v~$\leftrightarrows $~1~
|239v~\leftrightarrows ~ | 21c6 21c6 Leftwards arrow over rightwards arrow
|239w~$\leftleftarrows $~1~
|239w~\leftleftarrows ~ | 21c7 21c7 Leftwards paired arrows
|239x~$\upuparrows $~1~
|239x~\upuparrows ~ | 21c8 21c8 Upwards paired arrows
|239y~$\rightrightarrows $~1~
|239y~\rightrightarrows ~ | 21c9 21c9 Rightwards paired arrows
|239z~$\downdownarrows $~1~
|239z~\downdownarrows ~ | 21ca 21ca Downwards paired arrows
|239{~$\leftrightharpoons $~1~
|239{~\leftrightharpoons ~ | 21cb 21cb Leftwards harpoon over rightwards harpoon
|239||~$\rightleftharpoons $~1~
|239||~\rightleftharpoons ~ | 21cc 21cc Rightwards harpoon over leftwards harpoon
|239}~$\nLeftarrow $~1~
|239}~\nLeftarrow ~ | 21cd 21cd Leftwards double arrow with stroke
|239|~~$\nLeftrightarrow $~1~
|239|~~\nLeftrightarrow ~ | 21ce 21ce Left right double arrow with stroke
|239|127~$\nRightarrow $~1~
|239|127~\nRightarrow ~ | 21cf 21cf Rightwards double arrow with stroke
|239|128~$\Leftarrow $~1~
|239|128~\Leftarrow ~ | 21d0 21d0 Leftwards double arrow
|239|129~$\Uparrow $~1~
|239|129~\Uparrow ~ | 21d1 21d1 Upwards double arrow
|239|130~$\Rightarrow $~1~
|239|130~\Rightarrow ~ | 21d2 21d2 Rightwards double arrow
|239|131~$\Downarrow $~1~
|239|131~\Downarrow ~ | 21d3 21d3 Downwards double arrow
|239|132~$\Leftrightarrow $~1~
|239|132~\Leftrightarrow ~ | 21d4 21d4 Left right double arrow
|239|133~$\Updownarrow $~1~
|239|133~\Updownarrow ~ | 21d5 21d5 Up down double arrow
|239|134~$\Nwarrow $~1~
|239|134~\Nwarrow ~ | 21d6 21d6 North west double arrow
|239|135~$\Nearrow $~1~
|239|135~\Nearrow ~ | 21d7 21d7 North east double arrow
|239|136~$\Searrow $~1~
|239|136~\Searrow ~ | 21d8 21d8 South east double arrow
|239|137~$\Swarrow $~1~
|239|137~\Swarrow ~ | 21d9 21d9 South west double arrow
|239|138~$\Lleftarrow $~1~
|239|138~\Lleftarrow ~ | 21da 21da Leftwards triple arrow
|239|139~$\Rrightarrow $~1~
|239|139~\Rrightarrow ~ | 21db 21db Rightwards triple arrow
|239|140~$\leftsquigarrow $~1~
|239|140~\leftsquigarrow ~ | 21dc 21dc Leftwards squiggle arrow
|239|141~$\rightsquigarrow $~1~
|239|141~\rightsquigarrow ~ | 21dd 21dd Rightwards squiggle arrow
|239|142~*u21de*~ | 21de 21de Upwards arrow with double stroke
|239|143~*u21df*~ | 21df 21df Downwards arrow with double stroke
|239|144~$\dashleftarrow $~1~
|239|144~\dashleftarrow ~ | 21e0 21e0 Leftwards dashed arrow
|239|145~*u21e1*~ | 21e1 21e1 Upwards dashed arrow
|239|146~$\dashrightarrow $~1~
|239|146~\dashrightarrow ~ | 21e2 21e2 Rightwards dashed arrow
|239|147~*u21e3*~ | 21e3 21e3 Downwards dashed arrow
|239|148~$\LeftArrowBar $~1~
|239|148~\LeftArrowBar ~ | 21e4 21e4 Leftwards arrow to bar
|239|149~$\RightArrowBar $~1~
|239|149~\RightArrowBar ~ | 21e5 21e5 Rightwards arrow to bar
|239|150~*u21e6*~ | 21e6 21e6 Leftwards white arrow
|239|151~*u21e7*~ | 21e7 21e7 Upwards white arrow
|239|152~*u21e8*~ | 21e8 21e8 Rightwards white arrow
|239|153~*u21e9*~ | 21e9 21e9 Downwards white arrow
|239|154~*u21ea*~ | 21ea 21ea Upwards white arrow from bar
|2400~$\forall $~1~
|2400~\forall ~ | 2200 2200 For all
|2401~$\complement $~1~
|2401~\complement ~ | 2201 2201 Complement
|2402~$\partialup $~1~
|2402~\partialup ~ | 2202 2202 Partial differential
|2403~$\exists $~1~
|2403~\exists ~ | 2203 2203 There exists
|2404~$\nexists $~1~
|2404~\nexists ~ | 2204 2204 There does not exist
|2405~$\varnothing $~1~
|2405~\varnothing ~ | 2205 2205 Empty set
|2406~*u2206*~ | 2206 2206 Increment
|2407~$\nabla $~1~
|2407~\nabla ~ | 2207 2207 Nabla
|2408~$\in $~1~
|2408~\in ~ | 2208 2208 Element of
|2409~$\notin $~1~
|2409~\notin ~ | 2209 2209 Not an element of
|240:~*u220a*~ | 220a 220a Small element of*
|240;~$\ni $~1~
|240;~\ni ~ | 220b 220b Contains as member
|240<~$\nni $~1~
|240<~\nni ~ | 220c 220c Does not contain as member
|240=~*u220d*~ | 220d 220d Small contains as member*
|240>~*u220e*~ | 220e 220e End of proof
|240?~$\prod $~1~
|240?~\prod ~ | 220f 220f N-ary product
|240@~$\coprod $~1~
|240@~\coprod ~ | 2210 2210 N-ary coproduct
|240A~$\sum $~1~
|240A~\sum ~ | 2211 2211 N-ary summation
|240B~$-$~1~
|240B~-~ | 2212 2212 Minus sign
|240C~$\mp $~1~
|240C~\mp ~ | 2213 2213 Minus-or-plus sign
|240D~$\dotplus $~1~
|240D~\dotplus ~ | 2214 2214 Dot plus
|240E~$\slash $~1~
|240E~\slash ~ | 2215 2215 Division slash
|240F~$\smallsetminus $~1~
|240F~\smallsetminus ~ | 2216 2216 Set minus
|240G~$\ast $~1~
|240G~\ast ~ | 2217 2217 Asterisk operator
|240H~$\circ $~1~
|240H~\circ ~ | 2218 2218 Ring operator
|240I~$\bullet $~1~
|240I~\bullet ~ | 2219 2219 Bullet operator
|240J~$\sqrt $~1~
|240J~\sqrt ~ | 221a 221a Square root
|240K~$\sqrt[3]$~1~
|240K~\sqrt[3]~ | 221b 221b Cube root
|240L~$\sqrt[4]$~1~
|240L~\sqrt[4]~ | 221c 221c Fourth root
|240M~$\propto $~1~
|240M~\propto ~ | 221d 221d Proportional to
|240N~$\infty $~1~
|240N~\infty ~ | 221e 221e Infinity
|240O~$\rightangle $~1~
|240O~\rightangle ~ | 221f 221f Right angle
|240P~$\angle $~1~
|240P~\angle ~ | 2220 2220 Angle {angle shape}
|240Q~$\measuredangle $~1~
|240Q~\measuredangle ~ | 2221 2221 Measured angle
|240R~$\sphericalangle $~1~
|240R~\sphericalangle ~ | 2222 2222 Spherical angle
|240S~$\mid $~1~
|240S~\mid ~ | 2223 2223 Divides
|240T~$\nmid $~1~
|240T~\nmid ~ | 2224 2224 Does not divide
|240U~$\parallel $~1~
|240U~\parallel ~ | 2225 2225 Parallel to
|240V~$\nparallel $~1~
|240V~\nparallel ~ | 2226 2226 Not parallel to
|240W~$\wedge $~1~
|240W~\wedge ~ | 2227 2227 Logical and
|240X~$\vee $~1~
|240X~\vee ~ | 2228 2228 Logical or
|240Y~$\cap $~1~
|240Y~\cap ~ | 2229 2229 Intersection
|240Z~$\cup $~1~
|240Z~\cup ~ | 222a 222a Union
|240[~$\int $~1~
|240[~\int ~ | 222b 222b Integral {integral sign}
|240\~$\iint $~1~
|240\~\iint ~ | 222c 222c Double integral
|240]~$\iiint $~1~
|240]~\iiint ~ | 222d 222d Triple integral
|240^~$\oint $~1~
|240^~\oint ~ | 222e 222e Contour integral
|240_~$\oiint $~1~
|240_~\oiint ~ | 222f 222f Surface integral
|240`~$\oiiint $~1~
|240`~\oiiint ~ | 2230 2230 Volume integral
|240a~*u2231*~ | 2231 2231 Clockwise integral
|240b~$\varointclockwise $~1~
|240b~\varointclockwise ~ | 2232 2232 Clockwise contour integral
|240c~$\ointctrclockwise $~1~
|240c~\ointctrclockwise ~ | 2233 2233 Anticlockwise contour integral
|240d~$\therefore $~1~
|240d~\therefore ~ | 2234 2234 Therefore
|240e~$\because $~1~
|240e~\because ~ | 2235 2235 Because
|240f~$:$~1~
|240f~:~ | 2236 2236 Ratio
|240g~$\Proportion $~1~
|240g~\Proportion ~ | 2237 2237 Proportion
|240h~*u2238*~ | 2238 2238 Dot minus
|240i~$\eqcolon $~1~
|240i~\eqcolon ~ | 2239 2239 Excess
|240j~*u223a*~ | 223a 223a Geometric proportion
|240k~*u223b*~ | 223b 223b Homothetic
|240l~$\sim $~1~
|240l~\sim ~ | 223c 223c Tilde operator
|240m~$\backsim $~1~
|240m~\backsim ~ | 223d 223d Reversed tilde
|240n~*u223e*~ | 223e 223e Inverted lazy s
|240o~$\AC $~1~
|240o~\AC ~ | 223f 223f Sine wave
|240p~$\wr $~1~
|240p~\wr ~ | 2240 2240 Wreath product
|240q~$\nsim $~1~
|240q~\nsim ~ | 2241 2241 Not tilde
|240r~$\eqsim $~1~
|240r~\eqsim ~ | 2242 2242 Minus tilde
|240s~$\simeq $~1~
|240s~\simeq ~ | 2243 2243 Asymptotically equal to
|240t~$\nsimeq $~1~
|240t~\nsimeq ~ | 2244 2244 Not asymptotically equal to
|240u~$\cong $~1~
|240u~\cong ~ | 2245 2245 Approximately equal to
|240v~*u2246*~ | 2246 2246 Approximately but not actually equal to
|240w~$\ncong $~1~
|240w~\ncong ~ | 2247 2247 Neither approximately nor actually equal to
|240x~$\approx $~1~
|240x~\approx ~ | 2248 2248 Almost equal to
|240y~$\napprox $~1~
|240y~\napprox ~ | 2249 2249 Not almost equal to
|240z~$\approxeq $~1~
|240z~\approxeq ~ | 224a 224a Almost equal or equal to
|240{~*u224b*~ | 224b 224b Triple tilde
|240||~*u224c*~ | 224c 224c All equal to
|240}~$\asymp $~1~
|240}~\asymp ~ | 224d 224d Equivalent to
|240|~~$\Bumpeq $~1~
|240|~~\Bumpeq ~ | 224e 224e Geometrically equivalent to
|240|127~$\bumpeq $~1~
|240|127~\bumpeq ~ | 224f 224f Difference between
|240|128~$\doteq $~1~
|240|128~\doteq ~ | 2250 2250 Approaches the limit
|240|129~$\Doteq $~1~
|240|129~\Doteq ~ | 2251 2251 Geometrically equal to
|240|130~$\fallingdotseq $~1~
|240|130~\fallingdotseq ~ | 2252 2252 Approximately equal to or the image of
|240|131~$\risingdotseq $~1~
|240|131~\risingdotseq ~ | 2253 2253 Image of or approximately equal to
|240|132~$\coloneq $~1~
|240|132~\coloneq ~ | 2254 2254 Colon equals
|240|133~$\eqcolon $~1~
|240|133~\eqcolon ~ | 2255 2255 Equals colon
|240|134~$\eqcirc $~1~
|240|134~\eqcirc ~ | 2256 2256 Ring in equal to
|240|135~$\circeq $~1~
|240|135~\circeq ~ | 2257 2257 Ring equal to
|240|136~*u2258*~ | 2258 2258 Corresponds to
|240|137~$\corresponds $~1~
|240|137~\corresponds ~ | 2259 2259 Estimates
|240|138~*u225a*~ | 225a 225a Equiangular to
|240|139~*u225b*~ | 225b 225b Star equals
|240|140~$\triangleq $~1~
|240|140~\triangleq ~ | 225c 225c Delta equal to
|240|141~*u225d*~ | 225d 225d Equal to by definition
|240|142~*u225e*~ | 225e 225e Measured by
|240|143~*u225f*~ | 225f 225f Questioned equal to
|240|144~$\neq $~1~
|240|144~\neq ~ | 2260 2260 Not equal to
|240|145~$\equiv $~1~
|240|145~\equiv ~ | 2261 2261 Identical to
|240|146~$\nequiv $~1~
|240|146~\nequiv ~ | 2262 2262 Not identical to
|240|147~*u2263*~ | 2263 2263 Strictly equivalent to
|240|148~$\leq $~1~
|240|148~\leq ~ | 2264 2264 Less-than or equal to
|240|149~$\geq $~1~
|240|149~\geq ~ | 2265 2265 Greater-than or equal to
|240|150~$\leqq $~1~
|240|150~\leqq ~ | 2266 2266 Less-than over equal to
|240|151~$\geqq $~1~
|240|151~\geqq ~ | 2267 2267 Greater-than over equal to
|240|152~$\lneqq $~1~
|240|152~\lneqq ~ | 2268 2268 Less-than but not equal to
|240|153~$\gneqq $~1~
|240|153~\gneqq ~ | 2269 2269 Greater-than but not equal to
|240|154~$\ll $~1~
|240|154~\ll ~ | 226a 226a Much less-than
|240|155~$\gg $~1~
|240|155~\gg ~ | 226b 226b Much greater-than
|240,~$\between $~1~
|240,~\between ~ | 226c 226c Between
|240|157~$\notasymp $~1~
|240|157~\notasymp ~ | 226d 226d Not equivalent to
|240|158~$\nless $~1~
|240|158~\nless ~ | 226e 226e Not less-than
|240|159~$\ngtr $~1~
|240|159~\ngtr ~ | 226f 226f Not greater-than
|240|160~$\nleq $~1~
|240|160~\nleq ~ | 2270 2270 Neither less-than nor equal to
|240|161~$\ngeq $~1~
|240|161~\ngeq ~ | 2271 2271 Neither greater-than nor equal to
|240|162~$\lesssim $~1~
|240|162~\lesssim ~ | 2272 2272 Less-than or equivalent to
|240|163~$\gtrsim $~1~
|240|163~\gtrsim ~ | 2273 2273 Greater-than or equivalent to
|240|164~$\NotLessTilde $~1~
|240|164~\NotLessTilde ~ | 2274 2274 Neither less-than nor equivalent to
|240|165~$\NotGreaterTilde $~1~
|240|165~\NotGreaterTilde ~ | 2275 2275 Neither greater-than nor equivalent to
|240|166~$\lessgtr $~1~
|240|166~\lessgtr ~ | 2276 2276 Less-than or greater-than
|240|167~$\gtrless $~1~
|240|167~\gtrless ~ | 2277 2277 Greater-than or less-than
|240|168~*u2278*~ | 2278 2278 Neither less-than nor greater-than
|240|169~$\NotGreaterLess $~1~
|240|169~\NotGreaterLess ~ | 2279 2279 Neither greater-than nor less-than
|240|170~$\prec $~1~
|240|170~\prec ~ | 227a 227a Precedes
|240|171~$\succ $~1~
|240|171~\succ ~ | 227b 227b Succeeds
|240|172~$\preccurlyeq $~1~
|240|172~\preccurlyeq ~ | 227c 227c Precedes or equal to
|240|173~$\succcurlyeq $~1~
|240|173~\succcurlyeq ~ | 227d 227d Succeeds or equal to
|240|174~$\precsim $~1~
|240|174~\precsim ~ | 227e 227e Precedes or equivalent to
|240|175~$\succsim $~1~
|240|175~\succsim ~ | 227f 227f Succeeds or equivalent to
|2410~$\nprec $~1~
|2410~\nprec ~ | 2280 2280 Does not precede
|2411~$\nsucc $~1~
|2411~\nsucc ~ | 2281 2281 Does not succeed
|2412~$\subset $~1~
|2412~\subset ~ | 2282 2282 Subset of
|2413~$\supset $~1~
|2413~\supset ~ | 2283 2283 Superset of
|2414~$\nsubset $~1~
|2414~\nsubset ~ | 2284 2284 Not a subset of
|2415~$\nsupset $~1~
|2415~\nsupset ~ | 2285 2285 Not a superset of
|2416~$\subseteq $~1~
|2416~\subseteq ~ | 2286 2286 Subset of or equal to
|2417~$\supseteq $~1~
|2417~\supseteq ~ | 2287 2287 Superset of or equal to
|2418~$\nsubseteq $~1~
|2418~\nsubseteq ~ | 2288 2288 Neither a subset of nor equal to
|2419~$\nsupseteq $~1~
|2419~\nsupseteq ~ | 2289 2289 Neither a superset of nor equal to
|241:~$\subsetneq $~1~
|241:~\subsetneq ~ | 228a 228a Subset of with not equal to
|241;~$\supsetneq $~1~
|241;~\supsetneq ~ | 228b 228b Superset of with not equal to
|241<~*u228c*~ | 228c 228c Multiset
|241=~*u228d*~ | 228d 228d Multiset multiplication
|241>~$\uplus $~1~
|241>~\uplus ~ | 228e 228e Multiset union
|241?~$\sqsubset $~1~
|241?~\sqsubset ~ | 228f 228f Square image of
|241@~$\sqsupset $~1~
|241@~\sqsupset ~ | 2290 2290 Square original of
|241A~$\sqsubseteq $~1~
|241A~\sqsubseteq ~ | 2291 2291 Square image of or equal to
|241B~$\sqsupseteq $~1~
|241B~\sqsupseteq ~ | 2292 2292 Square original of or equal to
|241C~$\sqcap $~1~
|241C~\sqcap ~ | 2293 2293 Square cap
|241D~$\sqcup $~1~
|241D~\sqcup ~ | 2294 2294 Square cup
|241E~$\oplus $~1~
|241E~\oplus ~ | 2295 2295 Circled plus
|241F~$\ominus $~1~
|241F~\ominus ~ | 2296 2296 Circled minus
|241G~$\otimes $~1~
|241G~\otimes ~ | 2297 2297 Circled times
|241H~$\oslash $~1~
|241H~\oslash ~ | 2298 2298 Circled division slash
|241I~$\odot $~1~
|241I~\odot ~ | 2299 2299 Circled dot operator
|241J~$\circledcirc $~1~
|241J~\circledcirc ~ | 229a 229a Circled ring operator
|241u~$\circledast $~1~
|241u~\circledast ~ | 229b 229b Circled asterisk operator
|241L~*u229c*~ | 229c 229c Circled equals
|241M~$\circleddash $~1~
|241M~\circleddash ~ | 229d 229d Circled dash
|241N~$\boxplus $~1~
|241N~\boxplus ~ | 229e 229e Squared plus
|241O~$\boxminus $~1~
|241O~\boxminus ~ | 229f 229f Squared minus
|241P~$\boxtimes $~1~
|241P~\boxtimes ~ | 22a0 22a0 Squared times
|241Q~$\boxdot $~1~
|241Q~\boxdot ~ | 22a1 22a1 Squared dot operator
|241R~$\vdash $~1~
|241R~\vdash ~ | 22a2 22a2 Right tack
|241S~$\dashv $~1~
|241S~\dashv ~ | 22a3 22a3 Left tack
|241T~$\top $~1~
|241T~\top ~ | 22a4 22a4 Down tack
|241U~$\bot $~1~
|241U~\bot ~ | 22a5 22a5 Up tack
|241V~*u22a6*~ | 22a6 22a6 Assertion
|241W~$\models $~1~
|241W~\models ~ | 22a7 22a7 Models
|241X~$\vDash $~1~
|241X~\vDash ~ | 22a8 22a8 True
|241Y~$\Vdash $~1~
|241Y~\Vdash ~ | 22a9 22a9 Forces
|241Z~$\Vvdash $~1~
|241Z~\Vvdash ~ | 22aa 22aa Triple vertical bar right turnstile
|241[~$\VDash $~1~
|241[~\VDash ~ | 22ab 22ab Double vertical bar double right turnstile
|241\~$\nvdash $~1~
|241\~\nvdash ~ | 22ac 22ac Does not prove
|241]~$\nvDash $~1~
|241]~\nvDash ~ | 22ad 22ad Not true
|241^~$\nVdash $~1~
|241^~\nVdash ~ | 22ae 22ae Does not force
|241_~$\nVDash $~1~
|241_~\nVDash ~ | 22af 22af Negated double vertical bar double right turnstile
|241`~*u22b0*~ | 22b0 22b0 Precedes under relation
|241a~*u22b1*~ | 22b1 22b1 Succeeds under relation
|241b~$\vartriangleleft $~1~
|241b~\vartriangleleft ~ | 22b2 22b2 Normal subgroup of
|241c~$\vartriangleright $~1~
|241c~\vartriangleright ~ | 22b3 22b3 Contains as normal subgroup
|241d~$\trianglelefteq $~1~
|241d~\trianglelefteq ~ | 22b4 22b4 Normal subgroup of or equal to
|241e~$\trianglerighteq $~1~
|241e~\trianglerighteq ~ | 22b5 22b5 Contains as normal subgroup or equal to
|241f~$\multimapdotbothA $~1~
|241f~\multimapdotbothA ~ | 22b6 22b6 Original of
|241g~$\multimapdotbothB $~1~
|241g~\multimapdotbothB ~ | 22b7 22b7 Image of
|241h~$\multimap $~1~
|241h~\multimap ~ | 22b8 22b8 Multimap
|241i~*u22b9*~ | 22b9 22b9 Hermitian conjugate matrix
|241j~$\intercal $~1~
|241j~\intercal ~ | 22ba 22ba Intercalate
|241k~$\veebar $~1~
|241k~\veebar ~ | 22bb 22bb Xor
|241l~$\barwedge $~1~
|241l~\barwedge ~ | 22bc 22bc Nand
|241m~*u22bd*~ | 22bd 22bd Nor
|241n~*u22be*~ | 22be 22be Right angle with arc
|241o~*u22bf*~ | 22bf 22bf Right triangle
|241p~$\bigwedge $~1~
|241p~\bigwedge ~ | 22c0 22c0 N-ary logical and
|241q~$\bigvee $~1~
|241q~\bigvee ~ | 22c1 22c1 N-ary logical or
|241r~$\bigcap $~1~
|241r~\bigcap ~ | 22c2 22c2 N-ary intersection
|241s~$\bigcup $~1~
|241s~\bigcup ~ | 22c3 22c3 N-ary union
|241t~$\diamond $~1~
|241t~\diamond ~ | 22c4 22c4 Diamond operator
|241K~$\cdot $~1~
|241K~\cdot ~ | 22c5 22c5 Dot operator {dot multiplication, "times"}
|241v~$\star $~1~
|241v~\star ~ | 22c6 22c6 Star operator
|241w~$\divideontimes $~1~
|241w~\divideontimes ~ | 22c7 22c7 Division times
|241x~$\bowtie $~1~
|241x~\bowtie ~ | 22c8 22c8 Bowtie
|241y~$\ltimes $~1~
|241y~\ltimes ~ | 22c9 22c9 Left normal factor semidirect product
|241z~$\rtimes $~1~
|241z~\rtimes ~ | 22ca 22ca Right normal factor semidirect product
|241{~$\leftthreetimes $~1~
|241{~\leftthreetimes ~ | 22cb 22cb Left semidirect product
|241||~$\rightthreetimes $~1~
|241||~\rightthreetimes ~ | 22cc 22cc Right semidirect product
|241}~$\backsimeq $~1~
|241}~\backsimeq ~ | 22cd 22cd Reversed tilde equals
|241|~~$\curlyvee $~1~
|241|~~\curlyvee ~ | 22ce 22ce Curly logical or
|241|127~$\curlywedge $~1~
|241|127~\curlywedge ~ | 22cf 22cf Curly logical and
|241|128~$\Subset $~1~
|241|128~\Subset ~ | 22d0 22d0 Double subset
|241|129~$\Supset $~1~
|241|129~\Supset ~ | 22d1 22d1 Double superset
|241|130~$\Cap $~1~
|241|130~\Cap ~ | 22d2 22d2 Double intersection
|241|131~$\Cup $~1~
|241|131~\Cup ~ | 22d3 22d3 Double union
|241|132~$\pitchfork $~1~
|241|132~\pitchfork ~ | 22d4 22d4 Pitchfork
|241|133~$\hash $~1~
|241|133~\hash ~ | 22d5 22d5 Equal and parallel to
|241|134~$\lessdot $~1~
|241|134~\lessdot ~ | 22d6 22d6 Less-than with dot
|241|135~$\gtrdot $~1~
|241|135~\gtrdot ~ | 22d7 22d7 Greater-than with dot
|241|136~$\lll $~1~
|241|136~\lll ~ | 22d8 22d8 Very much less-than
|241|137~$\ggg $~1~
|241|137~\ggg ~ | 22d9 22d9 Very much greater-than
|241|138~$\lesseqgtr $~1~
|241|138~\lesseqgtr ~ | 22da 22da Less-than equal to or greater-than
|241|139~$\gtreqless $~1~
|241|139~\gtreqless ~ | 22db 22db Greater-than equal to or less-than
|241|140~*u22dc*~ | 22dc 22dc Equal to or less-than
|241|141~*u22dd*~ | 22dd 22dd Equal to or greater-than
|241|142~$\curlyeqprec $~1~
|241|142~\curlyeqprec ~ | 22de 22de Equal to or precedes
|241|143~$\curlyeqsucc $~1~
|241|143~\curlyeqsucc ~ | 22df 22df Equal to or succeeds
|241|144~$\npreceq $~1~
|241|144~\npreceq ~ | 22e0 22e0 Does not precede or equal
|241|145~$\nsucceq $~1~
|241|145~\nsucceq ~ | 22e1 22e1 Does not succeed or equal
|241|146~$\nsqsubseteq $~1~
|241|146~\nsqsubseteq ~ | 22e2 22e2 Not square image of or equal to
|241|147~$\nsqsupseteq $~1~
|241|147~\nsqsupseteq ~ | 22e3 22e3 Not square original of or equal to
|241|148~*u22e4*~ | 22e4 22e4 Square image of or not equal to
|241|149~*u22e5*~ | 22e5 22e5 Square original of or not equal to
|241|150~$\lnsim $~1~
|241|150~\lnsim ~ | 22e6 22e6 Less-than but not equivalent to
|241|151~$\gnsim $~1~
|241|151~\gnsim ~ | 22e7 22e7 Greater-than but not equivalent to
|241|152~$\precnsim $~1~
|241|152~\precnsim ~ | 22e8 22e8 Precedes but not equivalent to
|241|153~$\succnsim $~1~
|241|153~\succnsim ~ | 22e9 22e9 Succeeds but not equivalent to
|241|154~$\ntriangleleft $~1~
|241|154~\ntriangleleft ~ | 22ea 22ea Not normal subgroup of
|241|155~$\ntriangleright $~1~
|241|155~\ntriangleright ~ | 22eb 22eb Does not contain as normal subgroup
|241,~$\ntrianglelefteq $~1~
|241,~\ntrianglelefteq ~ | 22ec 22ec Not normal subgroup of or equal to
|241|157~$\ntrianglerighteq $~1~
|241|157~\ntrianglerighteq ~ | 22ed 22ed Does not contain as normal subgroup or equal
|241|158~$\vdots $~1~
|241|158~\vdots ~ | 22ee 22ee Vertical ellipsis
|241|159~$\cdots $~1~
|241|159~\cdots ~ | 22ef 22ef Midline horizontal ellipsis
|241|160~$\iddots $~1~
|241|160~\iddots ~ | 22f0 22f0 Up right diagonal ellipsis
|241|161~$\ddots $~1~
|241|161~\ddots ~ | 22f1 22f1 Down right diagonal ellipsis
|2420~$\diameter $~1~
|2420~\diameter ~ | 2300 2300 Diameter sign*
|2422~*u2302*~ | 2302 2302 House*
|2425~*u2305*~ | 2305 2305 Projective*
|2426~*u2306*~ | 2306 2306 Perspective*
|2428~$\lceil $~1~
|2428~\lceil ~ | 2308 2308 Left ceiling*
|2429~$\rceil $~1~
|2429~\rceil ~ | 2309 2309 Right ceiling*
|242:~$\lfloor $~1~
|242:~\lfloor ~ | 230a 230a Left floor*
|242;~$\rfloor $~1~
|242;~\rfloor ~ | 230b 230b Right floor*
|242@~$\invneg $~1~
|242@~\invneg ~ | 2310 2310 Reversed not sign*
|242A~$\wasylozenge $~1~
|242A~\wasylozenge ~ | 2311 2311 Square lozenge*
|242B~*u2312*~ | 2312 2312 Arc*
|242C~*u2313*~ | 2313 2313 Segment*
|242G~*u2317*~ | 2317 2317 Viewdata square*
|242I~*u2319*~ | 2319 2319 Turned not sign*
|242L~$\ulcorner $~1~
|242L~\ulcorner ~ | 231c 231c Top left corner*
|242M~$\urcorner $~1~
|242M~\urcorner ~ | 231d 231d Top right corner*
|242N~$\llcorner $~1~
|242N~\llcorner ~ | 231e 231e Bottom left corner*
|242O~$\lrcorner $~1~
|242O~\lrcorner ~ | 231f 231f Bottom right corner*
|242P~*u2320*~ | 2320 2320 Top half integral*
|242Q~*u2321*~ | 2321 2321 Bottom half integral*
|242R~$\frown $~1~
|242R~\frown ~ | 2322 2322 Frown*
|242S~$\smile $~1~
|242S~\smile ~ | 2323 2323 Smile*
|242\~*u232c*~ | 232c 232c Benzene ring*
|242b~*u2332*~ | 2332 2332 Conical taper*
|242f~*u2336*~ | 2336 2336 Apl functional symbol i-beam*
|242g~*u2337*~ | 2337 2337 Apl functional symbol squish quad*
|242h~*u2338*~ | 2338 2338 Apl functional symbol quad equal*
|242i~$\APLinv $~1~
|242i~\APLinv ~ | 2339 2339 Apl functional symbol quad divide*
|242j~*u233a*~ | 233a 233a Apl functional symbol quad diamond*
|242k~*u233b*~ | 233b 233b Apl functional symbol quad jot*
|242l~*u233c*~ | 233c 233c Apl functional symbol quad circle*
|242m~*u233d*~ | 233d 233d Apl functional symbol circle stile*
|242n~*u233e*~ | 233e 233e Apl functional symbol circle jot*
|242o~$\notslash $~1~
|242o~\notslash ~ | 233f 233f Apl functional symbol slash bar*
|242p~$\notbackslash $~1~
|242p~\notbackslash ~ | 2340 2340 Apl functional symbol backslash bar*
|242q~*u2341*~ | 2341 2341 Apl functional symbol quad slash*
|242r~*u2342*~ | 2342 2342 Apl functional symbol quad backslash*
|242s~*u2343*~ | 2343 2343 Apl functional symbol quad less-than*
|242t~*u2344*~ | 2344 2344 Apl functional symbol quad greater-than*
|242u~*u2345*~ | 2345 2345 Apl functional symbol leftwards vane*
|242v~*u2346*~ | 2346 2346 Apl functional symbol rightwards vane*
|242w~$\APLleftarrowbox $~1~
|242w~\APLleftarrowbox ~ | 2347 2347 Apl functional symbol quad leftwards arrow*
|242x~$\APLrightarrowbox $~1~
|242x~\APLrightarrowbox ~ | 2348 2348 Apl functional symbol quad rightwards arrow*
|242y~*u2349*~ | 2349 2349 Apl functional symbol circle backslash*
|242z~*u234a*~ | 234a 234a Apl functional symbol down tack underbar*
|242{~*u234b*~ | 234b 234b Apl functional symbol delta stile*
|242||~*u234c*~ | 234c 234c Apl functional symbol quad down caret*
|242}~*u234d*~ | 234d 234d Apl functional symbol quad delta*
|242|~~*u234e*~ | 234e 234e Apl functional symbol down tack jot*
|242|127~*u234f*~ | 234f 234f Apl functional symbol upwards vane*
|242|128~$\APLuparrowbox $~1~
|242|128~\APLuparrowbox ~ | 2350 2350 Apl functional symbol quad upwards arrow*
|242|129~*u2351*~ | 2351 2351 Apl functional symbol up tack overbar*
|242|130~*u2352*~ | 2352 2352 Apl functional symbol del stile*
|242|131~*u2353*~ | 2353 2353 Apl functional symbol quad up caret*
|242|132~*u2354*~ | 2354 2354 Apl functional symbol quad del*
|242|133~*u2355*~ | 2355 2355 Apl functional symbol up tack jot*
|242|134~*u2356*~ | 2356 2356 Apl functional symbol downwards vane*
|242|135~$\APLdownarrowbox $~1~
|242|135~\APLdownarrowbox ~ | 2357 2357 Apl functional symbol quad downwards arrow*
|242|136~*u2358*~ | 2358 2358 Apl functional symbol quote underbar*
|242|137~*u2359*~ | 2359 2359 Apl functional symbol delta underbar*
|242|138~*u235a*~ | 235a 235a Apl functional symbol diamond underbar*
|242|139~*u235b*~ | 235b 235b Apl functional symbol jot underbar*
|242|140~*u235c*~ | 235c 235c Apl functional symbol circle underbar*
|242|141~$\APLcomment $~1~
|242|141~\APLcomment ~ | 235d 235d Apl functional symbol up shoe jot*
|242|142~$\APLinput $~1~
|242|142~\APLinput ~ | 235e 235e Apl functional symbol quote quad*
|242|143~$\APLlog $~1~
|242|143~\APLlog ~ | 235f 235f Apl functional symbol circle star*
|242|144~*u2360*~ | 2360 2360 Apl functional symbol quad colon*
|242|145~*u2361*~ | 2361 2361 Apl functional symbol up tack diaeresis*
|242|146~*u2362*~ | 2362 2362 Apl functional symbol del diaeresis*
|242|147~*u2363*~ | 2363 2363 Apl functional symbol star diaeresis*
|242|148~*u2364*~ | 2364 2364 Apl functional symbol jot diaeresis*
|242|149~*u2365*~ | 2365 2365 Apl functional symbol circle diaeresis*
|242|150~*u2366*~ | 2366 2366 Apl functional symbol down shoe stile*
|242|151~*u2367*~ | 2367 2367 Apl functional symbol left shoe stile*
|242|152~*u2368*~ | 2368 2368 Apl functional symbol tilde diaeresis*
|242|153~*u2369*~ | 2369 2369 Apl functional symbol greater-than diaeresis*
|242|154~*u236a*~ | 236a 236a Apl functional symbol comma bar*
|242|155~*u236b*~ | 236b 236b Apl functional symbol del tilde*
|242,~*u236c*~ | 236c 236c Apl functional symbol zilde*
|242|157~*u236d*~ | 236d 236d Apl functional symbol stile tilde*
|242|158~*u236e*~ | 236e 236e Apl functional symbol semicolon underbar*
|242|159~*u236f*~ | 236f 236f Apl functional symbol quad not equal*
|242|160~*u2370*~ | 2370 2370 Apl functional symbol quad question*
|242|161~*u2371*~ | 2371 2371 Apl functional symbol down caret tilde*
|242|162~*u2372*~ | 2372 2372 Apl functional symbol up caret tilde*
|242|163~*u2373*~ | 2373 2373 Apl functional symbol iota*
|242|164~*u2374*~ | 2374 2374 Apl functional symbol rho*
|242|165~*u2375*~ | 2375 2375 Apl functional symbol omega*
|242|166~*u2376*~ | 2376 2376 Apl functional symbol alpha underbar*
|242|167~*u2377*~ | 2377 2377 Apl functional symbol epsilon underbar*
|242|168~*u2378*~ | 2378 2378 Apl functional symbol iota underbar*
|242|169~*u2379*~ | 2379 2379 Apl functional symbol omega underbar*
|242|170~*u237c*~ | 237a 237c Apl functional symbol alpha*
|2226~*u2506*~ | 2506 2506 Box drawings light triple dash vertical*
|2230~*u2580*~ | 2580 2580 Upper half block*
|2234~*u2584*~ | 2584 2584 Lower half block*
|2238~*u2588*~ | 2588 2588 Full block*
|223<~*u258c*~ | 258c 258c Left half block*
|223@~*u2590*~ | 2590 2590 Right half block*
|223A~*u2591*~ | 2591 2591 Light shade*
|223B~*u2592*~ | 2592 2592 Medium shade*
|223C~*u2593*~ | 2593 2593 Dark shade*
|223P~*u25a0*~ | 25a0 25a0 Black square
|223Q~*u25a1*~ | 25a1 25a1 White square
|223R~*u25a2*~ | 25a2 25a2 White square with rounded corners
|223S~*u25a3*~ | 25a3 25a3 White square containing black small square
|223T~*u25a4*~ | 25a4 25a4 Square with horizontal fill
|223U~*u25a5*~ | 25a5 25a5 Square with vertical fill
|223V~*u25a6*~ | 25a6 25a6 Square with orthogonal crosshatch fill
|223W~*u25a7*~ | 25a7 25a7 Square with upper left to lower right fill
|223X~*u25a8*~ | 25a8 25a8 Square with upper right to lower left fill
|223Y~*u25a9*~ | 25a9 25a9 Square with diagonal crosshatch fill
|223Z~*u25aa*~ | 25aa 25aa Black small square
|223[~*u25ab*~ | 25ab 25ab White small square
|223\~*u25ac*~ | 25ac 25ac Black rectangle
|223]~*u25ad*~ | 25ad 25ad White rectangle
|223^~*u25ae*~ | 25ae 25ae Black vertical rectangle
|223_~*u25af*~ | 25af 25af White vertical rectangle
|223`~*u25b0*~ | 25b0 25b0 Black parallelogram
|223a~*u25b1*~ | 25b1 25b1 White parallelogram
|223b~*u25b2*~ | 25b2 25b2 Black up-pointing triangle
|223c~$\bigtriangleup $~1~
|223c~\bigtriangleup ~ | 25b3 25b3 White up-pointing triangle {triangle shape}
|223d~$\blacktriangleup $~1~
|223d~\blacktriangleup ~ | 25b4 25b4 Black up-pointing small triangle
|223e~$\smalltriangleup $~1~
|223e~\smalltriangleup ~ | 25b5 25b5 White up-pointing small triangle
|223f~$\RHD $~1~
|223f~\RHD ~ | 25b6 25b6 Black right-pointing triangle
|223g~$\rhd $~1~
|223g~\rhd ~ | 25b7 25b7 White right-pointing triangle
|223h~$\blacktriangleright $~1~
|223h~\blacktriangleright ~ | 25b8 25b8 Black right-pointing small triangle
|223i~$\smalltriangleright $~1~
|223i~\smalltriangleright ~ | 25b9 25b9 White right-pointing small triangle
|223j~*u25ba*~ | 25ba 25ba Black right-pointing pointer
|223k~*u25bb*~ | 25bb 25bb White right-pointing pointer
|223l~*u25bc*~ | 25bc 25bc Black down-pointing triangle
|223m~$\bigtriangledown $~1~
|223m~\bigtriangledown ~ | 25bd 25bd White down-pointing triangle
|223n~$\blacktriangledown $~1~
|223n~\blacktriangledown ~ | 25be 25be Black down-pointing small triangle
|223o~$\smalltriangledown $~1~
|223o~\smalltriangledown ~ | 25bf 25bf White down-pointing small triangle
|223p~$\LHD $~1~
|223p~\LHD ~ | 25c0 25c0 Black left-pointing triangle
|223q~$\lhd $~1~
|223q~\lhd ~ | 25c1 25c1 White left-pointing triangle
|223r~$\blacktriangleleft $~1~
|223r~\blacktriangleleft ~ | 25c2 25c2 Black left-pointing small triangle
|223s~$\smalltriangleleft $~1~
|223s~\smalltriangleleft ~ | 25c3 25c3 White left-pointing small triangle
|223t~*u25c4*~ | 25c4 25c4 Black left-pointing pointer
|223u~*u25c5*~ | 25c5 25c5 White left-pointing pointer
|223v~$\Diamondblack $~1~
|223v~\Diamondblack ~ | 25c6 25c6 Black diamond
|223w~$\Diamond $~1~
|223w~\Diamond ~ | 25c7 25c7 White diamond
|223x~*u25c8*~ | 25c8 25c8 White diamond containing black small diamond
|223y~*u25c9*~ | 25c9 25c9 Fisheye
|223z~$\lozenge $~1~
|223z~\lozenge ~ | 25ca 25ca Lozenge
|223{~$\circ $~1~
|223{~\circ ~ | 25cb 25cb White circle
|223||~*u25cc*~ | 25cc 25cc Dotted circle
|223}~*u25cd*~ | 25cd 25cd Circle with vertical fill
|223|~~*u25ce*~ | 25ce 25ce Bullseye
|223|127~$\CIRCLE $~1~
|223|127~\CIRCLE ~ | 25cf 25cf Black circle
|223|128~$\LEFTcircle $~1~
|223|128~\LEFTcircle ~ | 25d0 25d0 Circle with left half black
|223|129~$\RIGHTcircle $~1~
|223|129~\RIGHTcircle ~ | 25d1 25d1 Circle with right half black
|223|130~*u25d2*~ | 25d2 25d2 Circle with lower half black
|223|131~*u25d3*~ | 25d3 25d3 Circle with upper half black
|223|132~*u25d4*~ | 25d4 25d4 Circle with upper right quadrant black
|223|133~*u25d5*~ | 25d5 25d5 Circle with all but upper left quadrant black
|223|134~$\LEFTCIRCLE $~1~
|223|134~\LEFTCIRCLE ~ | 25d6 25d6 Left half black circle
|223|135~$\RIGHTCIRCLE $~1~
|223|135~\RIGHTCIRCLE ~ | 25d7 25d7 Right half black circle
|223|136~*u25d8*~ | 25d8 25d8 Inverse bullet
|223|137~*u25d9*~ | 25d9 25d9 Inverse white circle
|223|138~*u25da*~ | 25da 25da Upper half inverse white circle
|223|139~*u25db*~ | 25db 25db Lower half inverse white circle
|223|140~*u25dc*~ | 25dc 25dc Upper left quadrant circular arc
|223|141~*u25dd*~ | 25dd 25dd Upper right quadrant circular arc
|223|142~*u25de*~ | 25de 25de Lower right quadrant circular arc
|223|143~*u25df*~ | 25df 25df Lower left quadrant circular arc
|223|144~*u25e0*~ | 25e0 25e0 Upper half circle
|223|145~*u25e1*~ | 25e1 25e1 Lower half circle
|223|146~*u25e2*~ | 25e2 25e2 Black lower right triangle
|223|147~*u25e3*~ | 25e3 25e3 Black lower left triangle
|223|148~*u25e4*~ | 25e4 25e4 Black upper left triangle
|223|149~*u25e5*~ | 25e5 25e5 Black upper right triangle
|223|150~*u25e6*~ | 25e6 25e6 White bullet
|223|151~*u25e7*~ | 25e7 25e7 Square with left half black
|223|152~*u25e8*~ | 25e8 25e8 Square with right half black
|223|153~*u25e9*~ | 25e9 25e9 Square with upper left diagonal half black
|223|154~*u25ea*~ | 25ea 25ea Square with lower right diagonal half black
|223|155~$\boxbar $~1~
|223|155~\boxbar ~ | 25eb 25eb White square with vertical bisecting line
|223,~*u25ec*~ | 25ec 25ec White up-pointing triangle with dot
|223|157~*u25ed*~ | 25ed 25ed Up-pointing triangle with left half black
|223|158~*u25ee*~ | 25ee 25ee Up-pointing triangle with right half black
|223|159~*u25ef*~ | 25ef 25ef Large circle
|216>~$\pencil $~1~
|216>~\pencil ~ | 270e 270e Lower right pencil
|216C~$\checkmark $~1~
|216C~\checkmark ~ | 2713 2713 Check mark
|216G~$\ballotx $~1~
|216G~\ballotx ~ | 2717 2717 Ballot x
|216P~$\maltese $~1~
|216P~\maltese ~ | 2720 2720 Maltese cross
|216Z~*u272a*~ | 272a 272a Circled white star
|216f~*u2736*~ | 2736 2736 Six pointed black star
|216m~*u273d*~ | 273d 273d Heavy teardrop-spoked asterisk
|216|162~*u2772*~ | 2772 2772 Light left tortoise shell bracket ornament
|216|163~*u2773*~ | 2773 2773 Light right tortoise shell bracket ornament
|217K~*u279b*~ | 279b 279b Drafting point rightwards arrow
|217R~$\arrowbullet $~1~
|217R~\arrowbullet ~ | 27a2 27a2 Three-d top-lighted rightwards arrowhead
|217p~*u27c0*~ | 27c0 27c0 Three dimensional angle
|217q~*u27c1*~ | 27c1 27c1 White triangle containing small white triangle
|217r|227h~$\not\perp $~1~ | U+27c2 perpendicular + 0338 combining long solidus = not perpendicular 2020-11-16 (ex2009)
|217r|227h~\not\perp ~
|217r~$\perp $~1~
|217r~\perp ~ | 27c2 27c2 Perpendicular
|217s~*u27c3*~ | 27c3 27c3 Open subset
|217t~*u27c4*~ | 27c4 27c4 Open superset
|217u~$\Lbag $~1~
|217u~\Lbag ~ | 27c5 27c5 Left s-shaped bag delimiter
|217v~$\Rbag $~1~
|217v~\Rbag ~ | 27c6 27c6 Right s-shaped bag delimiter
|217w~*u27c7*~ | 27c7 27c7 Or with dot inside
|217x~*u27c8*~ | 27c8 27c8 Reverse solidus preceding subset
|217y~*u27c9*~ | 27c9 27c9 Superset preceding solidus
|217||~*u27cc*~ | 27cc 27cc Long division
|217|128~$\Diamonddot $~1~
|217|128~\Diamonddot ~ | 27d0 27d0 White diamond with centred dot
|217|129~*u27d1*~ | 27d1 27d1 And with dot
|217|130~*u27d2*~ | 27d2 27d2 Element of opening upwards
|217|131~*u27d3*~ | 27d3 27d3 Lower right corner with dot
|217|132~*u27d4*~ | 27d4 27d4 Upper left corner with dot
|217|133~*u27d5*~ | 27d5 27d5 Left outer join
|217|134~*u27d6*~ | 27d6 27d6 Right outer join
|217|135~*u27d7*~ | 27d7 27d7 Full outer join
|217|136~*u27d8*~ | 27d8 27d8 Large up tack
|217|137~*u27d9*~ | 27d9 27d9 Large down tack
|217|138~*u27da*~ | 27da 27da Left and right double turnstile
|217|139~*u27db*~ | 27db 27db Left and right tack
|217|140~$\multimapinv $~1~
|217|140~\multimapinv ~ | 27dc 27dc Left multimap
|217|141~*u27dd*~ | 27dd 27dd Long right tack
|217|142~*u27de*~ | 27de 27de Long left tack
|217|143~*u27df*~ | 27df 27df Up tack with circle above
|217|144~*u27e0*~ | 27e0 27e0 Lozenge divided by horizontal rule
|217|145~*u27e1*~ | 27e1 27e1 White concave-sided diamond
|217|146~*u27e2*~ | 27e2 27e2 White concave-sided diamond with leftwards tick
|217|147~*u27e3*~ | 27e3 27e3 White concave-sided diamond with rightwards tick
|217|148~*u27e4*~ | 27e4 27e4 White square with leftwards tick
|217|149~*u27e5*~ | 27e5 27e5 White square with rightwards tick
|217|150~$\llbracket $~1~
|217|150~\llbracket ~ | 27e6 27e6 Mathematical left white square bracket
|217|151~$\rrbracket $~1~
|217|151~\rrbracket ~ | 27e7 27e7 Mathematical right white square bracket
|217|152~$\langle $~1~
|217|152~\langle ~ | 27e8 27e8 Mathematical left angle bracket
|217|153~$\rangle $~1~
|217|153~\rangle ~ | 27e9 27e9 Mathematical right angle bracket
|217|154~$\lang $~1~
|217|154~\lang ~ | 27ea 27ea Mathematical left double angle bracket
|217|155~$\rang $~1~
|217|155~\rang ~ | 27eb 27eb Mathematical right double angle bracket
|217,~*u27ec*~ | 27ec 27ec Mathematical left white tortoise shell bracket
|217|157~*u27ed*~ | 27ed 27ed Mathematical right white tortoise shell bracket
|217|158~$\lgroup $~1~
|217|158~\lgroup ~ | 27ee 27ee Mathematical left flattened parenthesis
|217|159~$\rgroup $~1~
|217|159~\rgroup ~ | 27ef 27ef Mathematical right flattened parenthesis
|217|160~*u27f0*~ | 27f0 27f0 Upwards quadruple arrow
|217|161~*u27f1*~ | 27f1 27f1 Downwards quadruple arrow
|217|162~*u27f2*~ | 27f2 27f2 Anticlockwise gapped circle arrow
|217|163~*u27f3*~ | 27f3 27f3 Clockwise gapped circle arrow
|217|164~*u27f4*~ | 27f4 27f4 Right arrow with circled plus
|217|165~$\longleftarrow $~1~
|217|165~\longleftarrow ~ | 27f5 27f5 Long leftwards arrow
|217|166~$\longrightarrow $~1~
|217|166~\longrightarrow ~ | 27f6 27f6 Long rightwards arrow
|217|167~$\longleftrightarrow $~1~
|217|167~\longleftrightarrow ~ | 27f7 27f7 Long left right arrow
|217|168~$\Longleftarrow $~1~
|217|168~\Longleftarrow ~ | 27f8 27f8 Long leftwards double arrow
|217|169~$\Longrightarrow $~1~
|217|169~\Longrightarrow ~ | 27f9 27f9 Long rightwards double arrow
|217|170~$\Longleftrightarrow $~1~
|217|170~\Longleftrightarrow ~ | 27fa 27fa Long left right double arrow
|217|171~$\longmapsfrom $~1~
|217|171~\longmapsfrom ~ | 27fb 27fb Long leftwards arrow from bar
|217|172~$\longmapsto $~1~
|217|172~\longmapsto ~ | 27fc 27fc Long rightwards arrow from bar
|217|173~$\Longmapsfrom $~1~
|217|173~\Longmapsfrom ~ | 27fd 27fd Long leftwards double arrow from bar
|217|174~$\Longmapsto $~1~
|217|174~\Longmapsto ~ | 27fe 27fe Long rightwards double arrow from bar
|217|175~*u27ff*~ | 27ff 27ff Long rightwards squiggle arrow
|2180~$\psur $~1~
|2180~\psur ~ | 2900 2900 Rightwards two-headed arrow with vertical stroke
|2181~*u2901*~ | 2901 2901 Rightwards two-headed arrow with double vertical stroke
|2182~*u2902*~ | 2902 2902 Leftwards double arrow with vertical stroke
|2183~*u2903*~ | 2903 2903 Rightwards double arrow with vertical stroke
|2184~*u2904*~ | 2904 2904 Left right double arrow with vertical stroke
|2185~*u2905*~ | 2905 2905 Rightwards two-headed arrow from bar
|2186~$\Mapsfrom $~1~
|2186~\Mapsfrom ~ | 2906 2906 Leftwards double arrow from bar
|2187~$\Mapsto $~1~
|2187~\Mapsto ~ | 2907 2907 Rightwards double arrow from bar
|2188~*u2908*~ | 2908 2908 Downwards arrow with horizontal stroke
|2189~*u2909*~ | 2909 2909 Upwards arrow with horizontal stroke
|218:~*u290a*~ | 290a 290a Upwards triple arrow
|218;~*u290b*~ | 290b 290b Downwards triple arrow
|218<~*u290c*~ | 290c 290c Leftwards double dash arrow
|218=~*u290d*~ | 290d 290d Rightwards double dash arrow
|218>~*u290e*~ | 290e 290e Leftwards triple dash arrow
|218?~*u290f*~ | 290f 290f Rightwards triple dash arrow
|218@~*u2910*~ | 2910 2910 Rightwards two-headed triple dash arrow
|218A~*u2911*~ | 2911 2911 Rightwards arrow with dotted stem
|218B~$\UpArrowBar $~1~
|218B~\UpArrowBar ~ | 2912 2912 Upwards arrow to bar
|218C~$\DownArrowBar $~1~
|218C~\DownArrowBar ~ | 2913 2913 Downwards arrow to bar
|218D~$\pinj $~1~
|218D~\pinj ~ | 2914 2914 Rightwards arrow with tail with vertical stroke
|218E~$\finj $~1~
|218E~\finj ~ | 2915 2915 Rightwards arrow with tail with double vertical stroke
|218F~$\bij $~1~
|218F~\bij ~ | 2916 2916 Rightwards two-headed arrow with tail
|218G~*u2917*~ | 2917 2917 Rightwards two-headed arrow with tail with vertical stroke
|218H~*u2918*~ | 2918 2918 Rightwards two-headed arrow with tail with double vertical stroke
|218I~*u2919*~ | 2919 2919 Leftwards arrow-tail
|218J~*u291a*~ | 291a 291a Rightwards arrow-tail
|218K~*u291b*~ | 291b 291b Leftwards double arrow-tail
|218L~*u291c*~ | 291c 291c Rightwards double arrow-tail
|218M~*u291d*~ | 291d 291d Leftwards arrow to black diamond
|218N~*u291e*~ | 291e 291e Rightwards arrow to black diamond
|218O~*u291f*~ | 291f 291f Leftwards arrow from bar to black diamond
|218P~*u2920*~ | 2920 2920 Rightwards arrow from bar to black diamond
|218Q~*u2921*~ | 2921 2921 North west and south east arrow
|218R~*u2922*~ | 2922 2922 North east and south west arrow
|218S~*u2923*~ | 2923 2923 North west arrow with hook
|218T~*u2924*~ | 2924 2924 North east arrow with hook
|218U~*u2925*~ | 2925 2925 South east arrow with hook
|218V~*u2926*~ | 2926 2926 South west arrow with hook
|218W~*u2927*~ | 2927 2927 North west arrow and north east arrow
|218X~*u2928*~ | 2928 2928 North east arrow and south east arrow
|218Y~*u2929*~ | 2929 2929 South east arrow and south west arrow
|218Z~*u292a*~ | 292a 292a South west arrow and north west arrow
|218[~*u292b*~ | 292b 292b Rising diagonal crossing falling diagonal
|218\~*u292c*~ | 292c 292c Falling diagonal crossing rising diagonal
|218]~*u292d*~ | 292d 292d South east arrow crossing north east arrow
|218^~*u292e*~ | 292e 292e North east arrow crossing south east arrow
|218_~*u292f*~ | 292f 292f Falling diagonal crossing north east arrow
|218`~*u2930*~ | 2930 2930 Rising diagonal crossing south east arrow
|218a~*u2931*~ | 2931 2931 North east arrow crossing north west arrow
|218b~*u2932*~ | 2932 2932 North west arrow crossing north east arrow
|218c~$\leadsto $~1~
|218c~\leadsto ~ | 2933 2933 Wave arrow pointing directly right
|218d~*u2934*~ | 2934 2934 Arrow pointing rightwards then curving upwards
|218e~*u2935*~ | 2935 2935 Arrow pointing rightwards then curving downwards
|218f~*u2936*~ | 2936 2936 Arrow pointing downwards then curving leftwards
|218g~*u2937*~ | 2937 2937 Arrow pointing downwards then curving rightwards
|218h~*u2938*~ | 2938 2938 Right-side arc clockwise arrow
|218i~*u2939*~ | 2939 2939 Left-side arc anticlockwise arrow
|218j~*u293a*~ | 293a 293a Top arc anticlockwise arrow
|218k~*u293b*~ | 293b 293b Bottom arc anticlockwise arrow
|218l~*u293c*~ | 293c 293c Top arc clockwise arrow with minus
|218m~*u293d*~ | 293d 293d Top arc anticlockwise arrow with plus
|218n~*u293e*~ | 293e 293e Lower right semicircular clockwise arrow
|218o~*u293f*~ | 293f 293f Lower left semicircular anticlockwise arrow
|218p~*u2940*~ | 2940 2940 Anticlockwise closed circle arrow
|218q~*u2941*~ | 2941 2941 Clockwise closed circle arrow
|218r~*u2942*~ | 2942 2942 Rightwards arrow above short leftwards arrow
|218s~*u2943*~ | 2943 2943 Leftwards arrow above short rightwards arrow
|218t~*u2944*~ | 2944 2944 Short rightwards arrow above leftwards arrow
|218u~*u2945*~ | 2945 2945 Rightwards arrow with plus below
|218v~*u2946*~ | 2946 2946 Leftwards arrow with plus below
|218w~*u2947*~ | 2947 2947 Rightwards arrow through x
|218x~*u2948*~ | 2948 2948 Left right arrow through small circle
|218y~*u2949*~ | 2949 2949 Upwards two-headed arrow from small circle
|218z~$\leftrightharpoon $~1~
|218z~\leftrightharpoon ~ | 294a 294a Left barb up right barb down harpoon
|218{~$\rightleftharpoon $~1~
|218{~\rightleftharpoon ~ | 294b 294b Left barb down right barb up harpoon
|218||~*u294c*~ | 294c 294c Up barb right down barb left harpoon
|218}~*u294d*~ | 294d 294d Up barb left down barb right harpoon
|218|~~$\leftrightharpoonup $~1~
|218|~~\leftrightharpoonup ~ | 294e 294e Left barb up right barb up harpoon
|218|127~$\rightupdownharpoon $~1~
|218|127~\rightupdownharpoon ~ | 294f 294f Up barb right down barb right harpoon
|218|128~$\leftrightharpoondown $~1~
|218|128~\leftrightharpoondown ~ | 2950 2950 Left barb down right barb down harpoon
|218|129~$\leftupdownharpoon $~1~
|218|129~\leftupdownharpoon ~ | 2951 2951 Up barb left down barb left harpoon
|218|130~$\LeftVectorBar $~1~
|218|130~\LeftVectorBar ~ | 2952 2952 Leftwards harpoon with barb up to bar
|218|131~$\RightVectorBar $~1~
|218|131~\RightVectorBar ~ | 2953 2953 Rightwards harpoon with barb up to bar
|218|132~$\RightUpVectorBar $~1~
|218|132~\RightUpVectorBar ~ | 2954 2954 Upwards harpoon with barb right to bar
|218|133~$\RightDownVectorBar $~1~
|218|133~\RightDownVectorBar ~ | 2955 2955 Downwards harpoon with barb right to bar
|218|134~$\DownLeftVectorBar $~1~
|218|134~\DownLeftVectorBar ~ | 2956 2956 Leftwards harpoon with barb down to bar
|218|135~$\DownRightVectorBar $~1~
|218|135~\DownRightVectorBar ~ | 2957 2957 Rightwards harpoon with barb down to bar
|218|136~$\LeftUpVectorBar $~1~
|218|136~\LeftUpVectorBar ~ | 2958 2958 Upwards harpoon with barb left to bar
|218|137~$\LeftDownVectorBar $~1~
|218|137~\LeftDownVectorBar ~ | 2959 2959 Downwards harpoon with barb left to bar
|218|138~$\LeftTeeVector $~1~
|218|138~\LeftTeeVector ~ | 295a 295a Leftwards harpoon with barb up from bar
|218|139~$\RightTeeVector $~1~
|218|139~\RightTeeVector ~ | 295b 295b Rightwards harpoon with barb up from bar
|218|140~$\RightUpTeeVector $~1~
|218|140~\RightUpTeeVector ~ | 295c 295c Upwards harpoon with barb right from bar
|218|141~$\RightDownTeeVector $~1~
|218|141~\RightDownTeeVector ~ | 295d 295d Downwards harpoon with barb right from bar
|218|142~$\DownLeftTeeVector $~1~
|218|142~\DownLeftTeeVector ~ | 295e 295e Leftwards harpoon with barb down from bar
|218|143~$\DownRightTeeVector $~1~
|218|143~\DownRightTeeVector ~ | 295f 295f Rightwards harpoon with barb down from bar
|218|144~$\LeftUpTeeVector $~1~
|218|144~\LeftUpTeeVector ~ | 2960 2960 Upwards harpoon with barb left from bar
|218|145~$\LeftDownTeeVector $~1~
|218|145~\LeftDownTeeVector ~ | 2961 2961 Downwards harpoon with barb left from bar
|218|146~$\leftleftharpoons $~1~
|218|146~\leftleftharpoons ~ | 2962 2962 Leftwards harpoon with barb up above leftwards harpoon with barb down
|218|147~$\upupharpoons $~1~
|218|147~\upupharpoons ~ | 2963 2963 Upwards harpoon with barb left beside upwards harpoon with barb right
|218|148~$\rightrightharpoons $~1~
|218|148~\rightrightharpoons ~ | 2964 2964 Rightwards harpoon with barb up above rightwards harpoon with barb down
|218|149~$\downdownharpoons $~1~
|218|149~\downdownharpoons ~ | 2965 2965 Downwards harpoon with barb left beside downwards harpoon with barb right
|218|150~*u2966*~ | 2966 2966 Leftwards harpoon with barb up above rightwards harpoon with barb up
|218|151~*u2967*~ | 2967 2967 Leftwards harpoon with barb down above rightwards harpoon with barb down
|218|152~*u2968*~ | 2968 2968 Rightwards harpoon with barb up above leftwards harpoon with barb up
|218|153~*u2969*~ | 2969 2969 Rightwards harpoon with barb down above leftwards harpoon with barb down
|218|154~$\leftbarharpoon $~1~
|218|154~\leftbarharpoon ~ | 296a 296a Leftwards harpoon with barb up above long dash
|218|155~$\barleftharpoon $~1~
|218|155~\barleftharpoon ~ | 296b 296b Leftwards harpoon with barb down below long dash
|218,~$\rightbarharpoon $~1~
|218,~\rightbarharpoon ~ | 296c 296c Rightwards harpoon with barb up above long dash
|218|157~$\barrightharpoon $~1~
|218|157~\barrightharpoon ~ | 296d 296d Rightwards harpoon with barb down below long dash
|218|158~$\updownharpoons $~1~
|218|158~\updownharpoons ~ | 296e 296e Upwards harpoon with barb left beside downwards harpoon with barb right
|218|159~$\downupharpoons $~1~
|218|159~\downupharpoons ~ | 296f 296f Downwards harpoon with barb left beside upwards harpoon with barb right
|218|160~*u2970*~ | 2970 2970 Right double arrow with rounded head
|218|161~*u2971*~ | 2971 2971 Equals sign above rightwards arrow
|218|162~*u2972*~ | 2972 2972 Tilde operator above rightwards arrow
|218|163~*u2973*~ | 2973 2973 Leftwards arrow above tilde operator
|218|164~*u2974*~ | 2974 2974 Rightwards arrow above tilde operator
|218|165~*u2975*~ | 2975 2975 Rightwards arrow above almost equal to
|218|166~*u2976*~ | 2976 2976 Less-than above leftwards arrow
|218|167~*u2977*~ | 2977 2977 Leftwards arrow through less-than
|218|168~*u2978*~ | 2978 2978 Greater-than above rightwards arrow
|218|169~*u2979*~ | 2979 2979 Subset above rightwards arrow
|218|170~*u297a*~ | 297a 297a Leftwards arrow through subset
|218|171~*u297b*~ | 297b 297b Superset above leftwards arrow
|218|172~$\strictfi $~1~
|218|172~\strictfi ~ | 297c 297c Left fish tail
|218|173~$\strictif $~1~
|218|173~\strictif ~ | 297d 297d Right fish tail
|218|174~*u297e*~ | 297e 297e Up fish tail
|218|175~*u297f*~ | 297f 297f Down fish tail
|2190~$\VERT $~1~
|2190~\VERT ~ | 2980 2980 Triple vertical bar delimiter
|2191~$\spot $~1~
|2191~\spot ~ | 2981 2981 Z notation spot
|2192~*u2982*~ | 2982 2982 Z notation type colon
|2193~*u2983*~ | 2983 2983 Left white curly bracket
|2194~*u2984*~ | 2984 2984 Right white curly bracket
|2195~$\Lparen $~1~
|2195~\Lparen ~ | 2985 2985 Left white parenthesis
|2196~$\Rparen $~1~
|2196~\Rparen ~ | 2986 2986 Right white parenthesis
|2197~$\limg $~1~
|2197~\limg ~ | 2987 2987 Z notation left image bracket
|2198~$\rimg $~1~
|2198~\rimg ~ | 2988 2988 Z notation right image bracket
|2199~$\lblot $~1~
|2199~\lblot ~ | 2989 2989 Z notation left binding bracket
|219:~$\rblot $~1~
|219:~\rblot ~ | 298a 298a Z notation right binding bracket
|219;~*u298b*~ | 298b 298b Left square bracket with underbar
|219<~*u298c*~ | 298c 298c Right square bracket with underbar
|219=~*u298d*~ | 298d 298d Left square bracket with tick in top corner
|219>~*u298e*~ | 298e 298e Right square bracket with tick in bottom corner
|219?~*u298f*~ | 298f 298f Left square bracket with tick in bottom corner
|219@~*u2990*~ | 2990 2990 Right square bracket with tick in top corner
|219A~*u2991*~ | 2991 2991 Left angle bracket with dot
|219B~*u2992*~ | 2992 2992 Right angle bracket with dot
|219C~*u2993*~ | 2993 2993 Left arc less-than bracket
|219D~*u2994*~ | 2994 2994 Right arc greater-than bracket
|219E~*u2995*~ | 2995 2995 Double left arc greater-than bracket
|219F~*u2996*~ | 2996 2996 Double right arc less-than bracket
|219G~*u2997*~ | 2997 2997 Left black tortoise shell bracket
|219H~*u2998*~ | 2998 2998 Right black tortoise shell bracket
|219I~*u2999*~ | 2999 2999 Dotted fence
|219J~*u299a*~ | 299a 299a Vertical zigzag line
|219K~*u299b*~ | 299b 299b Measured angle opening left
|219L~*u299c*~ | 299c 299c Right angle variant with square
|219M~*u299d*~ | 299d 299d Measured right angle with dot
|219N~*u299e*~ | 299e 299e Angle with s inside
|219O~*u299f*~ | 299f 299f Acute angle
|219P~*u29a0*~ | 29a0 29a0 Spherical angle opening left
|219Q~*u29a1*~ | 29a1 29a1 Spherical angle opening up
|219R~*u29a2*~ | 29a2 29a2 Turned angle
|219S~*u29a3*~ | 29a3 29a3 Reversed angle
|219T~*u29a4*~ | 29a4 29a4 Angle with underbar
|219U~*u29a5*~ | 29a5 29a5 Reversed angle with underbar
|219V~*u29a6*~ | 29a6 29a6 Oblique angle opening up
|219W~*u29a7*~ | 29a7 29a7 Oblique angle opening down
|219X~*u29a8*~ | 29a8 29a8 Measured angle with open arm ending in arrow pointing up and right
|219Y~*u29a9*~ | 29a9 29a9 Measured angle with open arm ending in arrow pointing up and left
|219Z~*u29aa*~ | 29aa 29aa Measured angle with open arm ending in arrow pointing down and right
|219[~*u29ab*~ | 29ab 29ab Measured angle with open arm ending in arrow pointing down and left
|219\~*u29ac*~ | 29ac 29ac Measured angle with open arm ending in arrow pointing right and up
|219]~*u29ad*~ | 29ad 29ad Measured angle with open arm ending in arrow pointing left and up
|219^~*u29ae*~ | 29ae 29ae Measured angle with open arm ending in arrow pointing right and down
|219_~*u29af*~ | 29af 29af Measured angle with open arm ending in arrow pointing left and down
|219`~*u29b0*~ | 29b0 29b0 Reversed empty set
|219a~*u29b1*~ | 29b1 29b1 Empty set with overbar
|219b~*u29b2*~ | 29b2 29b2 Empty set with small circle above
|219c~*u29b3*~ | 29b3 29b3 Empty set with right arrow above
|219d~*u29b4*~ | 29b4 29b4 Empty set with left arrow above
|219e~*u29b5*~ | 29b5 29b5 Circle with horizontal bar
|219f~*u29b6*~ | 29b6 29b6 Circled vertical bar
|219g~*u29b7*~ | 29b7 29b7 Circled parallel
|219h~$\circledbslash $~1~
|219h~\circledbslash ~ | 29b8 29b8 Circled reverse solidus
|219i~*u29b9*~ | 29b9 29b9 Circled perpendicular
|219j~*u29ba*~ | 29ba 29ba Circle divided by horizontal bar and top half divided by vertical bar
|219k~*u29bb*~ | 29bb 29bb Circle with superimposed x
|219l~*u29bc*~ | 29bc 29bc Circled anticlockwise-rotated division sign
|219m~*u29bd*~ | 29bd 29bd Up arrow through circle
|219n~*u29be*~ | 29be 29be Circled white bullet
|219o~*u29bf*~ | 29bf 29bf Circled bullet
|219p~$\circledless $~1~
|219p~\circledless ~ | 29c0 29c0 Circled less-than
|219q~$\circledgtr $~1~
|219q~\circledgtr ~ | 29c1 29c1 Circled greater-than
|219r~*u29c2*~ | 29c2 29c2 Circle with small circle to the right
|219s~*u29c3*~ | 29c3 29c3 Circle with two horizontal strokes to the right
|219t~$\boxslash $~1~
|219t~\boxslash ~ | 29c4 29c4 Squared rising diagonal slash
|219u~$\boxbslash $~1~
|219u~\boxbslash ~ | 29c5 29c5 Squared falling diagonal slash
|219v~$\boxast $~1~
|219v~\boxast ~ | 29c6 29c6 Squared asterisk
|219w~$\boxcircle $~1~
|219w~\boxcircle ~ | 29c7 29c7 Squared small circle
|219x~$\boxbox $~1~
|219x~\boxbox ~ | 29c8 29c8 Squared square
|219y~*u29c9*~ | 29c9 29c9 Two joined squares
|219z~*u29ca*~ | 29ca 29ca Triangle with dot above
|219{~*u29cb*~ | 29cb 29cb Triangle with underbar
|219||~*u29cc*~ | 29cc 29cc S in triangle
|219}~*u29cd*~ | 29cd 29cd Triangle with serifs at bottom
|219|~~*u29ce*~ | 29ce 29ce Right triangle above left triangle
|219|127~$\LeftTriangleBar $~1~
|219|127~\LeftTriangleBar ~ | 29cf 29cf Left triangle beside vertical bar
|219|128~$\RightTriangleBar $~1~
|219|128~\RightTriangleBar ~ | 29d0 29d0 Vertical bar beside right triangle
|219|129~*u29d1*~ | 29d1 29d1 Bowtie with left half black
|219|130~*u29d2*~ | 29d2 29d2 Bowtie with right half black
|219|131~*u29d3*~ | 29d3 29d3 Black bowtie
|219|132~*u29d4*~ | 29d4 29d4 Times with left half black
|219|133~*u29d5*~ | 29d5 29d5 Times with right half black
|219|134~*u29d6*~ | 29d6 29d6 White hourglass
|219|135~*u29d7*~ | 29d7 29d7 Black hourglass
|219|136~*u29d8*~ | 29d8 29d8 Left wiggly fence
|219|137~*u29d9*~ | 29d9 29d9 Right wiggly fence
|219|138~*u29da*~ | 29da 29da Left double wiggly fence
|219|139~*u29db*~ | 29db 29db Right double wiggly fence
|219|140~*u29dc*~ | 29dc 29dc Incomplete infinity
|219|141~*u29dd*~ | 29dd 29dd Tie over infinity
|219|142~*u29de*~ | 29de 29de Infinity negated with vertical bar
|219|143~$\multimapboth $~1~
|219|143~\multimapboth ~ | 29df 29df Double-ended multimap
|219|144~*u29e0*~ | 29e0 29e0 Square with contoured outline
|219|145~*u29e1*~ | 29e1 29e1 Increases as
|219|146~*u29e2*~ | 29e2 29e2 Shuffle product
|219|147~*u29e3*~ | 29e3 29e3 Equals sign and slanted parallel
|219|148~*u29e4*~ | 29e4 29e4 Equals sign and slanted parallel with tilde above
|219|149~*u29e5*~ | 29e5 29e5 Identical to and slanted parallel
|219|150~*u29e6*~ | 29e6 29e6 Gleich stark
|219|151~*u29e7*~ | 29e7 29e7 Thermodynamic
|219|152~*u29e8*~ | 29e8 29e8 Down-pointing triangle with left half black
|219|153~*u29e9*~ | 29e9 29e9 Down-pointing triangle with right half black
|219|154~*u29ea*~ | 29ea 29ea Black diamond with down arrow
|219|155~$\blacklozenge $~1~
|219|155~\blacklozenge ~ | 29eb 29eb Black lozenge
|219,~*u29ec*~ | 29ec 29ec White circle with down arrow
|219|157~*u29ed*~ | 29ed 29ed Black circle with down arrow
|219|158~*u29ee*~ | 29ee 29ee Error-barred white square
|219|159~*u29ef*~ | 29ef 29ef Error-barred black square
|219|160~*u29f0*~ | 29f0 29f0 Error-barred white diamond
|219|161~*u29f1*~ | 29f1 29f1 Error-barred black diamond
|219|162~*u29f2*~ | 29f2 29f2 Error-barred white circle
|219|163~*u29f3*~ | 29f3 29f3 Error-barred black circle
|219|164~*u29f4*~ | 29f4 29f4 Rule-delayed
|219|165~$\setminus $~1~
|219|165~\setminus ~ | 29f5 29f5 Reverse solidus operator
|219|166~*u29f6*~ | 29f6 29f6 Solidus with overbar
|219|167~*u29f7*~ | 29f7 29f7 Reverse solidus with horizontal stroke
|219|168~*u29f8*~ | 29f8 29f8 Big solidus
|219|169~$\zhide $~1~
|219|169~\zhide ~ | 29f9 29f9 Big reverse solidus
|219|170~*u29fa*~ | 29fa 29fa Double plus
|219|171~*u29fb*~ | 29fb 29fb Triple plus
|219|172~*u29fc*~ | 29fc 29fc Left-pointing curved angle bracket
|219|173~*u29fd*~ | 29fd 29fd Right-pointing curved angle bracket
|219|174~*u29fe*~ | 29fe 29fe Tiny
|219|175~*u29ff*~ | 29ff 29ff Miny
|2200~$\bigodot $~1~
|2200~\bigodot ~ | 2a00 2a00 N-ary circled dot operator
|2201~$\bigoplus $~1~
|2201~\bigoplus ~ | 2a01 2a01 N-ary circled plus operator
|2202~$\bigotimes $~1~
|2202~\bigotimes ~ | 2a02 2a02 N-ary circled times operator
|2203~*u2a03*~ | 2a03 2a03 N-ary union operator with dot
|2204~$\biguplus $~1~
|2204~\biguplus ~ | 2a04 2a04 N-ary union operator with plus
|2205~$\bigsqcap $~1~
|2205~\bigsqcap ~ | 2a05 2a05 N-ary square intersection operator
|2206~$\bigsqcup $~1~
|2206~\bigsqcup ~ | 2a06 2a06 N-ary square union operator
|2207~*u2a07*~ | 2a07 2a07 Two logical and operator
|2208~*u2a08*~ | 2a08 2a08 Two logical or operator
|2209~$\varprod $~1~
|2209~\varprod ~ | 2a09 2a09 N-ary times operator
|220:~*u2a0a*~ | 2a0a 2a0a Modulo two sum
|220;~*u2a0b*~ | 2a0b 2a0b Summation with integral
|220<~$\iiiint $~1~
|220<~\iiiint ~ | 2a0c 2a0c Quadruple integral operator
|220=~*u2a0d*~ | 2a0d 2a0d Finite part integral
|220>~*u2a0e*~ | 2a0e 2a0e Integral with double stroke
|220?~$\fint $~1~
|220?~\fint ~ | 2a0f 2a0f Integral average with slash
|220@~*u2a10*~ | 2a10 2a10 Circulation function
|220A~*u2a11*~ | 2a11 2a11 Anticlockwise integration
|220B~*u2a12*~ | 2a12 2a12 Line integration with rectangular path around pole
|220C~*u2a13*~ | 2a13 2a13 Line integration with semicircular path around pole
|220D~*u2a14*~ | 2a14 2a14 Line integration not including the pole
|220E~*u2a15*~ | 2a15 2a15 Integral around a point operator
|220F~$\sqint $~1~
|220F~\sqint ~ | 2a16 2a16 Quaternion integral operator
|220G~*u2a17*~ | 2a17 2a17 Integral with leftwards arrow with hook
|220H~*u2a18*~ | 2a18 2a18 Integral with times sign
|220I~*u2a19*~ | 2a19 2a19 Integral with intersection
|220J~*u2a1a*~ | 2a1a 2a1a Integral with union
|220K~*u2a1b*~ | 2a1b 2a1b Integral with overbar
|220L~*u2a1c*~ | 2a1c 2a1c Integral with underbar
|220M~$\Join $~1~
|220M~\Join ~ | 2a1d 2a1d Join
|220N~*u2a1e*~ | 2a1e 2a1e Large left triangle operator
|220O~$\zcmp $~1~
|220O~\zcmp ~ | 2a1f 2a1f Z notation schema composition
|220P~$\zpipe $~1~
|220P~\zpipe ~ | 2a20 2a20 Z notation schema piping
|220Q~$\zproject $~1~
|220Q~\zproject ~ | 2a21 2a21 Z notation schema projection
|220R~*u2a22*~ | 2a22 2a22 Plus sign with small circle above
|220S~*u2a23*~ | 2a23 2a23 Plus sign with circumflex accent above
|220T~*u2a24*~ | 2a24 2a24 Plus sign with tilde above
|220U~*u2a25*~ | 2a25 2a25 Plus sign with dot below
|220V~*u2a26*~ | 2a26 2a26 Plus sign with tilde below
|220W~*u2a27*~ | 2a27 2a27 Plus sign with subscript two
|220X~*u2a28*~ | 2a28 2a28 Plus sign with black triangle
|220Y~*u2a29*~ | 2a29 2a29 Minus sign with comma above
|220Z~*u2a2a*~ | 2a2a 2a2a Minus sign with dot below
|220[~*u2a2b*~ | 2a2b 2a2b Minus sign with falling dots
|220\~*u2a2c*~ | 2a2c 2a2c Minus sign with rising dots
|220]~*u2a2d*~ | 2a2d 2a2d Plus sign in left half circle
|220^~*u2a2e*~ | 2a2e 2a2e Plus sign in right half circle
|220_~*u2a2f*~ | 2a2f 2a2f Vector or cross product
|220`~*u2a30*~ | 2a30 2a30 Multiplication sign with dot above
|220a~*u2a31*~ | 2a31 2a31 Multiplication sign with underbar
|220b~*u2a32*~ | 2a32 2a32 Semidirect product with bottom closed
|220c~*u2a33*~ | 2a33 2a33 Smash product
|220d~*u2a34*~ | 2a34 2a34 Multiplication sign in left half circle
|220e~*u2a35*~ | 2a35 2a35 Multiplication sign in right half circle
|220f~*u2a36*~ | 2a36 2a36 Circled multiplication sign with circumflex accent
|220g~*u2a37*~ | 2a37 2a37 Multiplication sign in double circle
|220h~*u2a38*~ | 2a38 2a38 Circled division sign
|220i~*u2a39*~ | 2a39 2a39 Plus sign in triangle
|220j~*u2a3a*~ | 2a3a 2a3a Minus sign in triangle
|220k~*u2a3b*~ | 2a3b 2a3b Multiplication sign in triangle
|220l~*u2a3c*~ | 2a3c 2a3c Interior product
|220m~*u2a3d*~ | 2a3d 2a3d Righthand interior product
|220n~$\fcmp $~1~
|220n~\fcmp ~ | 2a3e 2a3e Z notation relational composition
|220o~$\amalg $~1~
|220o~\amalg ~ | 2a3f 2a3f Amalgamation or coproduct
|220p~*u2a40*~ | 2a40 2a40 Intersection with dot
|220q~*u2a41*~ | 2a41 2a41 Union with minus sign
|220r~*u2a42*~ | 2a42 2a42 Union with overbar
|220s~*u2a43*~ | 2a43 2a43 Intersection with overbar
|220t~*u2a44*~ | 2a44 2a44 Intersection with logical and
|220u~*u2a45*~ | 2a45 2a45 Union with logical or
|220v~*u2a46*~ | 2a46 2a46 Union above intersection
|220w~*u2a47*~ | 2a47 2a47 Intersection above union
|220x~*u2a48*~ | 2a48 2a48 Union above bar above intersection
|220y~*u2a49*~ | 2a49 2a49 Intersection above bar above union
|220z~*u2a4a*~ | 2a4a 2a4a Union beside and joined with union
|220{~*u2a4b*~ | 2a4b 2a4b Intersection beside and joined with intersection
|220||~*u2a4c*~ | 2a4c 2a4c Closed union with serifs
|220}~*u2a4d*~ | 2a4d 2a4d Closed intersection with serifs
|220|~~*u2a4e*~ | 2a4e 2a4e Double square intersection
|220|127~*u2a4f*~ | 2a4f 2a4f Double square union
|220|128~*u2a50*~ | 2a50 2a50 Closed union with serifs and smash product
|220|129~*u2a51*~ | 2a51 2a51 Logical and with dot above
|220|130~*u2a52*~ | 2a52 2a52 Logical or with dot above
|220|131~*u2a53*~ | 2a53 2a53 Double logical and
|220|132~*u2a54*~ | 2a54 2a54 Double logical or
|220|133~*u2a55*~ | 2a55 2a55 Two intersecting logical and
|220|134~*u2a56*~ | 2a56 2a56 Two intersecting logical or
|220|135~*u2a57*~ | 2a57 2a57 Sloping large or
|220|136~*u2a58*~ | 2a58 2a58 Sloping large and
|220|137~*u2a59*~ | 2a59 2a59 Logical or overlapping logical and
|220|138~*u2a5a*~ | 2a5a 2a5a Logical and with middle stem
|220|139~*u2a5b*~ | 2a5b 2a5b Logical or with middle stem
|220|140~*u2a5c*~ | 2a5c 2a5c Logical and with horizontal dash
|220|141~*u2a5d*~ | 2a5d 2a5d Logical or with horizontal dash
|220|142~$\doublebarwedge $~1~
|220|142~\doublebarwedge ~ | 2a5e 2a5e Logical and with double overbar
|220|143~*u2a5f*~ | 2a5f 2a5f Logical and with underbar
|220|144~*u2a60*~ | 2a60 2a60 Logical and with double underbar
|220|145~*u2a61*~ | 2a61 2a61 Small vee with underbar
|220|146~*u2a62*~ | 2a62 2a62 Logical or with double overbar
|220|147~*u2a63*~ | 2a63 2a63 Logical or with double underbar
|220|148~$\dsub $~1~
|220|148~\dsub ~ | 2a64 2a64 Z notation domain antirestriction
|220|149~$\rsub $~1~
|220|149~\rsub ~ | 2a65 2a65 Z notation range antirestriction
|220|150~*u2a66*~ | 2a66 2a66 Equals sign with dot below
|220|151~*u2a67*~ | 2a67 2a67 Identical with dot above
|220|152~*u2a68*~ | 2a68 2a68 Triple horizontal bar with double vertical stroke
|220|153~*u2a69*~ | 2a69 2a69 Triple horizontal bar with triple vertical stroke
|220|154~*u2a6a*~ | 2a6a 2a6a Tilde operator with dot above
|220|155~*u2a6b*~ | 2a6b 2a6b Tilde operator with rising dots
|220,~*u2a6c*~ | 2a6c 2a6c Similar minus similar
|220|157~*u2a6d*~ | 2a6d 2a6d Congruent with dot above
|220|158~*u2a6e*~ | 2a6e 2a6e Equals with asterisk
|220|159~*u2a6f*~ | 2a6f 2a6f Almost equal to with circumflex accent
|220|160~*u2a70*~ | 2a70 2a70 Approximately equal or equal to
|220|161~*u2a71*~ | 2a71 2a71 Equals sign above plus sign
|220|162~*u2a72*~ | 2a72 2a72 Plus sign above equals sign
|220|163~*u2a73*~ | 2a73 2a73 Equals sign above tilde operator
|220|164~$\Coloneqq $~1~
|220|164~\Coloneqq ~ | 2a74 2a74 Double colon equal
|220|165~$\Equal $~1~
|220|165~\Equal ~ | 2a75 2a75 Two consecutive equals signs
|220|166~$\Same $~1~
|220|166~\Same ~ | 2a76 2a76 Three consecutive equals signs
|220|167~*u2a77*~ | 2a77 2a77 Equals sign with two dots above and two dots below
|220|168~*u2a78*~ | 2a78 2a78 Equivalent with four dots above
|220|169~*u2a79*~ | 2a79 2a79 Less-than with circle inside
|220|170~*u2a7a*~ | 2a7a 2a7a Greater-than with circle inside
|220|171~*u2a7b*~ | 2a7b 2a7b Less-than with question mark above
|220|172~*u2a7c*~ | 2a7c 2a7c Greater-than with question mark above
|220|173~$\leqslant $~1~
|220|173~\leqslant ~ | 2a7d 2a7d Less-than or slanted equal to
|220|174~$\geqslant $~1~
|220|174~\geqslant ~ | 2a7e 2a7e Greater-than or slanted equal to
|220|175~*u2a7f*~ | 2a7f 2a7f Less-than or slanted equal to with dot inside
|2210~*u2a80*~ | 2a80 2a80 Greater-than or slanted equal to with dot inside
|2211~*u2a81*~ | 2a81 2a81 Less-than or slanted equal to with dot above
|2212~*u2a82*~ | 2a82 2a82 Greater-than or slanted equal to with dot above
|2213~*u2a83*~ | 2a83 2a83 Less-than or slanted equal to with dot above right
|2214~*u2a84*~ | 2a84 2a84 Greater-than or slanted equal to with dot above left
|2215~$\lessapprox $~1~
|2215~\lessapprox ~ | 2a85 2a85 Less-than or approximate
|2216~$\gtrapprox $~1~
|2216~\gtrapprox ~ | 2a86 2a86 Greater-than or approximate
|2217~$\lneq $~1~
|2217~\lneq ~ | 2a87 2a87 Less-than and single-line not equal to
|2218~$\gneq $~1~
|2218~\gneq ~ | 2a88 2a88 Greater-than and single-line not equal to
|2219~$\lnapprox $~1~
|2219~\lnapprox ~ | 2a89 2a89 Less-than and not approximate
|221:~$\gnapprox $~1~
|221:~\gnapprox ~ | 2a8a 2a8a Greater-than and not approximate
|221;~$\lesseqqgtr $~1~
|221;~\lesseqqgtr ~ | 2a8b 2a8b Less-than above double-line equal above greater-than
|221<~$\gtreqqless $~1~
|221<~\gtreqqless ~ | 2a8c 2a8c Greater-than above double-line equal above less-than
|221=~*u2a8d*~ | 2a8d 2a8d Less-than above similar or equal
|221>~*u2a8e*~ | 2a8e 2a8e Greater-than above similar or equal
|221?~*u2a8f*~ | 2a8f 2a8f Less-than above similar above greater-than
|221@~*u2a90*~ | 2a90 2a90 Greater-than above similar above less-than
|221A~*u2a91*~ | 2a91 2a91 Less-than above greater-than above double-line equal
|221B~*u2a92*~ | 2a92 2a92 Greater-than above less-than above double-line equal
|221C~*u2a93*~ | 2a93 2a93 Less-than above slanted equal above greater-than above slanted equal
|221D~*u2a94*~ | 2a94 2a94 Greater-than above slanted equal above less-than above slanted equal
|221E~$\eqslantless $~1~
|221E~\eqslantless ~ | 2a95 2a95 Slanted equal to or less-than
|221F~$\eqslantgtr $~1~
|221F~\eqslantgtr ~ | 2a96 2a96 Slanted equal to or greater-than
|221G~*u2a97*~ | 2a97 2a97 Slanted equal to or less-than with dot inside
|221H~*u2a98*~ | 2a98 2a98 Slanted equal to or greater-than with dot inside
|221I~*u2a99*~ | 2a99 2a99 Double-line equal to or less-than
|221J~*u2a9a*~ | 2a9a 2a9a Double-line equal to or greater-than
|221K~*u2a9b*~ | 2a9b 2a9b Double-line slanted equal to or less-than
|221L~*u2a9c*~ | 2a9c 2a9c Double-line slanted equal to or greater-than
|221M~*u2a9d*~ | 2a9d 2a9d Similar or less-than
|221N~*u2a9e*~ | 2a9e 2a9e Similar or greater-than
|221O~*u2a9f*~ | 2a9f 2a9f Similar above less-than above equals sign
|221P~*u2aa0*~ | 2aa0 2aa0 Similar above greater-than above equals sign
|221Q~$\NestedLessLess $~1~
|221Q~\NestedLessLess ~ | 2aa1 2aa1 Double nested less-than
|221R~$\NestedGreaterGreater $~1~
|221R~\NestedGreaterGreater ~ | 2aa2 2aa2 Double nested greater-than
|221S~*u2aa3*~ | 2aa3 2aa3 Double nested less-than with underbar
|221T~*u2aa4*~ | 2aa4 2aa4 Greater-than overlapping less-than
|221U~*u2aa5*~ | 2aa5 2aa5 Greater-than beside less-than
|221V~$\leftslice $~1~
|221V~\leftslice ~ | 2aa6 2aa6 Less-than closed by curve
|221W~$\rightslice $~1~
|221W~\rightslice ~ | 2aa7 2aa7 Greater-than closed by curve
|221X~*u2aa8*~ | 2aa8 2aa8 Less-than closed by curve above slanted equal
|221Y~*u2aa9*~ | 2aa9 2aa9 Greater-than closed by curve above slanted equal
|221Z~*u2aaa*~ | 2aaa 2aaa Smaller than
|221[~*u2aab*~ | 2aab 2aab Larger than
|221\~*u2aac*~ | 2aac 2aac Smaller than or equal to
|221]~*u2aad*~ | 2aad 2aad Larger than or equal to
|221^~*u2aae*~ | 2aae 2aae Equals sign with bumpy above
|221_~$\preceq $~1~
|221_~\preceq ~ | 2aaf 2aaf Precedes above single-line equals sign
|221`~$\succeq $~1~
|221`~\succeq ~ | 2ab0 2ab0 Succeeds above single-line equals sign
|221a~*u2ab1*~ | 2ab1 2ab1 Precedes above single-line not equal to
|221b~*u2ab2*~ | 2ab2 2ab2 Succeeds above single-line not equal to
|221c~$\preceqq $~1~
|221c~\preceqq ~ | 2ab3 2ab3 Precedes above equals sign
|221d~$\succeqq $~1~
|221d~\succeqq ~ | 2ab4 2ab4 Succeeds above equals sign
|221e~*u2ab5*~ | 2ab5 2ab5 Precedes above not equal to
|221f~*u2ab6*~ | 2ab6 2ab6 Succeeds above not equal to
|221g~$\precapprox $~1~
|221g~\precapprox ~ | 2ab7 2ab7 Precedes above almost equal to
|221h~$\succapprox $~1~
|221h~\succapprox ~ | 2ab8 2ab8 Succeeds above almost equal to
|221i~$\precnapprox $~1~
|221i~\precnapprox ~ | 2ab9 2ab9 Precedes above not almost equal to
|221j~$\succnapprox $~1~
|221j~\succnapprox ~ | 2aba 2aba Succeeds above not almost equal to
|221k~$\llcurly $~1~
|221k~\llcurly ~ | 2abb 2abb Double precedes
|221l~$\ggcurly $~1~
|221l~\ggcurly ~ | 2abc 2abc Double succeeds
|221m~*u2abd*~ | 2abd 2abd Subset with dot
|221n~*u2abe*~ | 2abe 2abe Superset with dot
|221o~*u2abf*~ | 2abf 2abf Subset with plus sign below
|221p~*u2ac0*~ | 2ac0 2ac0 Superset with plus sign below
|221q~*u2ac1*~ | 2ac1 2ac1 Subset with multiplication sign below
|221r~*u2ac2*~ | 2ac2 2ac2 Superset with multiplication sign below
|221s~*u2ac3*~ | 2ac3 2ac3 Subset of or equal to with dot above
|221t~*u2ac4*~ | 2ac4 2ac4 Superset of or equal to with dot above
|221u~$\subseteqq $~1~
|221u~\subseteqq ~ | 2ac5 2ac5 Subset of above equals sign
|221v~$\supseteqq $~1~
|221v~\supseteqq ~ | 2ac6 2ac6 Superset of above equals sign
|221w~*u2ac7*~ | 2ac7 2ac7 Subset of above tilde operator
|221x~*u2ac8*~ | 2ac8 2ac8 Superset of above tilde operator
|221y~*u2ac9*~ | 2ac9 2ac9 Subset of above almost equal to
|221z~*u2aca*~ | 2aca 2aca Superset of above almost equal to
|221{~$\subsetneqq $~1~
|221{~\subsetneqq ~ | 2acb 2acb Subset of above not equal to
|221||~$\supsetneqq $~1~
|221||~\supsetneqq ~ | 2acc 2acc Superset of above not equal to
|221}~*u2acd*~ | 2acd 2acd Square left open box operator
|221|~~*u2ace*~ | 2ace 2ace Square right open box operator
|221|127~*u2acf*~ | 2acf 2acf Closed subset
|221|128~*u2ad0*~ | 2ad0 2ad0 Closed superset
|221|129~*u2ad1*~ | 2ad1 2ad1 Closed subset or equal to
|221|130~*u2ad2*~ | 2ad2 2ad2 Closed superset or equal to
|221|131~*u2ad3*~ | 2ad3 2ad3 Subset above superset
|221|132~*u2ad4*~ | 2ad4 2ad4 Superset above subset
|221|133~*u2ad5*~ | 2ad5 2ad5 Subset above subset
|221|134~*u2ad6*~ | 2ad6 2ad6 Superset above superset
|221|135~*u2ad7*~ | 2ad7 2ad7 Superset beside subset
|221|136~*u2ad8*~ | 2ad8 2ad8 Superset beside and joined by dash with subset
|221|137~*u2ad9*~ | 2ad9 2ad9 Element of opening downwards
|221|138~*u2ada*~ | 2ada 2ada Pitchfork with tee top
|221|139~*u2adb*~ | 2adb 2adb Transversal intersection
|221|140~*u2adc*~ | 2adc 2adc Forking
|221|141~*u2add*~ | 2add 2add Nonforking
|221|142~*u2ade*~ | 2ade 2ade Short left tack
|221|143~*u2adf*~ | 2adf 2adf Short down tack
|221|144~*u2ae0*~ | 2ae0 2ae0 Short up tack
|221|145~*u2ae1*~ | 2ae1 2ae1 Perpendicular with s
|221|146~*u2ae2*~ | 2ae2 2ae2 Vertical bar triple right turnstile
|221|147~*u2ae3*~ | 2ae3 2ae3 Double vertical bar left turnstile
|221|148~*u2ae4*~ | 2ae4 2ae4 Vertical bar double left turnstile
|221|149~*u2ae5*~ | 2ae5 2ae5 Double vertical bar double left turnstile
|221|150~*u2ae6*~ | 2ae6 2ae6 Long dash from left member of double vertical
|221|151~*u2ae7*~ | 2ae7 2ae7 Short down tack with overbar
|221|152~*u2ae8*~ | 2ae8 2ae8 Short up tack with underbar
|221|153~*u2ae9*~ | 2ae9 2ae9 Short up tack above short down tack
|221|154~$\Top $~1~
|221|154~\Top ~ | 2aea 2aea Double down tack
|221|155~$\Bot $~1~
|221|155~\Bot ~ | 2aeb 2aeb Double up tack
|221,~*u2aec*~ | 2aec 2aec Double stroke not sign
|221|157~*u2aed*~ | 2aed 2aed Reversed double stroke not sign
|221|158~*u2aee*~ | 2aee 2aee Does not divide with reversed negation slash
|221|159~*u2aef*~ | 2aef 2aef Vertical line with circle above
|221|160~*u2af0*~ | 2af0 2af0 Vertical line with circle below
|221|161~*u2af1*~ | 2af1 2af1 Down tack with circle below
|221|162~*u2af2*~ | 2af2 2af2 Parallel with horizontal stroke
|221|163~*u2af3*~ | 2af3 2af3 Parallel with tilde operator
|221|164~$\interleave $~1~
|221|164~\interleave ~ | 2af4 2af4 Triple vertical bar binary relation
|221|165~*u2af5*~ | 2af5 2af5 Triple vertical bar with horizontal stroke
|221|166~*u2af6*~ | 2af6 2af6 Triple colon operator
|221|167~*u2af7*~ | 2af7 2af7 Triple nested less-than
|221|168~*u2af8*~ | 2af8 2af8 Triple nested greater-than
|221|169~*u2af9*~ | 2af9 2af9 Double-line slanted less-than or equal to
|221|170~*u2afa*~ | 2afa 2afa Double-line slanted greater-than or equal to
|221|171~*u2afb*~ | 2afb 2afb Triple solidus binary relation
|221|172~$\biginterleave $~1~
|221|172~\biginterleave ~ | 2afc 2afc Large triple vertical bar operator
|221|173~$\sslash $~1~
|221|173~\sslash ~ | 2afd 2afd Double solidus operator
|221|174~$\talloblong $~1~
|221|174~\talloblong ~ | 2afe 2afe White vertical bar
|221|175~*u2aff*~ | 2aff 2aff N-ary white vertical bar
|2328~*u3008*~ | 3008 3008 Left angle bracket
|2329~*u3009*~ | 3009 3009 Right angle bracket
|232B~*u3012*~ | 3012 3012 Postal mark
|232D~*u3014*~ | 3014 3014 Left tortoise shell bracket
|232E~*u3015*~ | 3015 3015 Right tortoise shell bracket
|232H~*u3018*~ | 3018 3018 Left white tortoise shell bracket
|232I~*u3019*~ | 3019 3019 Right white tortoise shell bracket
|232J~*u301a*~ | 301a 301a Left white square bracket
|232K~*u301b*~ | 301b 301b Right white square bracket
|232`~*u3030*~ | 3030 3030 Wavy dash
|232|158~*u306e*~ | 306e 306e Hiragana letter no
| marked [e~...] rules added 2020-11-15/16 ff.:
|028e|~overrightarrow[|031~$\overrightarrow{~1~2~ | {2020-11-15}
|028e|~overrightarrow[|031~\overrightarrow{~ | {2020-11-15}
|028e|~underline[|031~$\underline{~1~2~ | {2020-11-16}
|028e|~underline[|031~\underline{~ | {2020-11-16}
|028e|~dot[|031~$\dot{~1~2~ | {2020-11-16}
|028e|~dot[|031~\dot{~ | {2020-11-16}
|028e|~overline[|031~$\overline{~1~2~ | {2020-11-16}
|028e|~overline[|031~\overline{~ | {2020-11-16}
|028e|~overleftarrow[|031~$\overleftarrow{~1~2~ | {2020-12-01}
|028e|~overleftarrow[|031~\overleftarrow{~ | {2020-12-01}
|028e|~overleftrightarrow[|031~$\overleftrightarrow{~1~2~ | {2020-12-01}
|028e|~overleftrightarrow[|031~\overleftrightarrow{~ | {2020-12-01}
|028e|~underleftarrow[|031~$\underleftarrow{~1~2~ | {2020-12-01}
|028e|~underleftarrow[|031~\underleftarrow{~ | {2020-12-01}
|028e|~underleftrightarrow[|031~$\underleftrightarrow{~1~2~ | {2020-12-01}
|028e|~underleftrightarrow[|031~\underleftrightarrow{~ | {2020-12-01}
|028e|~underrightarrow[|031~$\underrightarrow{~1~2~ | {2020-12-01}
|028e|~underrightarrow[|031~\underrightarrow{~ | {2020-12-01}
|028e|~widehat[|031~$\widehat{~1~2~ | {2020-12-01}
|028e|~widehat[|031~\widehat{~ | {2020-12-01}
|028e|~wideparen[|031~$\wideparen{~1~2~ | {2020-12-01}
|028e|~wideparen[|031~\wideparen{~ | {2020-12-01}
|028e|~overset[|242B][|031~$\overset{*u2312*}{~1~2~
|028e|~overset[|242B][|031~\overset{*u2312*}{~~
|028e|~underset[|242B][|031~$\underset{*u2312*}{~1~2~
|028e|~underset[|242B][|031~\underset{*u2312*}{~~
|028e|~widetilde[|031~$\widetilde{~1~2~ | {2020-12-01}
|028e|~widetilde[|031~\widetilde{~ | {2020-12-01}
| [bolim], [bulim] added 2020-11-16
| [lim] and [limits] added 2024-04-18
|028limits|031~\limits~
|028to|031~\to~
|028lim|031~$\lim~1~2~
|028lim|031~\lim~
|028bolim|031~$\overline{lim}~1~2~
|028bolim|031~\overline{lim}~
|028bulim|031~$\underline{lim}~1~2~
|028bulim|031~\underline{lim}~
|028sum|031~$\sum~1~2~
|028sum|031~\sum~
|028coprod|031~$\coprod~1~2~
|028coprod|031~\coprod~
|028int|031~$\int~1~2~
|028int|031~\int~
|028bigwedge|031~$\bigwedge~1~2~
|028bigwedge|031~\bigwedge~
|028bigvee|031~$\bigvee~1~2~
|028bigvee|031~\bigvee~
|028bigcap|031~$\bigcap~1~2~
|028bigcap|031~\bigcap~
|028bigcupdot|031~$\bigcupdot~1~2~
|028bigcupdot|031~\bigcupdot~
|028bigcapdot|031~$\bigcapdot~1~2~
|028bigcapdot|031~\bigcapdot~
|028bigsqcap|031~$\bigsqcap~1~2~
|028bigsqcap|031~\bigsqcap~
|028bigsqcup|031~$\bigsqcup~1~2~
|028bigsqcup|031~\bigsqcup~
| space after common functions need not be forced (added 2020-11-16):
arc ~arc ~
arc|013|010~arc|013|010~
arc|010~arc|010~
arg ~arg ~
arg|013|010~arg|013|010~
arg|010~arg|010~
cos ~cos ~
cos|013|010~cos|013|010~
cos|010~cos|010~
cosh ~cosh ~
cosh|013|010~cosh|013|010~
cosh|010~cosh|010~
cot ~cot ~
cot|013|010~cot|013|010~
cot|010~cot|010~
coth ~coth ~
coth|013|010~coth|013|010~
coth|010~coth|010~
csc ~csc ~
csc|013|010~csc|013|010~
csc|010~csc|010~
csch ~csch ~
csch|013|010~csch|013|010~
csch|010~csch|010~
deg ~deg ~
deg|013|010~deg|013|010~
deg|010~deg|010~
det ~det ~
det|013|010~det|013|010~
det|010~det|010~
dim ~dim ~
dim|013|010~dim|013|010~
dim|010~dim|010~
exp ~exp ~
exp|013|010~exp|013|010~
exp|010~exp|010~
gcd ~gcd ~
gcd|013|010~gcd|013|010~
gcd|010~gcd|010~
hom ~hom ~
hom|013|010~hom|013|010~
hom|010~hom|010~
inf ~inf ~
inf|013|010~inf|013|010~
inf|010~inf|010~
ker ~ker ~
ker|013|010~ker|013|010~
ker|010~ker|010~
lg ~lg ~
lg|013|010~lg|013|010~
lg|010~lg|010~
lim ~lim ~
lim|013|010~lim|013|010~
lim|010~lim|010~
ln ~ln ~
ln|013|010~ln|013|010~
ln|010~ln|010~
log ~log ~
log|013|010~log|013|010~
log|010~log|010~
max ~max ~
max|013|010~max|013|010~
max|010~max|010~
min ~min ~
min|013|010~min|013|010~
min|010~min|010~
Pr ~Pr ~
Pr|013|010~Pr|013|010~
Pr|010~Pr|010~
sec ~sec ~
sec|013|010~sec|013|010~
sec|010~sec|010~
sech ~sech ~
sech|013|010~sech|013|010~
sech|010~sech|010~
sin ~sin ~
sin|013|010~sin|013|010~
sin|010~sin|010~
sinh ~sinh ~
sinh|013|010~sinh|013|010~
sinh|010~sinh|010~
sup ~sup ~
sup|013|010~sup|013|010~
sup|010~sup|010~
tan ~tan ~
tan|013|010~tan|013|010~
tan|010~tan|010~
tanh ~tanh ~
tanh|013|010~tanh|013|010~
tanh|010~tanh|010~
| Following are for cases where [bar] is used without a preceding [e]
|226A|028bar|031~$\overline{*u0391*}$~1~ | 0391 0391 Greek capital letter alpha
|226A|028bar|031~\overline{*u0391*}~
|226B|028bar|031~$\overline{*u0392*}$~1~ | 0392 0392 Greek capital letter beta
|226B|028bar|031~\overline{*u0392*}~
|226C|028bar|031~$\overline{\Gamma }$~1~ | 0393 0393 Greek capital letter gamma
|226C|028bar|031~\overline{\Gamma }~
|226D|028bar|031~$\overline{\Delta }$~1~ | 0394 0394 Greek capital letter delta
|226D|028bar|031~\overline{\Delta }~
|226E|028bar|031~$\overline{*u0395*}$~1~ | 0395 0395 Greek capital letter epsilon
|226E|028bar|031~\overline{*u0395*}~
|226F|028bar|031~$\overline{*u0396*}$~1~ | 0396 0396 Greek capital letter zeta
|226F|028bar|031~\overline{*u0396*}~
|226G|028bar|031~$\overline{*u0397*}$~1~ | 0397 0397 Greek capital letter eta
|226G|028bar|031~\overline{*u0397*}~
|226H|028bar|031~$\overline{\Theta }$~1~ | 0398 0398 Greek capital letter theta
|226H|028bar|031~\overline{\Theta }~
|226I|028bar|031~$\overline{*u0399*}$~1~ | 0399 0399 Greek capital letter iota
|226I|028bar|031~\overline{*u0399*}~
|226J|028bar|031~$\overline{*u039a*}$~1~ | 039a 039a Greek capital letter kappa
|226J|028bar|031~\overline{*u039a*}~
|226K|028bar|031~$\overline{\Lambda }$~1~ | 039b 039b Greek capital letter lamda
|226K|028bar|031~\overline{\Lambda }~
|226L|028bar|031~$\overline{*u039c*}$~1~ | 039c 039c Greek capital letter mu
|226L|028bar|031~\overline{*u039c*}~
|226M|028bar|031~$\overline{*u039d*}$~1~ | 039d 039d Greek capital letter nu
|226M|028bar|031~\overline{*u039d*}~
|226N|028bar|031~$\overline{\Xi }$~1~ | 039e 039e Greek capital letter xi
|226N|028bar|031~\overline{\Xi }~
|226O|028bar|031~$\overline{*u039f*}$~1~ | 039f 039f Greek capital letter omicron
|226O|028bar|031~\overline{*u039f*}~
|226P|028bar|031~$\overline{\Pi }$~1~ | 03a0 03a0 Greek capital letter pi
|226P|028bar|031~\overline{\Pi }~
|226Q|028bar|031~$\overline{*u03a1*}$~1~ | 03a1 03a1 Greek capital letter rho
|226Q|028bar|031~\overline{*u03a1*}~
|226S|028bar|031~$\overline{\Sigma }$~1~ | 03a3 03a3 Greek capital letter sigma
|226S|028bar|031~\overline{\Sigma }~
|226T|028bar|031~$\overline{*u03a4*}$~1~ | 03a4 03a4 Greek capital letter tau
|226T|028bar|031~\overline{*u03a4*}~
|226U|028bar|031~$\overline{\Upsilon }$~1~ | 03a5 03a5 Greek capital letter upsilon
|226U|028bar|031~\overline{\Upsilon }~
|226V|028bar|031~$\overline{\Phi }$~1~ | 03a6 03a6 Greek capital letter phi
|226V|028bar|031~\overline{\Phi }~
|226W|028bar|031~$\overline{*u03a7*}$~1~ | 03a7 03a7 Greek capital letter chi
|226W|028bar|031~\overline{*u03a7*}~
|226X|028bar|031~$\overline{\Psi }$~1~ | 03a8 03a8 Greek capital letter psi
|226X|028bar|031~\overline{\Psi }~
|226Y|028bar|031~$\overline{\Omega }$~1~ | 03a9 03a9 Greek capital letter omega
|226Y|028bar|031~\overline{\Omega }~
|226a|028bar|031~$\overline{\alpha }$~1~ | 03b1 03b1 Greek small letter alpha
|226a|028bar|031~\overline{\alpha }~
|226b|028bar|031~$\overline{\beta }$~1~ | 03b2 03b2 Greek small letter beta
|226b|028bar|031~\overline{\beta }~
|226c|028bar|031~$\overline{\gamma }$~1~ | 03b3 03b3 Greek small letter gamma
|226c|028bar|031~\overline{\gamma }~
|226d|028bar|031~$\overline{\delta }$~1~ | 03b4 03b4 Greek small letter delta
|226d|028bar|031~\overline{\delta }~
|226e|028bar|031~$\overline{\varepsilon }$~1~ | 03b5 03b5 Greek small letter epsilon
|226e|028bar|031~\overline{\varepsilon }~
|226f|028bar|031~$\overline{\zeta }$~1~ | 03b6 03b6 Greek small letter zeta
|226f|028bar|031~\overline{\zeta }~
|226g|028bar|031~$\overline{\eta }$~1~ | 03b7 03b7 Greek small letter eta
|226g|028bar|031~\overline{\eta }~
|226h|028bar|031~$\overline{\theta }$~1~ | 03b8 03b8 Greek small letter theta
|226h|028bar|031~\overline{\theta }~
|226i|028bar|031~$\overline{\iota }$~1~ | 03b9 03b9 Greek small letter iota
|226i|028bar|031~\overline{\iota }~
|226j|028bar|031~$\overline{\kappa }$~1~ | 03ba 03ba Greek small letter kappa
|226j|028bar|031~\overline{\kappa }~
|226k|028bar|031~$\overline{\lambda }$~1~ | 03bb 03bb Greek small letter lamda
|226k|028bar|031~\overline{\lambda }~
|226l|028bar|031~$\overline{\mu }$~1~ | 03bc 03bc Greek small letter mu
|226l|028bar|031~\overline{\mu }~
|226m|028bar|031~$\overline{\nu }$~1~ | 03bd 03bd Greek small letter nu
|226m|028bar|031~\overline{\nu }~
|226n|028bar|031~$\overline{\xi }$~1~ | 03be 03be Greek small letter xi
|226n|028bar|031~\overline{\xi }~
|226o|028bar|031~$\overline{*u03bf*}$~1~ | 03bf 03bf Greek small letter omicron
|226o|028bar|031~\overline{*u03bf*}~
|226p|028bar|031~$\overline{\pi }$~1~ | 03c0 03c0 Greek small letter pi
|226p|028bar|031~\overline{\pi }~
|226q|028bar|031~$\overline{\rho }$~1~ | 03c1 03c1 Greek small letter rho
|226q|028bar|031~\overline{\rho }~
|226r|028bar|031~$\overline{\varsigma }$~1~ | 03c2 03c2 Greek small letter final sigma
|226r|028bar|031~\overline{\varsigma }~
|226s|028bar|031~$\overline{\sigma }$~1~ | 03c3 03c3 Greek small letter sigma
|226s|028bar|031~\overline{\sigma }~
|226t|028bar|031~$\overline{\tau }$~1~ | 03c4 03c4 Greek small letter tau
|226t|028bar|031~\overline{\tau }~
|226u|028bar|031~$\overline{\upsilon }$~1~ | 03c5 03c5 Greek small letter upsilon
|226u|028bar|031~\overline{\upsilon }~
|226v|028bar|031~$\overline{\varphi }$~1~ | 03c6 03c6 Greek small letter phi
|226v|028bar|031~\overline{\varphi }~
|226w|028bar|031~$\overline{\chi }$~1~ | 03c7 03c7 Greek small letter chi
|226w|028bar|031~\overline{\chi }~
|226x|028bar|031~$\overline{\psi }$~1~ | 03c8 03c8 Greek small letter psi
|226x|028bar|031~\overline{\psi }~
|226y|028bar|031~$\overline{\omega }$~1~ | 03c9 03c9 Greek small letter omega
|226y|028bar|031~\overline{\omega }~
|226|128|028bar|031~$\overline{\varbeta }$~1~ | 03d0 03d0 Greek beta symbol
|226|128|028bar|031~\overline{\varbeta }~
|226|129|028bar|031~$\overline{\vartheta }$~1~ | 03d1 03d1 Greek theta symbol
|226|129|028bar|031~\overline{\vartheta }~
|226|130|028bar|031~$\overline{*u03d2*}$~1~ | 03d2 03d2 Greek upsilon with hook symbol
|226|130|028bar|031~\overline{*u03d2*}~
|226|133|028bar|031~$\overline{\phi }$~1~ | 03d5 03d5 Greek phi symbol
|226|133|028bar|031~\overline{\phi }~
|226|134|028bar|031~$\overline{\varpi }$~1~ | 03d6 03d6 Greek pi symbol
|226|134|028bar|031~\overline{\varpi }~
|226|136|028bar|031~$\overline{\Qoppa }$~1~ | 03d8 03d8 Greek letter archaic koppa
|226|136|028bar|031~\overline{\Qoppa }~
|226|137|028bar|031~$\overline{\qoppa }$~1~ | 03d9 03d9 Greek small letter archaic koppa
|226|137|028bar|031~\overline{\qoppa }~
|226|138|028bar|031~$\overline{\Stigma }$~1~ | 03da 03da Greek letter stigma
|226|138|028bar|031~\overline{\Stigma }~
|226|139|028bar|031~$\overline{\stigma }$~1~ | 03db 03db Greek small letter stigma
|226|139|028bar|031~\overline{\stigma }~
|226|140|028bar|031~$\overline{\digamma }$~1~ | 03dc 03dc Greek letter digamma
|226|140|028bar|031~\overline{\digamma }~
|226|141|028bar|031~$\overline{\digamma }$~1~ | 03dd 03dd Greek small letter digamma
|226|141|028bar|031~\overline{\digamma }~
|226|142|028bar|031~$\overline{\Koppa }$~1~ | 03de 03de Greek letter koppa
|226|142|028bar|031~\overline{\Koppa }~
|226|143|028bar|031~$\overline{\koppa }$~1~ | 03df 03df Greek small letter koppa
|226|143|028bar|031~\overline{\koppa }~
|226|144|028bar|031~$\overline{\Sampi }$~1~ | 03e0 03e0 Greek letter sampi
|226|144|028bar|031~\overline{\Sampi }~
|226|145|028bar|031~$\overline{\sampi }$~1~ | 03e1 03e1 Greek small letter sampi
|226|145|028bar|031~\overline{\sampi }~
|226|160|028bar|031~$\overline{*u03f0*}$~1~ | 03f0 03f0 Greek kappa symbol
|226|160|028bar|031~\overline{*u03f0*}~
|226|161|028bar|031~$\overline{\varrho }$~1~ | 03f1 03f1 Greek rho symbol
|226|161|028bar|031~\overline{\varrho }~
|226|164|028bar|031~$\overline{*u03f4*}$~1~ | 03f4 03f4 Greek capital theta symbol
|226|164|028bar|031~\overline{*u03f4*}~
|226|165|028bar|031~$\overline{\epsilon }$~1~ | 03f5 03f5 Greek lunate epsilon symbol
|226|165|028bar|031~\overline{\epsilon }~
|226|166|028bar|031~$\overline{\backepsilon }$~1~ | 03f6 03f6 Greek reversed lunate epsilon symbol
|226|166|028bar|031~\overline{\backepsilon }~
|238Y|028bar|031~$\overline{*u2129*}$~1~ | 2129 2129 Turned greek small letter iota
|238Y|028bar|031~\overline{*u2129*}~
A|028bar|031~$\overline{A}$~1~
A|028bar|031~\overline{A}~
B|028bar|031~$\overline{B}$~1~
B|028bar|031~\overline{B}~
C|028bar|031~$\overline{C}$~1~
C|028bar|031~\overline{C}~
D|028bar|031~$\overline{D}$~1~
D|028bar|031~\overline{D}~
E|028bar|031~$\overline{E}$~1~
E|028bar|031~\overline{E}~
F|028bar|031~$\overline{F}$~1~
F|028bar|031~\overline{F}~
G|028bar|031~$\overline{G}$~1~
G|028bar|031~\overline{G}~
H|028bar|031~$\overline{H}$~1~
H|028bar|031~\overline{H}~
I|028bar|031~$\overline{I}$~1~
I|028bar|031~\overline{I}~
J|028bar|031~$\overline{J}$~1~
J|028bar|031~\overline{J}~
K|028bar|031~$\overline{K}$~1~
K|028bar|031~\overline{K}~
L|028bar|031~$\overline{L}$~1~
L|028bar|031~\overline{L}~
M|028bar|031~$\overline{M}$~1~
M|028bar|031~\overline{M}~
N|028bar|031~$\overline{N}$~1~
N|028bar|031~\overline{N}~
O|028bar|031~$\overline{O}$~1~
O|028bar|031~\overline{O}~
P|028bar|031~$\overline{P}$~1~
P|028bar|031~\overline{P}~
Q|028bar|031~$\overline{Q}$~1~
Q|028bar|031~\overline{Q}~
R|028bar|031~$\overline{R}$~1~
R|028bar|031~\overline{R}~
S|028bar|031~$\overline{S}$~1~
S|028bar|031~\overline{S}~
T|028bar|031~$\overline{T}$~1~
T|028bar|031~\overline{T}~
U|028bar|031~$\overline{U}$~1~
U|028bar|031~\overline{U}~
V|028bar|031~$\overline{V}$~1~
V|028bar|031~\overline{V}~
W|028bar|031~$\overline{W}$~1~
W|028bar|031~\overline{W}~
X|028bar|031~$\overline{X}$~1~
X|028bar|031~\overline{X}~
Y|028bar|031~$\overline{Y}$~1~
Y|028bar|031~\overline{Y}~
Z|028bar|031~$\overline{Z}$~1~
Z|028bar|031~\overline{Z}~
a|028bar|031~$\overline{a}$~1~
a|028bar|031~\overline{a}~
b|028bar|031~$\overline{b}$~1~
b|028bar|031~\overline{b}~
c|028bar|031~$\overline{c}$~1~
c|028bar|031~\overline{c}~
d|028bar|031~$\overline{d}$~1~
d|028bar|031~\overline{d}~
e|028bar|031~$\overline{e}$~1~
e|028bar|031~\overline{e}~
f|028bar|031~$\overline{f}$~1~
f|028bar|031~\overline{f}~
g|028bar|031~$\overline{g}$~1~
g|028bar|031~\overline{g}~
h|028bar|031~$\overline{h}$~1~
h|028bar|031~\overline{h}~
i|028bar|031~$\overline{i}$~1~
i|028bar|031~\overline{i}~
j|028bar|031~$\overline{j}$~1~
j|028bar|031~\overline{j}~
k|028bar|031~$\overline{k}$~1~
k|028bar|031~\overline{k}~
l|028bar|031~$\overline{l}$~1~
l|028bar|031~\overline{l}~
m|028bar|031~$\overline{m}$~1~
m|028bar|031~\overline{m}~
n|028bar|031~$\overline{n}$~1~
n|028bar|031~\overline{n}~
o|028bar|031~$\overline{o}$~1~
o|028bar|031~\overline{o}~
p|028bar|031~$\overline{p}$~1~
p|028bar|031~\overline{p}~
q|028bar|031~$\overline{q}$~1~
q|028bar|031~\overline{q}~
r|028bar|031~$\overline{r}$~1~
r|028bar|031~\overline{r}~
s|028bar|031~$\overline{s}$~1~
s|028bar|031~\overline{s}~
t|028bar|031~$\overline{t}$~1~
t|028bar|031~\overline{t}~
u|028bar|031~$\overline{u}$~1~
u|028bar|031~\overline{u}~
v|028bar|031~$\overline{v}$~1~
v|028bar|031~\overline{v}~
w|028bar|031~$\overline{w}$~1~
w|028bar|031~\overline{w}~
x|028bar|031~$\overline{x}$~1~
x|028bar|031~\overline{x}~
y|028bar|031~$\overline{y}$~1~
y|028bar|031~\overline{y}~
z|028bar|031~$\overline{z}$~1~
z|028bar|031~\overline{z}~
0|028bar|031~$\overline{0}$~1~
0|028bar|031~\overline{0}~
1|028bar|031~$\overline{1}$~1~
1|028bar|031~\overline{1}~
2|028bar|031~$\overline{2}$~1~
2|028bar|031~\overline{2}~
3|028bar|031~$\overline{3}$~1~
3|028bar|031~\overline{3}~
4|028bar|031~$\overline{4}$~1~
4|028bar|031~\overline{4}~
5|028bar|031~$\overline{5}$~1~
5|028bar|031~\overline{5}~
6|028bar|031~$\overline{6}$~1~
6|028bar|031~\overline{6}~
7|028bar|031~$\overline{7}$~1~
7|028bar|031~\overline{7}~
8|028bar|031~$\overline{8}$~1~
8|028bar|031~\overline{8}~
9|028bar|031~$\overline{9}$~1~
9|028bar|031~\overline{9}~
|028es|~math|031~\(~1~2~ | treat like [ts]
|028es|~math|031~~2~3~(~ | nesting unlikely
|028es|~math|031~~3~~(~
|028ee|~math|031~~1~ | anomalous
|028ee|~math|031~\)~2~1~
|028ee|~math|031~~3~~)~ | treat like [te]
|028ee|~math|031|031~~1~ | anomalous
|028ee|~math|031|031~\)~2~1~
|028ee|~math|031|031~~3~~)~
|028es|~math-separation|031~\)~~1~(~
|028ee|~math-separation|031~\(~1~~)~
|028es|~math-TextInMath|031~\text{~~6~(~
|028ee|~math-TextInMath|031~}~6~~)~
