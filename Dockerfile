FROM bitnami/node AS builder

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN mkdir -p uploads
RUN npm run build

FROM bitnami/node

COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/build ./build

EXPOSE 3333

CMD ["npm", "run", "start:prod"]
