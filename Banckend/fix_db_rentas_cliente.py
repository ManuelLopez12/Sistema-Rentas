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

    print("Actualizando tabla rentas...")
    
    # Hacer cliente_id opcional (permitir NULL)
    try:
        cursor.execute("ALTER TABLE rentas MODIFY COLUMN cliente_id INT NULL;")
        print("cliente_id modificado a NULL.")
    except Exception as e:
        print(f"Error modificando cliente_id: {e}")

    # Agregar nombre_cliente
    try:
        cursor.execute("ALTER TABLE rentas ADD COLUMN nombre_cliente VARCHAR(200) NULL;")
        print("Columna nombre_cliente agregada.")
    except Exception as e:
        print(f"Error agregando nombre_cliente (quizás ya existe): {e}")

    # Agregar telefono_cliente
    try:
        cursor.execute("ALTER TABLE rentas ADD COLUMN telefono_cliente VARCHAR(30) NULL;")
        print("Columna telefono_cliente agregada.")
    except Exception as e:
        print(f"Error agregando telefono_cliente (quizás ya existe): {e}")

    conn.commit()
    print("¡Actualización de base de datos completada!")

except Exception as e:
    print(f"Error de conexión a la BD: {e}")
finally:
    if 'conn' in locals() and conn.open:
        cursor.close()
        conn.close()
