FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

# Uncomment for production env and comment the volume bind in docker-compose
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

