import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.base': 'O nome deve ser um texto.',
    'string.empty': 'O nome não pode estar vazio.',
    'string.min': 'O nome deve ter no mínimo 3 caracteres.',
    'string.max': 'O nome deve ter no máximo 50 caracteres.',
    'any.required': 'O nome é obrigatório.',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'O preço deve ser um número.',
    'number.positive': 'O preço deve ser um número positivo.',
    'any.required': 'O preço é obrigatório.',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'O estoque deve ser um número inteiro.',
    'number.min': 'O estoque não pode ser negativo.',
    'any.required': 'O estoque é obrigatório.',
  }),
  min_stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'O estoque mínimo deve ser um número inteiro.',
    'number.min': 'O estoque mínimo não pode ser negativo.',
    'any.required': 'O estoque mínimo é obrigatório.',
  }),
});
