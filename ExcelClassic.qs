<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<VariableBlock>
		<Variable ID="%Workbook%" Callback="xmlGetActiveWorkbook" />
		<Variable ID="%Worksheet%" Callback="xmlGetActiveSheetName" />
		<Variable ID="%Region%" Callback="xmlGetActiveRegionName" />
	</VariableBlock>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="ExcelOptions.DocumentSettings.PropertiesOfCells.Comments" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="ExcelOptions.DocumentSettings.PropertiesOfCells.Formulas" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="ExcelOptions.DocumentSettings.Formatting.DetectFormatConditions" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="ExcelOptions.ReadingOptions.HeaderAndContentOrder" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="ExcelOptions.ReadingOptions.FilterDetection" ShowConditionEvent="QuickSettingDisabledEvent" />
		</Excludes>
		<Category ID="BrailleOptions">
			<Category ID="BrailleOptions.TableOptions">
				<Setting ID="BrailleOptions.TableOptions.TableDisplay" Type="List">
					<Dependents>
						<Dependent ID="ExcelOptions.Braille.BrlStructuredMode" />
					</Dependents>
					<SettingsFile ReadValuesEvent="GetTableDisplayBrailleZoomInfo" WriteValuesEvent="SetTableDisplayBrailleZoomInfo" />
				</Setting>
			</Category>	
		</Category>
		<Category ID="ExcelOptions">
	 		<Category ID="ExcelOptions.Formatting">
	 			<Setting ID="ExcelOptions.Formatting.NumberFormatVerbosity" Type="Boolean">
	 				<SettingsFile Section="NonJCFOptions" Name="DetectCellNumberFormatChange" DefaultValue="0" />
		 		</Setting>
	 		</Category>
	 		<Category ID="ExcelOptions.CellAppearance">
	  		<Setting ID="ExcelOptions.CellAppearance.CellBorderVerbosity" Type="Boolean">
	  			<SettingsFile Section="NonJCFOptions" Name="DetectCellBorderChange" DefaultValue="0" />
	  		</Setting>
	 		</Category>
	 		<Category ID="ExcelOptions.MonitoringCells">
		  	<Setting ID="ExcelOptions.MonitoringCells.MonitorCellTitles" Type="Boolean">
		  		<SettingsFile Section="NonJCFOptions" Name="MonitorCellTitles" DefaultValue="1" />
		  	</Setting>
	 		</Category>
	  	<Category ID="ExcelOptions.WorkbookSettings">
	  		<Setting ID="ExcelOptions.WorkbookSettings.DocSettingsAssoc" Type="List">
	  			<SettingsFile ReadValuesEvent="getDocSettingsAssocInfo" WriteValuesEvent="setDocSettingsAssocInfo" />
	  		</Setting>
		  </Category>
		  <Category ID="ExcelOptions.ReadingOptions">
				<Setting ID="ExcelOptions.ReadingOptions.HeaderAndContentOrder" Type="List">
					<Values>
						<Value ID="ExcelOptions.ReadingOptions.HeaderAndContentOrder.0" />
						<Value ID="ExcelOptions.ReadingOptions.HeaderAndContentOrder.1" />
					</Values>
					<SettingsFile Section="NonJCFOptions" Name="TblHeaderContentOrder"  />
				</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.ToggleCellReadingVerbosity" Type="List">
	  			<Values>
	  				<Value ID="ExcelOptions.ReadingOptions.ToggleCellReadingVerbosity.0" />
	  				<Value ID="ExcelOptions.ReadingOptions.ToggleCellReadingVerbosity.1" />
	  			</Values>
	  			<SettingsFile Section="NonJCFOptions" Name="CellReadingVerbosity" DefaultValue="1" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.toggleSelectionReadingVerbosity" Type="List">
	  			<Values>
	  				<Value ID="ExcelOptions.ReadingOptions.toggleSelectionReadingVerbosity.0" />
	  				<Value ID="ExcelOptions.ReadingOptions.toggleSelectionReadingVerbosity.1" />
	  			</Values>
	  			<SettingsFile Section="NonJCFOptions" Name="SelectionReadingVerbosity" DefaultValue="0" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.FilterDetection" Type="Boolean">
	  			<SettingsFile Section="NonJCFOptions" Name="DetectFilters" DefaultValue="0" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.HyperlinkAddressAnnouncement" Type="Boolean">
	  			<SettingsFile Section="NonJCFOptions" Name="HyperlinkAddressAnnouncement" DefaultValue="0" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.ObjectCountDetection" Type="Boolean">
	  			<SettingsFile Section="NonJCFOptions" Name="DetectObjectCount" DefaultValue="1" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.PagebreaksDetection" Type="Boolean">
	  			<SettingsFile FileName="%Workbook%" Section="doc" Name="DetectPagebreaks" DefaultValue="0" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.BlankCellAnnouncement" Type="Boolean">
	  			<SettingsFile Section="NonJCFOptions" Name="CellReadingBlank" />
	  		</Setting>
	  		<Setting ID="ExcelOptions.ReadingOptions.togglePointModeVerbosity" Type="List">
	  			<Values>
	  				<Value ID="ExcelOptions.ReadingOptions.togglePointModeVerbosity.0" />
	  				<Value ID="ExcelOptions.ReadingOptions.togglePointModeVerbosity.1" />
	  				<Value ID="ExcelOptions.ReadingOptions.togglePointModeVerbosity.2" />
	  				<Value ID="ExcelOptions.ReadingOptions.togglePointModeVerbosity.3" />
	  			</Values>
	  			<SettingsFile Section="NonJCFOptions" Name="PointModeVerbosity" DefaultValue="1" />
	  		</Setting>
		  </Category>
		  <Category ID="ExcelOptions.Braille">
		  	<Setting ID="ExcelOptions.Braille.BrlStructuredMode" Type="List">
		  		<Dependents>
		  			<Dependent ID="BrailleOptions.TableOptions.TableDisplay" Type="List" />
		  		</Dependents>
		  		<SettingsFile ReadValuesEvent="GetBrlStructuredModeInfo" WriteValuesEvent="SetBrlStructuredModeInfo" />
		  	</Setting>
		  </Category>
		  <Category ID="ExcelOptions.DocumentSettings" DocumentNode="True">
		  	<Category ID="ExcelOptions.DocumentSettings.Formatting">
					<Setting ID="ExcelOptions.DocumentSettings.Formatting.FontChanges" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="%Worksheet%" Name="FontChanges" DefaultValue="0" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.Formatting.TitleCellFontAndFormattingIndication" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="doc" Name="TitleCellFontAndFormattingIndication" DefaultValue="0" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.Formatting.DetectFormatConditions" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="doc" Name="FormatConditionsDetection" DefaultValue="0" />
		  		</Setting>
		  	</Category>
		  	<Category ID="ExcelOptions.DocumentSettings.CellAppearance">
			  	<Setting ID="ExcelOptions.DocumentSettings.CellAppearance.AnnounceTextVisible" Type="Boolean">
			  		<SettingsFile FileName="%Workbook%" Section="doc" Name="CellTextVisibility" DefaultValue="0" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.CellAppearance.OrientationIndication" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="doc" Name="OrientationIndication" DefaultValue="0" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.CellAppearance.CellShadingChanges" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="doc" Name="ShadingChanges" DefaultValue="0" />
		  		</Setting>
		  	</Category>
		  	<Category ID="ExcelOptions.DocumentSettings.TitleReading">
					<Setting ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures" Type="Boolean">
		  	 		<Dependents>
			  	 		<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.OverrideDocNamedTitles"/>
		  	 			<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.MultipleRegionSupport" />
		  	 			<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  	 		</Dependents>
		  	 		<SettingsFile ReadValuesEvent="getAllowPerformanceImpactingFeaturesInfo" WriteValuesEvent="setAllowPerformanceImpactingFeaturesInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
					</Setting>
		  	 	<Setting ID="ExcelOptions.DocumentSettings.TitleReading.OverrideDocNamedTitles" Type="List">
		  	 		<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures" />
		  	 			<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.MultipleRegionSupport" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  	 		</Dependents>
		 				<SettingsFile ReadValuesEvent="GetOverrideDocNamedTitlesInfo" WriteValuesEvent="SetOverrideDocNamedTitlesInfo"/>
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.MultipleRegionSupport" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures" />
		  				<Dependent ID="%Region%" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
		  			</Dependents>
		  			<!-- Although this is pretty straightforward, it must be done custom -->
		  			<!-- because the setting changes how the collections under the hood behave. -->
		  			<SettingsFile ReadValuesEvent="getMultipleRegionSupportInfo" WriteValuesEvent="setMultipleRegionSupportInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures"/>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  			</Dependents>
		  			<SettingsFile ReadValuesEvent="GetTitleReadingVerbosityInfo" WriteValuesEvent="SetTitleReadingVerbosityInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.TitleSpeaksForCells" Type="List">
		  			<Values>
		  				<Value ID="ExcelOptions.DocumentSettings.TitleReading.TitleSpeaksForCells.0" />
		  				<Value ID="ExcelOptions.DocumentSettings.TitleReading.TitleSpeaksForCells.1" />
		  			</Values>
		  			<SettingsFile FileName="%Workbook%" Section="%Worksheet%" Name="TitleSpeaksForCells" DefaultValue="0"  />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures"/>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  			</Dependents>
		  			<SettingsFile  ReadValuesEvent="getColTitlesToRowRangeInfo" WriteValuesEvent="SetColTitlesToRowRangeInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures"/>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  			</Dependents>
		  			<SettingsFile ReadValuesEvent="getRowTitlesToColumnRangeInfo" WriteValuesEvent="setRowTitlesToColumnRangeInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.SetTotalsColumnToCurrent" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  			</Dependents>
		  			<SettingsFile ReadValuesEvent="getTotalsColumnInfo" WriteValuesEvent="setTotalsColumnInfo" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.SetTotalsRowToCurrent" Type="List">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" />
		  			</Dependents>
		  			<SettingsFile ReadValuesEvent="getTotalsRowInfo" WriteValuesEvent="setTotalsRowInfo" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.TitleReading.ClearDefinitions" Type="Boolean">
		  			<Dependents>
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.AllowPerformanceImpactingFeatures" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.ColTitlesToRowRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.RowTitlesToColumnRange" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.TitleReadingVerbosity" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.SetTotalsRowToCurrent" />
		  				<Dependent ID="ExcelOptions.DocumentSettings.TitleReading.SetTotalsColumnToCurrent" />
		  			</Dependents>
		  			<SettingsFile ReadValuesEvent="getClearRegionDefinitionsInfo" WriteValuesEvent="setClearRegionDefinitionsInfo" />
		  		</Setting>
				</Category>
			  <Category ID="ExcelOptions.DocumentSettings.MonitoringCells">
			  	<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" Type="Boolean">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.10" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.1" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.2" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.3" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.4" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.5" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.6" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.7" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.8" />
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.9" />
			  		</Dependents>
			  		<SettingsFile ReadValuesEvent="getClearedMonitorCellInfo" WriteValuesEvent="setClearedMonitorCellInfo" OnDependeeChangedEvent="OnDependeeInfoChange" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.1" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.2" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.3" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.4" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.5" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.6" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.7" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.8" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.9" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.MonitoringCells.MonitorCell.10" Type="List">
			  		<Dependents>
			  			<Dependent ID="ExcelOptions.DocumentSettings.MonitoringCells.ClearMonitorCells" />
			  		</Dependents>
		  			<SettingsFile ReadValuesEvent="getMonitorCellsInfo" WriteValuesEvent="setMonitorCellsInfo" />
			  	</Setting>
			  </Category>
		  	<Category ID="ExcelOptions.DocumentSettings.PropertiesOfCells">
		  		<Setting ID="ExcelOptions.DocumentSettings.PropertiesOfCells.Formulas" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="%Worksheet%" Name="Formulas" DefaultValue="1" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.PropertiesOfCells.Comments" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="%Worksheet%" Name="Comments" DefaultValue="1" />
		  		</Setting>
		  		<Setting ID="ExcelOptions.DocumentSettings.PropertiesOfCells.MergedCells" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="%Worksheet%" Name="MergedCells" DefaultValue="1" />
		  		</Setting>
			  </Category>
		  	<Category ID="ExcelOptions.DocumentSettings.ReadingOptions">
		  		<Setting ID="ExcelOptions.DocumentSettings.ReadingOptions.FormControlsDetection" Type="Boolean">
		  			<SettingsFile FileName="%Workbook%" Section="doc" Name="DetectFormControls" DefaultValue="0" />
		  		</Setting>
			  </Category>
		  </Category>
	  </Category>
	</QuickSettingsDefinitions>
</QuickSettings>
