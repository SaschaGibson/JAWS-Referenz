<?xml version="1.0" encoding="utf-8" ?>
<QuickSettings>
	<QuickSettingsDefinitions
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" >
		<Excludes>
			<Exclude ID="VirtualCursorOptions.GeneralOptions.SmartNavigation" />
		</Excludes>
		<Category ID="Objects" >
			<Setting ID="Objects.OverlapAlert" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="DetectOverlappingShapes" />
			</Setting>
			<Setting ID="Objects.TextPlaceholderOverflowAlert" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="DetectTextOverflow" />
			</Setting>
			<Setting ID="Objects.Description" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="DescribeObjectTypes" />
			</Setting>
		</Category>
		<Category ID="Slides">
			<Setting ID="Slides.TableReadingMethod" Type="List">
				<Values>
					<Value ID="Slides.TableReadingMethod.0" />
					<Value ID="Slides.TableReadingMethod.1" />
					<Value ID="Slides.TableReadingMethod.2" />
					<Value ID="Slides.TableReadingMethod.3" />
				</Values>
				<SettingsFile Section="NonJCFOptions" Name="TableReadingMethod" />
			</Setting>
			<Setting ID="Slides.SlideTransitionIndication" Type="Boolean">
				<SettingsFile Section="NonJCFOptions" Name="AnnounceSlideTransitions" />
			</Setting>
		</Category>
	</QuickSettingsDefinitions>
</QuickSettings>
