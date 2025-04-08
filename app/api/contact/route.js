import axios from 'axios';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY, // Use App Password if 2FA is enabled
  },
});

// Email template for admin (you)
const generateAdminEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Email template for user (thank you response)
const generateUserEmailTemplate = (name) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">Thank You for Contacting Us!</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for reaching out! We have received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br><strong>Meet Vaghani</strong></p>
    </div>
  </div>
`;

// Function to send emails
async function sendEmail(payload) {
  const { name, email, message: userMessage } = payload;

  // Email to admin (you)
  const adminMailOptions = {
    from: "Portfolio",
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: userMessage,
    html: generateAdminEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  // Email to user (thank you message)
  const userMailOptions = {
    from: "Portfolio",
    to: email, // Send to user's email
    subject: "Thank You for Reaching Out!",
    text: `Hi ${name}, thank you for contacting us! We'll get back to you soon.`,
    html: generateUserEmailTemplate(name),
  };

  try {
    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    // Send acknowledgment email to user
    await transporter.sendMail(userMailOptions);
    return true;
  } catch (error) {
    console.error('Error while sending email:', error.message);
    return false;
  }
}

// API Handler
export async function POST(request) {
  try {
    const payload = await request.json();
    const emailSuccess = await sendEmail(payload);

    if (emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Emails sent successfully!',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send emails.',
    }, { status: 500 });
  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
}
