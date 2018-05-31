FROM node:8.11-alpine

LABEL owner="Giancarlos Salas"
LABEL maintainer="giansalex@gmail.com"

ENV APP_ID ""
ENV WEBHOOK_SECRET development
ENV PRIVATE_KEY_PATH ".data/private-key.pem"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
