# Usa uma imagem base oficial do Node.js
FROM node:20-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o código da aplicação
COPY . .

# Comando para rodar a aplicação (assumindo que o script principal é index.js)
CMD [ "node", "index.js" ]