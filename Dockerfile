# Usamos la imagen oficial de Node.js basada en Alpine para mayor ligereza.
FROM node:20-alpine

# Instalar dependencias de compilación necesarias
RUN apk add --no-cache python3 make g++

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos las dependencias definidas en el package.json
RUN npm ci

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Definimos las variables de entorno (puedes modificarlas según tus necesidades)
ENV NODE_ENV=production \
  PORT=3008 \
  BASE_URL=https://cmi.consensocorp.com \
  DB_USER=sellout \
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

CMD ["sh", "-c", "npm run build:prod && npm run start:prod"]
