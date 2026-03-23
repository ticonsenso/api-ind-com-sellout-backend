import os
import psycopg2
from dotenv import load_dotenv

# Configuración: Cargamos el entorno de desarrollo
# Por defecto buscamos .env.development que es el que el usuario seleccionó
env_file = '.env.development'
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    print(f"Advertencia: No se encontró el archivo {env_file}. Asegúrate de que exista.")

# Datos de conexión desde las variables de entorno
DB_USER = os.getenv('DB_USER', 'jpsolanoc')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'holatuten123.')
DB_HOST = os.getenv('DB_HOST', '82.165.47.88')
DB_NAME = os.getenv('DB_NAME', 'consenso')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_SCHEMA = os.getenv('DB_DEFAULT_SCHEMA', 'db-sellout')

def update_consolidated_keys():
    conn = None
    try:
        # Conexión a la base de datos
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        cur = conn.cursor()
        
        print(f"Conectado a la base de datos {DB_NAME} en {DB_HOST}...")

        # Procedemos a actualizar las columnas key_store y key_producto
        # Usamos COALESCE para evitar que valores nulos arruinen la concatenación
        # Se normalizan acentos, se eliminan espacios, caracteres especiales y se convierte a MAYÚSCULAS
        # Usamos TRANSLATE para convertir á, é, í, ó, ú, ñ y sus variantes (Ã, Ä, etc.) a sus formas base a, e, i, o, u, n
        
        # 1. Actualizar key_store
        print("Actualizando columna 'key_store'...")
        update_key_store_sql = f"""
            UPDATE "{DB_SCHEMA}".consolidated_data_stores
            SET key_store = UPPER(REGEXP_REPLACE(
                TRANSLATE(
                    COALESCE(distributor, '') || COALESCE(code_store_distributor, ''),
                    'áéíóúÁÉÍÓÚÑñÃãÄäËëÏïÖöÜüÂâÊêÎîÔôÛûÀàÈèÌìÒòÙù',
                    'aeiouAEIOUNnAaAaEeIiOoUuAaEeIiOoUuAaEeIiOoUu'
                ),
                '[^a-zA-Z0-9]', '', 'g'
            ))
            WHERE distributor IS NOT NULL OR code_store_distributor IS NOT NULL;
        """
        cur.execute(update_key_store_sql)
        count_store = cur.rowcount
        print(f"Se actualizaron {count_store} registros en 'key_store'.")

        # 2. Actualizar key_producto
        print("Actualizando columna 'key_producto'...")
        update_key_product_sql = f"""
            UPDATE "{DB_SCHEMA}".consolidated_data_stores
            SET key_producto = UPPER(REGEXP_REPLACE(
                TRANSLATE(
                    COALESCE(distributor, '') || 
                    COALESCE(code_product_distributor, '') || 
                    COALESCE(description_distributor, ''),
                    'áéíóúÁÉÍÓÚÑñÃãÄäËëÏïÖöÜüÂâÊêÎîÔôÛûÀàÈèÌìÒòÙù',
                    'aeiouAEIOUNnAaAaEeIiOoUuAaEeIiOoUuAaEeIiOoUu'
                ),
                '[^a-zA-Z0-9]', '', 'g'
            ))
            WHERE distributor IS NOT NULL 
               OR code_product_distributor IS NOT NULL 
               OR description_distributor IS NOT NULL;
        """
        cur.execute(update_key_product_sql)
        count_product = cur.rowcount
        print(f"Se actualizaron {count_product} registros en 'key_producto'.")

        # Confirmamos los cambios
        conn.commit()
        print("\n¡Proceso completado exitosamente!")
        cur.close()

    except (Exception, psycopg2.Error) as error:
        print(f"Error al conectar o ejecutar SQL: {error}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    update_consolidated_keys()
