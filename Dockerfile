# Usamos la imagen oficial de Node.js basada en Alpine para mayor ligereza.
FROM node:18-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

RUN rm -rf node_modules package-lock.json

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos las dependencias definidas en el package.json
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Definimos las variables de entorno (puedes modificarlas según tus necesidades)
ENV NODE_ENV=production \
  PORT=3008 \
  BASE_URL=https://cmi.consensocorp.com \
  DB_USER=comisiones \
  DB_HOST=cpdbep.consensocorp.com \
  DB_NAME=sellout \
  DB_PASSWORD=S3ll0ut. \
  DB_PORT=5435 \
  DB_DEFAULT_SCHEMA=db-sellout \
  DATABASE_URL=postgres://postgres:cpdbep.consensocorp.com@localhost:5435/consenso?sslmode=disable \
  JWT_SECRET=sellout_2025$$

# Exponemos el puerto que la aplicación usará dentro del contenedor
EXPOSE 3008

# Comando por defecto para iniciar la aplicación en modo de producción
CMD ["sh", "-c", "npm install && npm run prod"]