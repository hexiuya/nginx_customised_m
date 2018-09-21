FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY static-page-m /usr/share/nginx/html
EXPOSE 81
