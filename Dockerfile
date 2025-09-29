FROM oven/bun:1.2.21-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY bun.lockb* ./

RUN bun install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

FROM oven/bun:1.2.21-alpine

WORKDIR /app

RUN bun add -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bunx -y http-get http://localhost:3000/ > /dev/null || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]
