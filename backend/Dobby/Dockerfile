From node:10.19.0

MAINTAINER SeungHyeop Chae <shchae.dev@gmail.com>

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030

CMD ["npm","start"]
