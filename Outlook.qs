<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<Includes>
		<Include File="Outlook 2007.qs" />
	</Includes>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
		<!--Proofing options now handled in QuickSettings for Office365. -->
		<!-- This file includes Outlook 2007 which includes WordClassic, so these must be directly excluded from here. -->
			<Exclude ID="WordSettings.EditingOptions.SpellingErrorDetection" />
			<Exclude ID="WordSettings.EditingOptions.GrammaticalErrorDetection" />
			<Exclude ID="WordSettings.EditingOptions.SpellingBuzzer" />r
		<!--Flags are no longer used when representing items in the message lists -->
			<Exclude ID="MessageFlags" />
			<Exclude ID="MessageFlags.MessageFollow-upFlagIndication" />	
			<Exclude ID="MessageFlags.MessageForwardedFlagIndication" />	
		</Excludes>
		<Category ID="MessageStatus">
			<Setting ID="MessageStatus.IndicateUnread" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="UnreadVerbosity" />
			</Setting>
			<Setting ID="MessageStatus.IndicateReplied" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="RepliedVerbosity" />
			</Setting>
			<Setting ID="MessageStatus.IndicateForwarded" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="ForwardedVerbosity" />
			</Setting>
		</Category>
		<Category ID="ReadingOptions">
			<Setting ID="PlaySoundsForAutocomplete" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="AutoCompletePlaySounds" />
			</Setting>
			<Setting ID="OutlookReadOnlyMsgsUseUIA" Type="Boolean">
				<SettingsFile ReadValuesEvent="GetOutlookReadOnlyMsgsUseUIA" WriteValuesEvent="SetOutlookReadOnlyMsgsUseUIA" />
			</Setting>
			<Setting ID="ReadingOptions.SpeakWindowTitlesForReadOnlyMessagesAutomatically " Type="Boolean" Location="Top">
				<SettingsFile Section="NonJCFOptions" Name="SpeakWindowTitlesForVirtualMessages" />
			</Setting>
			<Setting ID="ReadingOptions.AnnounceGroupChangeInLists" Type="Boolean" Location="Top">
				<SettingsFile Section="NonJCFOptions" Name="AnnounceGroupChangeInLists" />
			</Setting>
			<Setting ID="ReadingOptions.UseJAWSCustomization" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="UseJAWSCustomization" />
			</Setting>
		</Category>
	</QuickSettingsDefinitions>
	<CategoryOrder>
		<Category ID="ReadingOptions" Location="Top" />
		<Category ID="MessageStatus" Location="Top" />
	</CategoryOrder>
</QuickSettings>
