# Generated by Django 4.1.7 on 2023-04-19 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0011_comment_created_at_profilecomment_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='band',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
