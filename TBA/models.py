from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone
from django.conf import settings


class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name="tba_users")
    user_permissions = models.ManyToManyField(Permission, related_name="tba_users")
    profile_pic = models.ImageField(
        upload_to="TBA/static/profile_pics", blank=True, null=True
    )
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following"
    )

    def get_followers(self):
        return self.followers.all()

    def get_following(self):
        return self.following.all()

    @property
    def sorted_reviews_posted(self):
        return self.reviews_posted.order_by("-created_at")

    def serialize(self):
        local_date_joined = timezone.localtime(self.date_joined)
        return {
            "id": self.id,
            "name": self.username,
            "email": self.email,
            "profile_pic": self.profile_pic.url if self.profile_pic else None,
            "date_joined": local_date_joined.strftime("%Y-%m-%d"),
            "reviews": [
                review.minimal_serialize()
                for review in self.sorted_reviews_posted
                if self.reviews_posted
            ],
            "followers_count": self.followers.count(),
            "following_count": self.following.count(),
            "followers_users": [user.id for user in self.followers.all()],
            "following_users": [user.id for user in self.following.all()],
            "model_type": "user",
        }

    def minimal_serialize(self):
        return {"id": self.id, "model_type": "user"}

    def get_messages(self):
        return list(self.sent_messages.all()) + list(self.received_messages.all())


class Message(models.Model):
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages"
    )
    body = models.TextField()
    image = models.ImageField(
        upload_to="TBA/static/message_images", blank=True, null=True
    )
    sent_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        local_sent_at = timezone.localtime(self.sent_at)
        return {
            "id": self.id,
            "sender": self.sender.serialize(),
            "recipient": self.recipient.serialize(),
            "body": self.body,
            "image": self.image.url if self.image else None,
            "created_at": local_sent_at.strftime("%Y-%m-%d %H:%M:%S"),
            "model_type": "message",
        }


class Gear(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(
        max_length=50,
        choices=[
            ("guitar", "Guitar"),
            ("amp", "Amplifier"),
            ("pedal", "Pedal"),
            ("other", "Other"),
        ],
    )
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="TBA/static/gear_images/", blank=True, null=True
    )
    tonehunt_url = models.URLField(blank=True, null=True)

    @property
    def sorted_reviews(self):
        return self.reviews.order_by("-created_at")

    @property
    def sorted_comments(self):
        return self.comments.order_by("-created_at")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "image": self.image.url if self.image else None,
            "tonehunt_url": self.tonehunt_url,
            "reviews": [
                review.serialize() for review in self.sorted_reviews if self.reviews
            ],
            "players": [player.minimal_serialize() for player in self.players.all()],
            "albums": [album.minimal_serialize() for album in self.albums.all()],
            "comments": [
                comment.serialize()
                for comment in self.sorted_comments
                if self.sorted_comments
            ],
            "model_type": "gear",
        }

    def minimal_serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "picture": self.image.url if self.image else None,
            "description": self.description,
            "model_type": "gear",
        }


class Player(models.Model):
    name = models.CharField(max_length=255)
    gear = models.ManyToManyField(Gear, related_name="players")
    picture = models.ImageField(
        upload_to="TBA/static/player_pics/", null=True, blank=True
    )
    description = models.TextField(blank=True)

    @property
    def sorted_comments(self):
        return self.comments.order_by("-created_at")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "gear": [gear.serialize() for gear in self.gear.all()],
            "picture": self.picture.url if self.picture else None,
            "description": self.description,
            "comments": [
                comment.serialize()
                for comment in self.sorted_comments
                if self.sorted_comments
            ],
            "bands": [
                (band.name, band.id, band.picture.url) for band in self.bands.all()
            ],
            "albums": [album.minimal_serialize() for album in self.albums.all()],
            "model_type": "player",
        }

    def minimal_serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "picture": self.picture.url if self.picture else None,
            "description": self.description,
            "model_type": "player",
        }


class Band(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(Player, related_name="bands")
    picture = models.ImageField(
        upload_to="TBA/static/band_pics/", null=True, blank=True
    )
    description = models.TextField(blank=True)

    @property
    def sorted_comments(self):
        return self.comments.order_by("-created_at")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "players": [member.serialize() for member in self.members.all()],
            "albums": [album.serialize() for album in self.albums.all()],
            "picture": self.picture.url if self.picture else None,
            "comments": [
                comment.serialize()
                for comment in self.sorted_comments
                if self.sorted_comments
            ],
            "description": self.description,
            "model_type": "band",
        }


class Album(models.Model):
    name = models.CharField(max_length=255)
    band = models.ForeignKey(Band, on_delete=models.CASCADE, related_name="albums")
    guitar_players = models.ManyToManyField(Player, related_name="albums", blank=True)
    gear = models.ManyToManyField(Gear, related_name="albums", blank=True)
    cover_art = models.ImageField(
        upload_to="TBA/static/album_covers/", blank=True, null=True
    )
    description = models.TextField(blank=True)

    @property
    def sorted_reviews(self):
        return self.reviews.order_by("-created_at")

    @property
    def sorted_comments(self):
        return self.comments.order_by("-created_at")

    def serialize(self):
        print(self.cover_art.url)
        return {
            "id": self.id,
            "name": self.name,
            "band": self.band.name,
            "band_id": self.band.id,
            "players": [player.serialize() for player in self.guitar_players.all()],
            "cover_art_url": self.cover_art.url if self.cover_art else None,
            "reviews": [
                review.serialize() for review in self.sorted_reviews if self.reviews
            ],
            "comments": [
                comment.serialize()
                for comment in self.sorted_comments
                if self.sorted_comments
            ],
            "description": self.description,
            "gear": [gear.serialize() for gear in self.gear.all()],
            "model_type": "album",
        }

    def minimal_serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "cover_art_url": self.cover_art.url if self.cover_art else None,
            "model_type": "album",
        }


class Review(models.Model):
    STARS_CHOICES = [
        (0, "0"),
        (0.5, "0.5"),
        (1, "1"),
        (1.5, "1.5"),
        (2, "2"),
        (2.5, "2.5"),
        (3, "3"),
        (3.5, "3.5"),
        (4, "4"),
        (4.5, "4.5"),
        (5, "5"),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews_posted",
    )
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="reviews", blank=True, null=True
    )
    gear = models.ForeignKey(
        Gear, on_delete=models.CASCADE, related_name="reviews", blank=True, null=True
    )
    stars = models.FloatField(choices=STARS_CHOICES)
    text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    is_edited = models.BooleanField(default=False)

    def serialize(self):
        local_created_at = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "album": self.album.minimal_serialize() if self.album else None,
            "gear": self.gear.minimal_serialize() if self.gear else None,
            "stars": self.stars,
            "text": self.text,
            "created_at": local_created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "user": self.user.serialize(),
            "is_edited": self.is_edited,
            "model_type": "review",
        }

    def minimal_serialize(self):
        local_created_at = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "album": self.album.minimal_serialize() if self.album else None,
            "gear": self.gear.minimal_serialize() if self.gear else None,
            "stars": self.stars,
            "text": self.text,
            "created_at": local_created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "is_edited": self.is_edited,
            "model_type": "review",
        }


class Comment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="entry_comments_posted",
        blank=True,
        null=True,
    )
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="comments", blank=True, null=True
    )
    player = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="comments", blank=True, null=True
    )
    gear = models.ForeignKey(
        Gear, on_delete=models.CASCADE, related_name="comments", blank=True, null=True
    )
    band = models.ForeignKey(
        Band, on_delete=models.CASCADE, related_name="comments", blank=True, null=True
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        local_created_at = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "username": self.user.username,
            "user": self.user.minimal_serialize(),
            "user_profile_pic": self.user.profile_pic.url,
            #'album': self.album.name if self.album else None,
            #'gear': self.gear.name if self.gear else None,
            #'player': self.player.name if self.player else None,
            "text": self.text,
            "created_at": local_created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "model_type": "comment",
        }


class ProfileComment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile_comments_posted",
    )
    profile_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile_comments_received",
        default=None,
    )

    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        local_created_at = timezone.localtime(self.created_at)
        return {
            "id": self.id,
            "text": self.text,
            "username": self.user.username,
            "user": self.user.serialize(),
            "profile_user_id": self.profile_user.username,
            "user_picture_poster": self.user.profile_pic.url,
            "created_at": local_created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "model_type": "profile_comment",
        }
