FROM node:18-alpine as build

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

#---

FROM nginx:alpine

COPY --from=build /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]