# syntax=docker/dockerfile:1

ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

# CMD [ "npm", "run", "build" ]
CMD [ "npm", "start" ]


