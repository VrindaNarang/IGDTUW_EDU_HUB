FROM node:18-slim

WORKDIR /app

# Install build tools needed for native modules (e.g., prisma)
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY package-lock.json ./
RUN npm install && npm run build 

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
