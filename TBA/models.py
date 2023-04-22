from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone
from django.conf import settings


class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name='tba_users')
    user_permissions = models.ManyToManyField(
        Permission, related_name='tba_users')
    profile_pic = models.ImageField(
        upload_to='TBA/static/profile_pics', blank=True, null=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.username,
            "email": self.email,
            "profile_pic": self.profile_pic.url if self.profile_pic else None,
            "date_joined": self.date_joined.strftime('%Y-%m-%d'),
            'model_type': 'user'
        }

    def get_messages(self):
        return list(self.sent_messages.all()) + list(self.received_messages.all())


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='received_messages')
    body = models.TextField()
    image = models.ImageField(
        upload_to='TBA/static/message_images', blank=True, null=True)
    sent_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            'id': self.id,
            'sender': self.sender.serialize(),
            'recipient': self.recipient.serialize(),
            'body': self.body,
            'image': self.image.url if self.image else None,
            'sent_at': self.sent_at.strftime('%Y-%m-%d %H:%M:%S'),
            'model_type': 'message'
        }


class Gear(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=[(
        'guitar', 'Guitar'), ('amp', 'Amplifier'), ('pedal', 'Pedal'), ('other', 'Other')])
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to='TBA/static/gear_images/', blank=True, null=True)
    tonehunt_url = models.URLField(blank=True, null=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'image': self.image.url if self.image else None,
            'tonehunt_url': self.tonehunt_url,
            'players': [player.minimal_serialize() for player in self.players.all()],
            'model_type': 'gear'
        }


class Player(models.Model):
    name = models.CharField(max_length=255)
    gear = models.ManyToManyField(Gear, related_name='players')
    picture = models.ImageField(
        upload_to='TBA/static/player_pics/', null=True, blank=True)
    description = models.TextField(blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'gear': [gear.serialize() for gear in self.gear.all()],
            'picture': self.picture.url if self.picture else None,
            'description': self.description,
            'bands': [(band.name, band.id, band.picture.url) for band in self.bands.all()],
            'albums': [(album.name, album.id, album.cover_art.url) for album in self.albums.all()],
            'model_type': 'player'

        }

    def minimal_serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'picture': self.picture.url if self.picture else None,
            'description': self.description,
            'model_type': 'player'
        }


class Band(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(Player, related_name='bands')
    picture = models.ImageField(
        upload_to='TBA/static/band_pics/', null=True, blank=True)
    description = models.TextField(blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'members': [member.serialize() for member in self.members.all()],
            'albums': [album.serialize() for album in self.albums.all()],
            'picture': self.picture.url if self.picture else None,
            'description': self.description,
            'model_type': 'band'
        }


class Album(models.Model):
    name = models.CharField(max_length=255)
    band = models.ForeignKey(
        Band, on_delete=models.CASCADE, related_name='albums')
    guitar_players = models.ManyToManyField(
        Player, related_name='albums')
    cover_art = models.ImageField(
        upload_to='TBA/static/album_covers/', blank=True, null=True)
    description = models.TextField(blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'band': self.band.name,
            'band_id': self.band.id,
            'guitar_players': [player.serialize() for player in self.guitar_players.all()],
            'cover_art_url': self.cover_art.url if self.cover_art else None,
            'reviews': [review.serialize() for review in self.reviews.all()],
            'comments': [comment.serialize() for comment in self.comments.all()],
            'description': self.description,
            'model_type': 'album'
        }


class Review(models.Model):
    STARS_CHOICES = [
        (0, '0'),
        (0.5, '0.5'),
        (1, '1'),
        (1.5, '1.5'),
        (2, '2'),
        (2.5, '2.5'),
        (3, '3'),
        (3.5, '3.5'),
        (4, '4'),
        (4.5, '4.5'),
        (5, '5'),
    ]

    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name='reviews', blank=True, null=True)
    gear = models.ForeignKey(
        Gear, on_delete=models.CASCADE, related_name='reviews', blank=True, null=True)
    stars = models.FloatField(choices=STARS_CHOICES)
    text = models.TextField(blank=True)

    def serialize(self):
        return {
            'id': self.id,
            'album': self.album.name if self.album else None,
            'gear': self.gear.name if self.gear else None,
            'stars': self.stars,
            'text': self.text,
            'model_type': 'review'
        }


class Comment(models.Model):
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    gear = models.ForeignKey(
        Gear, on_delete=models.CASCADE, related_name='comments', blank=True, null=True)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            'id': self.id,
            'album': self.album.name if self.album else None,
            'gear': self.gear.name if self.gear else None,
            'player': self.player.name if self.player else None,
            'text': self.text,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'model_type': 'comment'
        }


class ProfileComment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile_comments_posted')
    profile_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile_comments_received', default=None)

    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'username': self.user.username,
            'user': self.user.serialize(),
            'profile_user_id': self.profile_user.username,
            'user_picture_poster': self.user.profile_pic.url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'model_type': 'profile_comment'
        }
