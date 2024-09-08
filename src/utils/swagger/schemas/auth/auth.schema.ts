export const LoginRequestDto = {
    type: 'object',
        properties: {
        email: {
            type: 'string',
                format: 'email',
                example: 'user@example.com',
        },
        password: {
            type: 'string',
                format: 'password',
                example: 'password123',
        },
    },
    required: ['email', 'password'],
}
export const RegisterDto =  {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
        },
        displayName: {
            type: 'string',
            description: 'The display name of the user',
            example: 'example_',
        },
        password: {
            type: 'string',
            format: 'password',
            example: 'password123',
        },
    },
    required: ['email', 'password','displayName'],
}
export const SuccessResponse = {
    type: 'object',
        properties: {
        success: {
            type: 'boolean',
                example: true,
        },
        message: {
            type: 'string',
                example: 'Login successful',
        },
        data: {
            type: 'object',
                properties: {
                token: {
                    type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                display_name: {
                    type: 'string',
                        example: 'afeezco',
                },
            },
        },
    },
}
export const PasswordIncorrectErrorResponse = {
    type: 'object',
        properties: {
        success: {
            type: 'boolean',
                example: false,
        },
        message: {
            type: 'string',
                example: 'Password is incorrect',
        },
    },
}
export const EmailIncorrectErrorResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Email is not associated with an account',
        },
    },
}
