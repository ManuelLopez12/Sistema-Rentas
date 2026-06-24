# =============================================
# MODELO DE CLIENTES (cliente.py)
# =============================================
# Este archivo define la tabla "clientes" en MySQL.
# Aquí guardamos los datos de las personas que nos
# rentan las sillas, mesas, carpas, etc.
# =============================================

# Importamos los tipos de datos que necesitamos para las columnas.
# Solo usamos Column, Integer y String porque un cliente solo tiene
# textos (nombre, teléfono, dirección) y un número (id).
from sqlalchemy import Column, Integer, String

# Importamos "Base" para que SQLAlchemy reconozca esta clase como una tabla.
from app.database import Base


# Creamos la clase "Cliente" que hereda de "Base".
class Cliente(Base):
    # Así se llamará la tabla en MySQL.
    __tablename__ = "clientes"

    # --- COLUMNAS DE LA TABLA ---

    # "id" es el número único que identifica a cada cliente.
    id = Column(Integer, primary_key=True, index=True)

    # "nombre" guarda el nombre completo del cliente (ej. "Juan Pérez").
    # String(150) permite hasta 150 letras.
    nombre = Column(String(150), index=True)

    # "telefono" guarda el WhatsApp o celular del cliente.
    # String(20) porque un teléfono no tiene más de 20 dígitos.
    telefono = Column(String(20))

    # "direccion" guarda la dirección del cliente.
    # nullable=True significa que es OPCIONAL (a veces no la tenemos).
    direccion = Column(String(300), nullable=True)