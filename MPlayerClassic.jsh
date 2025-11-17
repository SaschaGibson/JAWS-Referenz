; Copyright 1995-2015 by Freedom Scientific, Inc.
; JAWS 9 Media Player Classic script header file
; developed by ST

Const
  OKButtonID = 1,
  CancelButtonID = 2,
  OpenFileNameID = 1001,
  OpenFileBrowseID = 11120,
  DubFileBrowseID = 11121,
  AddToPlayListID = 11080,
  CountrySelectionID = 11008,
  MenuBarID = 59648,
  PropertiesTabID = 12320,
  ClipNameID = 11060,
  ClipID = 11063,
  AuthorID = 11061,
  CopyrightID = 11062,
  RatingID = 11064,
  LocationID = 11065,
  DescriptionID = 11066,
  TimeGoButtonID = 12024,
  FrameGoButtonID = 12025,

  TabClassName = "SysTabControl32",
  CommonKeys = "Common Keys",
  Keys = " Keys",
  TCM_GETCURSEL           0x130B

Globals
  Int GlobalAnnounceTime,
  Int GlobalMPlayerFirstTime,
  String GlobalAction

