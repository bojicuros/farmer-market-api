import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import * as dotenv from "dotenv";

dotenv.config();

export const marketEmail = process.env.GOOGLE_EMAIL;

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });
  return transporter;
};

export const sendEmail = async (emailOptions: Options) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
