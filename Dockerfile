# Usamos la imagen oficial de Node.js basada en Alpine para mayor ligereza.
FROM node:20-alpine

# Instalar dependencias de compilación necesarias
RUN apk add --no-cache python3 make g++

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de definición de dependencias
COPY package*.json ./

# Instalamos las dependencias definidas en el package.json
RUN npm install

# Instalamos las dependencias definidas en el package.json
RUN npm ci

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Definimos las variables de entorno (puedes modificarlas según tus necesidades)
ENV NODE_ENV=development \
  PORT=3008 \
  BASE_URL=http://localhost:3008 \
  DB_USER=jpsolanoc \
  DB_HOST=82.165.47.88 \
  DB_NAME=consenso \
  DB_PASSWORD=holatuten123. \
  DB_PORT=5432 \
  DB_DEFAULT_SCHEMA=db_sellout \
  DATABASE_URL=postgres://postgres:holatuten123.@localhost:5432/consenso?sslmode=disable \
  JWT_SECRET=sellout_2025$$

# Exponemos el puerto que la aplicación usará dentro del contenedor
EXPOSE 3008

# Comando por defecto para iniciar la aplicación en modo de producción

CMD ["sh", "-c", "npm run build:prod && npm run start:prod"]
