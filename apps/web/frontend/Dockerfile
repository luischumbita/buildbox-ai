# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN pnpm install
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev"]