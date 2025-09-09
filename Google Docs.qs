<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<Includes>
		<Include File="Browser.qs" />
		<Include File="IA2Browser.qs" />
	</Includes>
	<QuickSettingsDefinitions 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Category ID="DocsTableOptions">
			<Setting ID="DocsTableOptions.TableTitles" Type="List">
				<Values>
					<Value ID="DocsTableOptions.TableTitles.0" />
					<Value ID="DocsTableOptions.TableTitles.1" />
					<Value ID="DocsTableOptions.TableTitles.2" />
					<Value ID="DocsTableOptions.TableTitles.3" />
					<Value ID="DocsTableOptions.TableTitles.4" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="TblHeaders"  />
			</Setting>
			<Setting ID="DocsTableOptions.HeaderAndContentOrder" Type="List">
				<Values>
					<Value ID="DocsTableOptions.HeaderAndContentOrder.0" />
					<Value ID="DocsTableOptions.HeaderAndContentOrder.1" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="TblHeaderContentOrder"  />
			</Setting>
			<Setting ID="DocsTableOptions.CellCoordinatesAnnouncement" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="TableCoordsAnnouncement" />
			</Setting>
		</Category>	
	</QuickSettingsDefinitions>
</QuickSettings>
