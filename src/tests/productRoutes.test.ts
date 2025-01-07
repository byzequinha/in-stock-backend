jest.setTimeout(30000); // 30 segundos
import request from "supertest";
import app from "../server"; // Certifique-se de exportar o app no seu servidor
import pool from "../config/database"; // Conexão com o banco de dados

describe("Testes de Integração - Produtos", () => {
  beforeAll(async () => {
    // Configurar banco de dados antes dos testes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC NOT NULL
      );
    `);
    console.log("Tabela de teste criada com sucesso!");
  });

  afterAll(async () => {
    try {
      // Limpar dados após os testes
      await pool.query("DROP TABLE IF EXISTS products;");
      console.log("Tabela de teste removida com sucesso!");

      // Encerrar conexão com o banco de dados
      await pool.end();
      console.log("Conexão com o banco de dados encerrada!");
    } catch (err) {
      console.error("Erro ao encerrar o banco de dados:", err);
    }
  });

  it("Deve criar um novo produto", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({ name: "Produto Teste", price: 100 }); // price como número

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Produto Teste");
    expect(Number(response.body.price)).toBe(100); // Garante que price seja numérico
  });

  it("Deve listar os produtos", async () => {
    const response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
