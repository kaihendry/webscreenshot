# https://github.com/microsoft/playwright/tree/master/docs/docker#ubuntu-20

FROM mcr.microsoft.com/playwright:focal

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ARG PORT=8080
ENV PORT=$PORT

CMD [ "npm", "start" ]
