FROM node:8-slim

LABEL maintainer "Charlie McClung <charlie@bowtie.co>, Brandon Cabael<brandon@bowtie.co>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update --fix-missing && apt-get -y upgrade

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /src/*.deb

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . .

RUN npm i -g npm@latest
RUN npm install && npm cache clean --force

RUN groupadd --system chrome && \
    useradd --system --create-home --gid chrome --groups audio,video chrome && \
    mkdir --parents /home/chrome/reports && \
    chown --recursive chrome:chrome /home/chrome

USER chrome

CMD [ "dumb-init", "npm", "start" ]

EXPOSE 3000