FROM oven/bun:1.2.20-alpine AS base

ENV DIR=/home/app
WORKDIR $DIR

FROM base AS build

RUN apk update && apk add --no-cache dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json .
COPY ./.env .

RUN bun install --frozen-lockfile

COPY tsconfig*.json .
COPY vite.config.ts .
COPY index.html .
COPY public ./public/
COPY src ./src

RUN bun run build && \
  bun run prune

FROM base AS production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

COPY --from=build $DIR/package.json ./package.json

COPY --from=build $DIR/public ./public
COPY --from=build $DIR/tsconfig*.json ./tsconfig*.json
COPY --from=build $DIR/node_modules ./node_modules
COPY --from=build $DIR/dist ./dist

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run start"]
