import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'In Stock API',
        version: '1.0.0',
        description: 'Documentação da API para controle de estoque',
      },
      servers: [
        {
          url: 'http://localhost:3001',
        },
      ],
    },
    apis: ['./src/routes/*.ts'], // Caminho correto para os arquivos de rotas
  };
  
  
  const swaggerSpec = swaggerJsdoc(options);
  

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
