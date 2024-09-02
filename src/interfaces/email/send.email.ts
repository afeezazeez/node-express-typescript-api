export interface SendMailArgs {
    to: string;                   // Recipient's email address
    subject: string;              // Subject line of the email
    view: string;                 // Path to the email template (view file)
    data?: Record<string, any>;   // Optional data for template rendering
}