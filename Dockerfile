# Dockerfile
FROM node:16-alpine  
# Use a Node.js base image

WORKDIR /app

COPY package*.json ./  
# Copy package files first for caching
RUN npm install

COPY . .  
# Copy the rest of the application code

# Set environment variables (you can also use a .env file and copy it)
# IMPORTANT: Never hardcode sensitive information like keys directly in the Dockerfile
ENV SUPABASE_URL=https://hzhfgowxebxvksorcomp.supabase.co
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aGZnb3d4ZWJ4dmtzb3Jjb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzQzNDAsImV4cCI6MjA1NDg1MDM0MH0.SkOM0guCBApUgu5j_mGmORud63Id5whHhVe8Mfuc8YM
ENV JWT_SECRET=AIO!api++

EXPOSE 3000

CMD ["node", "server.js"]
