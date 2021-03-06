# Generated by Django 3.0.8 on 2020-08-07 19:08

from django.db import migrations


def recreate_game_player_participations(apps, schema_editor):
    Player = apps.get_model("core", "Player")
    PlayerGameParticipation = apps.get_model("core", "PlayerGameParticipation")

    for player in Player.objects.all():
        for pad in player.pads.all():
            try:
                PlayerGameParticipation.objects.get(player=player, game=pad.game)
            except PlayerGameParticipation.DoesNotExist:
                PlayerGameParticipation.objects.create(
                    player=player, game=pad.game, order=pad.order
                )


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0024_auto_20200807_2046"),
    ]

    operations = [migrations.RunPython(recreate_game_player_participations)]
