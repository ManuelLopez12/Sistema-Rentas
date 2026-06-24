import os
from dotenv import load_dotenv
import pymysql

load_dotenv(".env")

# Lista expandida de colores profesionales para eventos
colores = [
    "Rojo", "Azul Rey", "Azul Marino", "Azul Cielo", "Dorado", "Plateado", 
    "Verde Esmeralda", "Verde Menta", "Verde Bandera", "Amarillo", "Naranja", 
    "Fucsia", "Rosa Palo", "Rosa Pastel", "Morado", "Lila", 
    "Vino (Burgundy)", "Turquesa", "Coral", "Durazno (Peach)", "Negro", "Blanco"
]

items_to_add = [
    # Mobiliario Base
    ("Mesa Rectangular", "Mesas", "Blanco", 30, 50.0),
    ("Mesa Redonda", "Mesas", "Blanco", 40, 50.0),
    ("Silla Plegable", "Sillas", "Negro", 700, 10.0),
    ("Mantel Base", "Manteles", "Blanco", 100, 20.0),
    ("Cubresilla", "Cubresillas", "Blanco", 700, 8.0),
    
    # Carpas e Inflables
    ("Pared de Carpa", "Accesorios Carpa", "Blanco", 9, 100.0),
    ("Brincolin", "Inflables", "Multicolor", 1, 500.0),
    ("Carpa 6x6", "Carpas", "Blanco", 5, 800.0),
    ("Carpa 3x6", "Carpas", "Blanco", 5, 500.0)
]

# Agregamos dinámicamente los 22 colores para Cubremanteles (50 piezas de c/u)
for color in colores:
    items_to_add.append(("Cubremantel", "Cubremanteles", color, 50, 15.0))

# Agregamos dinámicamente los 22 colores para Moños (150 piezas de c/u)
for color in colores:
    items_to_add.append(("Moño", "Moños", color, 150, 5.0))

try:
    conn = pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "sistema_rentas")
    )
    cursor = conn.cursor()

    # Vaciamos la tabla para meter la nueva lista gigante de colores
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    cursor.execute("TRUNCATE TABLE items;")
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

    sql = "INSERT INTO items (nombre, categoria, color, cantidad_total, precio_renta) VALUES (%s, %s, %s, %s, %s)"
    
    for item in items_to_add:
        cursor.execute(sql, item)
    
    conn.commit()
    conn.close()
    print("¡Inventario inicializado con todos los colores!")

except Exception as e:
    print(f"Error al inicializar inventario: {e}")
