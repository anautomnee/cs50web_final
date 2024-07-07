from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Group(models.Model):
    group_name = models.CharField(max_length=64)
    group_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_groups")

class Module(models.Model):
    module_name = models.CharField(max_length=64)
    model_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="model_groups")
    module_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_modules")

class Text(models.Model):
    text_name = models.CharField(max_length=64)
    text_group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="text_groups")
    text_owner = models.ForeignKey(User, on_delete=models.CASCADE,  related_name="user_texts")

class Card(models.Model):
    term = models.CharField(max_length=48)
    definition = models.CharField(max_length=128)
    card_module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="card_module")


    


