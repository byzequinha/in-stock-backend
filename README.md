# In Stock - Backend

Um sistema de controle de estoque eficiente, com autenticação baseada em JWT e CRUD completo para gerenciamento de usuários. Desenvolvido com Node.js, Express e TypeScript.

---

## Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração e Instalação](#configuração-e-instalação)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Próximos Passos](#próximos-passos)

---

## Sobre o Projeto

O **In Stock** é uma aplicação backend para controle de estoque, com foco em flexibilidade, segurança e usabilidade. Atualmente, oferece CRUD completo para gerenciar usuários, autenticação segura com JWT e suporte para controle hierárquico (Supervisor, Usuário, etc.).

---

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript.
- **Express**: Framework web para criar APIs RESTful.
- **TypeScript**: Tipagem estática para JavaScript.
- **PostgreSQL (em breve)**: Banco de dados relacional.
- **JWT (JSON Web Tokens)**: Autenticação segura.
- **Docker**: Contêiner para facilitar deploy e desenvolvimento.
- **ThunderClient**: Ferramenta para testes de APIs.

---

## Configuração e Instalação

### 1. Clonar o Repositório
```bash
git clone https://github.com/byzequinha/in-stock-backend
cd in-stock-backend
```

---
### 2. Instalar Dependências
```bash
npm install
```
---
### 3. Configurar Variáveis de Ambiente
Crie um arquivo ```.env``` na raiz do projeto e configure as seguintes variáveis:
```bash
PORT=3000
JWT_SECRET=defaultSecretKey
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=in_stock
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

```
---
### 4. Iniciar o Servidor
```bash
npx ts-node-dev src/server.ts
```
---
### Endpoints Disponíveis
**Autenticação**
- POST ```/api/auth/login```
Autentica um usuário mockado e retorna um token JWT.

**Usuários**
- GET ```/api/users```
Lista todos os usuários (Apenas Supervisores).
- POST ```/api/users```
Cria um novo usuário (Apenas Supervisores).
- PUT ```/api/users/:id```
Atualiza informações de um usuário específico (Apenas Supervisores).
- DELETE ```/api/users/:id```
Remove um usuário específico (Apenas Supervisores).
- GET ```/api/users/test```
Testa a autenticação de um token JWT.

**Produtos**
- GET ```/api/products```
Lista todos os produtos.
- POST ```/api/products```
Cria um novo produto.
- PUT ```/api/products/:id```
Atualiza informações de um produto específico.
- DELETE ```/api/products/:id```
Remove um produto específico.
- POST```/api/products/:id/sale```
Registra uma venda para o produto especificado.

---

### Próximos Passos
---
**1. Documentação da API:**
Adicionar documentação com Swagger para facilitar o uso da API.

**2. Validações:**
Implementar validações robustas nos dados de entrada usando bibliotecas como ``` joi ``` ou ``` zod ```.

**3. Testes Automatizados:**
Criar testes com ``` jest ``` para garantir a estabilidade do sistema.

**4. Deploy:**
Configurar o deploy da aplicação usando Docker e plataformas como AWS ou Heroku.

---

## Autor

- [José Francisco Moreira Neto](https://github.com/byzequinha)

![Logo](https://github.com/byzequinha/byzequinha/blob/main/Linkedin%20_qrcode%20Zequinha%20200px.png)


## Licença

Todos os Direitos Reservados

[MIT](https://choosealicense.com/licenses/mit/)

