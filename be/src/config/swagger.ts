import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: 'Tài liệu API cho hệ thống web bán hàng',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: 'Local Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Nhập Access Token theo dạng: Bearer <token>',
                },
            },
        },
    },
 
    apis: ['./src/modules/**/*.route.ts', './src/modules/**/*.schema.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
