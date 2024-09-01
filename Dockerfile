FROM bitnami/node

WORKDIR /app

RUN git clone https://github.com/KpSantiago/shopper-test.git

COPY prisma ./shopper-test/prisma
COPY .npmrc ./shopper-test/.npmrc
COPY package*.json ./shopper-test/package.json

COPY . .

RUN npm ci

RUN mkdir -p uploads
RUN npm run build

RUN npx prisma migrate deploy

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
