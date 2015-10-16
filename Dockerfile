FROM node
MAINTAINER Michael Kubarycz <michael.kubarycz@golfchannel.com>

COPY ./src /src

WORKDIR /src

RUN npm install
RUN npm install -g nodemon

ENTRYPOINT ["npm", "run-script", "production"]