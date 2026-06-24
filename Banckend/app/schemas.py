from pydantic import BaseModel
from datetime import date
from typing import Optional

# =============================================
# ESQUEMAS DE ARTÍCULOS (Items)
# =============================================

class ItemBase(BaseModel):
    nombre: str
    categoria: str
    color: Optional[str] = None 
    cantidad_total: int
    precio_renta: float

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int

    class Config:
        from_attributes = True

# =============================================
# ESQUEMAS DE CLIENTES
# =============================================

class ClienteBase(BaseModel):
    nombre: str
    telefono: str
    direccion: Optional[str] = None 

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int

    class Config:
        from_attributes = True


# =============================================
# ESQUEMAS DE DETALLES DE RENTA
# =============================================

class RentaDetalleBase(BaseModel):
    item_id: int 
    cantidad: int 
    precio_unitario: float

class RentaDetalleCreate(RentaDetalleBase):
    pass

class RentaDetalle(RentaDetalleBase):
    id: int
    renta_id: int
    precio_unitario: float
    item_nombre: Optional[str] = "Desconocido"

    class Config:
        from_attributes = True


# =============================================
# ESQUEMAS DE LA RENTA PRINCIPAL
# =============================================

class RentaBase(BaseModel):
    # Cliente ahora se captura directo — sin necesidad de seleccionar de la lista
    nombre_cliente: Optional[str] = None
    telefono_cliente: Optional[str] = None
    # cliente_id sigue siendo opcional por compatibilidad con rentas antiguas
    cliente_id: Optional[int] = None

    fecha_evento: date     
    fecha_entrega: date
    fecha_recoleccion: date
    estado: str = "Pendiente" 
    lugar_evento: Optional[str] = None 

class RentaCreate(RentaBase):
    detalles: list[RentaDetalleCreate]

class Renta(RentaBase):
    id: int
    total: float
    detalles: list[RentaDetalle]

    class Config:
        from_attributes = True