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

    print("Actualizando precios base en la base de datos...")
    
    # Silla sola = 6
    cursor.execute("UPDATE items SET precio_renta = 6 WHERE categoria = 'Sillas'")
    
    # Mesa sola sin mantel = 30
    cursor.execute("UPDATE items SET precio_renta = 30 WHERE categoria = 'Mesas'")
    
    # Mantel base = 30
    cursor.execute("UPDATE items SET precio_renta = 30 WHERE categoria = 'Manteles'")
    
    # Cubremantel = 20
    cursor.execute("UPDATE items SET precio_renta = 20 WHERE categoria = 'Cubremanteles'")
    
    # Cubresilla (vamos a ponerle 10, y al moño 5, para que sumen 15 el "juego")
    cursor.execute("UPDATE items SET precio_renta = 10 WHERE categoria = 'Cubresillas'")
    
    # Moños = 5
    cursor.execute("UPDATE items SET precio_renta = 5 WHERE categoria = 'Moños'")
    
    # Paredes = 100
    cursor.execute("UPDATE items SET precio_renta = 100 WHERE categoria = 'Paredes'")
    
    # Brincolin = 500
    cursor.execute("UPDATE items SET precio_renta = 500 WHERE nombre LIKE '%brincolin%' OR categoria = 'Inflables'")
    
    # Carpas (Asumiendo que existen, de lo contrario hay que crearlas o ya se actualizarán solas si se agregan por interfaz con esos precios)
    cursor.execute("UPDATE items SET precio_renta = 600 WHERE nombre LIKE '%6x6%' AND categoria = 'Carpas'")
    cursor.execute("UPDATE items SET precio_renta = 300 WHERE nombre LIKE '%3x6%' AND categoria = 'Carpas'")

    conn.commit()
    print("¡Precios actualizados!")

except Exception as e:
    print(f"Error de conexión a la BD: {e}")
finally:
    if 'conn' in locals() and conn.open:
        cursor.close()
        conn.close()
