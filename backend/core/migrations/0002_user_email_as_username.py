# Generated by Django 2.1.8 on 2019-04-03 10:08

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.AlterModelManagers(
            name="user", managers=[("objects", core.models.UserManager())]
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(
                max_length=254, unique=True, verbose_name="email address"
            ),
        ),
    ]
