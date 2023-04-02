from django.contrib.auth.models import AbstractUser,Group,Permission
from django.db import models
from django.utils import timezone



class User(AbstractUser):
    groups = models.ManyToManyField(Group, related_name='tba_users')
    user_permissions = models.ManyToManyField(Permission, related_name='tba_users')

