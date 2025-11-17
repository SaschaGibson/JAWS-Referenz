<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<Includes>
		<Include File="WordClassic.qs" />
	</Includes>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="ReadingOptions.UseVPCInsteadOfEnhancedEditModeForReadOnlyDocs" ShowConditionEvent="QuickSettingDisabledEvent" />
			<!-- The following two options are not available for use in virtualized Outlook Messages. -->
			<Exclude ID="VirtualCursorOptions.GeneralOptions.DocumentPresentation" />
			<Exclude ID="WordSettings.DocumentSettings" />
			<Exclude ID="WordSettings.EditingOptions.TrackChanges" />
			<Exclude ID="WordSettings.ReadingOptions.BookmarkIndication" />
			<Exclude ID="WordSettings.ReadingOptions.CommentsFootnotesEndnotesDetection" />
			<Exclude ID="WordSettings.ReadingOptions.LineSpacingDetection" />
			<Exclude ID="WordSettings.Formatting.F1HelpPrompt" />
			<Exclude ID="WordSettings.Formatting.ShadingDetection" />
			<Exclude ID="WordSettings.Formatting.StyleChanges" />
			<Exclude ID="WordSettings.ReadingOptions.PageSectionAndMultipleColumnBreaks" />
			<Exclude ID="WordSettings.ReadingOptions.SmartTagsIndication" />
			<Exclude ID="WordSettings.GeneralOptions" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="WordSettings.GeneralOptions.DocumentPresentation" />
			<Exclude ID="WordSettings.GeneralOptions.UIAEditControls" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="WordSettings.Formatting.MeasurementUnits" />
			<Exclude ID="WordSettings.ReadingOptions.ObjectCountDetection" />
			<Exclude ID="WordSettings.SpeechAndSoundSchemes" />
			<Exclude ID="ReadingOptions.CustomLabels" />
			<Exclude ID="WordSettings.ReadingOptions.ListNestingLevelAnnouncement"  ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="WordSettings.Tables.TableDetection" ShowConditionEvent="QuickSettingDisabledEvent" />
		</Excludes>
		<Category ID="MessageFlags">
			<Setting ID="MessageFlags.MessageFollow-upFlagIndication" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="MessageFlagVerbosity" />
			</Setting>
			<Setting ID="MessageFlags.MessageForwardedFlagIndication" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="ForwardedFlagVerbosity" />
			</Setting>
		</Category>
		<Category ID="ReadingOptions">
			<Setting ID="ReadingOptions.UseVPCInsteadOfEnhancedEditModeForReadOnlyDocs" Type="Boolean">
				<SettingsFile Section="Options" Name="UseVPCInsteadOfEnhancedEditModeForReadOnlyDocs" />
			</Setting>
			<Setting ID="ReadingOptions.AddressListAuto-CompleteAnnouncement" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="AutoCompleteVerbosity" />
			</Setting>
			<Setting ID="ReadingOptions.InformationBarMessagesAnnouncement" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="InformationBarVerbosity" />
			</Setting>
			<Setting ID="ReadingOptions.MessageHeaderFieldWithMessageAnnouncement" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="MessageHeaderVerbosity" />
			</Setting>
			<Setting ID="ReadingOptions.MessageTypeAnnouncement" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="MessageTypeVerbosity" />
			</Setting>
			<Setting ID="ReadingOptions.WebLinkCountIndication" Type="Boolean">
				<SettingsFile Section="nonJCFOptions" Name="MessageLinkCountIndication" />
			</Setting>
			<Setting ID="ReadingOptions.MessagesAutomaticallyRead" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="MessageSayAllVerbosity" />
			</Setting>
		</Category>
	</QuickSettingsDefinitions>
	<CategoryOrder>
		<Category ID="ReadingOptions" Location="Top" />
		<Category ID="MessageFlags" Location="Top" />
		<Category ID="WordSettings" Location="Bottom" />
	</CategoryOrder>
</QuickSettings>
