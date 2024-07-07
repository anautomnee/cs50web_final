from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User

def index(request):
    return render(request, "learneasy/index.html")

def login_view(request):
    if request.method == "POST":
        user_username = request.POST["login_username_input"]
        user_password = request.POST["login_password_input"]
        user = authenticate(request, username=user_username, password=user_password)
        if user is not None:
            login(request, user)
            return redirect("index")
        else:
            return render(request, "learneasy/login.html", {
                "message": "User not found."
            })
    else:
        return render(request, "learneasy/login.html")

def logout_view(request):
    logout(request)
    return redirect('index')

def register(request):
    if request.method == "POST":
        user_username = request.POST["register_username_input"]
        user_email = request.POST["register_email_input"]
        user_password = request.POST["register_password_input"]
        user_confirmation_password = request.POST["register_password_confirmation_input"]
        if user_password == user_confirmation_password:
            user = User.objects.create_user(username=user_username, email=user_email, password=user_password)
            user.save()
            login(request, user)
            return redirect("index")
        else:
            return render(request, "learneasy/register.html", {
                "message": "Passwords must match."
            })    
    else:
        return render(request, "learneasy/register.html")
    

def add_module(request):
    if request.method == "POST":
        return redirect("index")
    return render(request, "learneasy/add_module.html")