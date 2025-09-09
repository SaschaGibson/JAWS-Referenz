# Proofreading and Annotations Functions

Proofreading and annotations functions enable JAWS scripts to retrieve
information about spelling and grammatical errors, revisions, comments,
bookmarks, footnotes and endnotes, etc. in applications where they are
accessible. Whether you should use proofreading functions or annotation
functions to access this information depends on which method of
retrieval is supported by the application. Annotations functions use UIA
to access information; proofreading functions use the document object
model to access information.

Annotations functions apply only to the caret location. Depending on the
annotation type and its fields, you can use annotations functions to
retrieve information such as author, date, time, text, etc. of comments,
footnotes and endnotes, and revisions type annotations.

While some proofreading functions apply to the caret, some are not
restricted only to the caret location. Some allow you to move directly
to the proofreading element location in the document. See hjConst.jsh
for a list of Proofreading Element types used by the proofreading
functions.

This category also lists functions used to detect inconsistencies in a
text range. Inconsistencies include mismatched quotations and
parentheses, improper spacing around punctuation, capitalization errors,
etc. See hjConst.jsh for constants used by functions that detect
inconsistencies.

For a complete listing of Proofreading and Annotations functions, see
the topics in this category book of the Reference Guide.
