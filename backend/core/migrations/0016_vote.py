# Generated by Django 3.0.5 on 2020-04-21 19:14

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_game_round_duration'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('pad_step', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='votes', to='core.PadStep')),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.Player')),
            ],
            options={
                'ordering': ('-created_at',),
                'get_latest_by': 'created_at',
                'abstract': False,
            },
        ),
    ]
