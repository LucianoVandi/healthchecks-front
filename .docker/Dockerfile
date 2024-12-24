# Base Stage: Node.js base image
FROM node:18-alpine AS base

# Dichiarazione degli ARG per i valori di build-time
ARG NEXT_PUBLIC_APIKEY
ARG NEXT_PUBLIC_BACKEND_URL

# Imposta le variabili ENV dai valori ARG
ENV NEXT_PUBLIC_APIKEY=$NEXT_PUBLIC_APIKEY
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file necessari
COPY package.json package-lock.json ./
RUN npm install

# Copia il resto del progetto
COPY . .

# Imposta la variabile per OpenSSL legacy
ENV NODE_OPTIONS=--openssl-legacy-provider

# Stage per Sviluppo
FROM base AS development
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

# Stage per Build
FROM base AS builder
ENV NODE_ENV=production
RUN npm run build

# Stage per Runtime in Produzione (immagine leggera)
FROM node:18-alpine AS production
WORKDIR /app

# Copia la build e i file necessari
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Espone la porta
EXPOSE 3000

# Avvia l'applicazione
CMD ["npm", "run", "start"]
