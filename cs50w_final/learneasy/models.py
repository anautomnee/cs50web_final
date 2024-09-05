from django.contrib.auth.models import AbstractUser
from django.db import models

EMOJI = {
    "OPEN BOOK": "&#128214;",
    "WRITING HAND": "&#9997;",
    "GRADUATION CAP": "&#127891;",
    "SCHOOL": "&#127979;",
    "HOURGLASS WITH FLOWING SAND": "&#9203;",
    "GLOWING STAR": "&#127775;",
    "MUSICAL NOTES": "&#127926;",
    "LAPTOP": "&#128187;",
    "CLAPPER BOARD": "&#127916;",
    "NOTEBOOK BROWN": "&#128212;",
    "BOOKS STAMP": "&#128218;",
    "NOTEBOOK": "&#128211;",
    "PAGE FACING UP": "&#128196;"
}

class User(AbstractUser):
    language = models.CharField(max_length=24, default="en")
    pass

class Group(models.Model):
    group_name = models.CharField(max_length=64)
    group_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_groups")
    group_emoji = models.CharField(max_length=28, choices=EMOJI, default=EMOJI["SCHOOL"])

class Module(models.Model):
    module_name = models.CharField(max_length=64)
    module_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_modules", null=True)
    module_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_modules")
    module_emoji = models.CharField(max_length=28, choices=EMOJI, default=EMOJI["OPEN BOOK"])

class Text(models.Model):
    text_name = models.CharField(max_length=64)
    text_content = models.TextField(max_length=8096)
    text_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_texts", null=True)
    text_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_texts")
    text_emoji = models.CharField(max_length=28, choices=EMOJI, default=EMOJI["WRITING HAND"])

class Card(models.Model):
    term = models.CharField(max_length=48)
    definition = models.CharField(max_length=128)
    card_module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="module_cards")


    


