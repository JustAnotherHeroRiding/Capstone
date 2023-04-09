

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
- Users will also be able to message each other, and these messages should be visible on their profiles for each user they have communicated with
- Users can upload their profile pictures #DONE 
- If i follow a user i can see all of their reviews
- The user view will have a reactive second nav menu allowing me to select my reviews, reviews from follower users, gear on my wishlist etc
- Create Lists

### There will be a search bar to search for any matches in any of the categories
- In the sidebar I should be able to search for usernames of other users and view their profiles #DONE 
- I can check if it is a user, add some identifier in the models so i can load the proper component, profile if it's a user and so on #DONE 
## Browse Albums, Players or Gear
## Leave Reviews for albums or gear, leave comments for players
## Messaging between users
## Forum section
Maybe use the spotify api to get data about an artist's album
Fun Facts section with a description for each artist,album or gear
