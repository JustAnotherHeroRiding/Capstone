# Generated by Django 4.1.7 on 2023-04-29 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0015_album_gear'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='gear',
            field=models.ManyToManyField(blank=True, related_name='albums', to='TBA.gear'),
        ),
        migrations.AlterField(
            model_name='album',
            name='guitar_players',
            field=models.ManyToManyField(blank=True, related_name='albums', to='TBA.player'),
        ),
    ]