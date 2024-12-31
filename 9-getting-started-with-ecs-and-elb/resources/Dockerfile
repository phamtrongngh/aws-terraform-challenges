FROM nginx:alpine

# Install bash and setup script
RUN apk add --no-cache bash

# Create script to update index.html with container ID
RUN echo '#!/bin/bash' > /docker-entrypoint.d/90-create-index.sh && \
    echo 'CONTAINER_ID=$(hostname)' >> /docker-entrypoint.d/90-create-index.sh && \
    echo 'echo "<h1>Hello from container: $CONTAINER_ID</h1>" > /usr/share/nginx/html/index.html' >> /docker-entrypoint.d/90-create-index.sh && \
    chmod +x /docker-entrypoint.d/90-create-index.sh

# Keep the default NGINX command
CMD ["nginx", "-g", "daemon off;"]