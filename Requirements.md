
# A website where users can discuss guitar music, rate albums, list the gear used by the players and discuss the player's themselves. A never ending chase of "Tone"

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
- The inbox will first show all users that the current user has written or was writen by, showing the last message that was either sent or received in the history with that user #DONE
- Upon clicking on one of the users the message history will be loaded, i will need a state to track which user's messages to show and one more state to see if it should show the users or the message history #DONE
- The user's whose history is showing is the one that will receive the message when sending the new message #DONE
- Messages should have pictures as well as text and emoji #DONE
- Users can upload their profile pictures #DONE
- If i follow a user i can see all of their reviews
- The user view will have a reactive second nav menu allowing me to select my reviews, reviews from followed users, gear on my wishlist etc
- Create Lists
- Pagination for comments, infinite scroll for messages where messages get loaded when scrolling up

### There will be a search bar to search for any matches in any of the categories

- In the sidebar I should be able to search for usernames of other users and view their profiles #DONE
- I can check if it is a user, add some identifier in the models so i can load the proper component, profile if it's a user and so on #DONE

## Album/Gear/Player/Band view

- Users should be able to upload pictures for each entry #DONE 
- Separate page for each entry, on the main page there should be a selection from each other these caterogies, ranked by various statictics that I need to determine, it can be by date at first #DONE
- All the links should load the correct view when clicked, when clicking on the player from the album view it should load the player's page  #DONE
- Each gear entry should have a list of players using it and albums it was used on
- Each player should have a list of gear used, gear used per album #DONE 
- Each album page should have the tracklist, gear used and the guitar player #DONE 
- Tags and descriptors for albums, players and gear and bands

## Adding New Entries

- There should be a separate page that should be all about adding new entries #DONE 
- This can be an album, a connection between a player and a piece of gear or anything in between. #DONE 
- Bunch of forms with post requests to the backend #DONE 
- Reactive nav menu inside the popup for selecting which type of entry to add #DONE 

## Updating or editing already added entries
- On the single view i can edit or add new gear, albums or any other connections #DONE 
- I should also be able to delete connections #DONE 
## Reviews and Comments
- Albums are done, need to add it for gear #DONE 
- Users should be able to leave reviews for albums and gear, one per user #DONE 
- Users can edit their own reviews and change the star rating or text, if edited there will be a star next to the date to show it was edited after it's original date #DONE 
- If a user submits a review when there is already one review posted by them then the review will be edited with the new stars and text #DONE 
- Users can only leave comments for players and bands, which are not limited to one but do not have stars, comments can also be left on albums and gear #DONE 

## Going back to the profile
- Finish the remaining functionality on the profile, which is the reactive menu: #DONE 
- With all reviews posted by a user #DONE 
- Users can follow each other #DONE 
- I need a way to fetch all reviews posted by the users that I am following whose Ids are currently stored in following_users, either a new endpoint or an extension to following_users
- Reviews posted by users I follow in the following tab on the profile nav menu
- Adding gear to the wishlist
- Gear on the wishlist on the profile view
- Album charts

## Finishing Touches
- Reviews sorted in reverse chronological order #DONE 
- Pagination for the entries so I dont have to scroll a lot if there are a lot of entries
- Testing the responsiveness of the UI and appearance on smaller screens
- Smoothing out elements that don't fit the style or stick out
- 
## Browse Albums, Players or Gear #DONE

## Leave Reviews for albums or gear, leave comments for players #DONE 

## Messaging between users #DONE

## Forum section

Maybe use the spotify api to get data about an artist's album
Fun Facts section with a description for each artist,album or gear
Tonehunt links when there is one for amps and pedals
