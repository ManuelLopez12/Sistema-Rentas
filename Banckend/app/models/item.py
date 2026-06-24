# =============================================
# MODELO DE ARTÍCULOS (item.py)
# =============================================
# Este archivo le dice a la base de datos MySQL
# qué columnas tiene la tabla "items".
# Piensa en esto como el "plano" de una hoja de Excel:
# cada columna aquí se convierte en una columna real en MySQL.
# =============================================

# Importamos los tipos de datos que usaremos para definir cada columna:
# - Column: Le dice a SQLAlchemy que esto es una columna de la tabla.
# - Integer: Número entero (1, 2, 3, 50, 100...).
# - String: Texto (letras, palabras, frases).
# - Float: Número con decimales (15.50, 200.00...).
from sqlalchemy import Column, Integer, String, Float

# Importamos "Base" del archivo database.py que creamos antes.
# "Base" es como la plantilla madre: todos nuestros modelos deben heredar de ella
# para que SQLAlchemy sepa que son tablas de la base de datos.
from app.database import Base


# Creamos la clase "Item" que hereda de "Base".
# En Python, cuando una clase hereda de otra (Item hereda de Base),
# significa que Item obtiene todos los poderes de Base.
class Item(Base):
    # __tablename__ le dice a MySQL cómo se va a llamar esta tabla.
    # Cuando Python cree la tabla, la llamará "items" (en plural).
    __tablename__ = "items"

    # --- DEFINIMOS LAS COLUMNAS DE LA TABLA ---

    # "id" es el número único de cada artículo. Es como el número de serie.
    # primary_key=True significa que este campo es el identificador principal.
    # index=True significa que MySQL creará un índice para buscar más rápido por este campo.
    id = Column(Integer, primary_key=True, index=True)

    # "nombre" guarda el nombre del artículo (ej. "Silla Plegable", "Mesa Redonda").
    # String(255) significa que puede tener hasta 255 letras.
    # index=True para buscar artículos por nombre rápidamente.
    nombre = Column(String(255), index=True)

    # "categoria" nos ayuda a agrupar (ej. "Sillas", "Mesas", "Carpas", "Manteles").
    categoria = Column(String(255), index=True)

    # "color" es opcional. Una carpa puede ser blanca, azul, etc.
    # nullable=True significa que puede quedar vacío (no todos los artículos tienen color).
    color = Column(String(255), nullable=True)

    # "cantidad_total" es cuántos tenemos en la bodega disponibles para rentar.
    cantidad_total = Column(Integer)

    # "precio_renta" es cuánto cobramos por rentar UNA unidad por día.
    precio_renta = Column(Float)