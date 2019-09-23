FROM node:latest as build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . /app
RUN npm build

EXPOSE 3000
CMD npm start