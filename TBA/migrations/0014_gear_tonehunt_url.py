# Generated by Django 4.1.6 on 2023-04-22 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0013_album_description_player_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='gear',
            name='tonehunt_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]