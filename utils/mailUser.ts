// import sgMail from "@sendgrid/mail";

// export const sendEmail = async (
//   recipient: string,
//   subject: string,
//   body: string
// ) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
//   const msg = {
//     to: recipient,
//     from: process.env.SENDER_EMAIL!,
//     subject,
//     // text: text,
//     html: body
//   };

//   try {
//     await sgMail.send(msg);
//   } catch (err) {
//     console.error(err);
//   }
// };

const { createTransport } = require("nodemailer");

const mailSender = process.env.NODEMAILER_SENDER;

const transporter = createTransport({
  service: "yahoo",
  auth: {
    user: mailSender,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

export const sendEmail = async (
  recipient: string,
  subject: string,
  body: string
) => {
  var mailOptions = {
    from: mailSender,
    to: recipient,
    subject,
    html: body
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err);
  }
};
