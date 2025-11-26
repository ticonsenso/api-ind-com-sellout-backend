#!/bin/bash

# Detener contenedores
docker compose down

# Actualizar código desde dev-sellout
git pull origin dev-sellout

# Reconstruir imagen sin caché
docker compose build --no-cache

# Levantar contenedores
docker compose up -d
