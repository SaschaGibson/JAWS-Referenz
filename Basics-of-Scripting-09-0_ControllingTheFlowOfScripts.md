# 9.0 Controlling the Flow of Scripts with Decision Making

In the previous chapters, you created scripts that performed each line
once and only once. When JAWS performs your scripts in this manner, each
statement is performed regardless of any situations that may arise
during the execution of the script. This manner of performing your
scripts is called sequential flow control.

This is the most basic way in which JAWS performs your scripts. JAWS
performs each statement sequentially beginning with the first statement
in your script and continuing to the EndScript statement. You can think
of a script that flows sequentially as a script that JAWS performs
step-by-step.

In addition to creating scripts that JAWS performs sequentially, you can
add statements to your scripts that perform an evaluation. This type of
flow control is called branching, conditional, or decision-making.

You may find that at some point during the execution of your script, the
script must evaluate certain conditions before continuing. The
conditions your script evaluates can be anything from the value
contained within a variable to the return value from a function. Once
your script completes the evaluation, the statements that are processed
next are based on the outcome of the evaluation. When the outcome of the
evaluation is true, processing may continue down one branch. If the
outcome is found to be false, a second branch of statements is
performed.

For example, suppose you come to a group of two doors at the end of a
hallway. Before you continue, you must evaluate which door to go
through. Your decision will be based on a set of conditions. If it is
dark outside, you might choose one door but if it is light out, you
might choose another.

Your script may need to do that same type of decision making. You use
the If-Then-Else statement structure to make a decision. When your
script comes to the If-Then-Else statement a condition is evaluated.
Based on the outcome of the evaluation, your script may perform one
branch of code as opposed to another.

In this chapter, you will learn how to create basic If statements to
make decisions in your scripts. You will learn the structure of the If
statement and the uses of the Else and ElIf key words. You will also
learn how to create more complex If statements that use compound
evaluations as well as nesting If statements inside one another. You
will also learn how to create a loop that executes a section of code
multiple times.

## Table of Contents

Chapter 9.0 Controlling the Flow of Scripts with Decision Making,
contains the following sections:

[9.1 Logical Operators](09-1_LogicalOperators.htm)

[9.2 The If Statement](09-2_TheIfStatement.htm)

[9.3 Adding a Second Branch, the Else
Keyword](09-3_TheElseStatement.htm)

[9.4 Adding Multiple Branches, the ElIf
Statement](09-4_TheElIfStatement.htm)

[9.5 Nested If Statements](09-5_NestedIfStatements.htm)

[9.6 Compound If Statements](09-6_CompoundIfStatements.htm)

[9.7 Looping](09-7_Looping.htm)

[9.8 Chapter Exercises](09-8_ChapterExercises.htm)

 

  ---------------------------------------------------------- -- --------------------------------------------------
  [Back](javascript:window.history.go(-1);){accesskey="b"}      [Next](09-1_LogicalOperators.htm){accesskey="x"}
  ---------------------------------------------------------- -- --------------------------------------------------
