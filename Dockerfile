FROM node 

ENV MONGO_URL="mongodb://admin:qwerty@localhost:27017"

RUN mkdir -p techgen

WORKDIR /techgen 

COPY . . 

RUN npm install express mongodb 

EXPOSE 5050 

CMD ["node","server.js"]

