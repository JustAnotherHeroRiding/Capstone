# Generated by Django 4.1.6 on 2023-04-08 16:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0003_album_gear_profilecomment_alter_user_profile_pic_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProfileComment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
