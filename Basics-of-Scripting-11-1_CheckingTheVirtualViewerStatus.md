# 11.1 Checking the Virtual Viewer Status

Before you display text in the virtual viewer, you should check to make
sure it is not currently being displayed by another script or function.
When you find the virtual viewer is being displayed, you should
deactivate it. Deactivating the virtual viewer before you display new
information prevents the text from running together.

You use the built-in function, UserBufferIsActive, to check the status
of the virtual viewer. The function returns a value of 1 when the
virtual viewer is active or displayed and a value of 0 when the viewer
is not displayed. You can substitute the constant, TRUE, for the value
of 1 and the constant, FALSE, for the value of zero in your scripts.

When the virtual viewer is active, you use the built-in function,
UserBufferDeactivate, to close the virtual viewer. This function closes
the virtual viewer just as if you pressed **ESC** from the keyboard. You
should place both the UserBufferIsActive and the UserBufferDeactivate
functions within a conditional statement before you display the virtual
viewer. An example of the use of both functions follows:

If UserBufferIsActive () Then\
UserBufferDeactivate () ; close the virtual viewer\
EndIf

 

  ---------------------------------------------------------- -- -----------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](11-2_CreatingTheMessages.htm){accesskey="x"}
  ---------------------------------------------------------- -- -----------------------------------------------------
