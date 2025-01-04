import { productSchema } from "../validations/productValidation";

describe("Product Validation", () => {
  it("Deve validar um produto válido", () => {
    const validProduct = { name: "Produto A", price: 100 };

    const { error } = productSchema.validate(validProduct);

    expect(error).toBeUndefined(); // Não deve haver erros
  });

  it("Deve falhar quando o nome for curto", () => {
    const invalidProduct = { name: "A", price: 100 };

    const { error } = productSchema.validate(invalidProduct);

    expect(error).toBeDefined(); // Deve haver um erro
    expect(error?.details[0].message).toContain("mínimo 3 caracteres");
  });

  it("Deve falhar quando o preço for negativo", () => {
    const invalidProduct = { name: "Produto A", price: -50 };

    const { error } = productSchema.validate(invalidProduct);

    expect(error).toBeDefined(); // Deve haver um erro
    expect(error?.details[0].message).toContain("número positivo");
  });

  it("Deve falhar quando o preço não for fornecido", () => {
    const invalidProduct = { name: "Produto A" };

    const { error } = productSchema.validate(invalidProduct);

    expect(error).toBeDefined(); // Deve haver um erro
    expect(error?.details[0].message).toContain("é obrigatório");
  });
});
