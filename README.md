# MOAN TECHNOLOGY Back-End

This is a project for the MOAN TECHNOLOGY BACKEND CODING CHALLENGE backend

- Authentication; this returns a signed JWT

## Usage

1. Clone the Repo

> git clone https://github.com/ejeh/Stackoverflow_clone.git

2. Install Dependencies

> npm install

3.Server App

> npm start

## Routes

In this project there are several routes (public route and protected routes) and are as follows:

# Root route

- `GET http://localhost:6000`

## user routes

user signup

- `POST http://localhost:6000/api/v1/authenticate/email/user/signup` for the signup function
  Example Request body:
  `javascript { email: 'email', password: 'password' }`
  user login

- `POST http://localhost:6000/api/v1/authencation/email/user/login` for the login function. This also signs a JSON Web Token for use in the other routes.
  Example Request body:
  ```javascript
      {
          email: 'email',
          password: 'password'
  ```

## Answer Route

# Public Route

Find searched answer

- `GET http://localhost:6000/api/v1/answer/search` for function. This takes in a query parameter.

Protected Routes

Create Post

- `POST http://localhost:6000/api/v1/post/user`

Example Request body:

`````javascript
{
"title": "",
"body": ""
        }

Create Answer
- `POST http://localhost:6000/api/v1/answer/:postId`

Example Request body:

````javascript
{
"text": "",
        }
    ```
`````
