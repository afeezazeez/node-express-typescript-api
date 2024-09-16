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
export const ResetPasswordRequestDto = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
            example: '02840877ad59ea384a38f55f971c82fe95a25593179b1ea1bdef5f843fe1'
        },
        old_password: {
            type: 'string',
            example: '1234567'
        },
        new_password: {
            type: 'string',
            example: '123456'
        },
        confirm_new_password: {
            type: 'string',
            example: '123456'
        }
    }
}
