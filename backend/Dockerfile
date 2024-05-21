# syntax=docker/dockerfile:1

ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV dev

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD npm start
