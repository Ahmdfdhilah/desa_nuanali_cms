FROM node:18

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

ENV PORT=3002

EXPOSE 3002

CMD ["yarn", "start"]