# user-authentication

simple backend application that exposes Registration, login and get all registered users API  using Express and MongoDB.
This collection contains sample requests from this [API](http://127.0.0.1/api/users)

It contains the following requests

• Register a user

• Login a user with given credentials

• Get all registered user

# registration route

• EndPoint "/register"

• Request type: POST

• payload : firstName, sureName, email, occupation, password, confirmPassword

> A successful registration will result in a HTTP 201 Status Code and a response object 
```
{ 
  "status": "success", 
  "token": "generated token", 
  "data": [ user detail ] 
}

```
# login route

• EndPoint "/login"

• Request type: POST

• payload :  email, password

> A successful login will result in a HTTP 200 Status Code and a response object 
```
{ 
  "status": "success", 
  "token": "generated token", 
  "data": [ user detail ] 
}

```
# get all users route

• EndPoint "/allusers"

• Request type: GET

> A successful API request will return a HTTP 200 Status Code and a response object of 
```
{ 
"message": "API response message",
"status": "success",
"data": [ Registered users objects ]
}

```
> Request form a user that is not logged in or expired token will return a HTTP 401 Status Code and a response object of 
```
{ 
  "message": "Please login", 
  "status": "failed", 
  "data": null
}

```
[Link to the API documentation with sample requests](https://documenter.getpostman.com/view/9775449/TzRNDUzB)