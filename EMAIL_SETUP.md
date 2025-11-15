# Email Authentication Setup Guide

This guide will help you configure email authentication for the Password Reset feature in the PMS application.

## Overview

The application supports multiple email configuration options:
1. Gmail SMTP (Recommended for development/testing)
2. Custom SMTP (For production services like SendGrid, AWS SES, etc.)
3. Development mode (Default - Logs URLs to console)

## Option 1: Gmail SMTP Configuration (Recommended)

### Prerequisites
1. A Gmail account
2. 2-Factor Authentication enabled on your Gmail account
3. An App Password generated for the application

### Steps

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification
   - Follow the prompts to enable 2FA

2. **Generate an App Password**
   - Go to your Google Account settings
   - Navigate to Security > 2-Step Verification > App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password

3. **Configure Environment Variables**
   Add the following to your `backend/.env` file:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM="Mobiloitte PMS" <your-email@gmail.com>
   ```

## Option 2: Custom SMTP Configuration

### For SendGrid:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM="Mobiloitte PMS" <no-reply@yourdomain.com>
```

### For AWS SES:
```
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-access-key-id
SMTP_PASS=your-secret-access-key
EMAIL_FROM="Mobiloitte PMS" <no-reply@yourdomain.com>
```

### For Other SMTP Providers:
```
SMTP_HOST=your-smtp-host.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASS=your-password
EMAIL_FROM="Mobiloitte PMS" <no-reply@yourdomain.com>
```

## Option 3: Development Mode (Default)

If no email configuration is provided, the system will:
- Use Ethereal.email for testing (may fail due to test credentials)
- Log the password reset URL to the console for manual testing
- Always return success messages to the frontend for security

## Testing Email Functionality

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Trigger the forgot password flow:**
   - Visit `http://localhost:3000/forgot-password`
   - Enter a registered email address
   - Submit the form

3. **Check the console output:**
   - If email is configured correctly, you'll see "Password reset email sent successfully"
   - If using development mode, you'll see "For development testing, use this reset URL: [URL]"

4. **Verify email delivery:**
   - Check the recipient's inbox
   - For Ethereal testing, check the preview URL in console output

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env` files to version control
   - Use different configurations for development, staging, and production

2. **App Passwords:**
   - Generate specific app passwords for each application
   - Revoke app passwords when no longer needed

3. **Rate Limiting:**
   - Consider implementing rate limiting for password reset requests
   - Prevent abuse of the email sending functionality

## Troubleshooting

### Common Issues:

1. **"Invalid login: 535 Authentication failed"**
   - Ensure you're using an App Password, not your regular Gmail password
   - Verify 2-Factor Authentication is enabled

2. **"Email not received"**
   - Check spam/junk folders
   - Verify the EMAIL_FROM address is correctly formatted
   - Check SMTP server logs for delivery issues

3. **"Connection timeout"**
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Check firewall settings
   - Ensure the SMTP service is accessible

### Testing with Ethereal.email:

If you want to test with Ethereal.email (the default development option):
1. Visit https://ethereal.email/create
2. Create a temporary account
3. Update the credentials in the `createTransporter()` function
4. The preview URL will show you the "received" email

## Production Deployment

For production deployment:

1. **Choose a reliable email service:**
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Set environment variables:**
   - Configure SMTP settings in your production environment
   - Use secure methods to store credentials (AWS Secrets Manager, etc.)

3. **Monitor email delivery:**
   - Set up delivery tracking
   - Monitor bounce rates
   - Handle complaints appropriately

4. **Implement proper error handling:**
   - Log email sending failures
   - Implement retry mechanisms for transient failures
   - Alert on persistent delivery issues

## Example Production Configuration

```
NODE_ENV=production
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASS=SG.xxxxxxx
EMAIL_FROM="Mobiloitte PMS" <no-reply@mobiloitte.com>
```