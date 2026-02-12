import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT!),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string,
): Promise<void> => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

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

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string,
): Promise<void> => {
  const resetPasswordLink = `${process.env.FRONTEND_URL}/reset?token=${token}`;

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
