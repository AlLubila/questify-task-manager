FROM node:20-alpine
WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/src ./src
COPY backend/.env ./.env

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/index.js"]
