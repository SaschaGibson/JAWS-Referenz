# Creating Research It Rules

JAWS 11 introduced the Research It feature, providing quick access to
data but at the same time making it easy to return to your primary task.
Research It utilizes a \"Lookup\" source from the Internet, and presents
findings in the JAWS virtual Results Viewer.

You may launch Research It from any application. The Research It user
interface provides you with an edit field to type in a word or phrase to
search, along with a list of Lookup resources from which to search, as
well as numerous other controls that let you customize how to search.
Once you press ENTER to begin a search, the virtual Results Viewer
displays either an error message if nothing was found, or information
from the chosen Lookup resource relevant to your search term. the
information presented in the virtual Results Viewer is in a highly
condensed format, thus eliminating all of the extra elements that
clutter up a Web page - graphics, Flash objects, links to unrelated
materials, etc.

When Research It finds results from a search term, the virtual results
viewer window presents only the links and starting text for each
relevant item found. From any of these links, you can press Enter to
navigate to a condensed version of the Web page where the entire content
of that particular link is located but without all the extraneous
material that is normally displayed on that Web page utilizing a
standard Web search engine.

For more details on working with the virtual viewer window and the
virtual results viewer, see [Implementing a Virtual Viewer
Window.](Virtual_Viewer_Functions.html)

Research It is customizable through its user interface, as mentioned
above. You may choose from numerous Lookup resources that ship with
JAWS. These include Wikipedia, WikiDictionary, various news sources, and
so on. You may even choose which source should be the primary Lookup
resource for search terms.

But in addition to the Research It user interface, you may customize
Research It for application-specific Lookup resources that do not ship
with JAWS. The xQuery language and the Freedom Scientific scripting
language work hand-in-hand for customizing Live Resource Lookup (LRL)
functionality. Over the years, some lookup sources initially provided
with JAWS for Research It have had to be removed due to the everchanging
dynamic redesign of some websites. Nevertheless, there is much you can
do with rule sets of your own as well as with the currently shipping
available lookup sources provided with JAWS.

## Definitions

- Lookup Module Raw Name - The name of a Lookup module as it appears in
  the file system without the path and extension.
- Lookup Module Friendly Name - The localized name of a Lookup module.
  This name is used in the Settings Center user interface, as well as in
  the list of Lookup resources in the Research It user interface dialog.
- Rule Set - An optional set of instructions for a Lookup Module. The
  rule set follows the Syntax defined by the Lookup module. A rule set
  allows a Lookup module to contain generic code that may be manipulated
  externally by the rules defined in the rule set.
- The PrimaryLookupModule key is stored in the \[Research It Options\]
  section of the default JAWS configuration (jcf) file. The primary key
  may be application-specific.

## Defining a Rule Set: The RUL and QRY Files

A Research It rule set contains two files that share a common filename
with extensions .rul and .qry:

- .rul - the Rule file containing the basic information needed to run
  the Research It query through the JAWS user interface.
- .qry - the Query file containing the program that accesses an Internet
  website, sends any query data to that site, locates the desired data,
  and returns it to the JAWS virtual Results viewer.

For more details on working with the Rule (.rul) file, see [The Rule
File.](Creating_ResearchIt_Rules/Rule_File.html)

For more details on working with the Query (.qry) file, see [The Query
File.](Creating_ResearchIt_Rules/Query_File.html)

### Creating Rule Sets Within the JAWS Research It User Interface

Rather than using the tools discussed in the file referenced above, you
may prefer to build your queries directly as rule sets that run in the
JAWS Research It user interface. Simply create your .rul file, and then
write your query in an editor like notepad and save it as your .qry
file. If there are errors in the query code when you run the query from
Research It, JAWS just reports that no results were found.

To obtain error and debugging information within Research It, you must
use the JAWS Utility Mode, as described in \"Research It: Creating Rule
Sets for JAWS (Word file)\". Download the file from the link located at:
[Creating Research It Rules for
JAWS.](https://support.freedomscientific.com/Content/Documents/Other/Research-It-Creating-Rule-Sets-for-JAWS.doc)

### Running Queries Within the JAWS Research It user Interface

The fact that JAWS can utilize certain query tools (XQuery/XQilla) is
due to the inclusion of a Freedom Scientific lookup module called
LiveResourceLookup.dll. this module ships with JAWS since JAWS 11. It is
located in the root folder of the JAWS LookupModule subfolder. This API
allows the queries to run as a feature of JAWS. The module supports
multiple lookup sources, those created by Freedom Scientific that ship
with JAWS, and those created by third-party developers for their own
queries. The three-letter prefix, lrl, used in the filenames of our own
Research It files comes from the name of this module. It is useful to
prefix the filenames this way to indicate the particular lookup module
with which they should be associated. But if you are interacting with a
lookup source that does not support XQuery, if you must protect
proprietary data, or if your lookup source requires user authentication,
you must create your own lookup module as a .dll API. For more details
on this, see: [Research It DLL API.](ResearchIt_DLL_API.html)

## Research It Scripting Functions

There are numerous functions you may use for customizing Research It
rules in your own applications. See to the LiveResourceLookup.jsd script
documentation and its associated LiveResourceLookup.jss script source
files that ship with JAWS. These files are located in the shared folders
as follows:

- LiveResourceLookup.JSS in the Shared Scripts folder, and
- LiveResourceLookup.JSD in the Shared Scripts\\Language folder.

For a complete listing of Research It functions, see the relevant
category book of the [Reference Guide.](Reference_Guide.html)
