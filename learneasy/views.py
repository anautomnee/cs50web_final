from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from .models import User, Group, Module, Text, Card
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .forms import TextForm
import deepl
from .config import deepl_key
import json
import random


@login_required
def index(request):
    current_user = User.objects.get(username=request.user.username)
    user_modules = current_user.user_modules.all()[:3]
    user_modules_layout = current_user.user_modules.all()
    user_groups = current_user.user_groups.all()
    user_texts = current_user.user_texts.all()[:3]
    user_texts_layout = current_user.user_texts.all()
    user_lang = current_user.language
    return render(request, "learneasy/index.html", {
        "modules": user_modules_layout,
        "preview_modules": user_modules,
        "groups": user_groups,
        "texts": user_texts_layout,
        "preview_texts": user_texts,
        "lang": user_lang
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
        # Check if username exists in system
        try:
            user = User.objects.get(username=user_username)
            return render(request, "learneasy/register.html", {
                "message": "Username taken",
                "username": user_username,
                "email": user_email
            })
        except:
            pass

        # Check if email exists in system
        try:
            user = User.objects.get(email=user_email)
            return render(request, "learneasy/register.html", {
                "message": "Email already exists in system",
                "username": user_username,
                "email": user_email
            })
        except:
            pass
        user_password = request.POST["register_password_input"]
        user_confirmation_password = request.POST["register_password_confirmation_input"]
        user_lang = request.POST["register_lang_input"]
        if user_password == user_confirmation_password:
            user = User.objects.create_user(username=user_username, email=user_email, password=user_password, language=user_lang)
            user.save()
            login(request, user)
            return redirect("index")
        else:
            return render(request, "learneasy/register.html", {
                "message": "Passwords must match.",
                "username": user_username,
                "email": user_email
            })    
    else:
        return render(request, "learneasy/register.html")
    

@login_required
def add_module(request):
    current_user = User.objects.get(username=request.user.username)
    if request.method == "POST":
        module_name = ''
        new_module = ''
        new_term = ''
        new_def = ''
        module_emoji = ''
        key_empty_flag = False
        for key, value in request.POST.items():
            if not value:
                key_empty_flag = True

        if not key_empty_flag:
            for key, value in request.POST.items():
                if key != 'csrfmiddlewaretoken' and value:
                    if key == 'new_module_name':
                        module_name = value
                        new_module = Module(module_name=module_name, module_owner=current_user)
                        new_module.save()
                        continue
                    if key == 'module_emoji':
                        module_emoji = value
                        new_module.module_emoji = module_emoji
                        new_module.save(update_fields=["module_emoji"])
                        continue
                    if key.startswith('term'):
                        new_term = value
                        continue
                    if key.startswith('def'):
                        if value and new_term:
                            new_def = value
                            new_card = Card(term=new_term, definition=new_def, card_module=new_module)
                            new_card.save()
            return redirect(f"module/{new_module.id}")
        else: 
            modules = current_user.user_modules.all()
            texts = current_user.user_texts.all()
            groups = current_user.user_groups.all()
            lang = current_user.language
            message = "Module must contain at least two full cards"
            return render(request, "learneasy/add_module.html", {
                "modules": modules,
                "texts": texts,
                "groups": groups,
                "lang": lang,
                "message": message,
                "message_module_name": request.POST["new_module_name"]
            })
            
    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language
    return render(request, "learneasy/add_module.html", {
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang
    })

def edit_module(request, id):
    current_module = Module.objects.get(id=id)
    current_user = User.objects.get(username=request.user.username)
    module_id = current_module.id
    module_emoji = current_module.module_emoji
    if request.method == "POST":
        new_term = ''
        new_def = ''
        for key, value in request.POST.items():
            if key != 'csrfmiddlewaretoken' and value:
                if key == 'new_module_name':
                    current_module.module_name = value
                    current_module.save(update_fields=["module_name"])
                    continue
                if key == 'module_emoji':
                        current_module.module_emoji = value
                        current_module.save(update_fields=["module_emoji"])
                        continue
                if key.startswith('term'):
                    id=key[4:]
                    try:
                        current_card = Card.objects.get(id=id)
                        current_card.term = value
                        current_card.save() 
                    except:
                        new_term = value
                    continue
                if key.startswith('def'):
                    id=key[10:]
                    try:
                        current_card = Card.objects.get(id=id)
                        current_card.definition = value
                        current_card.save() 
                    except:
                        new_def = value
                        new_card = Card(term=new_term, definition=new_def, card_module=current_module)
                        new_card.save()
                    continue
        return redirect("module", module_id)
    
    cards = current_module.module_cards.all()

    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language
    return render(request, "learneasy/add_module.html", {
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang, 
        "cards": cards,
        "module_id": module_id,
        "module_name": current_module.module_name,
        "module_emoji": module_emoji
    })

@login_required
def module(request, id):
    current_module = Module.objects.get(id=id)
    current_user = User.objects.get(username=request.user.username)
    if current_module.module_owner.username != request.user.username:
        return render(request, "learneasy/error.html")
    
    cards = current_module.module_cards.all().order_by("id")
    cards_count = len(cards)
    paginator = Paginator(cards, 1)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    lang = current_user.language

    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    random_list = ["match", "spell", "quiz"]

    return render(request, "learneasy/module.html", {
        "module": current_module,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "cards": cards,
        "cards_count": cards_count,
        "page_obj": page_obj,
        "lang": lang,
        "random_list": random_list
    })

@login_required
def add_group(request):
    current_user = User.objects.get(username=request.user.username)
    if request.method == "POST":
        name = request.POST["new_group_name"]
        new_group = Group(group_name=name, group_owner=current_user)
        new_group.save()

        # Add modules
        module_array = request.POST.getlist('user_modules_select')
        for module in module_array:
            current_module = Module.objects.get(id=module)
            current_module.module_group = new_group
            current_module.save()

        # Add texts
        text_array = request.POST.getlist('new_group_texts_select')
        for text in text_array:
            current_text = Text.objects.get(id=text)
            current_text.text_group = new_group
            current_text.save()

        return HttpResponseRedirect(f"group/{new_group.id}")

    lang = current_user.language
    user_modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()

    return render(request, "learneasy/add_group.html", {
        "modules": user_modules,
        "texts": texts,
        "groups": groups,
        "lang": lang,
    })
    
@login_required
def group(request, id):
    current_user = User.objects.get(username=request.user.username)
    lang = current_user.language
    current_group = Group.objects.get(id=id)
    group_modules = current_group.group_modules.all()
    group_texts = current_group.group_texts.all()
    if current_group.group_owner.username != request.user.username:
        return render(request, "learneasy/error.html")
    
    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()

    new_group_modules = modules.difference(group_modules)
    new_group_texts = texts.difference(group_texts)

    return render(request, "learneasy/group.html", {
        "group": current_group,
        "group_modules": group_modules,
        "group_texts": group_texts,
        "lang": lang,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "new_group_modules": new_group_modules,
        "new_group_texts": new_group_texts
    })


@login_required
def add_text(request):
    current_user = User.objects.get(username=request.user.username)
    if request.method == "POST":
        form = TextForm(request.POST)
        if form.is_valid():
            text_name = form.cleaned_data["text_name"]
            text_content = form.cleaned_data["text_content"]
            new_text = Text(text_name=text_name, text_content=text_content, text_owner=current_user)
            new_text.save()
            return redirect(f"text/{new_text.id}")

    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language
    form = TextForm()
    return render(request, "learneasy/add_text.html", {
        "form": form,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang,
    })

@login_required
def text(request, id):
    current_user = User.objects.get(username=request.user.username)
    user_modules = current_user.user_modules.all()
    current_text = Text.objects.get(id=id)
    lang = current_user.language
    if current_text.text_owner.username != request.user.username:
        return render(request, "learneasy/error.html")
    
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()

    return render(request, "learneasy/text.html", {
        "text": current_text,
        "modules": user_modules,
        "texts": texts,
        "groups": groups,
        "lang": lang
    })

@login_required
def translate(request):
    if request.method == "POST":
        # current_user = User.objects.get(username=request.user.username)
        # supported_langs = {
        #     "english": "EN-GB",
        #     "german": "DE",
        #     "french": "FR",
        #     "spanish": "ES",
        #     "italian": "IT"
        # }
        # lang = current_user.language
        auth_key = deepl_key
        data = json.loads(request.body)["text"]
        translator = deepl.Translator(auth_key)
        result = translator.translate_text(data, target_lang="EN-GB")
        return HttpResponse(result)
    
    return render(request, "learneasy/error.html")

@login_required
def add_new_card(request):
    if request.method == "POST":
        term = json.loads(request.body)["term"]
        definition = json.loads(request.body)["def"]
        module = json.loads(request.body)["module"]
        current_module = Module.objects.get(id=module)
        new_card = Card(term=term, definition=definition, card_module=current_module)
        new_card.save()
        try:
            return HttpResponse("Added card")
        except:
            print("An exception occurred")
    
    return render(request, "learneasy/error.html")


def change_lang(request):
    if request.method == "POST":
        current_user = User.objects.get(username=request.user.username)
        new_lang = request.POST["change_lang_modal_input"]
        print(new_lang)
        next = request.POST["change_lang_modal_next"]
        current_user.language = new_lang
        current_user.save(update_fields=['language'])
        print(current_user.language)
        return HttpResponseRedirect(next)
    return render(request, "learneasy/error.html")

def add_to_group(request):
    if request.method == "POST":
        group_id = request.POST["add_to_group_group_id"]
        group = Group.objects.get(id=group_id)
        next = request.POST["add_to_group_form_next"]
        type = request.POST["add_to_group_form_type"]

        if type == "module":
            module_array = request.POST.getlist('add_to_module_group_select')
            print(module_array)
            for module in module_array:
                current_module = Module.objects.get(id=module)
                current_module.module_group = group
                current_module.save()
            return HttpResponseRedirect(next)
        if type == "text":
            text_array = request.POST.getlist('add_to_text_group_select')
            print(text_array)
            for text in text_array:
                current_text = Text.objects.get(id=text)
                current_text.text_group = group
                current_text.save()
            return HttpResponseRedirect(next)
        
    return render(request, "learneasy/error.html")


@login_required
def match(request, module_id):
    current_user = User.objects.get(username=request.user.username)
    current_module = Module.objects.get(id=module_id)
    shuffled_list = list(current_module.module_cards.all())

    # Use a deterministic seed based on the session key
    seed = hash(request.session.session_key)
    random.Random(seed).shuffle(shuffled_list)

    paginator = Paginator(shuffled_list, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language

    return render(request, "learneasy/match.html", {
        "module": current_module,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang,
        "page_obj": page_obj,
    })

def collect(request):
    if request.method == "POST":
        type = json.loads(request.body)["type"]
        content = json.loads(request.body)["content"]
        module_id = json.loads(request.body)["module_id"]
        current_module = Module.objects.get(id=module_id)
        if type == "term":
            card = list(Card.objects.filter(term=content, card_module=current_module).values())[0]
            return JsonResponse(card)
        
        card = list(Card.objects.filter(definition=content, card_module=current_module).values())[0]
        return JsonResponse(card)
    return render(request, "learneasy/error.html")


@login_required
def spell(request, module_id):
    current_user = User.objects.get(username=request.user.username)
    current_module = Module.objects.get(id=module_id)
    

    shuffled_list = list(current_module.module_cards.all())

    # Use a deterministic seed based on the session key
    seed = hash(request.session.session_key)
    random.Random(seed).shuffle(shuffled_list)


    paginator = Paginator(shuffled_list, 1)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    
    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language

    return render(request, "learneasy/spell.html", {
        "module": current_module,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang,
        "page_obj": page_obj,
    })

@login_required
def quiz(request, module_id):
    current_user = User.objects.get(username=request.user.username)
    current_module = Module.objects.get(id=module_id)
    

    shuffled_list = list(current_module.module_cards.all())
    defs = []
    for card in shuffled_list:
        defs.append(card.definition)

    # Use a deterministic seed based on the session key
    seed = hash(request.session.session_key)
    random.Random(seed).shuffle(shuffled_list)


    paginator = Paginator(shuffled_list, 1)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    
    modules = current_user.user_modules.all()
    texts = current_user.user_texts.all()
    groups = current_user.user_groups.all()
    lang = current_user.language

    return render(request, "learneasy/quiz.html", {
        "module": current_module,
        "modules": modules,
        "texts": texts,
        "groups": groups,
        "lang": lang,
        "page_obj": page_obj,
        "defs": defs
    })