import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MediCart API Documentation',
            version: '1.0.0',
            description: 'API documentation for MediCart API operations',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
              },
              {
                url: 'https://medicart-backend.vercel.app/',  // Vercel URL
                description: 'Production server',
              }
        ],
    },
    apis: ["./index.js"], // Path to the API docs
};

const specs = swaggerJsDoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;