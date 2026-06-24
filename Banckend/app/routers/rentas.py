# Importamos HTTPException para poder lanzar errores ("¡No hay suficientes sillas!")
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db

# Importamos Modelos y Esquemas
from app.models.renta import Renta as RentaModel, RentaDetalle as DetalleModel
from app.models.item import Item as ItemModel
from app import schemas

router = APIRouter(prefix="/rentas", tags=["Rentas"])

# --- RUTA PARA CREAR UNA RENTA ---
@router.post("/", response_model=schemas.Renta)
def crear_renta(renta: schemas.RentaCreate, db: Session = Depends(get_db)):
    # 1. Creamos el "Ticket" general sin los detalles y sin el total de dinero todavía
    nueva_renta = RentaModel(
        cliente_id=renta.cliente_id,
        nombre_cliente=renta.nombre_cliente,
        telefono_cliente=renta.telefono_cliente,
        fecha_evento=renta.fecha_evento,
        fecha_entrega=renta.fecha_entrega,
        fecha_recoleccion=renta.fecha_recoleccion,
        estado=renta.estado,
        lugar_evento=renta.lugar_evento
    )
    
    # Lo agregamos a la sesión para que SQLAlchemy le asigne un ID, 
    # pero usamos flush() que es un "pre-guardado". Aún no es definitivo en MySQL.
    db.add(nueva_renta)
    db.flush() 
    
    total_renta = 0.0

    # 2. Vamos a recorrer (iterar) la lista de sillas/mesas que el cliente quiere rentar
    for detalle_info in renta.detalles:
        # Buscamos en la base de datos si el artículo que piden existe
        item_db = db.query(ItemModel).filter(ItemModel.id == detalle_info.item_id).first()
        
        # Si alguien intenta rentar una silla que no existe, marcamos error
        if not item_db:
            raise HTTPException(status_code=404, detail=f"El artículo con ID {detalle_info.item_id} no existe")
        
        # LÓGICA DE INVENTARIO: ¿Tenemos suficientes en la bodega?
        if item_db.cantidad_total < detalle_info.cantidad:
            raise HTTPException(status_code=400, detail=f"No hay suficientes '{item_db.nombre}'. Solo quedan {item_db.cantidad_total} en inventario.")
        
        # ¡LA MAGIA DE LA RESTA! Si sí hay, se los restamos al inventario de la BD
        item_db.cantidad_total -= detalle_info.cantidad
        
        # Calculamos cuánto nos va a pagar por este artículo (cantidad x precio_unitario que viene del frontend)
        costo_detalle = detalle_info.cantidad * detalle_info.precio_unitario
        total_renta += costo_detalle
        
        # Creamos el registro del detalle (la línea adentro del ticket)
        nuevo_detalle = DetalleModel(
            renta_id=nueva_renta.id,
            item_id=item_db.id,
            cantidad=detalle_info.cantidad,
            precio_unitario=detalle_info.precio_unitario # Ahora respetamos el precio de paquete que manda React
        )
        db.add(nuevo_detalle)

    # 3. Le asignamos el costo total matemático que acabamos de sumar al ticket general
    nueva_renta.total = total_renta

    # 4. Ahora sí, guardamos el ticket, los detalles y el inventario restado todo junto permanentemente
    db.commit()
    db.refresh(nueva_renta)
    
    return nueva_renta

# --- RUTA PARA VER TODAS LAS RENTAS ---
@router.get("/", response_model=list[schemas.Renta])
def obtener_rentas(db: Session = Depends(get_db)):
    # Gracias a la relación "mágica" que pusimos en el Modelo, esto nos traerá
    # también la lista de sillas/mesas de forma automática.
    rentas = db.query(RentaModel).all()
    return rentas

# --- RUTA PARA DEVOLVER UNA RENTA (MARCAR COMO DEVUELTA) ---
# Usamos el método PUT porque vamos a ACTUALIZAR una renta que ya existe
@router.put("/{renta_id}/devolver", response_model=schemas.Renta)
def devolver_renta(renta_id: int, db: Session = Depends(get_db)):
    # 1. Buscamos la renta en la base de datos usando el ID que nos pasaron en la URL
    renta_db = db.query(RentaModel).filter(RentaModel.id == renta_id).first()
    
    # Si la renta no existe en la base de datos, lanzamos un error 404 (No Encontrado)
    if not renta_db:
        raise HTTPException(status_code=404, detail="Renta no encontrada")
        
    # Si la renta ya estaba devuelta desde antes, no hacemos nada y lanzamos un error
    if renta_db.estado == "Devuelto":
        raise HTTPException(status_code=400, detail="Esta renta ya fue devuelta anteriormente")
        
    # 2. Cambiamos el estado del ticket a "Devuelto"
    renta_db.estado = "Devuelto"
    
    # 3. Recorremos los detalles (las sillas y mesas que se llevaron) para regresarlas a la bodega
    for detalle in renta_db.detalles:
        # Buscamos el artículo original en el inventario
        item_db = db.query(ItemModel).filter(ItemModel.id == detalle.item_id).first()
        if item_db:
            # ¡LA MAGIA DE LA SUMA! Le regresamos las cosas al inventario (volvemos a sumar lo que restamos)
            item_db.cantidad_total += detalle.cantidad
            
    # 4. Guardamos los cambios permanentemente en MySQL (estado y el nuevo inventario)
    db.commit()
    # Refrescamos la información de la renta desde MySQL
    db.refresh(renta_db)
    
    # 5. Devolvemos la renta ya actualizada
    return renta_db