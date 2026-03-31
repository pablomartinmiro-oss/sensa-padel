FROM node:22.12-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node_modules/.bin/next", "start", "-p", "3000"]
