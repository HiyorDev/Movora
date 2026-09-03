# 🎬 Movora

Movora is a movie-platform-inspired web application focused on user authentication, backend development, and database integration.

The project combines a modern frontend with a **FastAPI REST API** and a **PostgreSQL database** for user registration and authentication.

---

## 🚀 Features

* 🔐 User registration
* 🔑 User login
* 🔒 Password hashing with Argon2
* 🗄️ PostgreSQL database
* ⚡ FastAPI REST API
* 🔌 SQLAlchemy database integration
* 🌐 CORS configuration
* 📚 Interactive API documentation with Swagger
* 🎬 Movie-platform-inspired UI
* 📱 Modern and responsive interface

---

## 🛠️ Technologies

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* psycopg2
* Passlib
* Argon2

### Database

* PostgreSQL

### Tools & Deployment

* Git
* GitHub
* Render

---

## 📁 Project Structure

```text
Movora/
│
├── index.html
├── database.sql
├── .env
├── .env.example
├── .gitignore
├── requirements.txt
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── icons/
│   └── ...
│
├── images/
│   └── ...
│
└── app/
    ├── main.py
    ├── db.py
    └── security.py
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Movora.git
cd Movora
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgresql_database_url
```

The `.env` file contains sensitive information and **must not be uploaded to GitHub**.

A `.env.example` file is included as a template:

```env
DATABASE_URL=
```

---

## 🗄️ Database

Movora uses **PostgreSQL** to store user account information.

The database schema is available in:

```text
database.sql
```

The main `users` table contains:

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(45) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);
```

Passwords are hashed before being stored in the database.

---

## ▶️ Run the Backend

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Interactive Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 📡 API Endpoints

### `GET /`

Checks if the API is running.

Example response:

```json
{
  "message": "API funcionando"
}
```

---

### `GET /db`

Tests the connection with PostgreSQL.

Example response:

```json
{
  "database": 1
}
```

---

### `POST /register`

Creates a new user account.

Request:

```json
{
  "username": "test",
  "email": "test@movora.com",
  "password": "123456"
}
```

Example response:

```json
{
  "message": "Usuario Registrado correctamente",
  "username": "test",
  "email": "test@movora.com"
}
```

---

### `POST /login`

Authenticates an existing user.

Request:

```json
{
  "email": "test@movora.com",
  "password": "123456"
}
```

Example response:

```json
{
  "message": "Login exitoso",
  "user_id": 1,
  "username": "test",
  "email": "test@movora.com"
}
```

---

## 🔒 Authentication Flow

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Frontend   │
                    │ HTML/CSS/JS  │
                    └──────┬───────┘
                           │
                           │ HTTP Request
                           ▼
                    ┌──────────────┐
                    │   FastAPI    │
                    │     API      │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
             Register                Login
                │                     │
                ▼                     ▼
        Hash Password          Find User
                │                     │
                ▼                     ▼
          PostgreSQL           Verify Password
                                      │
                                      ▼
                                Authentication
```

---

## ☁️ Architecture

```text
┌─────────────────────────┐
│        Frontend         │
│      HTML / CSS / JS    │
└────────────┬────────────┘
             │
             │ HTTPS
             ▼
┌─────────────────────────┐
│      FastAPI API        │
│        Backend          │
└────────────┬────────────┘
             │
             │ SQLAlchemy
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
│        Database         │
└─────────────────────────┘
```

The application is designed to separate the frontend, backend, and database into independent components.

---

## 🔒 Security

Movora does not store passwords as plain text.

During registration:

```text
Plain Password
      ↓
   Argon2
      ↓
Password Hash
      ↓
 PostgreSQL
```

During login:

```text
Entered Password
      ↓
Verify Against Hash
      ↓
Authentication Result
```

Environment variables are used to keep database credentials outside the source code.

---

## 📚 What This Project Practices

* REST API development
* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic models
* Password hashing
* Authentication
* CORS
* Environment variables
* Frontend-backend communication
* Git and GitHub
* Database design
* Cloud deployment

---

## 🔮 Future Improvements

* JWT authentication
* Protected routes
* User sessions
* Movie API integration
* Movie search
* Movie details
* Favorites
* Watchlist
* User profiles
* Movie ratings
* Responsive improvements
* Docker
* Automated testing
* CI/CD
* Production deployment

---

## ⭐ Project Status

🚧 **In Development**

Movora is currently being developed as a full-stack movie-platform-inspired application, with a focus on backend development, authentication, database integration, and modern web technologies.
