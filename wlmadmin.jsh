; JAWS 6.10.xx Script header file for WLM Admin network tools
; Copyright 1999-2015  by Freedom Scientific BLV Group, LLC
Const
; control ID's
	id_LicenseInfoLb = 1092,
	id_ClientInfoLB = 1096,
	id_ServerTV = 59648,
	id_ServerName = 1096,
	id_IPAddress = 1097,
	id_FeatureName = 1095,
	id_Version = 1094,
	id_TotalUsersInUse = 1080,
	id_TotalUsersTotal =1089, 
	id_TotalUsersQueued = 1077, 
	Id_ReservedInUse = 1087, 
	id_ReservedTotal =1079,
	id_CommuterInUse = 1088, 
	id_CommuterTotal = 1078,
	id_LicenseType = 1033,
	id_AllowCommuterLicense = 1093,
	id_StartDate = 1051,
	id_EndDate = 1050,
	id_UserName = 1044,
	id_LicensesUsed = 1073,
	id_HeldLicense = 1070,
	id_StartTime = 1045,
	id_GroupName = 1072,
	id_Redundant = 1082,
	id_NumOfServers = 1083,
	; keystrokes
	ksF6 = "F6",
	key_F6 = 64	
	
Globals
	handle ghParent,
	handle ghServerTV ,
	int giWlmFirstTime,
	int giInServerTV,
	int giUserActivated,
	int giClientInfoActive,
	int giLicenseInfoActive,
	int giServerInfoActive,
	int giHelpScreenActive 