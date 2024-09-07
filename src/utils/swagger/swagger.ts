import swaggerJSDoc from "swagger-jsdoc";


const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: "3.1.0",
        info: {
            title: "NodeJs API",
            version: "0.1.0",
            description: "An API project",
        },
    },
     apis: [
    `${__dirname}/../../routes/**/*.js`,
    `${__dirname}/swagger.js`,
     `${__dirname}/../../routes/**/*.ts`,
     `${__dirname}/swagger.ts`,
     `${__dirname}/../../controllers/**/*.ts`,
],
})

export default swaggerSpec