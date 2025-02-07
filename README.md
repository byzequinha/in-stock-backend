# In Stock - backend

Um sistema de controle de estoque eficiente, com autenticação baseada em JWT, CRUD completo para gerenciamento de usuários e validações robustas. Desenvolvido com Node.js, Express, TypeScript e testes automatizados.

---

## Sumário
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração e Instalação](#configuração-e-instalação)
- [Endpoints Disponíveis](#endpoints-disponíveis)
- [Testes Automatizados](#testes-automatizados)
- [Backup e Restauração do Banco de Dados](#backup-e-restauração-do-banco-de-dados)
- [Próximos Passos](#próximos-passos)

---

## Sobre o Projeto

O **In Stock** é uma aplicação backend para controle de estoque, com foco em flexibilidade, segurança e usabilidade. Atualmente, oferece CRUD completo para gerenciar usuários e produtos, autenticação segura com JWT, validações robustas usando Joi e suporte para controle hierárquico (Supervisor, Usuário, etc.).

---

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para criar APIs RESTful
- **TypeScript**: Tipagem estática para JavaScript
- **PostgreSQL**: Banco de dados relacional
- **JWT (JSON Web Tokens)**: Autenticação segura
- **Docker & Docker Compose**: Contêinerização para deploy e desenvolvimento
- **Joi**: Validações de entrada de dados
- **Jest**: Framework de testes automatizados
- **Swagger**: Documentação e testes de endpoints da API
- **Bcrypt**: Criptografia de senhas
- **CORS**: Middleware para configuração de CORS

---

## Configuração e Instalação

### 1. Clonar o Repositório
```bash
git clone https://github.com/byzequinha/in-stock-backend
cd in-stock-backend
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:
```bash
PORT=3000
JWT_SECRET=sua_chave_secreta
POSTGRES_USER=seu_usuario
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=in_stock
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### 4. Iniciar o Servidor

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

**Com Docker:**
```bash
docker-compose up --build
```

---

## Endpoints Disponíveis

**Autenticação**
- POST `/api/auth/login`: Autentica um usuário e retorna um token JWT.

**Usuários**
- GET `/api/users`: Lista todos os usuários (Apenas Supervisores).
- POST `/api/users`: Cria um novo usuário (Apenas Supervisores).
- PUT `/api/users/:id`: Atualiza informações de um usuário específico (Apenas Supervisores).
- DELETE `/api/users/:id`: Remove um usuário específico (Apenas Supervisores).
- GET `/api/users/test`: Testa a autenticação de um token JWT.

**Produtos**
- GET `/api/products`: Lista todos os produtos.
- POST `/api/products`: Cria um novo produto.
- PUT `/api/products/:id`: Atualiza informações de um produto específico.
- DELETE `/api/products/:id`: Remove um produto específico.
- POST `/api/products/:id/sale`: Registra uma venda para o produto especificado.

---

## Testes Automatizados

### Testes com Swagger
Os endpoints foram inicialmente testados usando **Swagger**, garantindo que a estrutura da API e as respostas esperadas estivessem corretas antes da implementação das validações com **Joi**.

### Testes com Jest
Após a implementação das validações, os testes automatizados foram realizados com **Jest** para garantir a robustez do sistema. Foram testados casos de validação de dados e integração com a API, incluindo:
- Produtos válidos e inválidos (nome curto, preço negativo, etc.).
- Testes de integração para os endpoints do sistema.

### Executar os Testes
Para rodar os testes:
```bash
npm test
```

Para rodar os testes com coverage:
```bash
npm test -- --coverage
```

---

## Backup e Restauração do Banco de Dados

Para realizar um backup completo do banco de dados, execute o seguinte comando:

```bash
docker exec -t in_stock_postgres pg_dump -U admin -d in_stock_db > backup_in_stock_db.sql
```

Isso criará um arquivo `backup_in_stock_db.sql` contendo toda a estrutura e os dados do banco.

Para restaurar o banco de dados em outro ambiente, utilize:

```bash
docker exec -i in_stock_postgres psql -U admin -d in_stock_db < backup_in_stock_db.sql
```

Caso precise visualizar todas as tabelas existentes, execute:

```bash
docker exec -it in_stock_postgres psql -U admin -d in_stock_db -c "\dt"
```

E para visualizar os dados de uma tabela específica:

```bash
docker exec -it in_stock_postgres psql -U admin -d in_stock_db -c "SELECT * FROM nome_da_tabela;"
```

---

## Próximos Passos
1. **Frontend**: Desenvolver a interface do sistema, conectando-a ao backend.
2. **Deploy**: Configurar o deploy da aplicação usando Docker e plataformas como AWS ou Heroku.

---

## Autor

- [José Francisco Moreira Neto](https://github.com/byzequinha)

![Logo](https://github.com/byzequinha/byzequinha/blob/main/Linkedin%20_qrcode%20Zequinha%20200px.png)

---

## Licença

Todos os Direitos Reservados

[MIT](https://choosealicense.com/licenses/mit/)

