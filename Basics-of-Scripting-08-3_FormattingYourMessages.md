# 8.3 Formatting Your Messages

If you have used placeholders in your message, you can use the built-in
function, FormatString, to replace those placeholders with information.
You provide the message as the first parameter of the function. The
subsequent parameters are used for the information that replaces the
placeholders in your message. If you have only used two placeholders,
then you need only provide information for the next two parameters
following the message name.

The function formats the message then returns the formatted message to
the script or function as a string of text. You can store this formatted
message in a string variable for use in some of the speaking functions
such as SayFormattedMessage.

The following example shows the use of the FormatString function with a
message that contains placeholders:

## Example 1: Using the FormatString Function

\@MsgMyName\
Hello, my name is %1 %2. You can just call me %1.\
@@

The call to the FormatString function looks like the following:

let sMessage = FormatString (MsgMyName, \"John\", \"Doe\")\

The text the FormatString function returns follows:

Hello, my name is John Doe. You can just call me John.

**NOTE:** Beginning in JAWS 12 update 1, the SayFormattedMessage
function allows you to substitute place holders directly. To speak the
message using this function, you no longer have to use FormatString
first.

 

  ---------------------------------------------------------- -- ------------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](08-4_SpeakingYourMessages.htm){accesskey="x"}
  ---------------------------------------------------------- -- ------------------------------------------------------
