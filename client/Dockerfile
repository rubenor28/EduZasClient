FROM oven/bun:1.2.20-alpine AS base

ENV DIR /home/app

FROM base AS build

RUN apk update && apk add --no-cache dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json bun.lock $DIR

RUN bun run install --frozen-lockfile

COPY tsconfig*.json $DIR
COPY src $DIR/src

RUN bun run build && \
  bun run prune

FROM base AS production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

COPY --from=build $DIR/package.json $DIR/package.json

COPY --from=build $DIR/tsconfig*.json $DIR/tsconfig*.json
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run start"]
