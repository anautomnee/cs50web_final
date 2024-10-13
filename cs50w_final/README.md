# Learneasy

Learnesy is a web application made as a final project for Harvard's CS50 Web Course. It was developed primarily for learners of the foreign language. It simplifies and gamifies the process of remembering new words by including a functionality of drilling the lexis through little built-in games.

## Distinctiveness and Complexity

On the back-end this web application utilizes a Python web-framework Django. It includes data models by using Django's dynamic database-access API, as well as use of its form library that handles rendering forms as HTML, validating user-submitted data, and converting that data to native Python types. In addition to that, the back-end uses Deepl API to translate words from text.

On the front-end Learneasy utilizes Javascript. The script is devided into two modules - scripts und utils, to make the code more readable and separate functions from the main script.

Moreover, the web app includes adaptability to different devices - the interface looks good not only on desktop, but also on tablets and mobile devices. It is achieved by the use of media queries in CSS, which change some of the style parameters for certain elements on a page.

To wrap up this section, learnesy is neither a social network nor an e-commerce site. This makes it sufficiently distinct from the other projects in this course and provides distinctiveness.

## Functionality

To access the app functionality users should either login or register. The authenticated users can create modules, texts and groups. 
Modules include cards with new vocabulary in a target and known language. Texts contain a text block added by a user and cards block. By clicking on a new word, a popover with a translation appears. This translation can be added as a card to a certain module. Groups serve as collections of modules and texts.
To train the cards a user can play one of three games (there is also a random game button) - match, spell and quiz.

## Usage

When running an app for the fist time a database file (that was included in gitignore file for privacy reasons) must be created.
```bash
python manage.py makemigrations
python manage.py migrate
```

A simple command must be typed in to run the application.
```bash
python3 manage.py runserver
```
or
```bash
python manage.py runserver
```

## File structure

In the root directory there are:
- this README file that describes the functionality and aspects of the app
- manage.py - a file that serves as a command-line utility that helps manage the Django project
- a database (see usage to recreate a database after cloning the project) with users and custom models
- .gitignore file
- a project folder cs50w_final
- an app folder learneasy

A project folder cs50w_final includes starter files for the project, including
- settings.py which contains some important configuration settings for the project, including an array INSTALLED_APPS where our app "learneasy" is added.
- urls.py which contains directions for where users should be routed after navigating to a certain URL. It includes an admin route and the inclusion of all the paths from urls.py in the learneasy folder.

### Learneasy folder

This is the main folder of the project
- \__pycache__: This folder contains compiled Python files for performance optimization; it is automatically created when the Python interpreter runs.
- migrations: Django uses this folder to store migration files, which track changes in models (e.g., creating tables or altering fields) and allow for easy database management.
- \__init__.py: An empty file indicating that this directory should be treated as a Python package, making it importable in other parts of the project.
- admin.py: This file is to register models to appear in the Django admin interface and customize how they are displayed. In Learneasy User, Group, Module, Text, Card models are registered there for an easy access in the admin interface.
- apps.py: This file contains the configuration for the Django app, such as its name and metadata.
- config.py: This file contains a private key to Deepl API to translate words from text. It is included in .gitignore for privacy reasons.
- forms.py: This file is used to define forms using Django’s form API. In Learneasy it handles a form with title input and a textarea to create a new text.
- static: This folder is used for storing static files, including two JavaScript files(utils - with functions that are use to make a website interactive - and scripts - with event listeners and use of the mentioned above functions), images and a CSS styles file.
- templates: This folder contains HTML templates used to render views. It includes the layout file and all the pages
- models.py: This file contains model definitions - User, Group, Module, Text, Card.
- urls.py: This file defines URL patterns for the app, mapping URLs to the corresponding views.
- views.py: This file contains view functions, which handle requests (GET and POST) and return responses (usually rendering templates). Some views contain a decorator @login_required to ensure that only authenticated users can access them.

## Additional information
The app uses Deepl API that communicates with a private key included in .gitignore for privacy reasons.