<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<VariableBlock>
		<Variable ID="%BrailleDisplayName%" Callback="getBrailleDisplayNameForVariable" />
	</VariableBlock>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="TouchCursorOptions.ConfigureTypes" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="BrailleOptions" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="VirtualCursorOptions" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="GeneralOptions.IncludeDimensions" ShowConditionEvent="QuickSettingDisabledEvent" />
			<Exclude ID="GeneralOptions.EnableScreenShade" ShowConditionEvent="QuickSettingDisabledEvent" />
		</Excludes>
		<Category ID="TouchCursorOptions">
			<Setting ID="TouchCursorOptions.AutomaticActivation" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="AutomaticTouchCursorActivation" />
			</Setting>
			<Setting ID="TouchCursorOptions.NavigationQuickKeys" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="TouchQuickKeyNavigationMode" />
			</Setting>
			<Setting ID="TouchCursorOptions.UseSounds" Type="Boolean">
				<SettingsFile FileName="default.jcf" Section="NonJCFOptions" Name="UseTouchNavigationSounds" />
			</Setting>
			<Setting ID="TouchCursorOptions.NavigateByType" Type="List">
				<Values>
					<Value ID="TouchCursorOptions.NavigateByType.0" Index="1" />
					<Value ID="TouchCursorOptions.NavigateByType.1" Index="2" />
					<Value ID="TouchCursorOptions.NavigateByType.2" Index="3" />
					<Value ID="TouchCursorOptions.NavigateByType.3" Index="4" />
					<Value ID="TouchCursorOptions.NavigateByType.4" Index="5" />
					<Value ID="TouchCursorOptions.NavigateByType.5" Index="6" />
					<Value ID="TouchCursorOptions.NavigateByType.6" Index="7" />
					<Value ID="TouchCursorOptions.NavigateByType.7" Index="8" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="TouchRotorInitialType" />
			</Setting>
			<Category ID="TouchCursorOptions.ConfigureTypes">
				<Setting ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Button" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Calendar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Checkbox" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ComboBox" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Custom" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.DataGrid" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.DataItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Document" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Edit" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Group" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Header" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.HeaderItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Heading" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Hyperlink" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Image" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.List" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ListItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Menu" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.MenuBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.MenuItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Pane" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ProgressBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RadioButton" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Region" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ScrollBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Separator" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Slider" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Spinner" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.SplitButton" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.StatusBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Tab" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.TabItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Table" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Text" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Thumb" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.TitleBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ToolBar" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.ToolTip" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Tree" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.TreeItem" />
						<Dependent ID="TouchCursorOptions.ConfigureTypes.Window" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="RestoreToDefaultQuickSettingsOptionReadEvent"
						WriteValuesEvent="RestoreToDefaultQuickSettingsOptionWriteEvent"
						OnDependeeChangedEvent="OnDependeeInfoChange" />
				</Setting>
				<!-- All types need to have the type as final segment of the Setting ID, -->
				<!-- So the Read and Write Callback functions for these is getting it right. -->
				<Setting ID="TouchCursorOptions.ConfigureTypes.Button" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Calendar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Checkbox" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ComboBox" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Custom" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.DataGrid" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.DataItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Document" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Edit" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Group" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Header" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.HeaderItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Heading" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Hyperlink" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Image" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.List" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ListItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Menu" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.MenuBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.MenuItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Pane" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ProgressBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.RadioButton" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Region" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ScrollBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Separator" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Slider" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Spinner" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.SplitButton" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.StatusBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Tab" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.TabItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Table" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Text" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Thumb" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.TitleBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ToolBar" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.ToolTip" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Tree" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.TreeItem" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
				<Setting ID="TouchCursorOptions.ConfigureTypes.Window" Type="Boolean">
					<Dependents>
						<Dependent ID="TouchCursorOptions.ConfigureTypes.RestoreToDefault" />
					</Dependents>
					<SettingsFile
						ReadValuesEvent="QuickSetttingsTouchNavigationReadEvent"
						WriteValuesEvent="QuickSetttingsTouchNavigationWriteEvent"
					/>
				</Setting>
			</Category>
		</Category>
		<Category ID="GeneralOptions">
			<Setting ID="GeneralOptions.UserVerbosity" Type="List">
				<Values>
					<Value ID="GeneralOptions.UserVerbosity.0" />
					<Value ID="GeneralOptions.UserVerbosity.1" />
					<Value ID="GeneralOptions.UserVerbosity.2" />
				</Values>
				<SettingsFile Section="Options" Name="Verbosity" />
			</Setting>
			<Setting ID="GeneralOptions.VirtualRibbonMenu" Type="Boolean">
				<SettingsFile Section="Options" Name="VirtualRibbonSupport" />
			</Setting>
			<Setting ID="GeneralOptions.ProgressBars" Type="List">
				<!-- Setting is either an int value in milliseconds or it is OFF -->
				<!-- previously stored as a global from the JCF Option when turning it off, -->
				<!-- then restoring the value in ms when turning it back on. -->
				<SettingsFile  ReadValuesEvent="getProgressBarsInfo" WriteValuesEvent="setProgressBarsInfo" />
			</Setting>
			<Setting ID="GeneralOptions.TopAndBottomEdge" Type="List">
				<!-- Use list for settings with on/off output whose display text is not on/off, e.g. spoken, silent -->
				<Values>
					<Value ID="GeneralOptions.TopAndBottomEdge.0" />
					<Value ID="GeneralOptions.TopAndBottomEdge.1" />
				</Values>
				<SettingsFile Section="Options" Name="TopAndBottomEdgeAlert" />
			</Setting>
			<Setting ID="GeneralOptions.Graphics" Type="List">
				<Values>
					<Value ID="GeneralOptions.Graphics.0" />
					<Value ID="GeneralOptions.Graphics.1" />
					<Value ID="GeneralOptions.Graphics.2" />
				</Values>
				<SettingsFile Section="OSM" Name="IncludeGraphics" />
			</Setting>
			<!-- This will be disabled except in Word and Outlook 2007 or later. -->
			<!-- While CategoryOrder lets you move categories, the only way ti insert a setting between two defaults is add it by default and disable it except where you want it. -->
			<Setting ID="GeneralOptions.IncludeDimensions" Type="Boolean">
				<SettingsFile Section="RichEdit and Edit Control Options" Name="AppendShapeDimensions" />
			</Setting>
			<Setting ID="GeneralOptions.IncludeAlignmentDesc" Type="Boolean">
				<SettingsFile Section="RichEdit and Edit Control Options" Name="AppendShapeAlignment" />
			</Setting>
			<Setting ID="GeneralOptions.ScreenEcho" Type="List">
				<Values>
					<Value ID="GeneralOptions.ScreenEcho.0" />
					<Value ID="GeneralOptions.ScreenEcho.1" />
					<Value ID="GeneralOptions.ScreenEcho.2" />
				</Values>
				<SettingsFile Section="Options" Name="ScreenEcho" />
			</Setting>
			<Setting ID="GeneralOptions.FocusLoss" Type="Boolean">
				<SettingsFile FileName="default.jcf" Section="Options" Name="AnnounceFocusLoss" DefaultValue="0"  />
			</Setting>
			<Setting ID="GeneralOptions.EnableScreenShade" Type="Boolean">
				<SettingsFile ReadValuesEvent="getScreenShadeInfo" WriteValuesEvent="setScreenShadeInfo" />
			</Setting>
			<Setting ID="GeneralOptions.InterruptSpeechWhenADialogBoxIsCreated" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="InterruptSpeechWhenADialogBoxIsCreated" />
			</Setting>
			<Setting ID="GeneralOptions.UseInferredAccessKeys" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="UseInferredAccessKeys" DefaultValue="1" />
			</Setting>
		</Category>
		<Category ID="ConvenientOCR">
			<Setting ID="ConvenientOCR.Primary" Type="List">
				<SettingsFile ReadValuesEvent="getPrimaryOCRLanguageInfo" WriteValuesEvent="setPrimaryOCRLanguageInfo" />
			</Setting>
			<Setting ID="ConvenientOCR.Secondary" Type="List">
				<SettingsFile ReadValuesEvent="getSecondaryOCRLanguageInfo" WriteValuesEvent="setSecondaryOCRLanguageInfo" />
			</Setting>
		</Category>
		<Category ID="ReadingOptions">
			<Setting ID="ReadingOptions.TextAnalyzer" Type="List">
				<Values>
					<Value ID="ReadingOptions.TextAnalyzer.0" />
					<Value ID="ReadingOptions.TextAnalyzer.1" />
					<Value ID="ReadingOptions.TextAnalyzer.2" />
					<Value ID="ReadingOptions.TextAnalyzer.3" />
				</Values>
				<SettingsFile Section="Options" Name="TextAnalyser" DefaultValue="0"  />
			</Setting>
			<Setting ID="ReadingOptions.AnnotationIndication" Type="List">
				<Values>
					<Value ID="ReadingOptions.AnnotationIndication.0" />
					<Value ID="ReadingOptions.AnnotationIndication.1" />
					<Value ID="ReadingOptions.AnnotationIndication.2" />
				</Values>
				<SettingsFile Section="RichEdit and Edit Control Options" Name="ExpandAnnotationsInline" />
			</Setting>
			<Setting ID="ReadingOptions.SmartWordReading" Type="Boolean">
				<SettingsFile Section="Options" Name="SmartWordReading" DefaultValue="0" />
			</Setting>
			<Setting ID="ReadingOptions.LanguageDetectChange" Type="Boolean">
				<SettingsFile ReadValuesEvent="GetLanguageDetectChangeInfo" WriteValuesEvent="SetLanguageDetectChangeInfo" />
			</Setting>
			<Setting ID="ReadingOptions.CustomLabels" Type="Boolean">
				<SettingsFile Section="OSM" Name="UseCustomLabels" DefaultValue="0" />
			</Setting>
			<Setting ID="ReadingOptions.StopwordsExceptionDictionary" Type="Boolean">
				<SettingsFile Section="Options" Name="WordIndexStopwords" DefaultValue="0" />
			</Setting>
		</Category>
		<Category ID="SayAllOptions">
			<Setting ID="SayAllOptions.Scheme" Type="List">
				<!-- Uses a specified list from a separate JCF key -->
				<Dependents>
					<Dependent ID="DocumentSettings.Scheme" />
				</Dependents>
				<SettingsFile  ReadValuesEvent="getSayAllSchemeInfo" WriteValuesEvent="setSayAllSchemeInfo" />
			</Setting>
			<Setting ID="SayAllOptions.SayAllReadsBy" Type="List">
				<!-- manages two separate JCF options -->
				<SettingsFile  ReadValuesEvent="getSayAllReadsByInfo" WriteValuesEvent="SetSayAllReadsByInfo" />
			</Setting>
			<Setting ID="SayAllOptions.Capitalization" Type="List">
				<!-- This is and off / on setting but messages are specific not just off and on -->
				<Values>
					<Value ID="SayAllOptions.Capitalization.0" />
					<Value ID="SayAllOptions.Capitalization.1" />
				</Values>
				<SettingsFile Section="Options" Name="SayAllIndicateCaps" />
			</Setting>
		</Category>
		<Category ID="EditingOptions">
			<Setting ID="EditingOptions.TypingEcho" Type="List">
				<Values>
					<Value ID="EditingOptions.TypingEcho.0" />
					<Value ID="EditingOptions.TypingEcho.1" />
					<Value ID="EditingOptions.TypingEcho.2" />
					<Value ID="EditingOptions.TypingEcho.3" />
				</Values>
				<SettingsFile Section="Options" Name="TypingEcho" />
			</Setting>
			<Setting ID="EditingOptions.CapsIndicate" Type="List">
				<Values>
					<Value ID="EditingOptions.CapsIndicate.0" />
					<Value ID="EditingOptions.CapsIndicate.1" />
					<Value ID="EditingOptions.CapsIndicate.2" />
					<Value ID="EditingOptions.CapsIndicate.3" />
				</Values>
				<SettingsFile Section="Options" Name="IndicateCaps" />
			</Setting>
			<Setting ID="EditingOptions.Punctuation" Type="List">
				<!-- <Values>
					<Value ID="EditingOptions.Punctuation.0" />
					<Value ID="EditingOptions.Punctuation.1" />
					<Value ID="EditingOptions.Punctuation.2" />
					<Value ID="EditingOptions.Punctuation.3" />
				</Values> -->
				<SettingsFile ReadValuesEvent="getVoicePunctuationInfo" WriteValuesEvent="SetVoicePunctuationInfo" />
			</Setting>
			<Setting ID="EditingOptions.Indentation" Type="List">
				<!-- 0 Ignore, 1 Indicate -->
				<Values>
					<Value ID="EditingOptions.Indentation.0" />
					<Value ID="EditingOptions.Indentation.1" />
				</Values>
				<SettingsFile Section="Options" Name="Indentation" />
			</Setting>
		</Category>
		<Category ID="SpellingOptions">
			<Setting ID="SpellingOptions.TextSpell" Type="List">
				<!-- 0 Alphabetically, 1 Phonetically -->
				<Values>
					<Value ID="SpellingOptions.TextSpell.0" />
					<Value ID="SpellingOptions.TextSpell.1" />
				</Values>
				<SettingsFile Section="Options" Name="SpellPhonetic" />
			</Setting>
			<Setting ID="SpellingOptions.AlphaNumericText" Type="List">
				<!-- 0 Read as word, 1 Spell, 2 Spell Phonetically -->
				<Values>
					<Value ID="SpellingOptions.AlphaNumericText.0" />
					<Value ID="SpellingOptions.AlphaNumericText.1" />
					<Value ID="SpellingOptions.AlphaNumericText.2" />
				</Values>
				<SettingsFile Section="Options" Name="SpellAlphanumericData" />
			</Setting>
		</Category>
		<Category ID="NumbersOptions">
			<Setting ID="NumbersOptions.SingleDigitsThreshold" Type="List">
				<Values>
					<Value ID="NumbersOptions.SingleDigitsThreshold.0" />
					<Value ID="NumbersOptions.SingleDigitsThreshold.1" Index="5" />
					<Value ID="NumbersOptions.SingleDigitsThreshold.2" />
					<Value ID="NumbersOptions.SingleDigitsThreshold.3" />
					<Value ID="NumbersOptions.SingleDigitsThreshold.4" />
				</Values>
				<SettingsFile Section="Options" Name="SingleDigitThreshold" DefaultValue="5" />
			</Setting>
			<Setting ID="NumbersOptions.SingleDigitsDashes" Type="Boolean">
				<SettingsFile Section="Options" Name="SpeakNumbersSepByDashesAsDigits" DefaultValue="1" />
			</Setting>
		</Category>
		<Category ID="VirtualCursorOptions">
			<Setting ID="VirtualCursorOptions.VirtualCursorVerbosityLevel" Type="List">
				<Dependents>
					<Dependent ID="DocumentSettings.VirtualCursorVerbosityLevel" />
				</Dependents>
				<SettingsFile Section="VirtualCursorVerbosity" Name="VirtualCursorVerbosityLevel"  DefaultValue="1" />
					<Values>
						<Value ID="VirtualCursorOptions.VirtualCursorVerbosityLevel.0" />
						<Value ID="VirtualCursorOptions.VirtualCursorVerbosityLevel.1" />
						<Value ID="VirtualCursorOptions.VirtualCursorVerbosityLevel.2" />
					</Values>
			</Setting>
			<Setting ID="VirtualCursorOptions.ElementDescription" Type="Boolean">
				<SettingsFile ReadValuesEvent="getVCVElementDescriptionInfo" WriteValuesEvent="SetVCVElementDescriptionInfo"/>
			</Setting>
			<Setting ID="VirtualCursorOptions.GlanceHighlightIndication" Type="List">
				<Dependents>
					<Dependent ID="DocumentSettings.GlanceHighlightIndication" />
				</Dependents>
				<Values>
					<Value ID="VirtualCursorOptions.GlanceHighlightIndication.0" />
					<Value ID="VirtualCursorOptions.GlanceHighlightIndication.1" />
					<Value ID="VirtualCursorOptions.GlanceHighlightIndication.2" />
					<Value ID="VirtualCursorOptions.GlanceHighlightIndication.3" />
				</Values>
				<SettingsFile Section="PageAnalyzer" Name="sghIndication"  DefaultValue="1" />
			</Setting>
			<Setting ID="VirtualCursorOptions.AllowWebApplicationReservedKeystrokes" Type="Boolean">
				<Dependents>
					<Dependent ID="DocumentSettings.AllowWebApplicationReservedKeystrokes" />
				</Dependents>
				<SettingsFile ReadValuesEvent="getAllowWebAppReservedKeystrokesInfo" WriteValuesEvent="setAllowWebAppReservedKeystrokesInfo" />
			</Setting>
			<Setting ID="VirtualCursorOptions.SelectandCopy" Type="List">
				<Dependents>
					<Dependent ID="DocumentSettings.SelectandCopy" />
				</Dependents>
				<SettingsFile ReadValuesEvent="getSelectandCopyInfo" WriteValuesEvent="setSelectandCopyInfo" />
			</Setting>
			<Setting ID="VirtualCursorOptions.ReadOnlyState" Type="List">
				<!-- This is inverse, e.g suppres, 0 = on or announce, 1 = suppress or off / don't announce -->
				<Values>
					<Value ID="VirtualCursorOptions.ReadOnlyState.0" />
					<Value ID="VirtualCursorOptions.ReadOnlyState.1" />
				</Values>
				<Dependents>
					<Dependent ID="DocumentSettings.ReadOnlyState" />
				</Dependents>
				<SettingsFile Section="HTML" Name="ReadOnlyState"  />
			</Setting>
			<Setting ID = "VirtualCursorOptions.IndicateInsAndDelInVirtualDocs"  Type="Boolean">
				<Dependents>
					<Dependent ID="DocumentSettings.IndicateInsAndDelInVirtualDocs" />
				</Dependents>
				<SettingsFile Section="HTML" Name="IndicateInsAndDelInVirtualDocs" />
			</Setting>
			<Category ID="VirtualCursorOptions.FormsOptions">
				<Setting ID="VirtualCursorOptions.FormsOptions.AutoFormsMode" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.FormsOptions.AutoFormsMode" />
						<Dependent ID="VirtualCursorOptions.FormsOptions.NavigationQuickKeyDelay" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getAutoFormsModeInfo" WriteValuesEvent="setAutoFormsModeInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.FormsOptions.UseSound " Type="Boolean">
					<SettingsFile Section="FormsMode" Name="IndicateFormsModeWithSounds" />
				</Setting>
				<Setting ID="VirtualCursorOptions.FormsOptions.NavigationQuickKeyDelay" Type="List">
					<SettingsFile ReadValuesEvent="getQuickNavigationKeyDelayInfo" WriteValuesEvent="setQuickNavigationKeyDelayInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.0" />
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.1" />
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.2" />
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.3" />
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.4" />
						<Value ID="VirtualCursorOptions.FormsOptions.ButtonsShowUsing.5" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.FormsOptions.ButtonsShowUsing" />
					</Dependents>
					<SettingsFile Section="HTML" Name="ButtonTextOptions"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.0" />
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.1" />
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.2" />
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.3" />
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.4" />
						<Value ID="VirtualCursorOptions.FormsOptions.FormFieldsIdentifyPromptUsing.5" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.FormsOptions.FormFieldsIdentifyPromptUsing" />
					</Dependents>
					<SettingsFile Section="HTML" Name="FormFieldPromptOptions"  />
				</Setting>
				<Setting ID = "VirtualCursorOptions.FormsOptions.FormsModeOffWhenNewPageLoads" Type="Boolean">
					<Dependents>
						<Dependent ID = "DocumentSettings.FormsOptions.FormsModeOffWhenNewPageLoads" />
						<Dependent ID="VirtualCursorOptions.FormsOptions.AutoFormsMode" />
					</Dependents>
					<SettingsFile Section="FormsMode" Name="FormsModeAutoOff" />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.GeneralOptions">
				<Setting ID="VirtualCursorOptions.GeneralOptions.AnnouncePageElementsOnLoad" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="AnnouncePageElementsOnLoad" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.SmartNavigation" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.GeneralOptions.SmartNavigation.0" />
						<Value ID="VirtualCursorOptions.GeneralOptions.SmartNavigation.1" />
						<Value ID="VirtualCursorOptions.GeneralOptions.SmartNavigation.2" />
						<Value ID="VirtualCursorOptions.GeneralOptions.SmartNavigation.3" />
					</Values>
					<Dependents>
						<Dependent ID="VirtualCursorOptions.FormsOptions.AutoFormsMode" />
						<Dependent ID="VirtualCursorOptions.GeneralOptions.DocumentPresentation" />
					</Dependents>
					<SettingsFile Section="html" Name="SmartNavigation" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.DocumentAutomaticallyReads" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.DocumentAutomaticallyReads" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getDocumentAutomaticallyReadsInfo" WriteValuesEvent="setDocumentAutomaticallyReadsInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.NavigationQuickKeys" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.NavigationQuickKeys" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getNavigationQuickKeysInfo" WriteValuesEvent="setNavigationQuickKeysInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.DocumentPresentation" Type="List">
					<Dependents>
						<Dependent ID="BrailleOptions.TableOptions.TableDisplay" />
						<Dependent ID="DocumentSettings.GeneralOptions.DocumentPresentation" />
					</Dependents>
					<SettingsFile ReadValuesEvent="GetDocumentPresentationInfo" WriteValuesEvent="SetDocumentPresentationInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.CustomPageSummary" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.GeneralOptions.CustomPageSummary.0" />
						<Value ID="VirtualCursorOptions.GeneralOptions.CustomPageSummary.1" />
						<Value ID="VirtualCursorOptions.GeneralOptions.CustomPageSummary.2" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.CustomPageSummary" />
					</Dependents>
					<SettingsFile Section="Options" Name="CustomPageSummary" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.AccessKeysShow" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.AccessKeysShow" />
					</Dependents>
					<SettingsFile Section="HTML" Name="AccessKeys" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.AttributesIndicate" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.AttributesIndicate" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IndicateElementAttributes" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.FlashMoviesRecognize" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.FlashMoviesRecognize" />
					</Dependents>
					<SettingsFile Section="HTML" Name="EmbeddedActiveXSupport" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.PageRefresh" Type="List">
					<!-- This setting is either set to off or the value of the previously stored setting, e.g Default. -->
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.PageRefresh " />
					</Dependents>
					<SettingsFile ReadValuesEvent="GetPageRefreshInfo" WriteValuesEvent="SetPageRefreshInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.AnnounceLiveRegionUpdates" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.GeneralOptions.AnnounceLiveRegionUpdates" />
					</Dependents>
					<SettingsFile Section="HTML" Name="AnnounceLiveRegionUpdates" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.ScreenTrackVirtualCursor" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TextOptions.ScreenTrackVirtualCursor" />
					</Dependents>
					<SettingsFile Section="HTML" Name="ScreenFollowsVCursor" />
				</Setting>
				<Setting ID="VirtualCursorOptions.GeneralOptions.VirtualDocumentLinkActivationMethod" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.GeneralOptions.VirtualDocumentLinkActivationMethod.0" />
						<Value ID="VirtualCursorOptions.GeneralOptions.VirtualDocumentLinkActivationMethod.1" />
					</Values>
					<Dependents>
						<Dependent ID="VirtualCursorOptions.GeneralOptions.VirtualDocumentLinkActivationMethod" />
					</Dependents>
					<SettingsFile Section="Options" Name="VirtualDocumentLinkActivationMethod" />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.TextOptions">
				<Setting ID="VirtualCursorOptions.TextOptions.AbbreviationsExpand" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TextOptions.AbbreviationsExpand" />
					</Dependents>
					<SettingsFile Section="HTML" Name="ExpandAbbreviations" />
				</Setting>
				<Setting ID="VirtualCursorOptions.TextOptions.AcronymsExpand" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TextOptions.AcronymsExpand" />
					</Dependents>
					<SettingsFile Section="HTML" Name="ExpandAcronyms" />
				</Setting>
				<Setting ID="VirtualCursorOptions.TextOptions.RepeatedTextSkip" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TextOptions.RepeatedTextSkip" />
					</Dependents>
					<SettingsFile Section="HTML" Name="SkipPastRepeatedText" />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.GraphicsOptions">
				<Setting ID="VirtualCursorOptions.GraphicsOptions.GraphicsShow" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsShow.0" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsShow.1" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsShow.2" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.GraphicsOptions.GraphicsShow" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IncludeGraphics"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy.0" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy.1" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy.2" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy.3" />
						<Value ID="VirtualCursorOptions.GraphicsOptions.GraphicsRecognizeBy.4" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.GraphicsOptions.GraphicsRecognizeBy" />
					</Dependents>
					<SettingsFile Section="HTML" Name="GraphicRenderingOption"  />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.LinksOptions">
				<Setting ID="VirtualCursorOptions.LinksOptions.FilterConsecutiveDuplicateLinks" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.FilterConsecutiveDuplicateLinks" />
					</Dependents>
					<SettingsFile Section="HTML" Name="FilterConsecutiveDuplicateLinks" />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.GraphicalLinksShow" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.LinksOptions.GraphicalLinksShow.0" />
						<Value ID="VirtualCursorOptions.LinksOptions.GraphicalLinksShow.1" />
						<Value ID="VirtualCursorOptions.LinksOptions.GraphicalLinksShow.2" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.GraphicalLinksShow" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IncludeGraphicLinks"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.UntaggedGraphicalLinksShow" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.UntaggedGraphicalLinksShow" />
					</Dependents>
					<SettingsFile ReadValuesEvent="GetUntaggedGraphicalLinkShowInfo" WriteValuesEvent="SetUntaggedGraphicalLinkShowInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.LinksInImageMapsShow" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.LinksOptions.LinksInImageMapsShow.0" />
						<Value ID="VirtualCursorOptions.LinksOptions.LinksInImageMapsShow.1" />
						<Value ID="VirtualCursorOptions.LinksOptions.LinksInImageMapsShow.2" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.LinksInImageMapsShow" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IncludeImageMapLinks"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.TextLinksShowUsing" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.TextLinksShowUsing" />
					</Dependents>
					<SettingsFile ReadValuesEvent="getTextLinksInfo" WriteValuesEvent="setTextLinksInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.LinksIdentifyType" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.LinksIdentifyType" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IdentifyLinkType" />
				</Setting>
				<Setting ID="VirtualCursorOptions.LinksOptions.LinksIdentifySamePage" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.LinksOptions.LinksIdentifySamePage" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IdentifySamePageLinks" />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.HeadingAndFrameOptions">
				<Setting ID="VirtualCursorOptions.HeadingAndFrameOptions.HeadingsAnnounce" Type="List">
					<Dependents>
						<Dependent ID="DocumentSettings.HeadingAndFrameOptions.HeadingsAnnounce" />
					</Dependents>
					<SettingsFile ReadValuesEvent="GetHeadingsInfo" WriteValuesEvent="SetHeadingsInfo" />
				</Setting>
				<Setting ID="VirtualCursorOptions.HeadingAndFrameOptions.HeadingNavigation" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.HeadingAndFrameOptions.HeadingNavigation.0" />
						<Value ID="VirtualCursorOptions.HeadingAndFrameOptions.HeadingNavigation.1" />
						<Value ID="VirtualCursorOptions.HeadingAndFrameOptions.HeadingNavigation.2" />
					</Values>
					<SettingsFile Section="HTML" Name="HeadingNavigation" />
				</Setting>
				<Setting ID="VirtualCursorOptions.HeadingAndFrameOptions.InlineFramesShow" Type="List">
					<!-- This is only a list because 0 = on and 1 =off -->
					<Values>
						<Value ID="VirtualCursorOptions.HeadingAndFrameOptions.InlineFramesShow.0" />
						<Value ID="VirtualCursorOptions.HeadingAndFrameOptions.InlineFramesShow.1" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.HeadingAndFrameOptions.InlineFramesShow" />
					</Dependents>
					<SettingsFile Section="HTML" Name="IgnoreInlineFrames"  />
				</Setting>
			</Category>
			<Category ID="VirtualCursorOptions.TableOptions">
				<Setting ID="VirtualCursorOptions.TableOptions.LayoutTables" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TableOptions.LayoutTables" />
					</Dependents>
					<SettingsFile Section="OSM" Name="TableDetection" />
				</Setting>
				<Setting ID="VirtualCursorOptions.TableOptions.TableTitles" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.TableOptions.TableTitles.0" />
						<Value ID="VirtualCursorOptions.TableOptions.TableTitles.1" />
						<Value ID="VirtualCursorOptions.TableOptions.TableTitles.2" />
						<Value ID="VirtualCursorOptions.TableOptions.TableTitles.3" />
						<Value ID="VirtualCursorOptions.TableOptions.TableTitles.4" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.TableOptions.TableTitles" />
						<Dependent ID="DocsTableOptions.TableTitles" />
					</Dependents>
					<SettingsFile Section="NonJCFOptions" Name="TblHeaders"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.TableOptions.HeaderAndContentOrder" Type="List">
					<Values>
						<Value ID="VirtualCursorOptions.TableOptions.HeaderAndContentOrder.0" />
						<Value ID="VirtualCursorOptions.TableOptions.HeaderAndContentOrder.1" />
					</Values>
					<Dependents>
						<Dependent ID="DocumentSettings.TableOptions.HeaderAndContentOrder" />
					</Dependents>
					<SettingsFile Section="NonJCFOptions" Name="TblHeaderContentOrder"  />
				</Setting>
				<Setting ID="VirtualCursorOptions.TableOptions.CellCoordinatesAnnouncement" Type="Boolean">
					<Dependents>
						<Dependent ID="DocumentSettings.TableOptions.CellCoordinatesAnnouncement" />
					</Dependents>
					<SettingsFile Section="NonJCFOptions" Name="DefaultVCursorCellCoordinatesAnnouncement" />
				</Setting>
			</Category>
		</Category>
		<Category ID="BrailleOptions">
			<Setting ID="BrailleOptions.Mode" Type="List">
				<Values>
					<Value ID="BrailleOptions.Mode.0" />
					<Value ID="BrailleOptions.Mode.1" />
					<Value ID="BrailleOptions.Mode.2" />
					<Value ID="BrailleOptions.Mode.3" />
				</Values>
				<SettingsFile Section="Braille" Name="BrailleMode" />
			</Setting>
			<Category ID="BrailleOptions.CursorOptions">
				<Setting ID="BrailleOptions.CursorOptions.ActiveFollowsBraille" Type="Boolean">
					<SettingsFile Section="Braille" Name="BrailleMoveActiveCursor" DefaultValue="0" />
				</Setting>
				<Setting ID="BrailleOptions.CursorOptions.BrailleFollowsActive" Type="Boolean">
					<SettingsFile Section="Braille" Name="BrailleAutoRouteToCursor" DefaultValue="1" />
				</Setting>
			</Category>
			<Category ID="BrailleOptions.PanningOptions">
				<Setting ID="BrailleOptions.PanningOptions.PanBy" Type="List">
					<Values>
						<Value ID="BrailleOptions.PanningOptions.PanBy.0" />
						<Value ID="BrailleOptions.PanningOptions.PanBy.1" />
						<Value ID="BrailleOptions.PanningOptions.PanBy.2" />
						<Value ID="BrailleOptions.PanningOptions.PanBy.3" Index="255" />
					</Values>
					<SettingsFile Section="%BrailleDisplayName%" Name="BraillePanMode" DefaultValue="3"  />
				</Setting>
				<Setting ID="BrailleOptions.PanningOptions.PanByParagraph" Type="Boolean">
					<SettingsFile Section="Braille" Name="NavByParagraph" />
				</Setting>
				<Setting ID="BrailleOptions.PanningOptions.WordWrap" Type="Boolean">
					<SettingsFile Section="Braille" Name="WordWrap" />
				</Setting>
				<Setting ID="BrailleOptions.PanningOptions.AutoPan" Type="List">
					<Values>
						<Value ID="BrailleOptions.PanningOptions.AutoPan.0" />
						<Value ID="BrailleOptions.PanningOptions.AutoPan.1" Index="2" />
						<Value ID="BrailleOptions.PanningOptions.AutoPan.2" Index="1" />
					</Values>
					<SettingsFile Section="%BrailleDisplayName%" Name="AutoPanMode" />
				</Setting>
			</Category>
			<Setting ID="BrailleOptions.EightDotBraille" Type="Boolean">
				<SettingsFile Section="Braille" Name="EightDotBraille" DefaultValue="1" />
			</Setting>
			<Setting ID="BrailleOptions.MarkingUsesDots7and8" Type="List">
				<SettingsFile ReadValuesEvent="getMarkingUsesDots7and8Info" WriteValuesEvent="setMarkingUsesDots7and8Info" />
			</Setting>
			<Category ID="BrailleOptions.MarkingOptions">
				<Setting ID="BrailleOptions.MarkingOptions.Highlight" Type="Boolean">
					<SettingsFile ReadValuesEvent="getHighlightMarkingInfo" WriteValuesEvent="setHighlightMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.Bold" Type="Boolean">
					<SettingsFile ReadValuesEvent="getBoldMarkingInfo" WriteValuesEvent="setBoldMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.Underline" Type="Boolean">
					<SettingsFile ReadValuesEvent="getUnderlineMarkingInfo" WriteValuesEvent="setUnderlineMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.Italic" Type="Boolean">
					<SettingsFile ReadValuesEvent="GetItalicMarkingInfo" WriteValuesEvent="SetItalicMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.StrikeOut" Type="Boolean">
					<SettingsFile ReadValuesEvent="getStrikeOutMarkingInfo" WriteValuesEvent="setStrikeOutMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.Colors" Type="Boolean">
					<SettingsFile ReadValuesEvent="GetColorsMarkingInfo" WriteValuesEvent="SetColorsMarkingInfo" />
				</Setting>
				<Setting ID="BrailleOptions.MarkingOptions.ScriptDefined" Type="Boolean">
					<SettingsFile ReadValuesEvent="GetScriptDefinedMarkingInfo" WriteValuesEvent="setScriptDefinedMarkingInfo" />
				</Setting>
			</Category>
			<Category ID="BrailleOptions.TableOptions">
				<Setting ID="BrailleOptions.TableOptions.TableDisplay" Type="List">
					<SettingsFile ReadValuesEvent="GetTableDisplayBrailleZoomInfo" WriteValuesEvent="SetTableDisplayBrailleZoomInfo" />
				</Setting>
				<Setting ID="BrailleOptions.TableOptions.TableShowTitles" Type="List">
					<Values>
						<Value ID="BrailleOptions.TableOptions.TableShowTitles.0" />
						<Value ID="BrailleOptions.TableOptions.TableShowTitles.1" />
						<Value ID="BrailleOptions.TableOptions.TableShowTitles.2" />
						<Value ID="BrailleOptions.TableOptions.TableShowTitles.3" />
						<Value ID="BrailleOptions.TableOptions.TableShowTitles.4" />
					</Values>
					<SettingsFile Section="NonJCFOptions" Name="BrlTblHeader"  />
				</Setting>
				<Setting ID="BrailleOptions.TableOptions.TableShowCoordinates" Type="Boolean">
					<SettingsFile Section="NonJCFOptions" Name="BrlShowCoords" DefaultValue="1" />
				</Setting>
			</Category>
			<Setting ID="BrailleOptions.FlashMessages" Type="Boolean">
				<SettingsFile Section="Braille" Name="BrailleMessages" DefaultValue="1" />
			</Setting>
			<Setting ID="BrailleOptions.BrailleKeysInterruptSpeech" Type="Boolean">
				<SettingsFile Section="Braille" Name="BrailleKeyInterruptSpeech" DefaultValue="1" />
			</Setting>
			<Setting ID="BrailleOptions.StudyMode" Type="Boolean">
				<SettingsFile ReadValuesEvent="getBrailleStudyModeInfo" WriteValuesEvent="setBrailleStudyModeInfo" />
			</Setting>
		</Category>
	</QuickSettingsDefinitions>
	<CategoryOrder>
		<Category ID="BrailleOptions.StudyMode" Location="Bottom" />
	</CategoryOrder>
</QuickSettings>
