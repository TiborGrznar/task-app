# Task App
![CI](https://github.com/TiborGrznar/task-app/actions/workflows/ci.yml/badge.svg)

A full-stack task management application built as a learning project. Users can register, log in, create tasks, mark them as done, and delete them.

## Tech stack

**Backend**
- Java, Spring Boot 3
- Spring Data JPA (MySQL)
- Spring Security with JWT authentication (jjwt)
- Bean Validation
- Maven (Maven Wrapper, no global install required)

**Frontend**
- React + TypeScript (Vite)
- React Router
- Axios
- Tailwind CSS v4

**Infrastructure**
- Docker & Docker Compose (backend, frontend, MySQL, phpMyAdmin)

## Features

- User registration and login (JWT-based authentication)
- Create, complete, and delete tasks
- Tasks are scoped per user (each user only sees their own tasks)
- Active and completed tasks are displayed in separate sections

## Project structure

```
task-app/
├── backend/ # Spring Boot API
├── frontend/ # React + TypeScript client
└── docker-compose.yml
```

## Run with Docker (recommended)

The whole stack (MySQL, phpMyAdmin, backend, frontend) runs with one command.

1. Copy `.env.example` to `.env` in the repo root and fill in real values:

```bash
cp .env.example .env
```

2. Start everything:

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8081
- phpMyAdmin: http://localhost:8082

Stop with docker compose down (add -v to also wipe the database volume).

## Manual setup (without Docker)

## Prerequisites

- JDK 17+ (Maven Wrapper included, no global Maven install needed)
- Node.js 18+
- MySQL (a Docker setup is recommended, see below)


### 1. Database

```bash
docker run --name taskapp-mysql -e MYSQL_ROOT_PASSWORD=<your-password> -p 3307:3306 -v taskapp_mysql_data:/var/lib/mysql -d mysql:8.0
```

Create a database named `taskapp`.

### 2. Backend configuration

The repository does not include real secrets. Create `backend/src/main/resources/application-local.properties` (this file is gitignored) with:

```properties
spring.datasource.password=<your-mysql-password>
jwt.secret=<your-jwt-secret>
```

`application.properties` already contains the rest of the configuration (datasource URL, server port, etc.) with these two values left blank.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.arguments=--
spring.profiles.active=local
```

The API runs on `http://localhost:8081`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Testing

The backend has a unit test suite (JUnit 5 + Mockito) covering `AuthService` and `TaskService`.

```bash
cd backend
./mvnw test
```

Tests run automatically on every push and pull request via GitHub Actions (see `.github/workflows/ci.yml`), alongside a frontend build check.

## API overview

| Method | Endpoint                 | Description                   | Auth required  |
|--------|--------------------------|-------------------------------|----------------|
| POST   | `/api/auth/register`     | Register a new user           | No             |
| POST   | `/api/auth/login`        | Log in, returns a JWT         | No             |
| GET    | `/api/tasks`             | List the current user's tasks | Yes            |
| POST   | `/api/tasks`             | Create a new task             | Yes            |
| PATCH  | `/api/tasks/{id}/done`   | Mark a task as done           | Yes            |
| PATCH  | `/api/tasks/{id}/undone` | Mark a task as not done       | Yes            |
| DELETE | `/api/tasks/{id}`        | Delete a task                 | Yes            |

Authenticated requests must include an `Authorization: Bearer <token>` header.

## Notes

- Passwords are hashed with BCrypt; they cannot be recovered, only reset.
- The frontend stores the JWT in `localStorage` and attaches it automatically to API requests via an Axios interceptor.
- Two separate `.env` files exist: one in the repo root (Docker Compose secrets: MySQL password, JWT secret) and one in `frontend/` (`VITE_API_URL`). Neither is committed; see the corresponding `.env.example` files.
