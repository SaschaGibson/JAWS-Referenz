# Connection Events

A Connection event function provides information about a Tandem
Connection, such as whether it is connected or disconnected. JAWS uses
this information to determine whether to speak and display information
in Braille, for comparison purposes, etc.

Some examples of Connection event functions include:

- TandemConnectionEvent
- ControllerModeChangedEvent

For a complete listing of connection event functions, see the category
book in the [Reference Guide.](../Reference_Guide.html)

## Code Sample

In the below code sample, if a Tandem event occurs,a debug statement
saying \"99\" is spoken. Of course, the function that ships with JAWS
does not have this debug statement in it but we have used the function
from the default.jss script source file as a sample and have added the
debug statement here.

Note that there is no script associated with this sample in order for it
to work and provide information. This is because the function is an
event function. So it does not require that a script and key assignment
be bound to it in order to provide information or suppress it.

    Void Function TandemConnectionEvent(int nTandemApp, int nConnectionEvent)
    Var
        Int bShouldPlaySound
    SayInteger (99) ; This is the debug statement added to the original function from default.jss.
    Let bShouldPlaySound = GetDefaultJCFOption (OPT_USE_SOUNDS_TO_INDICATE_TANDEM)
    If nConnectionEvent == Tandem_Status_Connected then
        Let GlobalTandemMode = Tandem_Mode_Connected
        ;Note that the controller will hear the message spoken on the target side when the connection is made,
        ;so it is not necessary to speak the message for the controller as well.
        If bShouldPlaySound
        && GlobalTandemConnectSound then
            PlaySound(GlobalTandemConnectSound)
        EndIf
        If nTandemApp == Tandem_Target then
            SayMessage(ot_status,cmsg_TandemConnected)
            BrailleMessage (cmsg_TandemConnected)
        EndIf
    Elif nConnectionEvent == Tandem_Status_Disconnected then
        Let GlobalTandemMode = Tandem_Mode_NotConnected
        If bShouldPlaySound
        && GlobalTandemDisconnectSound then
            PlaySound(GlobalTandemDisconnectSound)
        EndIf
        If nTandemApp == Tandem_Controller then
            SayMessage(ot_status,cmsg_TandemDisconnectedFromTarget)
            BrailleMessage (cmsg_TandemDisconnectedFromTarget)
        Elif nTandemApp == Tandem_Target then
            SayMessage(ot_status,cmsg_TandemDisconnectedFromController)
            BrailleMessage (cmsg_TandemDisconnectedFromController)
            If gbLockedKeyboard then
                SetKeyboardLock(false)
            EndIf
        EndIf
    EndIf
    EndFunction
