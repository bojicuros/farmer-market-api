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
  try {
    const emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
  } catch (error) {
    console.error("Error sending email");
  }
};

export function sendRejectionEmail(email: string, name: string) {
  const emailOptions = {
    from: config.email,
    to: email,
    subject: "Registration Rejection",
    text: `Dear ${name},

We regret to inform you that your registration for our Farmer's Market app has been rejected. After reviewing your application, we found that it does not meet our criteria at this time. If you have any questions or need further information, please feel free to contact our support team at pijacnibarometar@gmail.com.

Thank you for your interest in our platform, and we wish you the best in your future endeavors.

Sincerely,
Pijacni barometar`,
  };

  sendEmail(emailOptions);
}

export function sendApprovalEmail(email: string, name: string) {
  const emailOptions = {
    from: config.email,
    to: email,
    subject: "Registration Approved",
    text: `Dear ${name},

We are pleased to inform you that your registration for our Farmer's Market app has been approved! Welcome to our community of vendors. You can now access your vendor account and start listing your products.

If you have any questions or need assistance, please do not hesitate to contact our support team at pijacnibarometar@gmail.com.
    
Best regards,
Pijacni barometar`,
  };

  sendEmail(emailOptions);
}

export function sendConfirmationEmail(email: string, secretToken: string) {
  const emailOptions = {
    from: config.email,
    to: email,
    subject: "Email Confirmation",
    text: `Here is your confirmation token: ${secretToken}`,
  };

  sendEmail(emailOptions);
}
