FROM node:20 as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set network-timeout 3000000

RUN yarn

COPY . .

RUN npx prisma db push

RUN npx prisma generate

RUN yarn build

CMD [ "yarn", "start:prod" ]



