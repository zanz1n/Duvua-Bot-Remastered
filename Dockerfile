FROM node:alpine

WORKDIR /server

CMD echo 'Starting...\n' && yarn install && yarn build && yarn prod
