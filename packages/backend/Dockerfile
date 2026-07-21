# Build context is the repo root (see docker-compose.yml) so npm workspaces
# resolve correctly across packages/shared and packages/backend.

FROM node:22-alpine AS builder
WORKDIR /app

# Alpine ships without OpenSSL — Prisma's query/schema engine binaries need
# it to detect the correct engine variant at `generate` time. Without this,
# Prisma silently guesses wrong and the engine fails to start at runtime.
RUN apk add --no-cache openssl

COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend/package.json packages/backend/package.json
RUN npm install

COPY packages/shared packages/shared
COPY packages/backend packages/backend

RUN npm run build --workspace=@interdex/shared
RUN npm run prisma:generate --workspace=@interdex/backend
RUN npm run build --workspace=@interdex/backend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Same reason as the builder stage: the engine binary needs OpenSSL present
# at runtime, not just at generate time.
RUN apk add --no-cache openssl

COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend/package.json packages/backend/package.json
RUN npm install --omit=dev

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend/dist packages/backend/dist
COPY --from=builder /app/packages/backend/prisma packages/backend/prisma
# Prisma generates its client into the hoisted root node_modules under npm
# workspaces — copy it from there, not from packages/backend/node_modules.
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma

EXPOSE 4000
WORKDIR /app/packages/backend

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
