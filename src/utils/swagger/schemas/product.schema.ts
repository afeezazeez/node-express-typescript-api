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