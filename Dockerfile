FROM nginx:alpine

# Copy HTML file
COPY index.html /usr/share/nginx/html/

# Copy nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
