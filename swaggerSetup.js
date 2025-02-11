const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

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
            },
        ],
    },
    apis: ["./index.js"], // Path to the API docs
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
