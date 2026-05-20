# Image Debian slim au lieu d'Alpine pour compatibilité OpenSSL avec Prisma
FROM node:20-slim

# Installer OpenSSL requis par Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

EXPOSE 5000

CMD ["node", "src/server.js"]