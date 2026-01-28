# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - serve with Caddy
FROM caddy:2-alpine

# Copy built files to Caddy's default serve directory
COPY --from=build /app/build /usr/share/caddy

# Create a simple Caddyfile for SPA routing
RUN printf ':80 {\n\troot * /usr/share/caddy\n\tfile_server\n\ttry_files {path} /index.html\n\tencode gzip\n}\n' > /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]