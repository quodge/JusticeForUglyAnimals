# JusticeForUglyAnimals
https://whispering-earth-86255.herokuapp.com/

This project uses a MEEN Stack (MongoDB, Express, EJS, NodeJS) and is hosted on Heroku.

I have a comments page where registered users can see a list of comments as well as add their own comments.
I also have an events page where registered users can view a fixed list of events. Users can add an event to their profile which is displayed to them near the top of the page.
Users who are not signed in have their access limited to the home, register and login pages. 
Users who are signed in can access all pages except login, register and the admin section. These users can go to their settings to sign out or delete their account.
The admin user can access all pages except login and register. This user has all the functionality of regular users as well as having access to the ‘Admin Centre’ where they can view a list of all registered users and can delete all comments from the comments page.


Passwords are hashed so that they are kept secure when being sent from the server to the database.

Environment variables are used to hide some variables like the JSON Web Token key and MongoDB URI for security.
Users are directed to a placeholder page when accessing a page they are not permitted to use.


Available log in details use:
•	username: testUser password: RGUcm4025
•	admin username: AdminLFTU; password: lftuRGU304 
•	You can also create your own user to test

The events page can only add one event to the ‘myEvents’ section at one time as making a list of events to hold in the database was not possible.
The comments page works as expected
