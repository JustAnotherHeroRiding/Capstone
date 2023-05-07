# Generated by Django 4.1.6 on 2023-05-07 17:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('TBA', '0017_review_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='review',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, related_name='reviews_posted', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
