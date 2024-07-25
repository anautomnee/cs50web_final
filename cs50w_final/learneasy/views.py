from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .models import User, Group, Module, Text, Card
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

@login_required
def index(request):
    current_user = User.objects.get(username=request.user.username)
    user_modules = current_user.user_modules.all()
    user_groups = current_user.user_groups.all()
    return render(request, "learneasy/index.html", {
        "modules": user_modules,
        "groups": user_groups
    })

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
    

@login_required
def add_module(request):
    if request.method == "POST":
        current_user = User.objects.get(username=request.user.username)
        module_name = ''
        new_module = ''
        new_term = ''
        new_def = ''
        for key, value in request.POST.items():
            if key != 'csrfmiddlewaretoken' and value:
                if key == 'new_module_name':
                    module_name = value
                    new_module = Module(module_name=module_name, module_owner=current_user)
                    new_module.save()
                    continue
                if key.startswith('term'):
                    new_term = value
                    continue
                if key.startswith('def'):
                    new_def = value
                    new_card = Card(term=new_term, definition=new_def, card_module=new_module)
                    new_card.save()
                
        return redirect("index")
    return render(request, "learneasy/add_module.html")

# @login_required
def module(request, id):
    current_module = Module.objects.get(id=id)
    if current_module.module_owner.username != request.user.username:
        return render(request, "learneasy/error.html")
    
    cards = current_module.module_cards.all()
    cards_count = len(cards)
    paginator = Paginator(cards, 1)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "learneasy/module.html", {
        "module": current_module,
        "cards": cards,
        "cards_count": cards_count,
        "page_obj": page_obj
    })

@login_required
def add_group(request):
    current_user = User.objects.get(username=request.user.username)
    if request.method == "POST":
        group_name = ''
        new_group = ''

        for key, value in request.POST.items():
            if key != 'csrfmiddlewaretoken' and value:
                group_name = value
                new_group = Group(group_name=group_name, group_owner=current_user)
                new_group.save()

        return redirect("index")

    user_modules = current_user.user_modules.all()
    return render(request, "learneasy/add_group.html", {
        "user_modules": user_modules
    })
    
@login_required
def group(request, id):
    current_group = Group.objects.get(id=id)
    if current_group.group_owner.username != request.user.username:
        return render(request, "learneasy/error.html")

    return render(request, "learneasy/group.html", {
        "group": current_group
    })