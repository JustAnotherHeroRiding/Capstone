from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST, require_http_methods
from django.core.files.storage import FileSystemStorage
from django.db.models import Q


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
    results["users"] = [user.serialize() for user in users]

    # Search Albums
    albums = Album.objects.all()
    results["albums"] = [album.serialize() for album in albums]

    # Search Gear
    gear = Gear.objects.all()
    results["gear"] = [g.serialize() for g in gear]

    # Search Players
    players = Player.objects.all()
    results["players"] = [player.serialize() for player in players]

    # Search Bands
    bands = Band.objects.all()
    results["bands"] = [band.serialize() for band in bands]

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
    messages = list(sent_messages) + list(received_messages)
    messages.sort(key=lambda message: message.sent_at)
    serialized_messages = [message.serialize() for message in messages]
    serialized_user = (
        user.serialize()
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
    
""" def add_connections(request, origin_type, origin_id, connection_type):
    if origin_type == 'player':
        player = Player.objects.get(id=origin_id)
        if connection_type == 'gear':
            gear_id = request.POST.get('gear_id')
            try:
                gear = Gear.objects.get(id=gear_id)
            except (Player.DoesNotExist, Gear.DoesNotExist):
                return JsonResponse({'error': 'Invalid player or gear ID'}, status=400)
            player.gear.add(gear)
            return JsonResponse({'success': True})
        elif connection_type == 'album':
            album_id = request.POST.get('album_id')
            try:
                album = Album.objects.get(id=album_id)
            except (Player.DoesNotExist, Album.DoesNotExist):
                return JsonResponse({"error": "Invalid player or album ID"},status = 400)
            player.albums.add(album)
            return JsonResponse({'succes': True})
        elif connection_type == 'band':
            band_id = request.POST.get('band_id')
            try:
                band = Band.objects.get(id=band_id)
            except (Player.DoesNotExist, Band.DoesNotExist):
                return JsonResponse({'error': "Invalid player or band ID"},status=400)
            player.bands.add(band)
            return JsonResponse({'success':True})
    else:
        return JsonResponse({'Message': "Invalid POST request."}) """


@login_required
def delete_entry(request, entry_type, entry_id):
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
