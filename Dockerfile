FROM oven/bun:1.2.20-alpine AS base

ENV DIR=/home/app
WORKDIR $DIR

RUN apk update && apk add --no-cache dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY . .
RUN bun install --frozen-lockfile

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run start"]
