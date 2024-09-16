export const CreateProductCategory = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            example: 'Pizza',
        }
    },
    required: ['name'],
}
export const CreateProductCategorySuccess = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Product saved!',
        },
    },
}
export const CreateProductCategoryError = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Category name exists',
        },
    },
}