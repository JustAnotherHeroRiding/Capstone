# Generated by Django 4.1.6 on 2023-04-09 16:00

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0008_comment_player'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilecomment',
            name='profile_user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='profile_comments', to=settings.AUTH_USER_MODEL),
        ),
    ]
