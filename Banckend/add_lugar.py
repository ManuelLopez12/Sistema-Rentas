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
        # Agregamos la nueva columna para el lugar del evento
        cursor.execute("ALTER TABLE rentas ADD COLUMN lugar_evento VARCHAR(300) NULL")
        print("Columna 'lugar_evento' agregada exitosamente a la tabla rentas.")
    except Exception as e:
        print(f"Nota (lugar_evento): {e}")

    conn.commit()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
