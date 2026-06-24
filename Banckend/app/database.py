#importaciones
import os #es un libreia de python que nos permite interactuar con el sistema operativo
from dotenv import load_dotenv #es una libreria que nos permite cargar variables de entorno desde un archivo .env
from sqlalchemy import create_engine #es una libreria que nos permite conectarnos a una base de datos
from sqlalchemy.orm import sessionmaker, declarative_base #es una libreria que nos permite crear sesiones de base de datos

#Cargamos las variables de entorno desde el archivo .env
load_dotenv()

#Obtenemos la variable de entorno DATABASE_URL
DB_USER = os.getenv("DB_USER")         # Tu usuario (ej. root)
DB_PASSWORD = os.getenv("DB_PASSWORD") # Tu contraseña
DB_HOST = os.getenv("DB_HOST")         # Donde está la base (ej. localhost)
DB_PORT = os.getenv("DB_PORT")         # El puerto (ej. 3306)
DB_NAME = os.getenv("DB_NAME")         # El nombre de la base de datos (ej. sistema_rentas)

#Creamos la cadena de conexion a la base de datos la F antes de la cadena indica que es una f-string, lo que nos permite insertar variables dentro de la cadena usando llaves {}
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

#Creamos el motor de base de datos usando la cadena de conexion
# TiDB Cloud Serverless requiere SSL/TLS. PyMySQL usa ssl_verify_cert y ssl_verify_identity
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "ssl_verify_cert": True,
        "ssl_verify_identity": True,
    }
)

#creamos la fabrica de sesiones 
#autocommit=False es para que no se haga commit automaticamente
#bind=engine es para que la sesion se conecte al motor de base de datos que creamos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Creamos la clase base para los modelos de base de datos
Base = declarative_base()

#funcion de conexion, esta funcion es un generador cada vez que se llama, crea una nueva sesion de base de datos y la devuelve, cuando se termina de usar la sesion, se cierra automaticamente
def get_db():
    db = SessionLocal()#abrimos sesion 
    try:
        yield db #entregamos temporalmente a quien la pidio 
    finally:
        db.close() #cerramos la sesion

        