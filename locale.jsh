;Some Constants from winnls.h defining Locale information which may be retrieved
;with the GetLocaleInfo function

const
LOCALE_ILANGUAGE=0x00000001, ; language id
LOCALE_SLANGUAGE=0x00000002, ; localized name of language
LOCALE_SENGLANGUAGE=0x00001001, ; English name of language
LOCALE_SABBREVLANGNAME=0x00000003, ; abbreviated language name
LOCALE_SNATIVELANGNAME=0x00000004, ; native name of language

LOCALE_ICOUNTRY=0x00000005, ; country code
LOCALE_SCOUNTRY=0x00000006, ; localized name of country
LOCALE_SENGCOUNTRY=0x00001002, ; English name of country
LOCALE_SABBREVCTRYNAME=0x00000007, ; abbreviated country name
LOCALE_SNATIVECTRYNAME=0x00000008, ; native name of country

LOCALE_IDEFAULTLANGUAGE=0x00000009, ; default language id
LOCALE_IDEFAULTCOUNTRY=0x0000000A, ; default country code

LOCALE_SLIST=0x0000000C, ; list item separator
LOCALE_IMEASURE=0x0000000D, ; 0= metric, 1= US

LOCALE_SDECIMAL=0x0000000E, ; decimal separator
LOCALE_STHOUSAND=0x0000000F, ; thousand separator
LOCALE_SGROUPING=0x00000010, ; digit grouping
LOCALE_IDIGITS=0x00000011, ; number of fractional digits
LOCALE_ILZERO=0x00000012, ; leading zeros for decimal
LOCALE_INEGNUMBER=0x00001010, ; negative number mode
LOCALE_SNATIVEDIGITS=0x00000013, ; native ascii 0-9

LOCALE_SCURRENCY=0x00000014, ; local monetary symbol
LOCALE_SINTLSYMBOL=0x00000015, ; intl monetary symbol
LOCALE_SMONDECIMALSEP=0x00000016, ; monetary decimal separator
LOCALE_SMONTHOUSANDSEP=0x00000017, ; monetary thousand separator
LOCALE_SMONGROUPING=0x00000018, ; monetary grouping
LOCALE_ICURRDIGITS=0x00000019, ; # local monetary digits
LOCALE_IINTLCURRDIGITS=0x0000001A, ; # intl monetary digits
LOCALE_ICURRENCY=0x0000001B, ; positive currency mode
LOCALE_INEGCURR=0x0000001C, ; negative currency mode

LOCALE_SDATE=0x0000001D, ; date separator
LOCALE_STIME=0x0000001E, ; time separator
LOCALE_SSHORTDATE=0x0000001F, ; short date format string
LOCALE_SLONGDATE=0x00000020, ; long date format string
LOCALE_STIMEFORMAT=0x00001003, ; time format string
LOCALE_IDATE=0x00000021, ; short date format ordering
LOCALE_ILDATE=0x00000022, ; long date format ordering
LOCALE_ITIME=0x00000023, ; time format specifier
LOCALE_ITIMEMARKPOSN=0x00001005, ; time marker position
LOCALE_ICENTURY=0x00000024, ; century format specifier (short date)
LOCALE_ITLZERO=0x00000025, ; leading zeros in time field
LOCALE_IDAYLZERO=0x00000026, ; leading zeros in day field (short date)
LOCALE_IMONLZERO=0x00000027, ; leading zeros in month field (short date)
LOCALE_S1159=0x00000028, ; AM designator
LOCALE_S2359=0x00000029, ; PM designator

LOCALE_ICALENDARTYPE=0x00001009, ; type of calendar specifier
LOCALE_IOPTIONALCALENDAR=0x0000100B, ; additional calendar types specifier
LOCALE_IFIRSTDAYOFWEEK=0x0000100C, ; first day of week specifier
LOCALE_IFIRSTWEEKOFYEAR=0x0000100D, ; first week of year specifier

LOCALE_SDAYNAME1=0x0000002A, ; long name for Monday
LOCALE_SDAYNAME2=0x0000002B, ; long name for Tuesday
LOCALE_SDAYNAME3=0x0000002C, ; long name for Wednesday
LOCALE_SDAYNAME4=0x0000002D, ; long name for Thursday
LOCALE_SDAYNAME5=0x0000002E, ; long name for Friday
LOCALE_SDAYNAME6=0x0000002F, ; long name for Saturday
LOCALE_SDAYNAME7=0x00000030, ; long name for Sunday
LOCALE_SABBREVDAYNAME1=0x00000031, ; abbreviated name for Monday
LOCALE_SABBREVDAYNAME2=0x00000032, ; abbreviated name for Tuesday
LOCALE_SABBREVDAYNAME3=0x00000033, ; abbreviated name for Wednesday
LOCALE_SABBREVDAYNAME4=0x00000034, ; abbreviated name for Thursday
LOCALE_SABBREVDAYNAME5=0x00000035, ; abbreviated name for Friday
LOCALE_SABBREVDAYNAME6=0x00000036, ; abbreviated name for Saturday
LOCALE_SABBREVDAYNAME7=0x00000037, ; abbreviated name for Sunday
LOCALE_SMONTHNAME1=0x00000038, ; long name for January
LOCALE_SMONTHNAME2=0x00000039, ; long name for February
LOCALE_SMONTHNAME3=0x0000003A, ; long name for March
LOCALE_SMONTHNAME4=0x0000003B, ; long name for April
LOCALE_SMONTHNAME5=0x0000003C, ; long name for May
LOCALE_SMONTHNAME6=0x0000003D, ; long name for June
LOCALE_SMONTHNAME7=0x0000003E, ; long name for July
LOCALE_SMONTHNAME8=0x0000003F, ; long name for August
LOCALE_SMONTHNAME9=0x00000040, ; long name for September
LOCALE_SMONTHNAME10=0x00000041, ; long name for October
LOCALE_SMONTHNAME11=0x00000042, ; long name for November
LOCALE_SMONTHNAME12=0x00000043, ; long name for December
LOCALE_SMONTHNAME13=0x0000100E, ; long name for 13th month (if exists)
LOCALE_SABBREVMONTHNAME1=0x00000044, ; abbreviated name for January
LOCALE_SABBREVMONTHNAME2=0x00000045, ; abbreviated name for February
LOCALE_SABBREVMONTHNAME3=0x00000046, ; abbreviated name for March
LOCALE_SABBREVMONTHNAME4=0x00000047, ; abbreviated name for April
LOCALE_SABBREVMONTHNAME5=0x00000048, ; abbreviated name for May
LOCALE_SABBREVMONTHNAME6=0x00000049, ; abbreviated name for June
LOCALE_SABBREVMONTHNAME7=0x0000004A, ; abbreviated name for July
LOCALE_SABBREVMONTHNAME8=0x0000004B, ; abbreviated name for August
LOCALE_SABBREVMONTHNAME9=0x0000004C, ; abbreviated name for September
LOCALE_SABBREVMONTHNAME10=0x0000004D, ; abbreviated name for October
LOCALE_SABBREVMONTHNAME11=0x0000004E, ; abbreviated name for November
LOCALE_SABBREVMONTHNAME12=0x0000004F, ; abbreviated name for December
LOCALE_SABBREVMONTHNAME13=0x0000100F, ; abbreviated name for 13th month (if exists)

LOCALE_SPOSITIVESIGN=0x00000050, ; positive sign
LOCALE_SNEGATIVESIGN=0x00000051, ; negative sign
LOCALE_IPOSSIGNPOSN=0x00000052, ; positive sign position
LOCALE_INEGSIGNPOSN=0x00000053, ; negative sign position
LOCALE_IPOSSYMPRECEDES=0x00000054, ; mon sym precedes pos amt
LOCALE_IPOSSEPBYSPACE=0x00000055, ; mon sym sep by space from pos amt
LOCALE_INEGSYMPRECEDES=0x00000056, ; mon sym precedes neg amt
LOCALE_INEGSEPBYSPACE=0x00000057 ; mon sym sep by space from neg amt

