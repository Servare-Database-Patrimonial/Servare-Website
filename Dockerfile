# Website — Servare Landing Page (Nginx)
# Sirve archivos estáticos desde public/

FROM nginx:alpine

# Copiar contenido del sitio
COPY public/ /usr/share/nginx/html/

# Configuración Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
