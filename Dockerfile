# Usa uma imagem base oficial do Node.js
FROM node:20-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o código da aplicação
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Comando para rodar a aplicação compilada
CMD [ "npm", "start" ]