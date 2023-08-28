import React from 'react';
import axios from 'axios';


export const SendEmail = async (to, subject, text) => {
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






