#!/bin/sh
set -e

# Esperar a que la base de datos esté disponible
echo "Esperando a que la base de datos esté disponible..."
while ! nc -z edu-zas-mariadb 3306; do
  sleep 1
done

echo "La base de datos está disponible!"

# Resto del script...
bun run build
exec "$@"
