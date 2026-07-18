# Stage 1: build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# Stage 2: the actual app
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src
COPY --from=frontend-build /frontend/dist ./public

EXPOSE 3000

CMD ["node", "src/index.js"]