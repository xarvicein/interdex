# Build context is the repo root (see docker-compose.yml) so npm workspaces
# resolve correctly across packages/shared and packages/frontend.

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY packages/frontend/package.json packages/frontend/package.json
RUN npm install

COPY packages/shared packages/shared
COPY packages/frontend packages/frontend

ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build --workspace=@interdex/shared
RUN npm run build --workspace=@interdex/frontend

FROM nginx:1.27-alpine AS runner
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
