/************ Using Sendgrid **************/

// import sgMail, { type MailDataRequired } from '@sendgrid/mail';

// const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY as string;

// sgMail.setApiKey(SENDGRID_API_KEY);

// interface SendEmailOptions {
//   to: string;
//   subject: string;
//   text: string;
// }

// const sendEmail = async ({
//   to,
//   subject,
//   text,
// }: SendEmailOptions): Promise<void> => {
    
//   const msg: MailDataRequired = {
//     to,
//     from: process.env.EMAIL_FROM as string,
//     subject,
//     text
//   };

//   try {
//     await sgMail.send(msg);
//     console.log('Email sent successfully');
//   } catch (error: any) {
//     console.error(
//       'Email sending failed:',
//       error.response?.body || error.message
//     );
//     throw error;
//   }
// };

// export default sendEmail;

/************ Using Nodemailer **************/

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});

export const sendEmail = async ({ to, subject, text }: SendEmailOptions) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL as string,
      to,
      subject,
      text
    });

    console.log("Email sent Successfully");
  }
  catch (error: any) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
