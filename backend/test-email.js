const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Test email configuration
async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '****' : 'NOT SET');
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Server is ready to take our messages');
    
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Test" <test@example.com>',
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'PMS Email Configuration Test',
      text: 'If you received this email, your email configuration is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1>Mobiloitte PMS</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937;">Email Configuration Test</h2>
            <p>If you received this email, your email configuration is working correctly!</p>
            <p>This confirms that the PMS application can successfully send emails to users.</p>
            <p style="margin-top: 30px;">Best regards,<br>The Mobiloitte Team</p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    
    if (process.env.EMAIL_SERVICE !== 'gmail') {
      console.log('Preview URL (if using Ethereal):', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('❌ Error testing email configuration:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.message.includes('Invalid login')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('- If using Gmail, ensure you have 2-Factor Authentication enabled');
      console.log('- Generate and use an App Password, not your regular Gmail password');
      console.log('- Check that your EMAIL_USER and EMAIL_PASS environment variables are correct');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('- Check your SMTP_HOST setting');
      console.log('- Ensure you have internet connectivity');
      console.log('- Verify the SMTP server is accessible');
    } else if (error.message.includes('Missing credentials')) {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('- Check that your .env file contains EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS');
      console.log('- Ensure the .env file is in the backend directory');
      console.log('- Restart the server after updating environment variables');
    }
  }
}

// Run the test
testEmail();