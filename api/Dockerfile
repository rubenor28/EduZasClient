FROM oven/bun:1.2.20-alpine AS base

WORKDIR /home/app

FROM base AS build

# Instalar OpenSSL (necesario para Prisma)
RUN apk update && apk add --no-cache openssl dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json .

RUN bun install --omit-dev --frozen-lockfile

COPY tsconfig*.json .
COPY prisma ./prisma/
COPY src ./src

FROM base as production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /usr/bin/openssl /usr/bin/openssl

COPY --from=build ./package.json ./package.json

COPY --from=build ./tsconfig*.json ./tsconfig*.json
COPY --from=build ./node_modules ./node_modules
COPY --from=build ./prisma ./prisma/
COPY --from=build ./src ./src

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run migrate && bun run start"]
