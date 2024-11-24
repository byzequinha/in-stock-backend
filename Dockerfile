# Imagem base do Node.js
FROM node:18

# Diretório de trabalho no contêiner
WORKDIR /app

# Copiar arquivos do projeto
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Compilar o código TypeScript
RUN npm run build

# Expor a porta 3000
EXPOSE 3000

# Rodar o servidor com o código transpilado
CMD ["npm", "start"]
