FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# Copiar los archivos finales de la aplicación en la carpeta del servidor
COPY --from=build-stage /app/dist /var/www/html
# Hacer que todos los archivos pertenezcan al usuario nginx
RUN chown -R nginx:nginx /var/www/html
RUN chmod 777 -R /var/www/html/
# Abrir el puerto 80 del contenedor
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
