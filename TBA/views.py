from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.core.files.storage import FileSystemStorage
from django.db.models import Q


import json

from .models import User,Album,Band,Gear,Message,Comment,ProfileComment,Player,Review

def index(request):
    return render(request, "base.html")


def check_login(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'is_authenticated': True, 
            'user_data': request.user.serialize()
            })
    else:
        return JsonResponse({'is_authenticated': False})
    

""" def search(request):
    query = request.GET.get('sidebar-search')
    results = {}

    # Search Users
    users = User.objects.filter(Q(username__icontains=query) | Q(email__icontains=query))
    results['users'] = [user.serialize() for user in users]

    # Search Albums
    albums = Album.objects.filter(name__icontains=query)
    results['albums'] = [album.serialize() for album in albums]

    # Search Gear
    gear = Gear.objects.filter(name__icontains=query)
    results['gear'] = [g.serialize() for g in gear]

    # Search Players
    players = Player.objects.filter(name__icontains=query)
    results['players'] = [player.serialize() for player in players]

    # Search Bands
    bands = Band.objects.filter(name__icontains=query)
    results['bands'] = [band.serialize() for band in bands]

    return JsonResponse(results) """

def search(request):
    results = {}

    # Search Users
    users = User.objects.all()
    results['users'] = [user.serialize() for user in users]

    # Search Albums
    albums = Album.objects.all()
    results['albums'] = [album.serialize() for album in albums]

    # Search Gear
    gear = Gear.objects.all()
    results['gear'] = [g.serialize() for g in gear]

    # Search Players
    players = Player.objects.all()
    results['players'] = [player.serialize() for player in players]

    # Search Bands
    bands = Band.objects.all()
    results['bands'] = [band.serialize() for band in bands]

    return JsonResponse(results)

@login_required
def upload_profile_pic(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['profile_pic']
        fs = FileSystemStorage(location='TBA/static/profile_pictures')
        filename = fs.save(uploaded_file.name, uploaded_file)
        request.user.profile_pic = fs.url(filename)
        request.user.save()
        return JsonResponse({'profile_pic_upload': True})




@csrf_protect
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = User.objects.filter(username=username).first()

        # Check if user exists
        if user is None:
            return JsonResponse({
                "message": "Invalid username and/or password.",
                'reason': f"User {username} does not exist"})
        
        # Authenticate user
        authenticated_user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if authenticated_user is not None:
            login(request, authenticated_user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return JsonResponse({
                "message": "Invalid username and/or password.",
                'reason': f"Invalid password for {username,authenticated_user}"})
        
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
            return render(request, "base.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "base.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "base.html")