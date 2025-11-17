FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm ci --only=production

ENV PORT=3000

EXPOSE ${PORT}

CMD npm run prisma:migrate:deploy && node dist/prisma/seed.js && node dist/src/main