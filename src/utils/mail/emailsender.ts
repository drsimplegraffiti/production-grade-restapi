import nodemailer, { TransportOptions } from "nodemailer";

type TransportOptionsType = TransportOptions & {
  host: string;
  port: number;
  auth: { user: string; pass: string };
  tls: {
    rejectUnauthorized: boolean;
  };
};

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (option: EmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  } as TransportOptionsType);

  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.SMTP_FROM}>`,
      to: option.email,
      subject: option.subject,
      text: option.message,
      html: option.message,
    };

    const info = await transporter.sendMail(message);
    console.log(`Message sent: ${info}`);
    return info;
  } catch (error) {
    return error;
  }
};

export { sendEmail };
