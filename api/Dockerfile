FROM oven/bun:1.2.20-alpine AS base

ENV DIR=/home/app
WORKDIR $DIR

FROM base AS build

# Instalar OpenSSL (necesario para Prisma)
RUN apk update && apk add --no-cache openssl dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json .

RUN bun install --omit-dev --frozen-lockfile

COPY . .

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run migrate && bun run start"]
