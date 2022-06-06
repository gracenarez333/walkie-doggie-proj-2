# Walkie Doggie!
Join [here!](https://walkie-doggie-project2.herokuapp.com/)

## Overview

## Project Description
You will use this app to view dogs in need of some company/care during the day. These pup parents have busy lives and would really appreciate the help. Take a buddy on a walk today!

## API usage
I will be using the [adopt a pet API](https://www.adoptapet.com/public/apis/pet_list.html)

## ERD
![ERD](./img/erd.png)

## RESTful Routing Chart

| VERB | URL pattern | Action \(CRUD\) | Description |
| :--- | :--- | :--- | :--- |
| GET | / | Show \(Read\) | home page with login and  sign up links |
| GET | /users/new | Show \(Read\) | create a new user |
| POST | /users | New \(Read\) | renders a sign up form |
| GET | /users/login | New \(Read\) | renders a login form |
| POST | /users/login | Create \(Create\) | logs in existing user |
| GET | /users/logout | Show \(Read\) | logs user out |
| GET | /users/profile | Show \(Read\) | renders users profile page |
| GET | /pages/home | Show \(Read\) | renders home page |
| GET | /pages/browse | Show \(Read\) | renders browse page |
| GET | /pages/about/:id | Show \(Read\) | renders about page with info on specific pet |
| POST | /pages/about/:id | Create \(Create\) | creates comments connected to specific pet |
| DELETE | /pages/about/:id | Destroy \(Delete\) | deletes comments connected to specific pet |
| GET | /pages/edit/:id | Show \(Read\) | renders a form to edit existing comments |
| PUT | /pages/edit/:id | Update \(Update\) | updates existing comment |
| GET | /pages/favorites | Show \(Read\) | list users saved favorites |
| POST | /pages/favorites | Create \(Create\) | list users saved favorites |
| DELETE | /pages/favorites | Destroy \(Delete\) | list users saved favorites |

## Wireframes

# On Load
![load page](img/onload.png)
# Login
![Login](img/login.png)
# Sign Up
![Sign Up](img/signup.png)
# Homepage
![Homepage](img/home.png)
# Browse
![Browse](img/browse.png)
# About
![About](img/about.png)
# Profile
![Profile](img/profile.png)
# Favorites
![Favorites](img/favs.png)
# Edit
![Edit]((img/edit.png)

## User Stories
As a user I want to be able to ligin or sign up for an account so that I can browse available pets for walking and save the ones that I am interested in. As a user I want to be able to look at my favorites, delete them, and also have them save after logout so that they are able to be accessed at different times. As well as saving to favorites, as a user I want to be able to comment on my favorites walk experiences and edit/delete comments.

## MVP Goals
- [] Render all pages listed above
- [] Encrypt usernames and emails and hash passwords for secure keeping
- [] Add the ability to browse available pets for adoption
- [] Have the ability to add to a list of favs
- [] Login attempt messages and sign up messages
- [] Render an error template
- [] Ability to delete from favs
- [] Ability to add comments to dogs
- [] Ability to delete/edit comments
- [] Logout and cookie clear ability
- [] Save fav list information after logout
- [] Only users loggin in can view their own favs and delete/edit comments they have made

## Stretch Goals
- [] Render a search by key words to increase user view
- [] Add profile specifications for users
- [] 2 levels of auth, walker, walkee
