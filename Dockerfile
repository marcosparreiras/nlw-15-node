FROM node:20-alpine3.19 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN mv .env.docker .env

RUN npm run build

RUN npm ci && npm cache clean --force

FROM node:20-alpine3.19

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package*.json ./

COPY --from=build /usr/src/app/.env ./

COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/prisma ./prisma

COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]