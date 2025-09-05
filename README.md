# Edu-zass

App web para creación de clases y evaluaciones

## Prerequisitos
### Opción 1: Docker
- Descargar [docker](https://www.docker.com/) y `docker compose` (para despliegue a producción y desarrollo).

### Opcion 2: Manual
- Descargar `MySQL` ≥ 5.7.9 GA o `MariaDB` ≥  10.4.3.
- Descargar [Bun](https://bun.com/) v1.2.20.

## Despliegue
### Opción 1: Docker
Dentro del directorio raíz del proyecto existe un archivo `docker-compose.yml` que contiene la configucación para las imágenes de la api, el cliente y una instancia de maridb, si desea cambiar variables de entorno puede hacerlo desde el docker compose.

Si no funciona `docker compose` prueba con `docker-compose` si no funciona ninguno de los dos, te falta instalar docker compose.

Antes de contruir la imagen del cliente o ejecutar el `docker-compose` es necesario establecer en `client/.env` el valor de la URL de la API

Además establecer las credenciales necesarias en el archivo `.env` en la raíz del proyecto
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
1. Clonar el repositorio y descargar las dependencias

```bash
git clone https://github.com/Nyx325/Edu-zas.git
```

2. Descargar las dependencias

```bash
bun install
```

3. Crear archivos `.env` en la carpeta `api` y `client` siguiendo
  el ejemplo en `.env.example`

4. Contruir y desplegar el proyecto
```bash
# Ejecutar migraciones de base de datos
bun run migrate
# Construir cliente
bun run build
# Limpiar dependencias de desarrollo
bun run prune
# Inicializar
bun run start
```

## Desarrollo
### Opción 1: Dev container
1. Descargar extensión `dev containers` en `vscode` (para desarrollo).
2. Abrir la carpeta del proyecto con vscode
3. Seleccionar boton `Reabrir en contenedor`
![Reopen in container](./images/Reopen%20in%20container.png)
O si no aparece `Ctrl+Shift+p` y escribir `Dev container: Reopen in container`.
El contenedor preinstala las dependencias existentes (`bun install`) y posee algunas extenciones útiles
4. Usar comandos de desarrollo

### Opción 2: Manual
1. Prerequisitos modo manual
2. Archivos crear archivos `.env` y `.env.test` si es necesario

### Comandos desarrollo
```bash
# Descargar dependencias
bun install

# Migración de base de datos
bun run migrate:dev

# Inicializar proyecto con hot reloading
bun run dev

# Ejecutar tests
bun run test
```
