FROM ubuntu:bionic

# https://github.com/microsoft/playwright/blob/master/docs/docker/Dockerfile.bionic
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs

# https://github.com/Microsoft/playwright/blob/master/docs/troubleshooting.md#firefox-headless-doesnt-launch-on-linuxwsl
RUN apt-get install -y libdbus-glib-1-2

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

ARG PORT=8080
ENV PORT=$PORT

CMD [ "node", "app.js" ]
