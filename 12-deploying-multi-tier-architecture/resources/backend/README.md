# Task Notes API

A simple RESTful API built with NestJS for task notes management.

## Features

- 🔐 JWT-based authentication
- ✅ Task management (CRUD operations)
- 📚 API documentation with Swagger
- 🗄️ PostgreSQL database with Prisma ORM

## Getting Started

### Prerequisites

- Node.js
- Docker and Docker Compose
- npm

### Installation with Docker Compose
1. Clone the repository
2. Set up environment variables in `.env` file based on `.env.example`:
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Port number that the server will listen on
3. Run `docker-compose up -d` to start

## Development

### API Documentation
Suppose the application has been running on port 8000. When running in development mode, Swagger documentation is available at: [http://localhost:8000/api](http://localhost:8000/api)

### API Endpoints

#### Auth
- `POST /auth/login` - Login with `username/password`
- `POST /auth/register` - Register new user

#### Users
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user profile

#### Tasks
- `GET /tasks` - List all tasks
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## Built With
- NestJS - Web framework
- Prisma - ORM
- PostgreSQL - Database
- Passport - Authentication
- Swagger - API documentation
