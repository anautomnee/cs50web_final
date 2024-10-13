from django.contrib import admin
from .models import User, Group, Module, Text, Card


admin.site.register(User)
admin.site.register(Group)
admin.site.register(Module)
admin.site.register(Text)
admin.site.register(Card)
