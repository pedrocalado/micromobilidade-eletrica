FROM node:14-alpine

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "--legacy-watch", "index.js"]