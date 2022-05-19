FROM node:16

WORKDIR /server

CMD echo 'Starting...\n' && yarn install && yarn dev
