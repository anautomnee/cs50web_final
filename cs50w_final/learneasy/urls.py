from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("add_module", views.add_module, name="add_module"),
    path("module/<int:id>", views.module, name="module"),
    path("add_group", views.add_group, name="add_group"),
    path("group/<int:id>", views.group, name="group"),
    path("add_text", views.add_text, name="add_text")
]