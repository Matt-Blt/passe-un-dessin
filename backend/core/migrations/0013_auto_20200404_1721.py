# Generated by Django 3.0.5 on 2020-04-04 16:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_game_pads_done'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='pads_done',
            field=models.IntegerField(default=0),
        ),
    ]
