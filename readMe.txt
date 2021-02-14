In order to run this application, do the following:

1. Ensure that your local mongoDB is on localhost:27107
2. Create a blank db that has 1 blank collection
3. whatever your DB name is, open app.js and replace the db name on line 5 with your db name(replace "user-management" with your db name)
4. Replace the collection value on line 27 in app.js with your empty collection name(replace "user-data" with your collection name)
5. cd into project location and execute "node app.js" in the terminal
6. in your browser, go to http://localhost:3000/
7. Create 3-4 users by clicking add and filling and submitting the information. your app should initially be blank if your db is blank
8. Edit a user
9. Delete a user
10. Click sort by age to sort users by age
11. Search a user by either the first or last name 
12. Click View all to view the entire table