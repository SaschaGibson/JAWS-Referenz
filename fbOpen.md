# fbOpen

## Description

Initializes display for communications

## Usage

FSBRLAPI HANDLE WINAPI fbOpen(LPCSTR lpszPort,HWND hwndNotify,UINT
umsgNotify);

## Parameters

### LPCSTR lpszPort

lpszPort- indicates the port to which a Braille display is connected. it
should be the name of a Communications port e.g. COM1, or USB. If this
parameter is NULL or contains an empty string, the system will search
for a display, first trying USB and then trying com ports (COM1 through
COM4).

### HWND hwndNotify

hwndNotify - the handle of a window to which braille display input and
disconnect information should be posted.

### UINT umsgNotify

umsgNotify - a Windows message number which should be used when posting
messages.

## Returns

HANDLE: On success, this function returns a handle to the opened
Display. On failure, it returns INVALID_HANDLE_VALUE.

## []{#messages} Messages

the hwndNotify and umsgNotify passed in to fbOpen are used to notify the
application of events related to the display. The event type is
indicated in wParam and the event details in lParam. The event types
currently defined are FB_DISCONNECTED which means that the display has
been disconnected, FB_INPUT which indicates that a key or button on the
display has been pressed or released, and FB_EXT_KEY which indicates a
Focus 2 extended key was pressed or released. FB_DISCONNECTED provides
no additional information in lParam. The lParam of FB_INPUT should be
cast to a LPBYTE and processed as a sequence of four bytes, the details
of which are described below. The lParam of FB_EXT_KEY is an extended
key state bit mask value also described below. The FB_EXT_KEY message is
only received if the Focus 2 has been configured for extended keys. See
fbConfigure.

### Key Event

- byte0=3 (3 indicates a key event)
- BYTE1=Braille keys.
- BYTE2=assorted keys.
- BYTE3= GDF keys.

BYTE 1: Braille keys (1=key down, 0=key up).

  --------- ------------------- ------------------------
  **Bit**   **Description**     **Supported Displays**
  0         Braille dot 1 key   Focus (1 & 2)
  1         Braille dot 2 key   Focus (1 & 2)
  2         Braille dot 3 key   Focus (1 & 2)
  3         Braille dot 4 key   Focus (1 & 2)
  4         Braille dot 5 key   Focus (1 & 2)
  5         Braille dot 6 key   Focus (1 & 2)
  6         Braille dot 7 key   Focus (1 & 2)
  7         Braille dot 8 key   Focus (1 & 2)
  --------- ------------------- ------------------------

BYTE 2: Assorted keys (1=key down, 0=key up).

  --------- ------------------------ ------------------------
  **Bit**   **Description**          **Supported Displays**
  0         Left Whiz Wheel press    all
  1         Right Whiz Wheel press   all
  2         Left shift key           Focus (1 & 2)
  3         Right shift key          Focus (1 & 2)
  4         Left advance bar         Focus (1 & 2)
  5         Right advance bar        Focus (1 & 2)
  6         undefined                n/a
  7         Braille spacebar         Focus (1 & 2)
  --------- ------------------------ ------------------------

BYTE 3: GDF keys (1=key down, 0=key up).

  --------- ----------------------- -----------------------------------------------------
  **Bit**   **Description**         **Supported Displays**
  0         Left GDF button         Focus
  1         Right GDF button        Focus
  2-3       undefined               n/a
  4         Left Bumper Bar Up      Focus 2 configured for extended keys (80 cell only)
  5         Left Bumper Bar Down    Focus 2 configured for extended keys (80 cell only)
  6         Right Bumper Bar Up     Focus 2 configured for extended keys (80 cell only)
  7         Right Bumper Bar Down   Focus 2 configured for extended keys (80 cell only)
  --------- ----------------------- -----------------------------------------------------

### Cursor Router Buttons

- BYTE0=4 (4 indicates cursor router button)
- BYTE1=button number 0-40
- BYTE2: state (1=key down, 0=key up).
- BYTE3:row (0=bottom, 1=top).

BYTE 2: state

Bit 0 is set to 1 when the button is pressed, and 0 when the button is
released. This is the same for all displays.

BYTE 3: row

This byte denotes the router button row number. The default is 0, which
indicates the 1st row. Currently there are devices that have one or two
rows hence this value is limited to 0 or 1. In the future there may be
more rows.

### Whiz Wheels

Note: The \"up\" direction on the left wheel is away from the operator.
The \"down\" direction on the right wheel is away from the operator.

- BYTE0=5 (5 indicates Whiz Wheel)
- BYTE1=unit number, direction, count.

BYTE 1:

  --------- ---------------------------------------------------- ------------------------
  **Bit**   **Description**                                      **Supported Displays**
  0-2       Pulses (1-7, number of clicks the wheel was moved)   all
  3         Direction (0 = up, 1 = down).                        all
  4-5       Whiz Wheel (0 = left, 1 = right).                    all
  6-7       undefined                                            n/a
  --------- ---------------------------------------------------- ------------------------

### Extended Keys (Focus 2 configured for extended keys)

Bit masks for 32-bit value (1=key down / 0 = key up):

**Bit Mask**

**Description**

0x00000010

Left Rocker Up

0x00000020

Left Rocker Down

0x00000040

Right Rocker Up

0x00000080

Right Rocker Down

All other bits are reserved and set to zero.
