

A website where users can discuss guitar music, rate albums, list the gear used by the players and discuss the player's themselves. A never ending chase of "Tone".

## Working title - In Tone

## Models
- Album Model, each album should have a guitar player connected to it, reviews and comments. A review can be only with stars or with text, only the stars are mandatory. #DONE 
- Player model, should be connected with all albums that he played on, and with the gear that he used #DONE 
- Band Model, can see all albums and guitar players from the band #DONE 
- Gear Model, with subcategories for guitar,amp,pedals and other #DONE 
- Review model, can be connected to the gear or album reviews #DONE 
- Comment model can be left on any of the above models, meaning you can leave comments on a player,album,band,gear,reviews etc. A comment does not have to include a rating but must include text, a review must include a rating but not text #DONE 
## Profile View
- Each User will have his own profile, where they can see all of their reviews, review score distribution, albums,gear or artists added to their watchlist, comments people have left them #DONE 
- Users will also be able to message each other, and these messages should be visible on their profiles for each user they have communicated with #DONE 
- The inbox will first show all users that the current user has written or was writen by, showing the last message that was either sent or received in the history with that user
- Upon clicking on one of the users the message history will be loaded, i will need a state to track which user's messages to show and one more state to see if it should show the users or the message history
- The user's whose history is showing is the one that will receive the message when sending the new message
- Messages should have pictures as well as text and emoji
- Users can upload their profile pictures #DONE 
- If i follow a user i can see all of their reviews
- The user view will have a reactive second nav menu allowing me to select my reviews, reviews from follower users, gear on my wishlist etc
- Create Lists
- Pagination for comments, infinite scroll for messages where messages get loaded when scrolling up

### There will be a search bar to search for any matches in any of the categories
- In the sidebar I should be able to search for usernames of other users and view their profiles #DONE 
- I can check if it is a user, add some identifier in the models so i can load the proper component, profile if it's a user and so on #DONE 
## Album/Gear/Player view
- Separate page for each entry, on the main page there should be a selection from each other these caterogies, ranked by various statictics that I need to determine, it can be by date at first
- All the links should load the correct view when clicked, when clicking on the player from the album view it should load the player's page 
- Each gear entry should have a list of players using it and albums it was used on
- Each player should have a list of gear used, gear used per album
- Each album page should have the tracklist, gear used and the guitar player
## Browse Albums, Players or Gear
## Leave Reviews for albums or gear, leave comments for players
## Messaging between users
## Forum section
Maybe use the spotify api to get data about an artist's album
Fun Facts section with a description for each artist,album or gear
