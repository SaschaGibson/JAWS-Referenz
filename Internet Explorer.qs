<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<Includes>
		<Include File="Browser.qs" />
	</Includes>
	<QuickSettingsDefinitions 
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="VirtualCursorOptions.GlanceHighlightIndication" />
		</Excludes>
		<Category ID="InternetExplorerSettings">
			<Setting ID="InternetExplorerSettings.InformationBar" Type="List">
				<Values>
					<Value ID="InternetExplorerSettings.InformationBar.0" />
					<Value ID="InternetExplorerSettings.InformationBar.1" />
					<Value ID="InternetExplorerSettings.InformationBar.2" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="InformationBarAnnounce" />
			</Setting>
			<Setting ID="InternetExplorerSettings.RSSFeeds" Type="List">
				<Values>
					<Value ID="InternetExplorerSettings.RSSFeeds.0" />
					<Value ID="InternetExplorerSettings.RSSFeeds.1" />
					<Value ID="InternetExplorerSettings.RSSFeeds.2" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="RSSFeedAvailabilityAnnounce" />
			</Setting>
			<Setting ID="InternetExplorerSettings.FrameUpdateNotification" Type="List">
				<Values>
				<Value ID="InternetExplorerSettings.FrameUpdateNotification.0" />
				<Value ID="InternetExplorerSettings.FrameUpdateNotification.1" />
				<Value ID="InternetExplorerSettings.FrameUpdateNotification.2" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="HTMLFrameUpdateNotification" />
			</Setting>
		</Category>	
	</QuickSettingsDefinitions>
</QuickSettings>
