# Capstone

# CS50 WEB PROGRAMMING FINAL PROJECT: InTone

The project video is: https://www.youtube.com/watch?v=0qHFcEABeHc

## Main idea
A website where users can discuss guitar music, rate albums, list the gear used by the players and discuss the players themselves. A never ending chase of "Tone" and the gear used to obtain it.  The main components are:

* Home page where there will be entries listed from all four categories, and users can search for an entry or user to load their profile/entry page
* Login/Logout/Register
* Albums/Gear/Players/Bands page where only entries of one category will be displayed
* Single Entry view where users can view the connections that the entry has, and all reviews and comments that other users have left. For example by clicking on an album, we can see the gear used to achieve that 
album's sound and the guitar players on it. On this page users can write reviews(one per user with a rating) or comments(unlimited per user without a rating)
* Profile view where users can look at all of the reviews they have written, reviews by followed users and their inbox. Users can message eachother, follow and be followed or leave comments on
eachother's profiles.
* On the main page users can add new entries using the popup window, and on each entry page users can add new connections.
* The admin account can delete these entries or connections that other users have added

## Distinctiveness and Complexity
The main complexity in this app comes from the various models that I have had to create in order to properly display the connections between the 4 types of entries and the reviews/comments/messages made by 
users or the wishlist of gear that they would like to acquire. The data returned from all of the endpoints needs to be light but comprehensive enough to display all of their characteristics and connections 
so that the load time is optimized, which i have managed to do by creating 2 serialize methods for each models where it was needed, a full serialization containing all of the data and a lighter minimal_serialize()
method which only returns the bare minimum needed to display the entry.

In order to serve all of this data to the front-end i've used over 25 endpoints. The frontend is entirely written using React built with Vite, which is then served to the base.html file in my django templates.
No django templating or additional html files were used. All of the data required to render the html code with react is obtained by making fetch requests to the API endpoints written in django almost all of which
return a JsonResponse or perform the action needed in the backend such as uploading a picture. This means that I have created a Single Page App where no page reloads are needed and the user experience is smooth
and fast when browsing the various entries and their connections, users can message eachother or leave reviews which will be instantly rendered on the screen.

## Files information

* In views.py are all of endpoint routes which will be used to communicate with the React Front-End. I have defined the following views:
    * index: the only view that renders an html file, which is base.html where we render the Vite React app instead of any html
    * check_login: checks if the user is logged in and returns true or false, if true then it also returns the user data
    * get_user_data: returns a JsonResponse of a user's data by passing in their user_id
    * search: an endpoint that returns minimal data needed for my search bar and loading the clicked result in a JsonResponse
    * upload_profile_pic: self explanatory, uploading a profile picture on the profile page
    * send_profile_comment: saving the profile comment in the db, returns an error message if the request is invalid or missing data in the request
    * send_entry_comment: same as above but for an entry instead of the profile
    * get_profile_comments: return a Json of all profile comments for the profile_id
    * send_message: send a message from the current user to the user with the recipient_id
    * get_all_users: get all users that the current user has sent a message to or received a message from, i.e. all chats
    * get_message_history: get the message history between the current user and the selected user with the user_id that is passed
    * get_all_messages: get all messages that the users has sent or received 
    * get_all_entires: return the full serialize method of each entry instead of the minimal_seriaze() in the search endpoint, currently not used
    * get_single_entry: get the entry data by passing the entry_type and entry_id
    * add_entry: add a new entry to the db
    * add_connection: add a new connection between 2 entries
    * delete_connection: delete a connection between 2 entries
    * post_review: post a review for a gear or album entry
    * get_all_reviews: returns a json of all reviews posted
    * get_following_reviews: returns a json of all reviews from followed users
    * delete_entry: delete an entry, only the admin user can delete an entry
    * follow_user: follow another user by passing in their user_id
    * unfollow_user: unfollow another user by passing in their user_id
    * add_to_wishlist: add a gear entry to the wishlist
    * remove_from_wishlist: remove a gear entry from the wishlist
    * login_view: log in a user
    * logout_view: log out a user
    * register: register a new user

* Models.py. The different models are:
  * User - A user can have followers or users that the model is following, stored in a ManyToManyField, a serialize method returning the full user data including their wishlist, posted reviews, followers and following 
  and their counts, and a minimal_serialize method which returns only what is needed to display the user and their profile picture and name, plus the ID to use in api requests
  * Message - a model to store all messages that users can send to eachother, including 2 foreign keys to the user mode for  a sender and a recipient
  * Gear - the first of our four entries which can be one of four categories: guitar, amplifier, pedal or other. Same as the user there are 2 serialize methods, the full serialize method returns all of the connections
  that the gear model has and their minimal_serialize() methods
  * Wishlist - a separate model to create wishlists and store the list of gear entries on each user's wishlist
  * Player - a model for the guitar players, the main connections are to the gear that the use, the bands they have been a part of and the albums that they played on. 2 serialize methods as before
  * Band - a model for bands, the main connections are the band members, albums and guitar players with 2 serialize methods
  * Album - a model for albums, each album must have a band but all connections can be blank. The main connections are the players and the gear used for each album. 2 serialize methods as before
  * Review - a model for reviews which can be left for Gear or Album entries, the review can have a score anywhere from 0 to 5 in 0.5 increments, a user that has posted it and the album or gear model
  that the review is meant for. I have added a separate marker to check if the review was edited or not. 2 serialize methods
  * Comment - a model for comments that users can leave on the four entries, it can have a foreign key to one of them while the other keys remain blank
  * ProfileComment - similiar to the comment but meant for profiles instead of the entries


* Src - Inside of the root directory of my Capstone project is the Src folder where React components are stored and served to the django server as the front end.
  * Main.jsx - The main jsx file which makes a check if the user is loged in and saves the current user data into a useState using the response returned from the API endpoint. The function fetchUserData() is 
  defined here which will be then passed to our Sidebar.jsx component, together with the loggedIn status, the user data and the currentuserId. This is where we render all of our react code to the root div
  * Sidebar.jsx - The Sidebar Component from which our navbar is rendered and we can navigate and use our app from. Depending on if the user is logged in or not we display the log out or log in/register buttons.
  There is a fully functional search bar that renders results in real time and loads the result's page upon clicking on it. From here we render the following components: A profile component if clicking on our profile
  in the sidebar or another user if clicking on another user in the search results/reviews/comments
  If the profile should not be loaded when we load our MainPageItems component that displays our entries.
  * Profile.jsx - Renders our profile page or another user's, we can see our message, message other users, read the comments that other users have left, upload a profile picture if our own profile, see all reviews written
  by this users or by users that he is following and see items on their wishlist.
  * AlbumGearArtist.jsx - Renders our entries which is what the user will see on the first page load. We can either display all four entry types, just one entry type using the buttons in the sidebar or open a specific
  entry page by clicking on it or the result in the search bar. We can also add new entries using the pop up window or add new connection from the single entry view.
  * Forms.jsx - here we have all the form components needed for another a new album, gear, player or band. We also have the forms for adding a new connection or writing and displaying all reviews or comments. The last 2
  forms handle adding a gear item to the wishlist or removing it.
  Each of these forms are a separate component that i can render inside of my other pages for quick reusable code
  * Index.css is my base file for tailwindCSS and my custom classes
  * App.css contains custom classes using vanilla css
  * Index.html remains unused as we are using base.html from the django app templates

* tailwind.config.js contains some of my custom classes, breakpoints and color schemes including the InTone color scheme which are the main colors used for my app.
* TBA/urls.py contains all of the endpoints for each view defined in views.py
* TBA/templatetags - Here I have defined a bundle needed to launch the app into production mode
* TBA/static - All entry pictures, profile pictures and pictures sent in messages

* staticfiles contains all of the files created by python.manage.py collectstatic that will be served if we run the django server with debug set to False(production mode), in this case we do not need to run the npm server


## How to run the application
* Install project dependencies by running pip install -r requirements.txt
* Install node modules with npm install
* Make and apply migrations by running python manage.py makemigrations and python manage.py migrate.

* Open a second terminal window and navigate to the project directory, run npm install to install all npm dependencies and then run npm run dev in order to start the vite react app.

* If you wish to run it into production mode, run npm run build, python manage.py collectstatic and then python manage.py runserver with debug set to false, this way you do not need to run the npm server to serve the 
front end code.
