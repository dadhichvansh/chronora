import nodemailer from 'nodemailer';

let testAccount;
let transporter;

export async function initMailer() {
  testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  console.log('📨 Ethereal email ready');
}

export async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    throw new Error('Mailer not initialized');
  }

  const info = await transporter.sendMail({
    from: `"Chronora" <${testAccount.user}>`,
    to,
    subject,
    html,
  });

  console.log('📩 Email sent (DEV)');
  console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
}
