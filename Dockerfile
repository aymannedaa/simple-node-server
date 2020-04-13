FROM node:12.16.2-alpine3.11
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD npm run start-prod
EXPOSE 3000