export const LoginRequestDto = {
    type: 'object',
        properties: {
        email: {
            type: 'string',
                format: 'email',
                example: 'Alvah30@yahoo.com',
        },
        password: {
            type: 'string',
                format: 'password',
                example: '123456',
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
export const RegisterSuccessResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Registration successful. Please check your email',
        },
    },
}
export const LogoutSuccessResponse = {
    type: 'object',
        properties: {
        success: {
            type: 'boolean',
                example: true,
        },
        message: {
            type: 'string',
                example: 'Logout successful.',
        },
    },
}
export const LoginSuccessResponse = {
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
export const UnauthorisedErrorResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Unauthenticated',
        },
    },
}
export const AuthUserDetailResponse = {
    type:'object',
    properties:{
        success:{
            type:'boolean',
            example:true
        },
        data:{
            type:'object',
            properties:{
                displayName: {
                    type:'string',
                    example:'john@12'
                },
                email:{
                    type:'string',
                    example:'Alvah30@yahoo.com'
                },
                avatar:{
                    type:'string',
                    example:'"https://loremflickr.com/640/480?lock=6979778766700544'
                }
            }

        }
    }
}
export const ForgotPasswordAndVerifyEmailRequestDto =  {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email',
            example: 'Alvah30@yahoo.com',
        },
    },
    required: ['email'],
}
export const PasswordResetLinkSuccessResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Password reset link sent successfully.',
        }
    },
}
export const EmailVerificationLinkSuccessResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Verification email resent successfully.',
        }
    },
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
export const PasswordResetSuccessful = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Password was reset successfully.',
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
export const InvalidPasswordResetLinkResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Password reset link is invalid or has expired',
        },
    },
}
export const OldPasswordIncorrectResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Old password is incorrect',
        },
    },
}
export const OldPasswordAsNewPasswordResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Please set a new password different from old password',
        },
    },
}
export const PasswordDoNotMatchResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Passwords do not  match',
        },
    },
}
export const EmailTakenResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Email is already associated with an account',
        },
    },
}
export const DisplayNameTakenResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Display name is already associated with an account',
        },
    },
}
export const ShortPasswordResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Password must be at least 6 characters long.',
        },
    },
}
export const LargePasswordResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Password must not exceed 12 characters.',
        },
    },
}
export const AccountVerifiedErrorResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Account is already verified',
        },
    },
}
export const EmailVerificationSuccessResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: true,
        },
        message: {
            type: 'string',
            example: 'Email verification successful.',
        }
    },
}
export const EmailVerificationTokenErrorResponse = {
    type: 'object',
    properties: {
        success: {
            type: 'boolean',
            example: false,
        },
        message: {
            type: 'string',
            example: 'Verification link is invalid or has expired',
        }
    },
}
export const VerifyEmailLinkRequestDto = {
    type: 'object',
    properties: {
        token: {
            type: 'string',
            example: '02840877ad59ea384a38f55f971c82fe95a25593179b1ea1bdef5f843fe1'
        },
    }
}