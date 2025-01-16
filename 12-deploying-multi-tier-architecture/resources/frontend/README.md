# Task Notes Web Frontend

This is the web frontend for the Task Notes web application.
The application is a task management tool that allows users to create, update, and delete tasks. The project is built using React, TypeScript, and Tailwind CSS. The API is generated using OpenAPI Generator provided by the [backend project](../backend)

## Features
- 🔐 JWT-based authentication
- ✅ Task management (CRUD operations)

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation with npm (for development)
1. Clone the repository.
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file based on the `.env.example` file and configure the environment variables.
4. Start the development server:
```bash
npm run dev
```

### Installation with Docker Compose
1. Clone the repository
2. Create a `.env` file based on the `.env.example` file and configure the environment variables.
3. Start the app with Docker Compose:
```bash
docker-compose up
```

## Technologies
- React
- TypeScript
- Vite
- Tailwind CSS, shadcn/ui
- OpenAPI Generator