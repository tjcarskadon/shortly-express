##Bare Minimum Requirements

Todo:
 * [ ] figure out what the db schema looks like, make sure it is correct - will need to store sessionID - Created a new table for users and tested this 
 * [ ] route to the registration page
 * [ ] make that login page post to db
 * [ ] implement a hash for the password.
 * [ ] activate a login page
 * [ ] get from the db and check to see if the user is authorized.
 * [ ] make that login page start a session - session params will have to log out after a reasonable time.  
 * [ ] add redirect to the app page 
 * [ ] minor improvment to how link click count is handled. This could be better.... right now you have to refresh.
 * [ ] create a log out method that destroys the session


* Build a simple session-based server-side authentication system - from scratch:
    * [ ] Make sure that you pass the tests marked as pending (xdescribe) in the spec file.
        * [ ] Add tests for your authentication if necessary.
    * Use the tests to guide you through the other requirements.
* [ ] Create a new table users with columns username and password. Consider how you will store this information securely. What models will you need and what behavior will they encapsulate?
* [ ] Allow users to register for a new account, or to login - build pages for login and sign up, and add routes to process the form data using POST actions.
* [ ] Add a checkUser helper to all server routes that require login, redirect the user to a login page as needed. Require users to log in to see shortened links and create new ones. Do NOT require the user to login when using a previously shortened link.
* [ ] Enable sessions so that the user does not need to keep logging in when reloading the page.
* [ ] Don't forget to give the user a way to log out!