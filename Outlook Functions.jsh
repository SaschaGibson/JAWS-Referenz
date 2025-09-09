; Header file for Outlook object models.
; Copyright 2007-2015, Freedom Scientific, Inc.
;
; This file is the header file for the Outlook code in Microsoft Outlook Functions group of source files.

Globals
	object goOutlook,
	Object goExplorer,
	Object goFolderItems

Const
	OBJECT_EXPLORER = "ExplorerObject",
	OBJECT_OUTLOOK = "OutlookObject",
	OBJECT_FOLDER_ITEMS = "FolderItemsObject",

	ciButton=1,

		; Identifiers for MSO menus...
	MSO_View = 30004,
	MSO_AutoPreview = 1744,

	; types of MSO controls...
	MSO_Button = 1,
	MSO_MenuBar = 10,


	; The XML tags we are working with after retrieving the XML data. Do not localize...
	SC_Heading = "heading",
	SC_Property = "prop",

	; Different schema names. Do not translate...
	SC_SchemaImportance = "Importance",
	SC_SchemaFlagStatus = "0x10900003",
	SC_SchemaAttachment = "hasattachment",
	SC_SchemaFrom = "fromname",
	SC_SchemaTo = "displayto",
	SC_SchemaSubject = "subject",
	SC_SchemaDate = "datereceived",
	SC_SchemaSent = "date",
	SC_SchemaSize = "8ff00003",
	SC_SchemaCategories = "office#Keywords",
	SC_SchemaStartDateAndTime = "dtstart",
	SC_SchemaEndDateAndTime = "dtend",
	SC_SchemaLocation = "location",
	SC_SchemaRecurrencePattern = "8232001f",
	SC_SchemaTaskSubject = "85a4001f",
	SC_SchemaStartDate = "81040040",
	SC_SchemaReminderTime = "85020040",
	SC_SchemaDueDate = "81050040",
	SC_SchemaInFolder = "0x0e05001f",
	SC_SchemaReminder = "8503000b",
	SC_SchemaFullName = "cn",	; Full name in contact view...
	SC_SchemaCompany = "o",
	SC_SchemaFileAs = "fileas",
SC_SchemaBusinessPhone = "officetelephonenumber",
 	SC_SchemaBusinessFax = "facsimiletelephonenumber",
	SC_SchemaHomePhone = "homePhone",
	SC_SchemaMobilePhone = "0x3a1c001f",
	SC_SchemaEMail = "8084001f",

	; Meeting Request message class - do not localise...
	SC_MeetingRequestMessageClass = "Meeting.Request",
	SC_MeetingCancelledMessageClass = "IPM.Schedule.Meeting.Canceled",
	SC_MeetingAcceptedMessageClass = "IPM.Schedule.Meeting.Resp.Pos",
	SC_MeetingDeclinedMessageClass = "IPM.Schedule.Meeting.Resp.Neg",
	; Undelivered report message class do not localize...
	SC_UndeliveredReportMessageClass = "REPORT.IPM.Note.NDR",
	; Out of office auto reply - do not localize...
	SC_OutOfOfficeAutoReplyMessageClass = "IPM.Note.Rules.OofTemplate.Microsoft",
	SC_TaskRequest = "IPM.TaskRequest",

	; The slash character not found in default heading and message file...
	SC_Slash = "/"
