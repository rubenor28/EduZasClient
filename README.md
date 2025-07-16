# Edu-zas

App web para creación de clases y evaluaciones

## Prerequisitos

- Descargar [Postgresql](https://www.postgresql.org/download/)
- Descargar [Bun](https://bun.com/) como entorno de ejecución de `JavaScript`

## Preparar el entorno de desarrollo/ejecución

- Clonar el repositorio y descargar las dependencias

```bash
git clone https://github.com/Nyx325/Edu-zas.git
```

- Descargar las dependencias

```bash
# Para desarrollo
bun install

# Para producción
bun install --omit dev
```

- Crear archivos `.env` en la carpeta `api` y `client` siguiendo
  el ejemplo en `.env.example`

## Desplegar producción

```bash
bun run build
bun run start
```

## Desplegar producción

```bash
bun run migrate
bun run dev
```
