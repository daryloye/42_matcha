import { verify } from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const verifyLink = `${process.env.APP_HOSTNAME}:${process.env.FRONTEND_PORT}/verify?token=${token}`;

  const htmlContent = `
    <h1>Hello ${username}!</h1>
    <p>Please verify your Matcha account by clicking this link:</p>
    <a href="${verifyLink}">Verify account</a>
  `;

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Matcha Account",
    html: htmlContent,
  });
}

export const sendPasswordResetEmail = async (
  email: string,
  username: string,
  token: string,
) => {
  const resetPasswordLink = `${process.env.APP_HOSTNAME}:${process.env.FRONTEND_PORT}/resetpassword?token=${token}`;

  const htmlContent = `
    <h1>Hello ${username}!</h1>
    <p>Please reset your email password by clicking the link below:</p>
    <a href="${resetPasswordLink}">Reset password</a>
    <p>This link will expire in 1 hour.</p>
  `;

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Matcha Password",
    html: htmlContent,
  });
};
