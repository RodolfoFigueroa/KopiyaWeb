FROM node:19

WORKDIR /usr/src/app

COPY . .

RUN npm ci --only=production

EXPOSE 3000

ENTRYPOINT ["npm", "start"]