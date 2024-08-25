# Blog Web App Server

This is the backend server for a blog web application. It provides user authentication, post management, and more through a set of API endpoints.

## Features

- User Registration
- User Login & Logout
- Create, Read, Update, and Delete Posts
- Secure JWT-based Authentication
- MongoDB as Database

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/blog-web-app-server.git
cd blog-web-app-server
```
### 2.install the dependencies 
```bash
     npm install
```
### 3. Set Up Environment Variables
Create a .env file in the root directory with the following environment variables:
```bash
MONGO_URI=<your-mongodb-atlas-uri>
Server_Secret=<your-server-secret>
Expire_Token=<token-expiration-time>
Expire_Cookies=<cookie-expiration-time>
url=<https://actual-frontend-url.com>
```
### 4. Create a MongoDB Database
Create a MongoDB cluster on MongoDB Atlas or set up a local MongoDB instance.
Add your MongoDB connection string to the MONGO_URI variable in the .env file.
```bash
npm start
```
The server will run on http://localhost:5000.

# API Endpoints
 #User Routes
 
Register User: POST http://localhost:5000/api/users/register
Login User: POST http://localhost:5000/api/users/login
Logout User: POST http://localhost:5000/api/users/logout
Post Routes
Create Post: POST http://localhost:5000/api/posts/create
Delete Post: DELETE http://localhost:5000/api/posts/delete/:id
Fetch All Posts: GET http://localhost:5000/api/posts/all
Fetch Single Post: GET http://localhost:5000/api/posts/:id
Additional Routes
More API routes can be found in the codebase.
 
# License
This project is licensed under the MIT License.
