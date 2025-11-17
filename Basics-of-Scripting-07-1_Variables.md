# 7.1 Variables

You can think of a variable in terms of a bucket you may have at home.
You can put a number of different things into the bucket. For example,
you may use the bucket to carry water, sand, or gravel. As you pour out
the contents of the bucket, you are changing the amount of sand, water,
or gravel in the bucket. You can also put varying amounts of each of
those items in the bucket. Sometimes you may only need to fill the
bucket half full of water. Another time, you may need to completely fill
the bucket with water.

Like a bucket, a variable is an entity that holds a value. You can
change the value the variable holds during the execution of your script.
Conditions that occur in your script can also change the value stored in
your variables. Each variable you use in your script or function is of a
specific type and can only store one type of information.

You must declare all variables with a name and a type before you can use
them within your script or function.

You must give each variable a distinct name to distinguish it from other
functions and names used in the script or script file.

You cannot use duplicate variable names as this can lead to errors when
you compile your script file.

## Variable Types

You can use one of four variable types within your scripts and
functions. You store only one specific type of information in each of
these variable types. Variable types include:

- integer
- string
- handle
- object

### Integer Variables

You can use the integer variable type to store numeric values. The
numeric value you store in an integer must be a whole number such as 0,
10, or 100. You cannot store numbers with decimal points in integer
variables. JAWS gives all integer variables an initial value of zero
each time you activate the script in which the variables are declared.

You must declare an integer variable before you can use it within your
script or function. You can declare an integer variable as follows:

Int MyIntegerVariable

### String Variables

You can use the string variable type to store a string of characters.
You can think of a string as a group of characters including letters,
numbers, punctuation marks, and spaces. When you assign a value to a
string variable, you must enclose the characters in quotation marks.

JAWS gives all string variables an initial value of null or no value
each time you activate the script in which the variables are declared.
You can represent null values as a pair of quotation marks with no
spaces between them or with the constant, cscNull, found in the
Common.jsm default message file. You must declare a string variable
before you can use it in your script or function. You can declare a
string variable as follows:

String MyStringVariable

### Handle Variables

You can use the handle variable type to store a window handle value. The
operating system automatically assigns a window handle to each window
within any running application. The window handle is a unique number
that changes each time you close and then reopen an application.

For example, when you start Microsoft Word, the document edit window may
have a window handle value of 1000. When you close Word and then reopen
it, the window handle value is no longer 1000. The new value may be
1100, 3000 or any other arbitrary number.

A handle is also a whole number like an integer and can be manipulated
like other integer variables. However, you can only use handle variables
solely for the identification of window handles. In other words, you
cannot store a handle value in an integer variable.

JAWS gives all handle integer variables an initial value of zero each
time you activate the script in which the variables are declared. You
must declare a handle variable before you can use it in your script or
function.

You declare a handle variable as follows:

Handle MyHandleVariable

### Object Variables

The forth and final variable type you can use is the object variable
type. You use the object variable type to store an object. An object
refers to the types of objects used within certain Microsoft
applications such as the Office suite.

JAWS gives all object variables an initial value of null or no value
each time you activate the script in which the variable is declared. You
must declare an object variable before you can use it in your script or
function. You declare an object variable as follows:

Object MyObjectVariable

## Naming Variables

As you begin to use variables within your scripts, there are a few ways
you can name them to easily identify their contents. When you use
multiple words for variable names, you should capitalize the initial
letter in each word of the variable name. When you follow this rule of
thumb, JAWS uses mixed case processing to pronounce each word beginning
with a capital letter as a new word. This makes it much easier to
understand the name of the variable. When the first letter of each word
in a variable name is not capitalized, JAWS pronounces the variable as a
single word.

The following examples illustrate the use of variables with multiple
word names. The first example uses initial capital letters in each word
while the second example does not.

MyFirstVariable\
myfirstvariable

As you used JAWS to read the previous examples, did you notice a
difference in the way the variable names were pronounced?

You should also give your variables meaningful names. If you give a
string variable the name of \"i\", you can\'t tell what type of
information the variable stores. However, when you use a name of address
or message for the name of a string variable the contents are easy to
identify.

You can also use Hungarian notation to name your variables. Hungarian
notation uses lower-case letters at the beginning of variable names to
indicate the variable type. For example, you could name a string
variable that contains a first name sFirstName. The lower case \"s\"
indicates the variable is of type string. The \"FirstName\" portion of
the variable name indicates the variable contains first name
information. Other types of Hungarian notation include \"I\" to indicate
integer variables, \"h\" indicating handle variables and \"o\" for
indicating object variables.

## Declaring Variables

You can declare variables in one of two ways, locally or globally. When
you declare variables locally, you can only use those variables in the
script where you declared them. When you declare a group of variables
globally you can use those variables in any script within the script
file where you declare them.

### Declaring Variables Locally

You declare local variables within a script immediately following the
beginning line of the script. You start the beginning of a local
variable declaration with the key word Var. You should declare each
variable on a separate line. When you declare more than one variable,
you must place a comma immediately after each variable name, except for
the last variable. A good idea is to add a comment at the end of the
declaration stating how the variable is used. As stated previously, you
can only use local variables within the script in which you declare
them. An example of a local variable declaration is as follows:

Var\
string sFirstName, ; describe variable here\
string sLastName ; describe variable here

### Declaring Global Variables

You declare global variables within a script file immediately following
any include statements. You start the beginning of a global variable
declaration with the key word Globals. You should declare each variable
on a separate line. When you declare more than one variable, you must
place a comma immediately after each variable name, except for the last
variable. A good idea is to add a comment at the end of the declaration
stating how the variable is used.

After you have created a global variable and assigned it a value, the
global variable retains the value even after you close the application
that uses it. If you open the application during the same computer
session, the global variables from that application\'s script file will
have the same values they had prior to when you closed the application.
You can only clear the values stored in global variables by unloading
and restarting JAWS.

An example of a global variable declaration is as follows:

Globals\
string sFirstName, ; describe variable here\
string sLastName ; describe variable here

You can also declare global variables in a script header file. When you
declare global variables in a script header file, you must include the
file in any script file in which you will use those variables. You can
find an example of a header file that contains global variable
declarations by viewing the default global file, HJGlobal.jsh. You can
find this file in your JAWS shared settings folder. The HJGlobal.jsh
file is included in the default script file, default.jss. Including the
HJGlobal.jsh header file in a default script file allows the global
variables to be used in any of the default scripts and user-defined
functions. When you include the HJGlobal.jsh file within an
application-specific script file, you can use these variables to get
specific information as needed. However, you should exercise caution
when using any global variables from the HJGlobal.jsh file. The default
scripts and user-defined functions often modify the values contained in
these variables. When you modify the values of the variables within your
own scripts, you may encounter unwanted results in your script file.

## Assigning Values

You can use the let statement to assign values to any one of the 4
variable types. For example, let iControl = 1500 assigns the value of
1500 to the variable, iControl. Beginning in JAWS version 11 the let
statement is now optional and is not required.

You can assign a value yourself or you can assign the return value from
a built-in function to a variable. When you assign a return value from a
function to a variable, you must make sure the variable types are the
same. For example, the GetFocus built-in function returns a window
handle. You need to use a handle variable to store this return value.
Otherwise, the script compiler will generate a syntax error when you
attempt to compile your script. The statement you would use to assign
the return value from the GetFocus function to a handle variable is:

let hWnd = GetFocus ()

Other examples of assigning values to variables using the let statement
follow:

let sCompanyName = \"Freedom Scientific\"\
sMessage = \"Hello world!\"\
let iControl= GetControlID (GetFocus ())

 

  ---------------------------------------------------------- -- -------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](07-2_Constants.htm){accesskey="x"}
  ---------------------------------------------------------- -- -------------------------------------------
