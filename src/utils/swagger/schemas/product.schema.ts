export const FetchProductCategorySuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates whether the request was successful',
            example: true,
        },
        data: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'The name of the product category',
                                example: 'Stationeries',
                            },
                            uuid: {
                                type: 'string',
                                description: 'The unique identifier for the category',
                                example: '35b4ad5f-9c4b-4c9a-a67f-aa44b6a56c0a',
                            },
                        },
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        current_page: {
                            type: 'integer',
                            description: 'The current page number',
                            example: 1,
                        },
                        next_page: {
                            type: 'integer',
                            description: 'The next page number, if available',
                            example: 2,
                        },
                        previous_page: {
                            type: 'integer',
                            description: 'The previous page number, if available',
                            example: null,
                        },
                        per_page: {
                            type: 'integer',
                            description: 'The number of items per page',
                            example: 2,
                        },
                        total: {
                            type: 'integer',
                            description: 'The total number of items',
                            example: 15,
                        },
                        last_page: {
                            type: 'integer',
                            description: 'The last page number',
                            example: 8,
                        },
                    },
                },
            },
        },
    },
};
export const CreateProductDto = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the product',
            example: 'Notebook',
        },
        description: {
            type: 'string',
            description: 'A brief description of the product',
            example: 'A 200-page notebook',
        },
        price: {
            type: 'number',
            description: 'The price of the product',
            example: 12.99,
        },
        quantity: {
            type: 'integer',
            description: 'The number of items in stock',
            example: 50,
        },
        category_uuid: {
            type: 'string',
            description: 'The unique identifier for the product category',
            example: '35b4ad5f-9c4b-4c9a-a67f-aa44b6a56c0a',
        },
    },
    required: ['name', 'description', 'price', 'quantity', 'category_uuid'],
};
export const CreateProductSuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates whether the request was successful',
            example: true,
        },
        message: {
            type: 'string',
            description: 'The message indicating the result of the operation',
            example: 'Product saved!',
        },
        data: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The name of the product',
                    example: 'Makintosh 2024',
                },
                uuid: {
                    type: 'string',
                    description: 'The unique identifier for the product',
                    example: '5239d838-0ad0-408d-bc44-3ca2fad6944a',
                },
                description: {
                    type: 'string',
                    description: 'A brief description of the product',
                    example: 'Durable phone with long life',
                },
                price: {
                    type: 'string',
                    description: 'The price of the product',
                    example: '2500.00',
                },
                category: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the product category',
                            example: 'Laptops',
                        },
                        uuid: {
                            type: 'string',
                            description: 'The unique identifier for the category',
                            example: 'e73ff99d-298f-4b4f-b4a6-dfb7959f381f',
                        },
                    },
                },
            },
        },
    },
};
export const FetchProductSuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates whether the request was successful',
            example: true,
        },
        data: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'The name of the product',
                                example: 'Makintosh 2024',
                            },
                            uuid: {
                                type: 'string',
                                description: 'The unique identifier for the product',
                                example: '5239d838-0ad0-408d-bc44-3ca2fad6944a',
                            },
                            description: {
                                type: 'string',
                                description: 'A brief description of the product',
                                example: 'Durable phone with long life',
                            },
                            price: {
                                type: 'string',
                                description: 'The price of the product',
                                example: '2500.00',
                            },
                            category: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: 'The name of the product category',
                                        example: 'Laptops',
                                    },
                                    uuid: {
                                        type: 'string',
                                        description: 'The unique identifier for the category',
                                        example: 'e73ff99d-298f-4b4f-b4a6-dfb7959f381f',
                                    },
                                },
                            },
                        },
                    },
                },
                meta: {
                    type: 'object',
                    properties: {
                        current_page: {
                            type: 'integer',
                            description: 'The current page number',
                            example: 1,
                        },
                        next_page: {
                            type: 'integer',
                            description: 'The next page number, if available',
                            example: 2,
                        },
                        previous_page: {
                            type: 'integer',
                            description: 'The previous page number, if available',
                            example: null,
                        },
                        per_page: {
                            type: 'integer',
                            description: 'The number of items per page',
                            example: 2,
                        },
                        total: {
                            type: 'integer',
                            description: 'The total number of items',
                            example: 15,
                        },
                        last_page: {
                            type: 'integer',
                            description: 'The last page number',
                            example: 8,
                        },
                    },
                },
            },
        },
    },
};
export const FetchSingleProductSuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates whether the request was successful',
            example: true,
        },
        data: {
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                    description: 'The name of the product',
                    example: 'Makintosh 2024',
                },
                uuid: {
                    type: 'string',
                    description: 'The unique identifier for the product',
                    example: '5239d838-0ad0-408d-bc44-3ca2fad6944a',
                },
                description: {
                    type: 'string',
                    description: 'A brief description of the product',
                    example: 'Durable phone with long life',
                },
                price: {
                    type: 'string',
                    description: 'The price of the product',
                    example: '2500.00',
                },
                category: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'The name of the product category',
                            example: 'Laptops',
                        },
                        uuid: {
                            type: 'string',
                            description: 'The unique identifier for the category',
                            example: 'e73ff99d-298f-4b4f-b4a6-dfb7959f381f',
                        },
                    },
                },
            },
        },
    },
};
export const AddProductToCartSuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            description: 'Indicates whether the request was successful',
            example: true,
        },
        message: {
            type: 'string',
            description: 'A message indicating the outcome of the operation',
            example: 'Product added to cart',
        },
        data: {
            type: 'object',
            properties: {
                product_uuid: {
                    type: 'string',
                    description: 'The UUID of the product',
                    example: 'fd9e3d1b-64ed-4bf0-91d9-ffae4a5f1520',
                },
                product_name: {
                    type: 'string',
                    description: 'The name of the product',
                    example: 'Iphone X',
                },
                quantity: {
                    type: 'integer',
                    description: 'The quantity of the product added to the cart',
                    example: 5,
                },
            },
        },
    },
};
export const FetchCartSuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Cart fetched successfully',
        },
        data: {
            type: 'object',
            properties: {
                cartItems: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            product_uuid: {
                                type: 'string',
                                format: 'uuid',
                                example: '7b10e73c-e19a-4279-bf3f-d220354924ae',
                            },
                            product_name: {
                                type: 'string',
                                example: 'Iphone 12 Pro',
                            },
                            quantity: {
                                type: 'integer',
                                example: 2,
                            },
                        },
                    },
                },
                totalAmount: {
                    type: 'integer',
                    example: 13800,
                },
            },
        },
    },
};

