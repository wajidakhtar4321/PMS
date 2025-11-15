const fs = require('fs');
const path = require('path');

console.log('📧 PMS Email Configuration Setup');
console.log('==================================\n');

console.log('This script will help you configure email settings for the PMS application.\n');

console.log('Available email configuration options:');
console.log('1. Gmail (Recommended for development/testing)');
console.log('2. Custom SMTP (For production services like SendGrid, AWS SES, etc.)');
console.log('3. Development mode (Default - Logs URLs to console)\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupEmail() {
  try {
    const choice = await askQuestion('Select email configuration option (1-3): ');
    
    let envContent = '';
    
    switch (choice) {
      case '1':
        console.log('\n🔧 Gmail Configuration');
        console.log('---------------------');
        console.log('Prerequisites:');
        console.log('- A Gmail account');
        console.log('- 2-Factor Authentication enabled');
        console.log('- An App Password generated\n');
        
        const emailUser = await askQuestion('Enter your Gmail address: ');
        const emailPass = await askQuestion('Enter your Gmail App Password: ');
        
        envContent = `# Gmail SMTP Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=${emailUser}
EMAIL_PASS=${emailPass}
EMAIL_FROM="Mobiloitte PMS" <${emailUser}>
`;
        break;
        
      case '2':
        console.log('\n🔧 Custom SMTP Configuration');
        console.log('---------------------------');
        
        const smtpHost = await askQuestion('Enter SMTP Host (e.g., smtp.sendgrid.net): ');
        const smtpPort = await askQuestion('Enter SMTP Port (e.g., 587): ');
        const smtpSecure = await askQuestion('Use secure connection? (true/false): ');
        const smtpUser = await askQuestion('Enter SMTP Username: ');
        const smtpPass = await askQuestion('Enter SMTP Password: ');
        const emailFrom = await askQuestion('Enter From Address (e.g., "PMS" <no-reply@yourdomain.com>): ');
        
        envContent = `# Custom SMTP Configuration
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_SECURE=${smtpSecure}
SMTP_USER=${smtpUser}
SMTP_PASS=${smtpPass}
EMAIL_FROM=${emailFrom}
`;
        break;
        
      case '3':
      default:
        console.log('\n🔧 Development Mode');
        console.log('-------------------');
        console.log('Using default development configuration.');
        console.log('Password reset URLs will be logged to console.\n');
        envContent = `# Development Mode (Default)
# No email configuration - URLs logged to console
`;
        break;
    }
    
    // Read existing .env file if it exists
    const envPath = path.join(__dirname, '.env');
    let existingContent = '';
    
    if (fs.existsSync(envPath)) {
      existingContent = fs.readFileSync(envPath, 'utf8');
      console.log('\nExisting .env file found. Backing up...');
      fs.writeFileSync(path.join(__dirname, '.env.backup'), existingContent);
      console.log('Backup saved as .env.backup\n');
    }
    
    // Write new configuration
    fs.writeFileSync(envPath, existingContent + '\n' + envContent);
    console.log('✅ Email configuration saved to .env file\n');
    
    if (choice === '1') {
      console.log('📝 Next steps for Gmail:');
      console.log('1. Ensure 2-Factor Authentication is enabled on your Gmail account');
      console.log('2. Generate an App Password in your Google Account settings');
      console.log('3. Use the App Password (not your regular Gmail password) in EMAIL_PASS\n');
    }
    
    console.log('🚀 You can now test your email configuration with:');
    console.log('   npm run test:email\n');
    
    console.log('🔐 Remember to keep your .env file secure and never commit it to version control!');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    readline.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupEmail();
}

module.exports = { setupEmail };