FROM node:22-bookworm-slim

WORKDIR /app
ENV WRANGLER_SEND_METRICS=false
COPY package.json package-lock.json* ./
RUN npm install
