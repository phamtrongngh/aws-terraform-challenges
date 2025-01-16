FROM node:22.11-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22.11-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json .
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/prisma ./prisma
RUN npm install --omit=dev
EXPOSE 3000
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
CMD ["npm", "run", "start:prod"]