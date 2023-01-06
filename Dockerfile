# FROM node:17-alpine as builder
# WORKDIR /app
# COPY package.json .
# COPY package-lock.json .
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:1.23.3
# WORKDIR /usr/share/nginx/html
# RUN rm -rf ./*
# COPY --from=builder /app/build .
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Build Environment
FROM node:17-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
# Have a .dockerignore file ignoring node_modules and build
COPY . ./
RUN npm run build

# Production
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]