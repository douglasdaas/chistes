const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Chistes y Matemáticas',
            version: '1.0.0',
            description: 'Una API para chistes y operaciones matemáticas',
        },
    },
    apis: ['app.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
