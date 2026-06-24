# =============================================
# MODELO DE RENTAS Y DETALLES (renta.py)
# =============================================
# Este archivo define DOS tablas en MySQL:
# 1. "rentas"         -> El ticket general (quién renta, cuándo, cuánto).
# 2. "renta_detalles" -> La lista de cosas dentro del ticket (5 sillas, 2 mesas).
#
# Piensa en esto como un TICKET DEL SUPER:
# - El ticket tiene la fecha, el total y quién compró.
# - Adentro del ticket está la lista de productos con sus cantidades.
# =============================================

# Importamos herramientas nuevas:
# - Date: Para guardar fechas (día/mes/año).
# - ForeignKey: Para conectar (enganchar) esta tabla con otra.
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey

# "relationship" nos permite navegar entre tablas desde Python.
# Ejemplo: Si tengo una renta, puedo pedirle sus detalles sin hacer otra consulta.
from sqlalchemy.orm import relationship

# Importamos "Base" para que SQLAlchemy reconozca estas clases como tablas.
from app.database import Base


# =============================================
# MODELO PRINCIPAL DE LA RENTA (EL "TICKET")
# =============================================
class Renta(Base):
    # Nombre de la tabla en MySQL.
    __tablename__ = "rentas"

    # --- COLUMNAS ---

    # Cada renta tiene su número de folio único (como el número del ticket).
    id = Column(Integer, primary_key=True, index=True)

    # [CONCEPTO IMPORTANTE]: ForeignKey = "Llave Foránea".
    # Es como un "gancho" que amarra esta renta a un cliente específico.
    # Aquí solo guardamos el NÚMERO (ID) del cliente, no todo su nombre.
    # Ejemplo: Si cliente_id = 3, significa que esta renta pertenece al cliente #3.
    # cliente_id ahora es opcional — el nombre/tel se captura directo en la renta
    cliente_id = Column(Integer, ForeignKey("clientes.id"), nullable=True)

    # Datos del cliente capturados directamente en la renta (más práctico)
    nombre_cliente = Column(String(200), nullable=True)
    telefono_cliente = Column(String(30), nullable=True)

    # Necesitamos 3 fechas distintas para tener control total del negocio:
    fecha_evento = Column(Date)       # El día exacto de la fiesta.
    fecha_entrega = Column(Date)      # El día que llevamos las cosas (puede ser antes).
    fecha_recoleccion = Column(Date)  # El día que pasamos a recogerlas.

    # Para saber si ya nos devolvieron las cosas o si el cliente aún las tiene.
    # Empieza como "Pendiente" y cambia a "Devuelto" cuando regresan todo.
    estado = Column(String(20), default="Pendiente")

    # Lugar donde será el evento
    lugar_evento = Column(String(300), nullable=True)

    # Total de dinero que cuesta toda la renta junta (se calcula automáticamente).
    total = Column(Float, default=0.0)

    # RELACIÓN MÁGICA: Esto NO es una columna en MySQL.
    # Es un "atajo" de Python que nos permite acceder a la lista de detalles
    # (las sillas, mesas, etc.) directamente desde un objeto Renta.
    # back_populates="renta" conecta esto con la relación inversa en RentaDetalle.
    detalles = relationship("RentaDetalle", back_populates="renta")


# =============================================
# MODELO DE LOS DETALLES (LAS COSAS DENTRO DEL TICKET)
# =============================================
class RentaDetalle(Base):
    # Nombre de la tabla en MySQL.
    __tablename__ = "renta_detalles"

    # --- COLUMNAS ---

    # ID único de este detalle.
    id = Column(Integer, primary_key=True, index=True)

    # "Gancho" hacia la renta principal (¿a qué ticket pertenece este detalle?).
    renta_id = Column(Integer, ForeignKey("rentas.id"))

    # "Gancho" hacia el artículo que se están llevando (¿qué silla/mesa es?).
    item_id = Column(Integer, ForeignKey("items.id"))

    # ¿Cuántas unidades de este artículo se llevó? (ej. 10 sillas).
    cantidad = Column(Integer)

    # ¿A cómo le rentamos cada unidad?
    # Guardamos el precio AQUÍ para que si en un futuro cambias el precio
    # de la silla en el catálogo, el precio histórico de esta renta NO se altere.
    precio_unitario = Column(Float)

    # --- RELACIONES MÁGICAS ---

    # Relación hacia la Renta principal (navegar del detalle al ticket).
    renta = relationship("Renta", back_populates="detalles")

    # Relación hacia el Artículo (para poder leer su nombre, categoría, etc.).
    # Esto nos permite hacer: detalle.item.nombre → "Silla Plegable"
    item = relationship("Item")

    # --- PROPIEDAD CALCULADA ---
    # @property convierte esto en un "dato falso" que se calcula al momento.
    # No existe como columna en MySQL, pero Python lo genera cuando lo pidas.
    # Así podemos mandar el nombre del artículo al frontend sin crear otra columna.
    @property
    def item_nombre(self):
        # Si el artículo existe, devolvemos su nombre. Si no, decimos "Desconocido".
        return self.item.nombre if self.item else "Desconocido"