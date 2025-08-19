# syntax=docker/dockerfile:1.6

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

# Install only server dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy server source
COPY server ./server

ENV PORT=3001
EXPOSE 3001
CMD ["node", "server/index.js"]