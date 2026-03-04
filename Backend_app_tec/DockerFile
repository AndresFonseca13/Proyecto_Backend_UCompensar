FROM node:20-alpine

WORKDIR /app

# 1. Instalamos pnpm
RUN npm install -g pnpm

# 2. Copiamos archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# 3. Instalamos dependencias
RUN pnpm install --frozen-lockfile

# 4. Copiamos el resto del proyecto
COPY . .

# 5. Prisma client
RUN pnpm prisma generate

# 6. Build NestJS
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
