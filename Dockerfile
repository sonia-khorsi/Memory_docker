# Étape 1 : Build l'app
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm rebuild esbuild && npm run build

# Étape 2 : Servir l'app
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json package-lock.json ./
RUN apk add --no-cache libc6-compat \
    && rm -rf node_modules \
    && npm ci --omit=dev \
    && npm install esbuild @rollup/rollup-linux-x64-musl --no-save
EXPOSE 8088
CMD ["npx", "vite", "preview", "--port=8088", "--host"]
