# APIRouter nos permite crear rutas fuera del archivo main.py para mantener el orden
from fastapi import APIRouter, Depends
# Necesitamos la sesión de la base de datos
from sqlalchemy.orm import Session
# Importamos la función get_db que creamos en database.py
from app.database import get_db

# Importamos nuestro Modelo (Base de datos) y nuestro Esquema (Cadenero)
from app.models.item import Item as ItemModel
from app import schemas

# Creamos el enrutador. Todo lo que esté aquí empezará con /items
router = APIRouter(prefix="/items", tags=["Inventario"])

# --- RUTA 1: CREAR UN ARTÍCULO ---
# Cuando alguien haga un POST a /items, entraremos aquí.
# response_model=schemas.Item significa que vamos a devolver los datos con la forma del Esquema final.
@router.post("/", response_model=schemas.Item)
def crear_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    # 1. Agarramos los datos validados por el Esquema (item.model_dump())
    # 2. Se los pasamos al Modelo de la base de datos (** desempaqueta los datos)
    nuevo_item = ItemModel(**item.model_dump())
    
    # 3. Lo agregamos a la sesión
    db.add(nuevo_item)
    
    # 4. Lo guardamos permanentemente en MySQL
    db.commit()
    
    # 5. Refrescamos para obtener el 'id' que MySQL le acaba de asignar
    db.refresh(nuevo_item)
    
    # 6. Devolvemos el artículo recién creado
    return nuevo_item

# --- RUTA 2: VER TODOS LOS ARTÍCULOS ---
# response_model=list[schemas.Item] significa que devolveremos una LISTA de artículos
@router.get("/", response_model=list[schemas.Item])
def obtener_items(db: Session = Depends(get_db)):
    # Vamos a MySQL, buscamos todos los Items y devolvemos la lista
    items = db.query(ItemModel).all()
    return items

