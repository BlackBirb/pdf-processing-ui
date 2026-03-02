FROM node:25-alpine AS builder

WORKDIR /srv
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /srv/dist /usr/share/nginx/html
