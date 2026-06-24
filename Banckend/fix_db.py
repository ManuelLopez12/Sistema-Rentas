import os
from dotenv import load_dotenv
import pymysql

load_dotenv(".env")

try:
    conn = pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "sistema_rentas")
    )
    cursor = conn.cursor()

    try:
        # Renombrar 'name' a 'nombre'
        cursor.execute("ALTER TABLE items CHANGE COLUMN name nombre VARCHAR(255)")
        print("Columna 'name' renombrada a 'nombre' exitosamente.")
    except Exception as e:
        print(f"Nota (name->nombre): {e}")

    try:
        # Renombrar 'price' a 'precio_renta'
        cursor.execute("ALTER TABLE items CHANGE COLUMN price precio_renta FLOAT")
        print("Columna 'price' renombrada a 'precio_renta' exitosamente.")
    except Exception as e:
        print(f"Nota (price->precio_renta): {e}")

    conn.commit()
    conn.close()
    print("Mantenimiento de base de datos finalizado.")
except Exception as e:
    print(f"Error de conexión a la BD: {e}")
