import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT!),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  }
});

/*
export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string,
): Promise<void> => {
  const verificationLink = `${process.env.HOSTNAME}${process.env.FRONTEND_PORT}/verify?token=${token}`;

  const htmlContent = `
        <h1>Welcome to Matcha, ${username}!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>Or copy this link: ${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Verify your Matcha account",
      html: htmlContent,
    });
    console.log(`✅ verification email sent to ${email}`);
  } catch (error) {
    console.log(`❌ error sending verification email: `, error);
    throw error;
  }
};
*/

export const sendVerificationEmail = async (email: string, token: string) => {
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;
  const auth = Buffer.from(`api:${apiKey}`).toString('base64');

  const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      from: `Matcha <noreply@${domain}>`,
      to: email,
      subject: 'Verify your Matcha Account',
      text: `Click here to verify: http://localhost:5173/verify?token=${token}`
    }),
  });
  if (!response.ok){
    throw new Error('Failed to send email via Mailgun API');
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string,
): Promise<void> => {
  const resetPasswordLink = `${process.env.HOSTNAME}${process.env.FRONTEND_PORT}/resetpassword?token=${token}`;

  const htmlContent = `
        <h1>Hello ${username}!</h1>
        <p>Please reset your email password by clicking the link below:</p>
        <a href="${resetPasswordLink}">reset password</a>
        <p>Or copy this link: ${resetPasswordLink}</p>
        <p>This link will expire in 24 hours.</p>`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset your password",
      html: htmlContent,
    });
    console.log(`✅ password reset link email sent to ${email}`);
  } catch (error) {
    console.log(`❌ error sending verification email: `, error);
    throw error;
  }
};
