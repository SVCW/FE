const axios = require('axios');

async function sendEmail(to, subject, text) {
    // const to = 'anbui.dev@gmail.com';
    //   const subject = 'Test email';
    //   const text = 'This is a test email';
     // Call the sendEmail function with the parameters
    //   await sendEmail(to, subject, text);
  const apiUrl = 'https://mail-sms-service.vercel.app/mail/send-email';
  const emailData = {
    to,
    subject,
    text
  };

  try {
    const response = await axios.post(apiUrl, emailData);
    if (response.status === 200) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = sendEmail;