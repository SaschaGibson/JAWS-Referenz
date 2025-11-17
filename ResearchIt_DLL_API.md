# Research It DLL API

## Lookup Module API

A lookup module is a dynamic link library (dll) encapsulating a
particular lookup technology. A lookup module may support single or
multiple lookup sources. The lookup module that ships with JAWS is able
to support multiple lookup sources. For each lookup source, a "rule set"
defines the important details of the lookup such as the rule set name,
information source, query definition, and parsing details. When the
lookup module is called, the data passed into the lookup module contains
the name of the rule set to be used to perform the lookup. If you want
to extend the lookup module, you need only define a rule set.

All lookup modules must support the following API methods:

### Initialize

Initialize performs any initialization necessary for the lookup module.
Any initialization that must not be performed in DllMain (thread
creation, synchronization, etc.) should be performed here. Call
Initialize prior to calling any other lookup module functions.\

    Syntax
    HRESULT Initialize(void);
    Return Value
    Returns S_OK (0x00000000L) if initialization was successful, otherwise E_FAIL (0x80004005L). If initialization fails, the DLL should not be used.

### DeInitialize

DeInitialize performs any cleanup necessary for the lookup module. Any
destruction that must not be performed in DllMain (thread destruction,
synchronization, etc.) should be performed here. Call DeInitialize after
all use of the lookup module is complete, immediately prior to calling
FreeLibrary.\

    Syntax
    HRESULT DeInitialize(void);
    Return Value
    Returns S_OK (0x00000000L) if deinitialization was successful, otherwise E_FAIL (0x80004005L).

### GetInterfaceSchema

GetInterfaceSchema returns the numeric version of the supported
interface. The interface version specified in this documentation is 1.
Should additional functions later be supported, the interface version
will increment.\

    Syntax
    HRESULT GetInterfaceSchema(
    DWORD& dwSchema);
    Parameters
    dwSchema [out]
    dwSchema will receive the API schema supported by the Lookup Module.
    Return Value
    If the function succeeds, the return value is S_OK (0x00000000L). Otherwise, a non-zero value is returned.

### GetFriendlyName

GetFriendlyName returns the friendly name(s) for a lookup module or the
rule sets belonging to the module. If a lookup module has no rule sets
associated with it, it returns the localized name for the lookup module.
If a lookup module has rule sets, it returns a bar-delimited list of
colon-delimited file name:friendly name pairs for the lookup module. For
most lookup modules, there will only be a single localized name.
However, for the Freedom Scientific Lookup Module, the bar delimited
group of localized file names and friendly names consist of the
localized rule set names supported by the lookup module.\

    Syntax
    HRESULT GetFriendlyName (
    LPWSTR lpszName,
    DWORD& dwSize
    );
    Parameters
    lpszName [out]
        A pointer to a buffer that receives a localized name for the module or file name-friendly name pairs for supported rule sets.
    dwSize [in, out]
    The size of the lpszName buffer in wide chars. If the output data is larger than the supplied buffer, upon return, this variable will hold the required size.
    Return Value
    If the function succeeds, the return value is S_OK (0x00000000L). Otherwise, one of the following errors may be returned:
    E_INVALID_ARG (0x80070057L)
        lpszName is NULL or dwSize is 0.
    E_INSUFFICIENT_BUFFER (0x802A0001L)
    lpszName is not large enough to hold the return data.

### Describe

Describe returns a localized description of the lookup module or
specified rule set.\

    Syntax
    HRESULT Describe (
    LPCWSTR lpszRuleSet,
    LPWSTR lpszOut,
    DWORD& dwSize
    );
    Parameters
    lpszRuleSet [in, optional]
    A null terminated string containing the name of the RuleSet for which the description should be returned. If this value is null, then the general description for the lookup module is returned.
    lpszOut [out]
    A pointer to a buffer that receives the output data.
    dwSize [in, out]
    The size of the lpszOut buffer in wide chars. If the output data is larger than the supplied buffer, upon return, this variable will hold the required size.
    Return Value
    If the function succeeds, the return value is S_OK (0x00000000L). Otherwise, one of the following errors may be returned:
    E_INVALIDARG (0x80070057L)
        In the case of the generic Freedom Scientific Lookup Module, this error is returned if lpszRuleSet is NULL (it is optional in general, but not in this specific case). Also returned if lpszOut is NULL or dwSize is 0.
    E_RULESET_NOT_FOUND (0x802A0002L)
    The rule set specified by lpszRuleSet is not supported by the lookup module.
    E_INSUFFICIENT_BUFFER (0x802A0001L)
    lpszName is not large enough to hold the return data.

### Invoke

Invoke requests a query from a lookup module. This function performs a
synchronous lookup. Aasynchronous lookups are not supported in JAWS.
Different combination of the input arguments may be used depending on
the lookup module.\

    Syntax
    HRESULT Invoke (
    LPCWSTR lpszRuleSet,
    LPCWSTR lpszIn,
    LPCWSTR lpszContext,
    DWORD dwOffset,
    LCID lcidAppLocale,
    LPWSTR lpszOut,
    DWORD& dwSize,
    LPVOID lpExtra = NULL
    );
    Parameters
    lpszRuleSet [in, optional]
    An optional null-terminated string that contains the name of the rule set that the lookup module must use to perform the query.
    lpszIn [in]
    A null terminated string containing the input data for the query. This may be the word or phrase at the current cursor. This value may be NULL if the lookup module utilizes the Context and Offset arguments.
    lpszContext [in]
    A null terminated string containing context data for the query. For example, some lookup modules may utilize the sentence or paragraph containing the target word. This argument can be NULL.
    dwOffset [in]
    The 0-based offset of the targeted word in lpszContext. 0xffffffff indicates no offset.
    lcidAppLocale [in]
    The locale ID of the calling application. This will allow us to select the appropriate localized lookup source, display a localized UI, or return error messages in the applications language.
    lpszOut [out]
    A pointer to a buffer that receives the output data. Depending on the lookup module, this could be an error, command, replacement string, etc.
    dwSize [in, out]
    The size of the lpszOut buffer in wide chars.
    lpExtra [in]
    This argument may be optionally used to pass additional information to the lookup module. The content and format of the data depends on the requirements of the lookup module. The value can be NULL.
    Return Value
    If the function succeeds, the return value is S_OK (0x00000000L). Otherwise, one of the following errors may be returned:
    E_INVALIDARG (0x80070057L)
    The rule set specified by lpszRuleSet is not supported by the lookup module.
    E_INSUFFICIENT_BUFFER (0x802A0001L)
    lpszName is not large enough to hold the return data. In this case, dwSize is set to the buffer size (in characters including the null terminator) required to hold the data.
    E_RULESET_NOT_FOUND (0x802A0002L)
        The requested rule set was not found.
    E_REQUEST_FAILED (0x802A0003L)
        The lookup attempt failed. Indicates a malformed query.
    E_REQUEST_NO_RESULTS (0x802A0004L)
        The lookup succeeded, but there were no results for the search term.
    E_REQUEST_TIMEOUT (0x802A0005L)
        The lookup took longer than the allowed amount of time.

## Rule Set and Query Format

The generic Freedom Scientific lookup module supports the ability to do
lookups with user-defined rule sets. A rule set consists of a query and
a variety of settings that specify how the rule set is exposed to the
end-user and how the query is executed. To create a custom rule set, you
must provide two files, a rule set file (.RUL) and a query file (.QRY)
with the following conditions:

- The files must have the same name (except for extension).
- The rule set file is an INI-formatted file. The file contains one
  section, \[Details\].

In the details section of the rule set file, you may provide the
following keys:

  ---------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **[Key Name]{style="font-family:\"Arial\",sans-serif"}**   **[Value]{style="font-family:\"Arial\",sans-serif"}**
  [FriendlyName]{style="font-family:\"Arial\",sans-serif"}   [A string specifying a "friendly" name for the rule set. Mandatory. Maximum 100 characters.]{style="font-family:\"Arial\",sans-serif"}
  [Description]{style="font-family:\"Arial\",sans-serif"}    [A string containing a brief description for the rule set. Optional. Maximum 500 characters.]{style="font-family:\"Arial\",sans-serif"}
  [Timeout]{style="font-family:\"Arial\",sans-serif"}        [An unsigned integer containing the timeout in milliseconds to be used for queries. Any query using this rule set will be aborted if it exceeds the timeout specified.]{style="font-family:\"Arial\",sans-serif"}
  [Version]{style="font-family:\"Arial\",sans-serif"}        *[Internal use only.]{style="font-family:\"Arial\",sans-serif"}*[ A string of the format "x.x.x" that specifies the version of the rule set. This will be used for Freedom Scientific-distributed rule sets in order to provide automatic update service.]{style="font-family:\"Arial\",sans-serif"}
  ---------------------------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

 

### Example of a Valid Rule Set

The following is an example of a valid rule set:\

    [Details]
    FriendlyName=Wikipedia
    Description=Look up an encyclopedia entry for a word or phrase.
    Timeout=15000

The query file contains an XQuery function that queries the desired
resource, parses results, and returns as its output a single string. In
addition to XQuery functions, the XQilla extension and XSLT functions
are also available for use from the query. For more information, see:
[XQilla XQuery Extension
Functions.](http://xqilla.sourceforge.net/ExtensionFunctions.html)

Within the query file, you can use the token \|ARG_1\...ARG_n\| to mark
a location where input should be substituted into the query string. The
token need not be placed directly into a search URL; the query author
can place it into a variable that can be further parsed or modified
prior to using it. This allows you to pass multiple arguments into
\|ARG_1\...ARG_n\| and parse them into separate variables within the
query code.

### Example of a Valid Query

The following is an example of a valid query:\

    declare namespace wiki = "http://opensearch.org/searchsuggest2";
    declare variable $new_line := '
    ';
    declare variable $doc := doc("http://en.wikipedia.org/w/api.php?action=opensearch&search=|ARG_1...ARG_n|&format=xml");
    for $item in $doc/wiki:SearchSuggestion//wiki:Item[1]
    return (fn:normalize-space(data($item//wiki:Description)), $new_line)

In this query, the \|ARG_1\...ARG_n\| token will be replaced by the
search term that is passed down from the script.

## Additional Resources

For more details on Research It, see [Creating Research It
Rules](Creating_ResearchIt_Rules.html)

For the functions used to customize Research It Rules using the JAWS
Scripting Language, see the category book in the reference guide,
[Research It.](Reference_Guide/Research_It.html)
