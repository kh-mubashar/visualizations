FROM node:14-buster

COPY package.json /app/

WORKDIR /app

RUN npm i

COPY . /app/

CMD ["node", "server/app.js"]
