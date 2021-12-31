FROM node:16.10.0-alpine3.14
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "start" ]