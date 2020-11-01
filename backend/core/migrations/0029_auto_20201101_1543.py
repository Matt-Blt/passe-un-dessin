# Generated by Django 3.1.2 on 2020-11-01 15:43

from django.db import migrations, models


def create_default_avatar(apps, schema_editor):
    Player = apps.get_model("core", "Player")
    PlayerGameParticipation = apps.get_model("core", "PlayerGameParticipation")
    f = open("core/avatar_default_value.txt", "r")
    default_avatar = f.read()
    for player in Player.objects.all():
        player.avatar = default_avatar
        player.save()
    f.close()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0028_add_avatar_to_player"),
    ]

    operations = [
        migrations.RunPython(create_default_avatar),
    ]
