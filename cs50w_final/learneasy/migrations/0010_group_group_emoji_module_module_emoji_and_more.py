# Generated by Django 5.0.3 on 2024-08-31 19:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('learneasy', '0009_user_language_delete_learner'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='group_emoji',
            field=models.CharField(choices=[('OPEN BOOK', '&#128214;'), ('WRITING HAND', '&#9997;'), ('GRADUATION CAP', '&#127891;'), ('SCHOOL', '&#127979;'), ('HOURGLASS WITH FLOWING SAND', '&#9203;'), ('GLOWING STAR', '&#127775;'), ('MUSICAL NOTES', '&#127926;'), ('LAPTOP', '&#128187;'), ('CLAPPER BOARD', '&#127916;'), ('NOTEBOOK BROWN', '&#128212;'), ('BOOKS STAMP', '&#128218;'), ('NOTEBOOK', '&#128211;'), ('PAGE FACING UP', '&#128196;')], default='&#127979;', max_length=28),
        ),
        migrations.AddField(
            model_name='module',
            name='module_emoji',
            field=models.CharField(choices=[('OPEN BOOK', '&#128214;'), ('WRITING HAND', '&#9997;'), ('GRADUATION CAP', '&#127891;'), ('SCHOOL', '&#127979;'), ('HOURGLASS WITH FLOWING SAND', '&#9203;'), ('GLOWING STAR', '&#127775;'), ('MUSICAL NOTES', '&#127926;'), ('LAPTOP', '&#128187;'), ('CLAPPER BOARD', '&#127916;'), ('NOTEBOOK BROWN', '&#128212;'), ('BOOKS STAMP', '&#128218;'), ('NOTEBOOK', '&#128211;'), ('PAGE FACING UP', '&#128196;')], default='&#128214;', max_length=28),
        ),
        migrations.AddField(
            model_name='text',
            name='text_emoji',
            field=models.CharField(choices=[('OPEN BOOK', '&#128214;'), ('WRITING HAND', '&#9997;'), ('GRADUATION CAP', '&#127891;'), ('SCHOOL', '&#127979;'), ('HOURGLASS WITH FLOWING SAND', '&#9203;'), ('GLOWING STAR', '&#127775;'), ('MUSICAL NOTES', '&#127926;'), ('LAPTOP', '&#128187;'), ('CLAPPER BOARD', '&#127916;'), ('NOTEBOOK BROWN', '&#128212;'), ('BOOKS STAMP', '&#128218;'), ('NOTEBOOK', '&#128211;'), ('PAGE FACING UP', '&#128196;')], default='&#9997;', max_length=28),
        ),
    ]
