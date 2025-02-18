# ------------------------
# Step 1: Build react app
# ------------------------

# Usar una imagen base de Node.js
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# ------------------------
# Step 2: Serve the app
# ------------------------

# Usar una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (puerto predeterminado de Nginx)
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]