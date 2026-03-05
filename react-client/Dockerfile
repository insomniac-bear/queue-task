# ---- Стадия сборки ----
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_HOST
ARG VITE_API_PORT
ARG VITE_WS_HOST
ARG VITE_WS_PORT

ENV VITE_API_HOST=$VITE_API_HOST
ENV VITE_API_PORT=$VITEAPI__PORT
ENV VITE_WS_PORT=$VITE_WS_PORT
ENV VITE_WS_HOST=$VITE_WS_HOST

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]