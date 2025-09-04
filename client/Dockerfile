FROM oven/bun:1.2.20-alpine AS base

WORKDIR /home/app

FROM base AS build

RUN apk update && apk add --no-cache dumb-init

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json .

RUN bun install --frozen-lockfile

COPY tsconfig*.json .
COPY src ./src

RUN bun run build && \
  bun run prune

FROM base AS production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

COPY --from=build ./package.json ./package.json

COPY --from=build ./tsconfig*.json ./tsconfig*.json
COPY --from=build ./node_modules ./node_modules
COPY --from=build ./dist ./dist

EXPOSE 3000

ENTRYPOINT [ "dumb-init" ]
CMD ["sh", "-c", "bun run start"]
