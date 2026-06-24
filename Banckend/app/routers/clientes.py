from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db

from app.models.cliente import Cliente as ClienteModel
from app import schemas

# Todo aquí empezará con /clientes
router = APIRouter(prefix="/clientes", tags=["Clientes"])

# --- RUTA PARA CREAR UN CLIENTE ---
@router.post("/", response_model=schemas.Cliente)
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    nuevo_cliente = ClienteModel(**cliente.model_dump())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

# --- RUTA PARA VER TODOS LOS CLIENTES ---
@router.get("/", response_model=list[schemas.Cliente])
def obtener_clientes(db: Session = Depends(get_db)):
    clientes = db.query(ClienteModel).all()
    return clientes