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

---

### Próximos Passos
---
**1. Integração com Banco de Dados:**
Conectar o sistema ao PostgreSQL para persistência de dados.

**2. Controle de Estoque:**
Implementar CRUD para produtos e gerenciamento de entradas/saídas.

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

