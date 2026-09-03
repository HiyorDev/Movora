

# FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text

from app.db import engine
from app.security import hash_password, verify_password



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#POO OBJECT REQUEST
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


@app.get("/")
def home():
    return {"message": "API funcionando"}

# CONNECTION DB
@app.get("/db")
def test_database():
    with engine.connect() as conections:
        result = conections.execute(text("SELECT 1"))

        return {"database": result.scalar()}


# LOGIN
@app.post("/login")
def login(user: LoginRequest):

    with engine.connect() as connection:

        result = connection.execute(
            text("""
                 SELECT user_id, username, email, password_hash
                 FROM users
                 WHERE email = :email
                 """),
            {
                "email": user.email
            }
        )

        db_user = result.fetchone()

        if db_user is None:
            return {
                "message": "Credenciales incorrectas"
            }

        password_correct = verify_password(
            user.password,
            db_user.password_hash
        )

        if not password_correct:
            return {
                "message": "Credenciales incorrectas"
            }

        return {
            "message": "Login exitoso",
            "user_id": db_user.user_id,
            "username": db_user.username,
            "email": db_user.email
        }


# REGISTER
@app.post("/register")
def register(user: RegisterRequest):

    password_hashed = hash_password(user.password)

    with engine.connect() as connection:

        connection.execute(
            text("""
                 INSERT INTO users (username, email, password_hash)
                 VALUES (:username, :email, :password_hash)
                 """),
            {
                "username": user.username,
                "email": user.email,
                "password_hash": password_hashed
            }
        )

        connection.commit()

        return {
            "message": "Usuario Registrado correctamente",
            "username": user.username,
            "email": user.email

        }