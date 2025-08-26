FROM oven/bun:1.2.20-alpine

WORKDIR /home/app

COPY package.json ./

RUN bun install

COPY . .

CMD ["sh", "-c", "bun run build && bun run start"]
