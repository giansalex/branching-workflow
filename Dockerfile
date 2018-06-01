FROM node:8.11-alpine AS base

LABEL owner="Giancarlos Salas"
LABEL maintainer="giansalex@gmail.com"

ENV APP_ID ""
ENV NODE_ENV production
ENV WEBHOOK_SECRET development
ENV PRIVATE_KEY_PATH ".data/private-key.pem"

EXPOSE 3000


FROM node:8.11-alpine AS build

WORKDIR /app

RUN apk add --no-cache \
    python=2.7.14-r0 \
    alpine-sdk=0.5-r0

COPY package*.json ./
RUN npm install --only=prod


FROM base AS final

WORKDIR /usr/src/app

COPY --from=build /app .
COPY . .

CMD [ "npm", "start" ]