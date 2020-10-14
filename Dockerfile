# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json package-lock.json ./
RUN npm --silent install

# add app
COPY . ./

RUN npm run test

RUN npm run compile

# start app
CMD ["node", "build/main"] 
