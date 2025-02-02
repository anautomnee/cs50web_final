from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("add_module", views.add_module, name="add_module"),
    path("edit_module/<int:id>", views.edit_module, name="edit_module"),
    path("module/<int:id>", views.module, name="module"),
    path("add_group", views.add_group, name="add_group"),
    path("group/<int:id>", views.group, name="group"),
    path("add_to_group", views.add_to_group, name="add_to_group"),
    path("add_text", views.add_text, name="add_text"),
    path("text/<int:id>", views.text, name="text"),
    path("translate", views.translate, name="translate"),
    path("add_new_card", views.add_new_card, name="add_new_card"),
    path("change_lang", views.change_lang, name="change_lang"),
    path("module/<int:module_id>/match", views.match, name="match"),
    path("module/<int:module_id>/spell", views.spell, name="spell"),
    path("collect", views.collect, name="collect"),
    path("module/<int:module_id>/quiz", views.quiz, name="quiz")
]