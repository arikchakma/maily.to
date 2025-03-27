import swaggerJsdoc from 'swagger-jsdoc';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: x-api-key
 */

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Spotable Maily.to API',
      version: '1.0.0',
    },
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  apis: ['./app/routes**/*.ts'],
};

export async function loader() {
  return swaggerJsdoc(options);
}
