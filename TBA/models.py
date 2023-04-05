from django.contrib.auth.models import AbstractUser,Group,Permission
from django.db import models
from django.utils import timezone



class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name='tba_users')
    user_permissions = models.ManyToManyField(Permission, related_name='tba_users')
    profile_pic = models.ImageField(upload_to='TBA/static/profile_pics', blank=True, null=True)


