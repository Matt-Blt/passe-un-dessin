# Generated by Django 3.0.8 on 2020-08-07 19:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_user_player'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pad',
            name='initial_player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pads', to='core.Player'),
        ),
        migrations.AlterUniqueTogether(
            name='playergameparticipation',
            unique_together={('player', 'game')},
        ),
    ]
