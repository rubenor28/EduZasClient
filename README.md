# Edu-zass

App web para creación de clases y evaluaciones

## Prerequisitos
### Opción 1: Docker
- Descargar [docker](https://www.docker.com/) y `docker compose` (para despliegue a producción y desarrollo).
- Descargar extensión `dev containers` en `vscode` (para desarrollo).

### Opcion 2: Manual
- Descargar `MySQL` ≥ 5.7.9 GA o `MariaDB` ≥  10.4.3.
- Descargar [Bun](https://bun.com/) v1.2.20.

## Despliegue
### Opción 1: Docker
Dentro del directorio raíz del proyecto existe un archivo `docker-compose.yml` que contiene la configucación para las imágenes de la api, el cliente y una instancia de maridb, si desea cambiar variables de entorno puede hacerlo desde el docker compose.

Si no funciona `docker compose` prueba con `docker-compose` si no funciona ninguno de los dos, te falta instalar docker compose.
```bash
# Construir imágenes, crear contenedores e iniciar contenedores
docker compose up

# Comando anterior pero como servicio
docker compose up -d

# Consultar logs
docker logs -f <container_name>

# Detener y eliminar contenedores
docker compose down

# Reiniciar contenedores
docker compose restart

# Iniciar contenedores
docker compose start

# Detener contenedores
docker compose stop
```

### Opción 2: Manual
- Clonar el repositorio y descargar las dependencias

```bash
git clone https://github.com/Nyx325/Edu-zas.git
```

- Descargar las dependencias

```bash
bun install
```

- Crear archivos `.env` en la carpeta `api` y `client` siguiendo
  el ejemplo en `.env.example`

```bash
# Ejecutar migraciones de base de datos
bun run migrate
# Construir cliente
bun run build
# Limpiar dependencias de desarrollo
bun run
# Inicializar
bun run start
```

## Desarrollo
