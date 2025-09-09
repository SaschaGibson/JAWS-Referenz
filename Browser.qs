<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<VariableBlock>
		<Variable ID="%doc%" Callback="getAddressJSINameForVariable" />
	</VariableBlock>
	<QuickSettingsDefinitions 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="DocumentSettings" ShowConditionEvent="QuickSettingDisabledEvent" />
		</Excludes>
		<Category ID="DocumentSettings" DocumentNode="True">
			<Setting ID="DocumentSettings.VirtualCursorVerbosityLevel" Type="List">
				<SettingsFile FileName="%doc%" 
					ReadValuesEvent="getVirtualCursorVerbosityLevelInfo"
					WriteValuesEvent="setVirtualCursorVerbosityLevelInfo"
					/>
			</Setting>
			<Setting ID="DocumentSettings.ElementDescription" Type="Boolean">
				<SettingsFile ReadValuesEvent="getVCVElementDescriptionInfo" WriteValuesEvent="SetVCVElementDescriptionInfo"/>
			</Setting>
			<Setting ID="DocumentSettings.GlanceHighlightIndication" Type="List">
				<Values>
					<Value ID="DocumentSettings.GlanceHighlightIndication.0" />
					<Value ID="DocumentSettings.GlanceHighlightIndication.1" />
					<Value ID="DocumentSettings.GlanceHighlightIndication.2" />
					<Value ID="DocumentSettings.GlanceHighlightIndication.3" />
				</Values>
				<SettingsFile FileName="%doc%" Section="PageAnalyzer" Name="sghIndication"  DefaultIsSettingValue="VirtualCursorOptions.GlanceHighlightIndication" />
			</Setting>
			<Setting ID="DocumentSettings.AllowWebApplicationReservedKeystrokes" Type="Boolean">
				<SettingsFile ReadValuesEvent="getCustomAllowWebAppReservedKeystrokesInfo" WriteValuesEvent="setCustomAllowWebAppReservedKeystrokesInfo" />
			</Setting>
			<Setting ID="DocumentSettings.SelectandCopy" Type="List">
				<SettingsFile ReadValuesEvent="getCustomSelectandCopyInfo" WriteValuesEvent="setCustomSelectandCopyInfo" />
			</Setting>
			<Setting ID="DocumentSettings.ReadOnlyState" Type="List">
				<!-- This is inverse, e.g suppres, 0 = on or announce, 1 = suppress or off / don't announce -->
				<Values>
					<Value ID="DocumentSettings.ReadOnlyState.0" />
					<Value ID="DocumentSettings.ReadOnlyState.1" />
				</Values>
				<SettingsFile FileName="%doc%" Section="HTML" Name="ReadOnlyState" DefaultIsSettingValue="VirtualCursorOptions.ReadOnlyState" />
			</Setting>
			<Setting ID = "DocumentSettings.IndicateInsAndDelInVirtualDocs"  Type="Boolean">
			<SettingsFile FileName="%doc%" Section="HTML" Name="IndicateInsAndDelInVirtualDocs" DefaultIsSettingValue="VirtualCursorOptions.IndicateInsAndDelInVirtualDocs" />
			</Setting>
			<Category ID="DocumentSettings.FormsOptions">
				<Setting ID="DocumentSettings.FormsOptions.AutoFormsMode" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.FormsOptions.NavigationQuickKeyDelay" />
					</Dependents>
					<SettingsFile 
					ReadValuesEvent="getCustomAutoFormsModeInfo" 
					WriteValuesEvent="setCustomAutoFormsModeInfo" 
				/>
				</Setting>
				<Setting ID="DocumentSettings.FormsOptions.NavigationQuickKeyDelay" Type="List">
					<SettingsFile ReadValuesEvent="getCustomQuickNavigationKeyDelayInfo" WriteValuesEvent="setCustomQuickNavigationKeyDelayInfo" />
				</Setting>
				<Setting ID="DocumentSettings.FormsOptions.ButtonsShowUsing" Type="List">
					<Values>
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.0" />
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.1" />
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.2" />
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.3" />
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.4" />
						<Value ID="DocumentSettings.FormsOptions.ButtonsShowUsing.5" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="ButtonTextOptions" DefaultIsSettingValue="VirtualCursorOptions.FormsOptions.ButtonsShowUsing" />
				</Setting>
				<Setting ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing" Type="List">
					<Values>
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.0" />
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.1" />
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.2" />
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.3" />
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.4" />
						<Value ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing.5" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="FormFieldPromptOptions" DefaultIsSettingValue="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing" />
				</Setting>
				<Setting ID = "DocumentSettings.FormsOptions.FormsModeOffWhenNewPageLoads" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="FormsMode" Name="AutoFormsMode" DefaultIsSettingValue="VirtualCursorOptions.FormsOptions.FormsModeOffWhenNewPageLoads" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.GeneralOptions">
				<Setting ID="DocumentSettings.GeneralOptions.DocumentAutomaticallyReads" Type="Boolean">
					<SettingsFile ReadValuesEvent="getCustomDocumentAutomaticallyReadsInfo" WriteValuesEvent="setCustomDocumentAutomaticallyReadsInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.LanguageDetectChange" Type="Boolean">
					<SettingsFile ReadValuesEvent="getCustomLanguageDetectChangeInfo" WriteValuesEvent="SetCustomLanguageDetectChangeInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.VirtualCursor" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="VirtualCursor" DefaultValue="1" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.NavigationQuickKeys" Type="List">
					<SettingsFile ReadValuesEvent="getCustomNavigationQuickKeysInfo" WriteValuesEvent="setCustomNavigationQuickKeysInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.DocumentPresentation" Type="List">
					<SettingsFile FileName="%doc%" ReadValuesEvent="GetCustomDocumentPresentationInfo" WriteValuesEvent="SetCustomDocumentPresentationInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.CustomPageSummary" Type="List">
					<Values>
						<Value ID="DocumentSettings.GeneralOptions.CustomPageSummary.0" />
						<Value ID="DocumentSettings.GeneralOptions.CustomPageSummary.1" />
						<Value ID="DocumentSettings.GeneralOptions.CustomPageSummary.2" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="CustomPageSummary" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.CustomPageSummary" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.AccessKeysShow" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="AccessKeys" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.AccessKeysShow" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.AttributesIndicate" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="IndicateElementAttributes" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.AttributesIndicate" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.FlashMoviesRecognize" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="EmbeddedActiveXSupport" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.FlashMoviesRecognize" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.PageRefresh " Type="List">
					<!-- This setting is either set to off or the value of the previously stored setting, e.g Default. -->
					<SettingsFile ReadValuesEvent="GetCustomPageRefreshInfo" WriteValuesEvent="SetCustomPageRefreshInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.AnnounceLiveRegionUpdates" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="AnnounceLiveRegionUpdates" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.AnnounceLiveRegionUpdates" />
				</Setting>
				<Setting ID="DocumentSettings.Scheme" Type="List">
					<!-- Uses a specified list from a separate JCF key -->
					<SettingsFile  ReadValuesEvent="getCustomSayAllSchemeInfo" WriteValuesEvent="setCustomSayAllSchemeInfo" />
				</Setting>
				<Setting ID="DocumentSettings.GeneralOptions.VirtualDocumentLinkActivationMethod" Type="List">
					<Values>
						<Value ID="DocumentSettings.GeneralOptions.VirtualDocumentLinkActivationMethod.0" />
						<Value ID="DocumentSettings.GeneralOptions.VirtualDocumentLinkActivationMethod.1" />
					</Values>
					<SettingsFile FileName="%doc%" Section="Options" Name="VirtualDocumentLinkActivationMethod" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.VirtualDocumentLinkActivationMethod" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.TextOptions">
				<Setting ID="DocumentSettings.TextOptions.AbbreviationsExpand" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="ExpandAbbreviations" DefaultIsSettingValue="VirtualCursorOptions.TextOptions.AbbreviationsExpand" />
				</Setting>
				<Setting ID="DocumentSettings.TextOptions.AcronymsExpand" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="ExpandAcronyms" DefaultIsSettingValue="VirtualCursorOptions.TextOptions.AcronymsExpand" />
				</Setting>
				<Setting ID="DocumentSettings.TextOptions.RepeatedTextSkip" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="SkipPastRepeatedText" DefaultIsSettingValue="VirtualCursorOptions.TextOptions.RepeatedTextSkip"  />
				</Setting>
				<Setting ID="DocumentSettings.TextOptions.ScreenTrackVirtualCursor" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="ScreenFollowsVCursor" DefaultIsSettingValue="VirtualCursorOptions.GeneralOptions.ScreenTrackVirtualCursor" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.GraphicsOptions">
				<Setting ID="DocumentSettings.GraphicsOptions.GraphicsShow" Type="List">
					<Values>
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsShow.0" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsShow.1" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsShow.2" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="IncludeGraphics" DefaultIsSettingValue="VirtualCursorOptions.GraphicsOptions.GraphicsShow" />
				</Setting>
				<Setting ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy" Type="List">
					<Values>
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy.0" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy.1" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy.2" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy.3" />
						<Value ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy.4" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="GraphicRenderingOption" DefaultIsSettingValue="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.LinksOptions">
				<Setting ID="DocumentSettings.LinksOptions.FilterConsecutiveDuplicateLinks" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="FilterConsecutiveDuplicateLinks" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.FilterConsecutiveDuplicateLinks" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.GraphicalLinksShow" Type="List">
					<SettingsFile FileName="%doc%" ReadValuesEvent="getCustomGraphicalLinksInfo" WriteValuesEvent="setCustomGraphicalLinksInfo" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.GraphicalLinksShow" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.UntaggedGraphicalLinksShow" Type="List">
					<SettingsFile FileName="%doc%" ReadValuesEvent="GetCustomUntaggedGraphicalLinkShowInfo" WriteValuesEvent="SetCustomUntaggedGraphicalLinkShowInfo" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.UntaggedGraphicalLinksShow" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.LinksInImageMapsShow" Type="List">
					<Values>
						<Value ID="DocumentSettings.LinksOptions.LinksInImageMapsShow.0" />
						<Value ID="DocumentSettings.LinksOptions.LinksInImageMapsShow.1" />
						<Value ID="DocumentSettings.LinksOptions.LinksInImageMapsShow.2" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="IncludeImageMapLinks" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.LinksInImageMapsShow" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.TextLinksShowUsing" Type="List">
					<SettingsFile FileName="%doc%" ReadValuesEvent="getCustomTextLinksInfo" WriteValuesEvent="setCustomTextLinksInfo" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.LinksIdentifyType" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="IdentifyLinkType" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.LinksIdentifyType" />
				</Setting>
				<Setting ID="DocumentSettings.LinksOptions.LinksIdentifySamePage" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="IdentifySamePageLinks" DefaultIsSettingValue="VirtualCursorOptions.LinksOptions.LinksIdentifySamePage" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.HeadingAndFrameOptions">
				<Setting ID="DocumentSettings.HeadingAndFrameOptions.HeadingsAnnounce" Type="List">
					<SettingsFile FileName="%doc%" ReadValuesEvent="GetCustomHeadingsInfo" WriteValuesEvent="SetCustomHeadingsInfo" />
				</Setting>
				<Setting ID="DocumentSettings.HeadingAndFrameOptions.InlineFramesShow" Type="List">
					<!-- This is only a list because 0 = on and 1 =off -->
					<Values>
						<Value ID="DocumentSettings.HeadingAndFrameOptions.InlineFramesShow.0" />
						<Value ID="DocumentSettings.HeadingAndFrameOptions.InlineFramesShow.1" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="IgnoreInlineFrames" DefaultIsSettingValue="VirtualCursorOptions.HeadingAndFrameOptions.InlineFramesShow" />
				</Setting>
			</Category>
			<Category ID="DocumentSettings.TableOptions">
				<Setting ID="DocumentSettings.TableOptions.LayoutTables" Type="Boolean">
					<SettingsFile FileName="%doc%" Section="HTML" Name="WhichTable" DefaultIsSettingValue="VirtualCursorOptions.TableOptions.LayoutTables" />
				</Setting>
				<Setting ID="DocumentSettings.TableOptions.TableTitles" Type="List">
					<Values>
						<Value ID="DocumentSettings.TableOptions.TableTitles.0" />
						<Value ID="DocumentSettings.TableOptions.TableTitles.1" />
						<Value ID="DocumentSettings.TableOptions.TableTitles.2" />
						<Value ID="DocumentSettings.TableOptions.TableTitles.3" />
						<Value ID="DocumentSettings.TableOptions.TableTitles.4" />
					</Values>
					<SettingsFile FileName="%doc%" Section="HTML" Name="TableTitlesAnnounce" DefaultIsSettingValue="VirtualCursorOptions.TableOptions.TableTitles" />
				</Setting>
			<Setting ID="DocumentSettings.TableOptions.JAWSDeterminesLayoutTable" Type="Boolean">
				<SettingsFile ReadValuesEvent="GetCustomJAWSDeterminesLayoutTable" WriteValuesEvent="SetCustomJAWSDeterminesLayoutTable" />
			</Setting>
			</Category>
		</Category>
	</QuickSettingsDefinitions>
	<CategoryOrder>
		<Category ID="VirtualCursorOptions" Location="Top" />
		<Category ID="InternetExplorerSettings" Location="Top" />
		<Category ID="DocumentSettings" Location="Bottom" />
	</CategoryOrder>
</QuickSettings>
