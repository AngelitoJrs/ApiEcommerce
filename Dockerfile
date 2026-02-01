# Usamos una versión ligera de Node
FROM node:18-alpine

# Creamos la carpeta de la app
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar la caché
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto 3000
EXPOSE 3000

# Comando para arrancar
CMD ["node", "server.js"]