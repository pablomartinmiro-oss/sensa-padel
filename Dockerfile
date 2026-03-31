FROM node:22.12-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV NODE_ENV=production

CMD ["sh", "-c", "node_modules/.bin/next start -p ${PORT:-3000}"]
