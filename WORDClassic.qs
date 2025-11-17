<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude  ID="WordSettings.Tables.AutomaticTableTitles" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude  ID="WordSettings.Tables.HeaderAndContentOrder" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="BrailleOptions.TableOptions.TableShowTitles" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="BrailleOptions.TableOptions.TableShowCoordinates" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="WordSettings.GeneralOptions.UIAEditControls" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="WordSettings.EditingOptions.SpellingBuzzer" ShowConditionEvent="AllowOffice365Settings" />
		</Excludes>
		<Category ID="WordSettings">
			<Category ID="WordSettings.Formatting">
				<Setting ID="WordSettings.Formatting.BulletTypeIndication" Type="List">
					<!-- 0 = On, 1 = OFF -->
					<Values>
						<Value ID="WordSettings.Formatting.BulletTypeIndication.0" />
						<Value ID="WordSettings.Formatting.BulletTypeIndication.1" />
					</Values>
					<SettingsFile Section="Options" Name="GeneralizeBullets" />
				</Setting>
				<Setting ID="WordSettings.Formatting.F1HelpPrompt" Type="List">
					<SettingsFile ReadValuesEvent="getExtraHelpIndicationInfo" WriteValuesEvent="setExtraHelpIndicationInfo" />
				</Setting>
				<Setting ID="WordSettings.Formatting.HeadingsAnnounce" Type="List">
					<SettingsFile ReadValuesEvent="getHeadingsDetectionInfo" WriteValuesEvent="setHeadingsDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.Formatting.MeasurementUnits" Type="List">
					<SettingsFile ReadValuesEvent="GetDesiredUnitsOfMeasureInfo" WriteValuesEvent="setDesiredUnitsOfMeasureInfo" />
				</Setting>
				<Setting ID="WordSettings.Formatting.ShadingDetection" Type="Boolean">
					<SettingsFile ReadValuesEvent="GetShadingDetectionInfo" WriteValuesEvent="SetShadingDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.Formatting.StyleChanges"  Type="List">
					<Dependents>
						<Dependent ID="WordSettings.Formatting.HeadingsAnnounce" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getStyleDetectionInfo" WriteValuesEvent="setStyleDetectionInfo" />
				</Setting>
			</Category>
			<Category ID="WordSettings.Tables">
				<Setting ID="WordSettings.Tables.AutomaticTableTitles" Type="List">
					<Values>
						<Value ID="WordSettings.Tables.AutomaticTableTitles.0" />
						<Value ID="WordSettings.Tables.AutomaticTableTitles.1" />
						<Value ID="WordSettings.Tables.AutomaticTableTitles.2" />
						<Value ID="WordSettings.Tables.AutomaticTableTitles.3" />
					</Values>
					<SettingsFile Section="NonJCFOptions" Name="TblHeaders"  />
				</Setting>
				<Setting ID="WordSettings.Tables.HeaderAndContentOrder" Type="List">
					<Values>
						<Value ID="WordSettings.Tables.HeaderAndContentOrder.0" />
						<Value ID="WordSettings.Tables.HeaderAndContentOrder.1" />
					</Values>
					<SettingsFile Section="NonJCFOptions" Name="TblHeaderContentOrder"  />
				</Setting>
				<Setting ID="WordSettings.Tables.CellCoordinatesAnnouncement" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="AnnounceCellCoordinates" />
				</Setting>
				<Setting ID="WordSettings.Tables.TableDetection" Type="Boolean">
					<SettingsFile Section="OSM" Name="TableIndication" />
				</Setting>
				<Setting ID="WordSettings.Tables.Description" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="TableDescription" />
				</Setting>
			</Category>
			<!-- legacy: was under document settings when category meant something different in UserOptions -->
			<Setting ID="WordSettings.SpeechAndSoundSchemes" Type="List">
				<SettingsFile ReadValuesEvent="getSchemeInfo" WriteValuesEvent="setSchemeInfo" />
			</Setting>
			<!-- Default nodes used for app -->
			<Category ID="WordSettings.EditingOptions">
				<Setting ID="WordSettings.EditingOptions.AutoCorrectDetection" Type="Boolean">
					<Dependents>
						<Dependent ID="WordSettings.EditingOptions.SpellingErrorDetection" />
						<Dependent ID="WordSettings.EditingOptions.GrammaticalErrorDetection" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getAutoCorrectDetectionInfo" WriteValuesEvent="setAutoCorrectDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.SpellingErrorDetection" Type="List">
					<SettingsFile ReadValuesEvent="getSpellingErrorDetectionInfo" WriteValuesEvent="setSpellingErrorDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.GrammaticalErrorDetection" Type="List">
					<SettingsFile ReadValuesEvent="getGrammaticalErrorDetectionInfo" WriteValuesEvent="setGrammaticalErrorDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.SpellingBuzzer" Type="Boolean">
					<Dependents>
						<Dependent ID="WordSettings.EditingOptions.SpellingErrorDetection" />
						<Dependent ID="WordSettings.EditingOptions.GrammaticalErrorDetection" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getSpellingBuzzerInfo" WriteValuesEvent="setSpellingBuzzerInfo" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.NewLinesAndParagraphsIndication" Type="List">
					<SettingsFile ReadValuesEvent="getNewLinesAndParagraphsIndicationInfo" WriteValuesEvent="setNewLinesAndParagraphsIndicationInfo" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.TABMeasurementIndication" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="TabMeasurementIndication" />
				</Setting>
				<Setting ID="WordSettings.EditingOptions.TrackChanges" Type="List">
					<SettingsFile ReadValuesEvent="GetRevisionDetectionInfo" WriteValuesEvent="setRevisionDetectionInfo" />
				</Setting>
			</Category>
			<Category ID="WordSettings.GeneralOptions">
				<Setting ID="WordSettings.GeneralOptions.DocumentPresentation" Type="List">
					<SettingsFile ReadValuesEvent="getWordDocumentPresentationInfo" WriteValuesEvent="setWordDocumentPresentationInfo" />
				</Setting>
			</Category>
			<Category ID="WordSettings.ReadingOptions">
				<Setting ID="WordSettings.ReadingOptions.OutlineLevelIndication" Type="Boolean">
					<SettingsFile Section="Options" Name="IndicateOutlineLevel" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.BookmarkIndication" Type="List">
					<SettingsFile ReadValuesEvent="getBookmarkDetectionInfo" WriteValuesEvent="setBookmarkDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.BorderChanges" Type="Boolean">
					<SettingsFile ReadValuesEvent="getBorderDetectionInfo" WriteValuesEvent="setBorderDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.CommentsFootnotesEndnotesDetection" Type="List">
					<SettingsFile ReadValuesEvent="getNotesDetectionInfo" WriteValuesEvent="setNotesDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.ItemCounts" Type="List">
					<SettingsFile ReadValuesEvent="getCountBeforeInfo" WriteValuesEvent="setCountBeforeInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.LineSpacingDetection" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="LineSpacingDetection" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.IncludeBlankParagraphsForParagraphNavigation" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="IncludeBlankParagraphsForParagraphNavigation" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.NavigationQuickKeys" Type="Boolean">
					<!-- Differs from default in that we just have an OFF and an ON option -->
					<!-- There is no SayAll Only Option in Word -->
					<!-- <SettingsFile Section="Options" Name="QuickKeyNavigationMode" /> -->
					<SettingsFile ReadValuesEvent="GetWordNavigationQuickKeysInfo" WriteValuesEvent="SetWordNavigationQuickKeysInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication" Type="List">
					<Values>
						<Value ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication.0" />
						<Value ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication.1" />
						<Value ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication.2" />
						<Value ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication.3" />
						<Value ID="WordSettings.ReadingOptions.NonbreakingSymbolsIndication.4" />
					</Values>
					<SettingsFile Section="Options" Name="IndicateNonbreakingSymbols" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.PageSectionAndMultipleColumnBreaks" Type="Boolean">
					<SettingsFile ReadValuesEvent="getPositionDetectionInfo" WriteValuesEvent="setPositionDetectionInfo" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.DetectHeadersFooters" Type="Boolean" >
					<SettingsFile Section="NonJCFOptions" Name="DetectHeadersFooters" />
				</Setting>
				<Setting ID="WordSettings.ReadingOptions.SmartTagsIndication" Type="Boolean">
					<SettingsFile ReadValuesEvent="getSmartTagsIndicationInfo" WriteValuesEvent="setSmartTagsIndicationInfo" />
				</Setting>
			</Category>
			<Category ID="WordSettings.BrailleOptions">
				<Setting ID="WordSettings.BrailleOptions.BrailleBulletTypeIndication" Type="Boolean">
					<SettingsFile ReadValuesEvent="getBrailleBulletTypeInfo" WriteValuesEvent="setBrailleBulletTypeInfo" />
				</Setting>
				<Setting ID="WordSettings.BrailleOptions.MarkProofreadingIndicationInBraille" Type="List">
					<Values>
						<Value ID="WordSettings.BrailleOptions.MarkProofreadingIndicationInBraille.0" />
						<Value ID="WordSettings.BrailleOptions.MarkProofreadingIndicationInBraille.1" />
						<Value ID="WordSettings.BrailleOptions.MarkProofreadingIndicationInBraille.2" />
						<Value ID="WordSettings.BrailleOptions.MarkProofreadingIndicationInBraille.3" />
					</Values>
					<SettingsFile Section="Osm" Name="UnderlineProofreadingErrors" />
				</Setting>
				<Category ID="WordSettings.BrailleOptions.TableOptions">
					<Setting ID="WordSettings.BrailleOptions.TableOptions.TableNumberDisplay" Type="Boolean">
						<SettingsFile Section="NonJCFOptions" Name="DisplayBRLTableNumber" />
					</Setting>
				</Category>
			</Category>
			<Category ID="WordSettings.DocumentSettings" DocumentNode="True">
				<Category ID="WordSettings.DocumentSettings.Tables">
					<Setting ID="WordSettings.DocumentSettings.Tables.DefinedBookmarkTableColumnAndRowTitlesOverride" Type="List">
						<Dependents>
							<Dependent ID="WordSettings.DocumentSettings.Tables.TableTitlesAnnounce" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.ColumnTitlesRowSet" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.RowTitlesColumnSet" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.TitleDefinitionsClear" />
						</Dependents>
						<SettingsFile ReadValuesEvent="getOverrideDocNamedTitlesInfo" WriteValuesEvent="setOverrideDocNamedTitlesInfo" />
					</Setting>
					<Setting ID="WordSettings.DocumentSettings.Tables.TableTitlesAnnounce" Type="List">
						<Dependents>
							<Dependent ID="WordSettings.DocumentSettings.Tables.ColumnTitlesRowSet" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.RowTitlesColumnSet" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.TitleDefinitionsClear" />
						</Dependents>
						<SettingsFile ReadValuesEvent="getTableTitlesAnnounceInfo" WriteValuesEvent="setTableTitlesAnnounceInfo" />
					</Setting>
					<Setting ID="WordSettings.DocumentSettings.Tables.ColumnTitlesRowSet" Type="List">
						<Dependents>
							<Dependent ID="WordSettings.DocumentSettings.Tables.TableTitlesAnnounce" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.TitleDefinitionsClear" />
						</Dependents>
						<SettingsFile ReadValuesEvent="getColumnTitlesRowInfo" WriteValuesEvent="setColumnTitlesRowInfo" />
					</Setting>
					<Setting ID="WordSettings.DocumentSettings.Tables.RowTitlesColumnSet" Type="List">
						<Dependents>
							<Dependent ID="WordSettings.DocumentSettings.Tables.TableTitlesAnnounce" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.TitleDefinitionsClear" />
						</Dependents>
						<SettingsFile ReadValuesEvent="getRowTitlesColumnInfo" WriteValuesEvent="setRowTitlesColumnInfo" />
					</Setting>
					<Setting ID="WordSettings.DocumentSettings.Tables.TitleDefinitionsClear" Type="Boolean">
						<Dependents>
							<Dependent ID="WordSettings.DocumentSettings.Tables.TableTitlesAnnounce" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.ColumnTitlesRowSet" />
							<Dependent ID="WordSettings.DocumentSettings.Tables.RowTitlesColumnSet" />
						</Dependents>
						<SettingsFile ReadValuesEvent="getClearTitleRowAndColumnDefinitionInfo" WriteValuesEvent="setClearTitleRowAndColumnDefinitionInfo" />
					</Setting>
				</Category>
			</Category>
		</Category>
	</QuickSettingsDefinitions>
</QuickSettings>
