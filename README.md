# Syntactics

## Features
- [ ] The user would paste the code into the textbox
    - [ ] The user can input any language of their choice and the code that is inserted would be in a IDE-like format, in other words, font that has fixed width.
- [ ] Uses an AI model (preferably Gemini API) to read in the code a provide a response
    - [ ] Return the time complexity of the code as well as indicating each line why it is considered that time complexity from the methods they make
    - [ ] Return the space complexity of the code
    - [ ] Return any techniques used in the code, such as the data structure used or techniques such as two-pointers, multiple pass techinque, etc.
    - [ ] Offer detailed feedback on improving the user's code, such as how its being coded, helpful comments, and suggesting on a different data strucutre if applicible
- [ ] Leetcode mode, where users can paste in any problem, select a programming language that the AI would respond with, give a leetcode problem, or a leetcode problem number, and the AI would return a response
    - [ ] The AI would use the UMPIRE framework to help the user what the problem is talking about, what time/space complexity it requires, and how to approach the problem.
        - [ ] Understand: The AI would see what the input is, what the output is, core logic, and the possible edge cases
        - [ ] Plan: Plan out what the code would be in plain english
        - [ ] Implement: Implement the code based on the option the user gave to choose the desired programming language
        - [ ] Review: Review and validate the code by testing out outputs and edge cases
        - [ ] Evaluate: State teh time complexity of the code that is written
