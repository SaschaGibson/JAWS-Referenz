# learning Jaws Scripting: a walkthrough
In this walkthrough, you will create a script using the Jaws for Windows scripting language. It will not be the most useful or engenius script ever written, but it will be a good first step into the complex, and often fustrating world of making applications more accessible to Jaws for Windows. This first example will focus on creating a script that simplifies a tedius task by simulating multiple keystrokes from the one script. In the next examples, we will learn about how to get under the hood of an application, accessing its underlying data to do things that cannot be done merely by simulating keystrokes.

## Prerequisits
Read the entire [Basics of scripting manual](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/01-0_Introduction.htm).
The manual is not particularly long, so you should be able to read the entire thing front to back. If you are confident you understand the concepts in a given chapter, feel free to skip the chapter exercises. I mostly want to be sure you understand all the basic concepts.
The first program we will work on making more accessible will be Dropbox. If you do not already have it, download and install it from [the Dropbox Website](https://www.dropbox.com/downloading). This will also require you to create a Dropbox account before you can properly run the program.

## The Problem
Dropbox, until recently, would open just like any other folder by using file Explorer, which is the built in program for displaying files and folders. Since Dropbox was opening as if it were a standard folder, there were no accessibility issues. Using Dropbox was as simple as navigating to a normal folder to find the desired file. Any special Dropbox functionality was accessed through the context menu. The recent changes to Dropbox, however, cause the app to open in its own style of window. There are some extra bells and wistles that have been added to this new interface, but Jaws is not able to navigate the files and folders as smoothly as it could before. One solution to this difficulty is to click the button named "Open in File Explorer", which opens the old style window. However, finding this button requires tabbing several times through other controls, which is a nusense.

## Solution
Since we know this button can be accessed, and know the commands we need to type to find and activate it, we can create a script that tabs through the Dropbox window until it finds the Open in File Explorer button. Once focus as been moved to the button, we can code the script to simulate pressing the enter key.

To make sure we are properly coding each step of this script, we will build it bit-by-bit, testing that each step does what we expect it to do. This will give us confidence that each bit of code we're adding does what we expect it to do, so once we run into problem, it should be much easier to troubleshoot.

## Setup: Opening Script Manager
1. Open Dropbox.
2. Press Jawskey+0
3. The script manager should open. If it prompts you to create a new script file for Dropbox, hit enter to create the file.
4. You should be in an empty file, and the title of the window should be, "Jaws Script Manager - [Dropbox.JSS]".

## Step1: Create An Empty Script
The first step is to make a script that does absolutely nothing, then test that Jaws properly associates it with a hotkey while using Dropbox. If you get stuck at any point, try referring to [chapter 5 of the Basics of Scripting manual](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/05-0_CreatingScripts.htm). 

1. In the empty Dropbox.JSS, press control+e to open the Add New Script dialog.
2. name the script OpenInFileExplorer.
3. Check the Can be Attached to Key checkbox.
4. Write a concise synopsis such as, "Opens Dropbox in File Explorer", then write a more detailed description such as, "Activates the Open in File Explorer button to open the older Dropbox interface".
5. In the Asign to Key field, press control+e.
6. Tab to the okay button and hit enter.
7. Your curser should now be in the middle of a new, blank script.
8. Press control+s to compile and save.
9. alt-tab to Dropbox, and activate keyboard help with jawskey+1.
10. Press control+e. You should hear Jaws speak the synopsis of your script.
11. Press control+e+e. You should hear Jaws speak the description of your script.
12. Press control+e+e+e. You should hear Jaws speak the name of your script.

If keyboard help mode is not recognising the hotkey at this point, try doing step 2 anyway. I have found that sometimes empty scripts simply are not recognised until they contain at least a line of functional code.

## Step 2: Create A Hello World Script
We will now modify our script to do the most basic thing any programmer knows how to do: speak the words, "hello world". We will do this by adding a call to the SayMessage function using the [insert function dialog, found in chapter 5.5 of Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/05-5_InsertingFunctions.htm).
1. In script manager, insure that the curser is inside the body of your script. That means it should be below the line that says, "Script OpenInFileExplorer", but above the "EndScript" line.
2. Press control+i to open the Insert Function dialog.
3. Type ""say", then tab once to the list box of all available functions.
4. From here, you can scroll through the functions, starting at the first function with the word "say".
5. Jaws should speak the description of each function as you arrow to it, but if you want to review the description, shift tab 3 times to the description field.
6. We want the function called SayMessage, so either arrow to it, or type saym in the function name field and hit enter.
7. The dialog box should now be prompting you for the constant representing the output type of this message. It is beyond the scope of this exercise to explain the purpose of output types and list them all, so for now, just type "OT_MESSAGE" (in all caps), and hit enter.
8. You should be prompted for the long message, which is the message spoken when Jaws is set to beginner verbosity. Type "hello world" (with surrounding quotation marks), and hit enter.
9. You should be prompted for the short message, which is the message spoken when Jaws is set to advanced verbosity. Type "hello" (with the surrounding quotation marks), and hit enter. Alternatively, leave this field blank and hit enter.
10. The dialog box will close. A new function call will be entered at the curser, and should look like:
    SayMessage (OT_MESSAGE, "hello world", "hello")
11. If you chose to leave the short message blank, the function call will end with a comma, a couple spaces, then a left paren. Delete the comma, otherwise the compiler will give an error. Also remove any extra space before the left paren for stylistic reasons.
12. Try to compile with control+s. This time, you will get a compiler error that looks like:
	>Compile Error  
	> Error: Unknown variable OT_MESSAGE
	
	This is because the script manager does not have a built in definition for OT_MESSAGE. You need to include the definition for OT_MESSAGE, and all other output type variables, by [including HJConst.jsh](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/05-1_BeforeYouStart.htm).
13. Move to the top of the file, and hit enter to create a blank line.
14. On that blank line, type 'include "HJConst.jsh"'.
15. Press ctrl+s to compile and save. You should now get the message "compile complete".
16. alt-tab to Dropbox, and press control+e. You should hear Jaws speak "hello world".

Congratulations. You now have a script that does something! In the next step, we will modify this script to do more than just talking.

## Step 3: Simulate Pressing A Key
Since the final version of this script will simply mimic the keystrokes we type to navigate to and activate the Open in File Explorer button, we will need to learn how to simulate pressing a key. We will start by calling the [TypeKey function to issue a single tab command](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/10-2_GivingKeyboardAccess.htm).
1. move the curser to a blank line between the SayMessage function call and the EndScript tag.
2. Press ctrl+i to open the Insert New function dialog.
3. Select the TypeKey function, and hit enter.
4. For the first parameter, type "tab", (including the surrounding quotation marks).
5. Press alt+f to finish.
6. A new call to the TypeKey function will be entered at the curser and will look like:
	>TypeKey ("tab", )
7. Try to compile with ctrl+s. You will get an error like:
	>Compile Error  
	> Error: Incorrect parameter format
	
	This is because we did not enter anything for the second parameter, so the Insert New Function dialog left a blank space between the comma and the left paren. The comma tells the compiler there should be another parameter, but it just finds a few spaces instead.
8. remove the comma before the left paren, and for stylistic reasons, remove any remaining space before the left paren as well.
9. Press ctrl+s to compile and save.
10. alt+tab to Dropbox.
11. Press ctrl+e. You should hear Jaws speak the message from the last step, then notice Jaws tab once.

At this point, you can delete the SayMessage call. It will not be needed in the next steps, although it can be nice to have as a sanity check.

## Step 4: Tab Repetivively
Of course if we need to tab multiple times to reach the Open in File Explorer button, then our button tabbing just once is not enough. We need to use a loop to tab multiple times. In the next couple steps, we will add a [while loop from chapter 9.7 of Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/09-7_Looping.htm) to tab repetatively until the button is found.

Since there is a risk that the button might not be found due to either an error in our script or a Dropbox update that changes the button element, we should first code our loop so it will not tab more than a given maximum number of times. We will do this by creating a max_tabs [constant](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/07-2_Constants.htm), creating a tabCount [variable](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/07-1_Variables.htm) to count the number of times the loop has executed, then coding the loop to break after tabbing that many times.
1. Define the MAX_TABS constant by going to a blank line at the top of the file, but below the include statement, and type "const MAX_TABS = 40".
2. Define the tabCount variable by going to a blank line below the start of the script, and typing
	>var int tabCount = 0
3. Enclose the call to TypeKey("tab") in a while loop. Above this line, type "while tabCount < MAX_TABS", then below it, type "EndWhile". You should now have a loop that looks like:
	>while tabCount < MAX_TABS  
	>TypeKey ("tab")  
	>EndWhile  
4. As is, this will loop infinatly because there is no code to count the number of times it has tabbed.
5. Above the EndWhile tag, add the line
	>tabCount = tabCount + 1
6. For stylistic reasons, remember to indent the lines of code inside the loop body. Your loop should now look like:
	>while tabCount < MAX_TABS  
	>	TypeKey ("tab")  
	>	tabCount = tabCount + 1  
	>EndWhile
7. Press ctrl+s to compile and save.
8. alt+tab to Dropbox, and Press ctrl+e. Jaws will tab a few times, but nowhere near the max of 40 that you specified in the MAX_TABS constant.
	This is because when Jaws issues the tab command, it does not wait for Dropbox to move focus to the next element before it continues executing the script. So while Dropbox takes a few milliseconds to handle the tab command, Jaws is continuing to run the loop, issuing tab commands that Dropbox is not able to handle. If we [pause after typing the tab key](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/10-3_DelayingYourScript.htm), then Dropbox has time to react to the tab key by moving focus to the next element before our script issues the next tab.
9. On a blank line below the call to TypeKey, add the line
	>Pause()
10. Compile and save.
11. Now when you alt+tab to Dropbox and press ctrl+e, Jaws will tab 40 times before stopping of its own accord.

In the next step, we will attempt to have Jaws stop tabbing when it lands on the Open in File Explorer button.

## Step 5: Try Using The Getline Command To Recognise When The Open In File Explorer Button Has Been Found.
Now that our script can tab repetatively without looping forever, we are ready to modify it so it stops when it finds the Open in File Explorer button. Since we can read the text of the button using the sayLine function, which is typically attached to Jawskey+up arrow, we can use the associated GetLine function to check if the line of text at the curser matches the button's name.
1. tab to the Open in File Explorer button.
2. Press Jawskey+up arrow twice quickly to hear Jaws spell the text of the button.
3. Add this text as a constant definition by going to the top of the file, then on a blank line beneath the MAX_TABS definition, type,
	>const OpenInFileExplorer_text = "Open in File Explorer"

4. Modify the condition of the while loop so it only loops when tabCount is less than maxTabs and when the GetLine function does not return the text of our button. Do this by appending to the condition in the while loop, "&& OpenInFileExplorer_text != GetLine()". It should now read:
	>while tabCount < MAX_TABS && OpenInFileExplorer_text == GetLine()

5. Compile and save, then alt+tab to Dropbox.
6. Try pressing ctrl+e. You will notice Jaws tabbing the full 40 times, going straight past our button.

Something is wrong. By all means, this script should stop when it reaches the Open in File Explorer button, but it does not. What is causing this problem? In the next couple steps, we will explore ways of troubleshooting this basic script error.

## Step 6: Using The Virtual Buffer To Review Values In Scripts
Consider where the problem could be in the code. We have a loop that tabs repetitively. Could this loop not be tabbing enough times to find the button? Trust me on this one, we set the MAX_TABS high enough that the loop tabs through the whole window at least once. If you want to double check, you could press control+e, then listen as Jaws tabs full circle back to the element you started on.

You might find other weak points, but as far as I am concerned, the only part of this code we didn't test while developing was the second half of the while condition, OpenInFileExplorer_text != GetLine(). My first hunch is that the GetLine function is not returning what we expect it to return. Let's test this by putting the return value of GetLine into the [virtual viewer, also known as the user buffer from chapter 11.3 of Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/11-3_DisplayingTheMessages.htm). We can then review the return value using standing reading commands.
1. At the top of the script, type,
	>sayMessage(OT_USER_BUFFER, getLine()).

2. Change the initial value of tabCount to a high number, like 1000. This will stop the loop from ever executing. We are effectively disabling the rest of the script while troubleshooting.
3. compile and save.
4. Alt+tab to Dropbox. The script should now open the virtual buffer, and fill it with the return value of GetLine().
5. You'll notice the virtual buffer is empty. What might we be doing wrong? Is GetLine even returning anything? Are we not using the virtual buffer properly?
6. double check that we are properly invoking the virtual buffer by adding text before and after the call to GetLine. 
	>sayMessage(OT_USER_BUFFER, "The line is "+getLine() +", end of line")
	
	At the least, if we are properly invoking the virtual buffer, the text we insertted before and after the call to GetLine will be displayed. If the virtual buffer still displays nothing, not even this text, then we know there is something wrong with our call to SayMessage.
7. Compile and save.
8. alt+tab back to Dropbox. Pressing ctrl+e should open the virtual buffer, displaying the text, "The line is  , end of line", with no added text in the middle. This tells us that even though the SayLine key, Jawskey+up arrow, reads the name of the button, the GetLine function is not returning anything.

As you become more proficient with scripts, you will likely find many instances where something does not work as expected, and there doesn't appear to be any good reason why that is. This example of GetLine not returning anything even though we know there's a line to return is one of those times when something simply does not work for no good reason. Becoming proficient with scripting in this type of environment involves the art of finding work-arounds to seemingly simple problems.

In the next step, we will explore alternative ways of recognising when we have tabbed to our button.

## Step 7: Finding Alternative Ways Of Recognising Buttons
Now that we know the GetLine function doesn't do what we hoped it would do, let's try scrolling through other builtin functions in hopes one of them will do the trick.
1. Within the body of your script, press ctrl+i to bring up the list of builtin functions.
2. tab once, then scroll through the list looking for something useful.
3. When you find a function that looks like it might be handy, you can shift+tab thrice  to review the description and what the function returns.
4. Since we are looking for something to help identify the Dropbox element we just tabbed to, try looking for functions that start with the word get. Perhaps one of them will return a unique identifier for the Open in File Explorer button.
5. To play with a function, you can rewrite the SayMessage function call from the prior step, replacing GetLine with a new function.
6. For further inspiration, check out [Chapter 13, Windows Program Structure from Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/13-0_WindowsStructure.htm).
7. After you have played around with this for a bit, move on to the next step where I will show you the solution I found.

## Step 8: A Successful Way To Identify The Button
I can't remember how many silly things I tried before finally landing on the GetObjectName button. It has a promising description, which reads as follows:
>If the Pc Cursor is active, the name of the object with focus is returned. Otherwise, the name of the object at the position of the active cursor is returned. The value is returned as a string.
Let's hope that our button has an object name that we can use to clearly identify it. We'll start by testing that the GetObjectName function returns a name that distinguishes the Open in File Explorer button from other buttons, then, if we're lucky, we'll code our while loop to use this function.
1. Rewrite the SayMessage function call to
	> sayMessage(OT_USER_BUFFER, "The object name is "+GetObjectName() +", end line")
2. Compile and save.
3. alt+tab to Dropbox. Press ctrl+e while on the Open in File Explorer button. The virtual window should pop up with the text,
	>The object name is Open in File Explorer, end line
4. Great! We found how to programatically identify this button. We can now use this in the while loop of our script to identify when to stop tabbing.

In the next step, we will implement the GetObjectName function in the condition of our while loop, so the loop terminates when the object with focus has the name "Open in File Explorer".

## Step 9: Implementing The GetObjectName Function
We need to edit the condition of the while loop so it compares against the result of a call to GetObjectName, then test that it stops when we want it to, but first, we should  remove the unnecessary code we added while debugging.
1. Delete the line at the top of the script that calls SayMesage, and which we were only using for debugging in the last few steps.
2. Enable the while loop by changing the initial value of tabCount back to 0, like it was before.
3.  Edit the condition of the while loop so it compares against GetObjectName instead of GetLine. It should now read,
	>while tabCount < MAX_TABS && OpenInFileExplorer_text != GetObjectName()
4. Compile and save.
5. alt+tab to dropbox. Press ctrl+e. You should now hear Jaws tabbing through the window before stopping at the Open in File Explorer button.

We now have a script that does all the difficult work for us. We can press control+e to move the focus to the Open in File Explorer button. The only remaining feature is for the script to go the extra mile of activating the button for us, which will be the focus of our next step.

## Step 10: Activate Thebutton
Since we can manually activate the button with the space bar, we can likewise code our script to activate the button by simulating typing a space. For this, we will use the TypeKey function. To insure we do not accidentally activate another button in the event that the while loop failed to find the Open in File Explorer button, we wil use an if statement to double check that the current object is what we want.
1. On a blank line at the end of the script, add the line:
	>TypeKey ("space")
2. Compile, save, alt+tab to Dropbox, and try the script.
3. It should now activate the button as soon as it is found. Dropbox tends to be a bit slow, so you might need to wait a few seconds before the file explorer window pops up.
4. Scroll up and down in file explorer, and observe that it is displaying the contents of your Dropbox in a standard Windows folder.

We now have a full-service script that both finds and activates the Open in File Explorer button. We will add the finishing touches by using an if statement to validate that the loop successfully moved the focus to the Open in File Explorer button, and if that is not the case, speak an error message.

## Step 11: Validation and Error Message
To insure the script does not activate any other button than the one we intend it to activate, we will enclose the call to TypeKey within an if block, found in [Chapter 9.2, The If Statement from Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/09-2_TheIfStatement.htm). Should the while loop not move focus to the Open in File Explorer button, the if statement will evaluate to false, preventing the TypeKey function from being called. We will put an else block after the call to TypeKey, causing an error message to be spoken whenever the TypeKey function is not called.
1. Enclose the call to TypeKey in an if statement, so it reads as follows:
	>if OpenInFileExplorer_text == GetObjectName() then  
	>	TypeKey ("space")  
	>endIf
2. Now after the call to TypeKey, but before the EndIf statement, add the else keyword, and a call to the say function with an error message.
	>if OpenInFileExplorer_text == GetObjectName() then  
	>	TypeKey ("space")  
	>else  
	>	say("Could not find Open in File Explorer button", OT_ERROR)  
	>endIf
3. To check that the error message is properly spoken when the button is not found, force the script to fail by making an intentional typo in the constant declaration for the button name. Something as simple as adding an x to the beginning should do the trick.
4. Compile, save, and alt tab to Dropbox.
5. When testing the script, you should hear Jaws tab 40 times before speaking the error message, "could not find Open in File Explorer button".
6. Finally, fix the typo you intentionally made in step 3, then save and compile.
7. Do one last test of the script to insure it still works as intended.

Congratulations. Your full-service script is polished and ready to go. It does what you need it to do, and it does not do what you do not want it to do. There is nothing more to add to the functionality of this script, but I would be doing you, and the Jaws scripting community, a disservice if I did not follow proper convention for spoken text and message files. The very last thing we will do is move the error message from the jss file into a jsm, Jaws Script Message, file.

## Step 12: Using Message Constants
To move the error message into a message file,we will first need to create the new file. It will then be a matter of copying the existing error message into the message file, using the syntax found in [Chapter 8.2, The Jaws Message Format, from Basics of Scripting](https://support.freedomscientific.com/Content/Documents/Other/ScriptManual/08-2_TheJAWSMessageFormat.htm). Then in the jss file, we include the jsm file, and replace the error message with the name given in the jsm file.
1. Press ctrl+n to open the new file dialog.
1. Scroll down to Messages (JSM), and hit enter. A new, blank file should be created.
1. On the top line, add the section indicater "Messages", which should be at the top of every jsm file, right below any optional comments.
1. On the bottom line, close the messages section with the keyword "EndMessages".
1. below the keyword Messages, but above EndMessages, type an @ character followed by the name we want for the message. In this case, let's call our message "msgButtonNotFound".
1. ctrl+tab back to Dropbox.jss. Find the error message near the bottom of the script, and copy the text between the quotes.
1. On the next line, paste the text of the error message.
1. Complete the message definition with two @ characters. The entire jsm file should now look like the following:
	>Messages  
	>@msgButtonNotFound  
	>Could not find Open in File Explorer button  
	>@@  
	>EndMessages
1. Press ctrl+s. Enter the name as Dropbox.jsm and save.
1. ctrl+tab back to Dropbox.jss.
1. Replace the text of the existing error message with the name we defined in the jsm file, being sure to remove the quotation marks. The call to say should now look like:
	>say(msgButtonNotFound, OT_ERROR)    
1. If you try to compile and save now, you will get an error about an unknown variable. This is because the compiler does not know to look in the jsm file you just created.
1. At the top of the file, on a blank line below the existing include statement, add 
	>include "Dropbox.jsm"
1. The script should now compile and save.

Now our fully functional script can be easily translated to other languages just by sharing the jsm file. It is time to be proud of the good work we have done.

## Next Steps: UIA
In the next tutorial, we will rewrite this script using the API from Freedom Scientific for User Interface Automation. This is a completely different method of writing scripts. What you wrote in this tutorial is a script that mimics Jaws commands to save you the effort of pressing a bunch of tab keys. When we learn how to use User Interface Automation, or UIA, we will be able to get under the hood of a program to access its underlying objects. We can then write scripts that can do things we otherwise could not do with keystrokes alone.
