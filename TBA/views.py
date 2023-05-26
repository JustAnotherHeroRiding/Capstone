from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_http_methods
from django.core.files.storage import FileSystemStorage
from django.db.models import Q, F


import json
import os

from .models import (
    User,
    Album,
    Band,
    Gear,
    Message,
    Comment,
    ProfileComment,
    Player,
    Review,
    Wishlist
)


def index(request):
    return render(request, "base.html")


@login_required
def check_login(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {"is_authenticated": True, "user_data": request.user.serialize()}
        )
    else:
        return JsonResponse({"is_authenticated": False})


def get_user_data(request, user_id):
    user = User.objects.filter(id=user_id).first()
    return JsonResponse(user.serialize(), safe=False)


def search(request):
    results = {}

    # Search Users
    users = User.objects.all()
    results["users"] = [user.minimal_serialize() for user in users]

    # Search Albums
    albums = Album.objects.all()
    results["albums"] = [album.minimal_serialize() for album in albums]

    # Search Gear
    gear = Gear.objects.all()
    results["gear"] = [g.minimal_serialize() for g in gear]

    # Search Players
    players = Player.objects.all()
    results["players"] = [player.minimal_serialize() for player in players]

    # Search Bands
    bands = Band.objects.all()
    results["bands"] = [band.minimal_serialize() for band in bands]

    return JsonResponse(results)


@login_required
def upload_profile_pic(request):
    if request.method == "POST":
        uploaded_file = request.FILES["profile_pic"]
        fs = FileSystemStorage(location="TBA/static/profile_pictures")
        filename = fs.save(uploaded_file.name, uploaded_file)
        request.user.profile_pic = fs.url(filename)
        request.user.save()
        return JsonResponse({"profile_pic_upload": True})


@login_required
@csrf_exempt
def send_profile_comment(request, profile_id):
    if request.method == "POST":
        user = request.user
        profile_user_id = User.objects.filter(pk=profile_id).first()

        if profile_user_id:
            data = json.loads(request.body)
            text = data["text"]

            if text:
                comment = ProfileComment.objects.create(
                    user=user, profile_user=profile_user_id, text=text
                )
                return JsonResponse(comment.serialize(), status=201)

        return JsonResponse(
            {"error": "Invalid data. Missing profile_user_id or text."}, status=400
        )
    else:
        return JsonResponse({"error": "HTTP method not allowed."}, status=405)

@login_required
def send_entry_comment(request, entry_type, entry_id):
    if request.method == 'POST':
        user = request.user
        text = request.POST.get('text')

        # Determine the entry type and retrieve the corresponding entry
        if entry_type == 'album':
            entry = Album.objects.get(pk=entry_id)
        elif entry_type == 'player':
            entry = Player.objects.get(pk=entry_id)
        elif entry_type == 'gear':
            entry = Gear.objects.get(pk=entry_id)
        elif entry_type == 'band':
            entry = Band.objects.get(pk=entry_id)
        else:
            return JsonResponse({'error': 'Invalid entry type'})

        # Create the new comment
        comment = Comment.objects.create(
            user=user,
            text=text,
            **{f'{entry_type}': entry}
        )

        # Return the serialized comment as a JSON response
        return JsonResponse(comment.serialize())

    else:
        return JsonResponse({'error': 'Invalid request method'})


def get_profile_comments(request, profile_id):
    if request.method == "GET":
        comments = ProfileComment.objects.filter(profile_user_id=profile_id).order_by(
            "-created_at"
        )
        serialized_comments = [comment.serialize() for comment in comments]
        return JsonResponse(serialized_comments, safe=False, status=200)
    else:
        return JsonResponse({"error": "HTTP method not allowed."}, status=405)


@login_required
@require_http_methods(["POST"])
def send_message(request, recipient_id):
    if request.method == "POST":
        sender = request.user
        recipient = get_object_or_404(User, id=recipient_id)
        body = request.POST.get("message")

        # Check if an image was uploaded
        if "image" in request.FILES:
            uploaded_image = request.FILES["image"]
            fs = FileSystemStorage(location="TBA/static/message_images")
            image_name = fs.save(uploaded_image.name, uploaded_image)
            image_path = fs.url(image_name)
        else:
            image_path = None
        message = Message(
            sender=sender, recipient=recipient, body=body, image=image_path
        )
        message.save()
        return JsonResponse(message.serialize(), status=201)
    else:
        return JsonResponse({"error": "HTTP method not allowed."}, status=405)


# Get all users that the current user has sent or received a message from
@login_required
def get_all_users(request):
    sent_messages = Message.objects.filter(sender=request.user)
    received_messages = Message.objects.filter(recipient=request.user)
    users = set()
    for message in sent_messages:
        users.add(message.recipient)
    for message in received_messages:
        users.add(message.sender)
    serialized_users = [user.serialize() for user in users]
    return JsonResponse(serialized_users, safe=False)


@login_required
def get_message_history(request, user_id):
    user = User.objects.get(id=user_id)
    sent_messages = Message.objects.filter(sender=request.user, recipient=user)
    received_messages = Message.objects.filter(sender=user, recipient=request.user)
    
    #messages = list(sent_messages) + list(received_messages)
    messages = (sent_messages | received_messages).distinct()
    #messages.sort(key=lambda message: message.sent_at)
    messages = messages.order_by('sent_at')

    
    serialized_messages = [message.serialize() for message in messages]
    serialized_user = (
        user.minimal_serialize()
    )  # assuming you have a `serialize()` method defined on the User model
    data = {
        "messages": serialized_messages,
        "user": serialized_user,
    }
    return JsonResponse(data)


@login_required
def get_all_messages(request):
    sent_messages = Message.objects.filter(sender=request.user)
    received_messages = Message.objects.filter(recipient=request.user)
    messages = list(sent_messages) + list(received_messages)
    messages.sort(key=lambda message: message.sent_at)
    serialized_messages = [message.serialize() for message in messages]
    return JsonResponse(serialized_messages, safe=False)


def get_all_entries(request):
    # Fetch all albums, bands, and artists
    albums = Album.objects.all()
    bands = Band.objects.all()
    artists = Player.objects.all()
    gear = Gear.objects.all()

    # Serialize the data
    serialized_albums = [album.serialize() for album in albums]
    serialized_bands = [band.serialize() for band in bands]
    serialized_artists = [artist.serialize() for artist in artists]
    serialized_gear = [g.serialize() for g in gear]

    # Combine the serialized data into one dictionary
    data = {
        "albums": serialized_albums,
        "bands": serialized_bands,
        "players": serialized_artists,
        "gear": serialized_gear,
    }

    # Return the JSON response
    return JsonResponse(data)


def get_single_entry(request, entry_type, entry_id):
    if entry_type == "album":
        entry = get_object_or_404(Album, id=entry_id)
    elif entry_type == "band":
        entry = get_object_or_404(Band, id=entry_id)
    elif entry_type == "player":
        entry = get_object_or_404(Player, id=entry_id)
    elif entry_type == "gear":
        entry = get_object_or_404(Gear, id=entry_id)
    else:
        return JsonResponse({"error": "Invalid entry type"})

    serialized_entry = entry.serialize()
    return JsonResponse(serialized_entry)


@login_required
def add_entry(request, entry_type):
    if entry_type == "album":
        # Retrieve the data from the request
        name = request.POST.get("name")
        print(request.POST)
        band_id = request.POST.get("band")
        guitar_player_ids = [
            int(player)
            for player in json.loads(request.POST.getlist("guitar_players")[0])
        ]
        gear_ids = [int(gear) for gear in json.loads(request.POST.getlist("gear")[0])]
        cover_art = request.FILES.get("cover_art")
        filename = cover_art.name.split("/")[-1] if cover_art else ""
        description = request.POST.get("description")

        # Create the new album
        try:
            band = Band.objects.get(id=band_id)
            guitar_players = Player.objects.filter(id__in=guitar_player_ids)
            gear = Gear.objects.filter(id__in=gear_ids)
            album = Album.objects.create(
                name=name, band=band, cover_art=cover_art, description=description
            )
            album.guitar_players.set(guitar_players)
            album.gear.set(gear)
            album.save()

            # Modify the cover_art field to only store the filename
            if cover_art:
                album.cover_art.name = filename
                album.save(update_fields=["cover_art"])

            # Return a success message
            return JsonResponse({"message": "Album added successfully"})

        except Exception as e:
            # Return an error message
            return JsonResponse(
                {"message": f"Error adding album: {str(e)}"}, status=500
            )
    elif entry_type == "band":
        # Retrieve the data from the request
        name = request.POST.get("name")
        picture = request.FILES.get("picture")
        filename = picture.name.split("/")[-1] if picture else ""
        description = request.POST.get("description")

        # Create the new album
        try:
            band = Band.objects.create(
                name=name, picture=picture, description=description
            )
            band.save()

            # Modify the cover_art field to only store the filename
            if picture:
                band.picture.name = filename
                band.save(update_fields=["picture"])

            # Return a success message
            return JsonResponse({"message": "Band added successfully"})

        except Exception as e:
            # Return an error message
            return JsonResponse(
                {"message": f"Error adding band: {str(e)}"}, status=500
            )
    elif entry_type == "player":
        # Retrieve the data from the request
        name = request.POST.get("name")
        gear_ids = [int(gear) for gear in json.loads(request.POST.getlist("gear")[0])]
        band_ids = [int(band) for band in json.loads(request.POST.getlist('band')[0])]
        album_ids = [int(album) for album in json.loads(request.POST.getlist('album')[0])]
        description = request.POST.get("description")
        picture = request.FILES.get("picture")
        filename = picture.name.split("/")[-1] if picture else ""
        
        # Create the new player
        try:
            gear = Gear.objects.filter(id__in=gear_ids)
            bands = Band.objects.filter(id__in=band_ids)
            albums = Album.objects.filter(id__in=album_ids)
            player = Player.objects.create(
                name=name,
                description=description,
                picture=picture,
            )
            player.gear.set(gear)
            player.bands.set(bands)
            player.albums.set(albums)
            player.save()
            
            if picture:
                player.picture.name = filename
                player.save(update_fields=["picture"])


            # Return a success message
            return JsonResponse({"message": "Player added successfully"})

        except Exception as e:
            # Return an error message
            return JsonResponse({"message": f"Error adding gear: {str(e)}"}, status=500)
        
    elif entry_type == "gear":
        # Retrieve the data from the request
        name = request.POST.get("name")
        category = request.POST.get("category")
        description = request.POST.get("description")
        image = request.FILES.get("image")
        filename = image.name.split("/")[-1] if image else ""

        tonehunt_url = request.POST.get("tonehunt_url")

        # Create the new gear
        try:
            gear = Gear.objects.create(
                name=name,
                category=category,
                description=description,
                image=image,
                tonehunt_url=tonehunt_url,
            )
            
            gear.save()
            
            if image:
                gear.image.name = filename
                gear.save(update_fields=["image"])


            # Return a success message
            return JsonResponse({"message": "Gear added successfully"})

        except Exception as e:
            # Return an error message
            return JsonResponse({"message": f"Error adding gear: {str(e)}"}, status=500)
    else:
        return JsonResponse({"message": f"Invalid entry type {str(e)}"}, status=500)
    
@login_required
def add_connections(request, origin_type, origin_id, connection_type):
    model_mapping = {
        'Player': {
            'gear': 'gear',
            'album': 'albums',
            'band': 'bands'
        },
        'Gear': {
            'album':'albums',
            'player':'players'
        },
        'Album': {
            'gear': 'gear',
            'player':'guitar_players',
            'band':'band'
        },
        'Band': {
            'album':'albums',
            'player':'members'
        }
    }

    try:
        related_field_name = model_mapping[origin_type.capitalize()][connection_type]
        model_class = globals()[origin_type.capitalize()]
        origin = model_class.objects.get(id=origin_id)
        related_field = getattr(origin, related_field_name)
    except (KeyError, AttributeError, model_class.DoesNotExist):
        return JsonResponse({'error': f'Invalid {origin_type} ID'}, status=400)

    if request.method == 'POST':
        item_id = request.POST.get(f'{connection_type}_id')
        try:
            item = related_field.model.objects.get(id=item_id)
        except related_field.model.DoesNotExist:
            return JsonResponse({'error': f'Invalid {connection_type} ID'}, status=400)
        related_field.add(item)
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@login_required
def delete_connections(request, origin_type, origin_id, connection_type, connection_id):
    model_mapping = {
        'Player': {
            'gear': 'gear',
            'album': 'albums',
            'band': 'bands'
        },
        'Gear': {
            'album':'albums',
            'player':'players'
        },
        'Album': {
            'gear': 'gear',
            'player':'guitar_players',
            'band':'band'
        },
        'Band': {
            'album':'albums',
            'player':'members'
        }
    }

    try:
        related_field_name = model_mapping[origin_type.capitalize()][connection_type]
        model_class = globals()[origin_type.capitalize()]
        origin = model_class.objects.get(id=origin_id)
        related_field = getattr(origin, related_field_name)
    except (KeyError, AttributeError, model_class.DoesNotExist):
        return JsonResponse({'error': f'Invalid {origin_type} ID'}, status=400)

    try:
        item = related_field.model.objects.get(id=connection_id)
        related_field.remove(item)
        return JsonResponse({'success': True})
    except related_field.model.DoesNotExist:
        return JsonResponse({'error': f'Invalid {connection_type} ID'}, status=400)

@login_required
def post_review(request, entry_type, entry_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    data = request.POST
    stars = data.get('stars')
    text = data.get('text')
    
    if entry_type != 'album' and entry_type != 'gear':
        return JsonResponse({'error': 'Album or gear ID is required'}, status=400)
    
    try:
        stars = float(stars)
        if not (0 <= stars <= 5):
            raise ValueError
    except ValueError:
        return JsonResponse({'error': 'Stars must be a number between 0 and 5'}, status=400)
    
     # Check if the user has already reviewed the album or gear
    existing_review = Review.objects.filter(user=request.user, gear_id=entry_id if entry_type == 'gear' else None, album_id=entry_id if entry_type == 'album' else None).first()
    if existing_review:
        print(existing_review.is_edited)
        # Update the existing review object with the new data
        existing_review.stars = stars
        existing_review.text = text
        existing_review.is_edited = True
        existing_review.save()
        return JsonResponse({'success': True, 'review': existing_review.serialize()})
        #return JsonResponse({'error': 'You have already reviewed this album or gear.'}, status=400)
    
    review_data = {'stars': stars, 'text': text}
    if entry_type == 'album':
        review_data['album_id'] = entry_id
    elif entry_type == 'gear':
        review_data['gear_id'] = entry_id
        
    review_data['user'] = request.user
 
    review = Review.objects.create(**review_data)
    review.save()
    
    return JsonResponse({'success': True, 'review': review.serialize()})

def get_all_reviews(request):
    reviews = Review.objects.all().order_by(F('created_at').desc())
    serialized_reviews = [review.serialize() for review in reviews]
    return JsonResponse(serialized_reviews, safe=False)


@login_required
def get_following_reviews(request, user_id):
    # Get the current user
    user = User.objects.filter(pk=user_id).first()
    
    # Retrieve the user IDs of the users the current user is following
    following_users = user.following.all().values_list('id', flat=True)
    
    # Retrieve the reviews from the following users
    reviews = Review.objects.filter(user__in=following_users)
    
    # Serialize the reviews
    serialized_reviews = [r.serialize() for r in reviews]
    
    return JsonResponse(serialized_reviews, safe=False)

@login_required
def delete_entry(request, entry_type, entry_id):
    if request.user.id == 2:
        # Map the model type to the corresponding model
        model_mapping = {
            "album": Album,
            "band": Band,
            "gear": Gear,
            "player": Player,
        }
        Model = model_mapping[entry_type]

        # Check if the model exists
        if Model is None:
            return JsonResponse({"error": f"Invalid model type: {entry_type}"})

        # Get the object or return an error if it doesn't exist
        obj = get_object_or_404(Model, pk=entry_id)

        # Delete the object and return a success message
        obj.delete()
        return JsonResponse({"message": f"{entry_type} {entry_id} deleted successfully"})
    else:
        return JsonResponse({'message':"Unauthorized action, admin acccess required."})


@login_required
def follow_user(request, user_id):
    if request.method == "POST":
        user_to_follow = User.objects.get(id=user_id)
        current_user = request.user
        
        if user_to_follow == current_user:
        # The user is trying to follow themselves
            return JsonResponse({'message': 'You cannot follow yourself'})
        
        if current_user.following.filter(id=user_to_follow.id).exists():
        # The user is already following the target user
            return JsonResponse({'message': 'You are already following this user'})

        if current_user.is_authenticated:
            current_user.following.add(user_to_follow)
            return JsonResponse({"message": f"You are now following {user_to_follow.username}"})

        return JsonResponse({"error": "User is not authenticated."}, status=401)

    return JsonResponse({"error": "Invalid request method."}, status=400)


@login_required
def unfollow_user(request, user_id):
    if request.method == "POST":
        user_to_unfollow = User.objects.get(id=user_id)
        current_user = request.user
        
        if user_to_unfollow == current_user:
        # The user is trying to unfollow themselves
            return JsonResponse({'message': 'You cannot unfollow yourself'})
        
        if not current_user.following.filter(id=user_to_unfollow.id).exists():
        # The user is not currently following the target user
            return JsonResponse({'message': 'You are not currently following this user'})

        if current_user.is_authenticated:
            current_user.following.remove(user_to_unfollow)
            return JsonResponse({"message": f"You have unfollowed {user_to_unfollow.username}"})

        return JsonResponse({"error": "User is not authenticated."}, status=401)

    return JsonResponse({"error": "Invalid request method."}, status=400)


@login_required
def add_to_wishlist(request, gear_id):
    try:
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        gear = Gear.objects.get(id=gear_id)
        wishlist.add_gear_item(gear)
        return JsonResponse({"message": "Gear item added to wishlist successfully."})
    except Gear.DoesNotExist:
        return JsonResponse({"error": "Gear item not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
def remove_from_wishlist(request, gear_id):
    try:
        wishlist, created = Wishlist.objects.get_or_create(user=request.user)
        gear = Gear.objects.get(id=gear_id)
        wishlist.remove_gear_item(gear)
        return JsonResponse({"message": "Gear item removed from wishlist successfully."})
    except Gear.DoesNotExist:
        return JsonResponse({"error": "Gear item not found."}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_protect
def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = User.objects.filter(username=username).first()

        # Check if user exists
        if user is None:
            return JsonResponse(
                {
                    "message": "Invalid username and/or password.",
                    "reason": f"User {username} does not exist",
                }
            )

        # Authenticate user
        authenticated_user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if authenticated_user is not None:
            login(request, authenticated_user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return JsonResponse(
                {
                    "message": "Invalid username and/or password.",
                    "reason": f"Invalid password for {username,authenticated_user}",
                }
            )


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "base.html", {"message": "Passwords must match."})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "base.html", {"message": "Username already taken."})
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "base.html")
    
@login_required
def delete_user(request, user_id):
    if request.user.id == 2:
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({'message': 'User deleted successfully'})
        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
