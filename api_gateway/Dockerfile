FROM node:14
ENV NODE_ENV=development

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]