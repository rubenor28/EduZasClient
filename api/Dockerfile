FROM oven/bun:1.2.20-alpine AS base

ENV DIR /home/app

FROM base AS build

# Instalar OpenSSL (necesario para Prisma)
RUN apk update && apk add --no-cache openssl dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json $DIR
COPY bun.lock $DIR

RUN bun run install --omit-dev --frozen-lockfile

COPY tsconfig*.json $DIR
COPY prisma $DIR/prisma/
COPY src $DIR/src

FROM base as production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build /usr/bin/openssl /usr/bin/openssl

COPY --from=build $DIR/package.json $DIR/package.json

COPY --from=build $DIR/tsconfig*.json $DIR/tsconfig*.json
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/prisma $DIR/prisma/
COPY --from=build $DIR/src $DIR/src

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run migrate && bun run start"]
