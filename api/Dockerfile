# Usa una imagen oficial con Bun
FROM oven/bun:1.2.20-alpine

# Instalar OpenSSL (necesario para Prisma)
RUN apk add --no-cache openssl

WORKDIR /home/app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json bun.lock ./
COPY prisma ./prisma/

# Instalar dependencias
RUN bun install

# Copiar el resto del código
COPY . .

CMD ["bun", "run", "build", "&&", "bun", "run", "start"]
