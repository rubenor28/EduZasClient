FROM oven/bun:1.2.20-debian

# Instalar herramientas de desarrollo
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    wget \
    vim \
    mariadb-client \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Comando por defecto
CMD ["sleep", "infinity"]
