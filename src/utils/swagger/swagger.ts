import swaggerJSDoc from "swagger-jsdoc";
import {schemas} from "./schemas";
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A sample API documentation',
        },
        components: {
            schemas,
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
    },
    apis: [
        `${__dirname}/swagger.js`,
        `${__dirname}/swagger.ts`,
        `${__dirname}/../../controllers/**/*.ts`,
        `${__dirname}/../../controllers/**/*.js`,
    ],
};

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec;