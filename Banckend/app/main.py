# =============================================
# ARCHIVO PRINCIPAL DE LA API (main.py)
# =============================================
# Este es el corazón de nuestra aplicación en Python (FastAPI).
# Aquí arrancamos el servidor y conectamos las rutas y la BD.
# =============================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos la conexión a la base de datos
from app.database import engine, Base

# Importamos los modelos (las tablas)
from app.models.item import Item
from app.models.cliente import Cliente
from app.models.renta import Renta, RentaDetalle

# Importamos los routers (los archivos donde están las URLs de la API)
from app.routers import items, clientes, rentas

# Creamos las tablas en la base de datos (si no existen)
Base.metadata.create_all(bind=engine)

# Iniciamos FastAPI
app = FastAPI(title="API Sistema de Rentas")

# =============================================
# CONFIGURACIÓN DE CORS (MUY IMPORTANTE)
# =============================================
# CORS es un sistema de seguridad de los navegadores.
# Si no lo configuramos, React (que corre en el puerto 5173) no podrá
# pedirle datos a FastAPI (que corre en el puerto 8000).
# Aquí le decimos a FastAPI: "Permite peticiones desde cualquier origen (*)".
app.add_middleware(
    CORSMiddleware,
    # Por ahora permitimos cualquier dominio ("*"). 
    # Cuando tengas tu dominio final (ej. www.mis-rentas.com) podemos restringirlo aquí.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conectamos las rutas de nuestros módulos a la aplicación principal
app.include_router(items.router)
app.include_router(clientes.router)
app.include_router(rentas.router)

# Ruta raíz para verificar que el servidor esté vivo
@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API del sistema de rentas"}