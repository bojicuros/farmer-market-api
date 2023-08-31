import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import { config } from "../utils/config";

const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.password,
    },
  });
  return transporter;
};

export const sendEmail = async (emailOptions: Options) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
