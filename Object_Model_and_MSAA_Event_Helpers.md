# Object Model and MSAA Event Helpers

An Object Model and MSAA Event helper function assists an Object Model
and MSAA Event. such an event may occur in any application or a feature
of the Windows operating system. Based on the information the Object
Model and MSAA Event helper function provides or returns, JAWS
determines what to speak and display from the related event. In this
case, to display information refers to showing it in Braille.

When overriding default behavior, it is best to overwrite the most
specific function to the task. If a function has helper functions, and
if the task you want to handle is best handled by a helper function,
then overwrite the helper function. Doing so is the best way to ensure
robust script behavior, and make it less likely that any future changes
to default scripts will have a negative impact on your scripts.

An example of an Object Model and MSAA event helper function is
HJDialogObjStateChangeSpoken. For a complete listing of Object Model and
MSAA event functions, see the category book in the [Reference
Guide.](../Reference_Guide.html)

## Additional Resources

For more information on the types of Objects the Freedom Scientific
Scripting language supports, see the General Scripting Concepts topic
called [Objects.](../Objects.html)

For more details on working with Object Model and MSAA in general, refer
to the Microsoft Developer Network in the section called [Microsoft
Active Accessibility and UI Automation Compared
(Windows)](http://msdn.microsoft.com/en-us/library/windows/desktop/dd561918(v=vs.85).aspx#object_model_navigation)
