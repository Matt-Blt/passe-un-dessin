# Generated by Django 3.0.5 on 2020-04-22 19:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("core", "0016_vote")]

    operations = [
        migrations.AlterField(
            model_name="game",
            name="phase",
            field=models.CharField(
                choices=[
                    ("INIT", "INIT"),
                    ("ROUNDS", "ROUNDS"),
                    ("DEBRIEF", "DEBRIEF"),
                    ("VOTE_RESULTS", "VOTE_RESULTS"),
                ],
                default="INIT",
                max_length=12,
            ),
        )
    ]
