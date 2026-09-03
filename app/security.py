from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

# Entra password como str a la funcion y devuelve password hasheada
def hash_password(password: str) -> str:
    return password_hash.hash(password)

# Verifica si esta hasheada y devuelve true o false
def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)