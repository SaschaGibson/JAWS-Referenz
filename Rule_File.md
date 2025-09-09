# The Rule File

The rule (.rul) file contains information that populates the JAWS
Research It user interface so that the Lookup Resource shows up in the
list of available Lookup resources. The rule file usually contains three
or four entries:

- Friendly Name - a string of characters representing the title of the
  query the user sees in the JAWS Research It user interface. This
  required entry has a maximum length of 100 characters.
- Description - an optional string containing a detailed description of
  the query. This entry has a maximum length of 500 characters. You may
  use it to provide any information that may help the user of the query
  to understand its purpose. For example, in an application that is
  non-standard, you might explain what the query does and what the
  format is for inputting data.
- Timeout - an optional integer value for the timeout in milliseconds
  that the query should wait to receive a response from the target Web
  site. Any query using the rule set you are defining is aborted if the
  time exceeds the timeout you specify. The default timeout is 15000
  milliseconds (15 seconds). This timeout value is assumed if no timeout
  value is specified. You may need to define a longer timeout value if
  the Web site being queried is slow, if a large amount of data is
  returned from the query, or if the query is complicated.
- Version - an optional entry containing the version information for the
  rule set.

## Code Sample

The below code sample is for a fictitious application that finds valid
Freedom Scientific serial numbers.

    [Details]
    FriendlyName=Freedom Scientific Serial Number Lookup
    Description=Enter your full name to find your Freedom Scientific Serial number. Example: Type in "Mary Smith" without the quotation marks. If your account is current, the query reports your serial number as XXXX in the virtual Results viewer. This query is only available for valid Freedom Scientific serial numbers.
    Timeout=15000
    Version=1.0.0
