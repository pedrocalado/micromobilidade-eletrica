FROM node:14
ENV NODE_ENV=development

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "--legacy-watch", "index.js"]