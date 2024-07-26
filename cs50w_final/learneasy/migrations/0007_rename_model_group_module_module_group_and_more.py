# Generated by Django 4.2.11 on 2024-07-26 19:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('learneasy', '0006_text_text_content'),
    ]

    operations = [
        migrations.RenameField(
            model_name='module',
            old_name='model_group',
            new_name='module_group',
        ),
        migrations.AlterField(
            model_name='text',
            name='text_group',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='group_texts', to='learneasy.group'),
        ),
    ]
