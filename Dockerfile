FROM node:latest

WORKDIR /app
COPY . /app

RUN npm install
CMD node bin/www

EXPOSE 9002
