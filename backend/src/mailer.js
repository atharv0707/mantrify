import nodemailer from 'nodemailer';

function getTransporter() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null; // dev: log to console

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendMail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM || 'noreply@mantrify.app';
  const transporter = getTransporter();

  if (!transporter) {
    console.log('\n📧 [DEV EMAIL] ──────────────────────────────────────');
    console.log(`To: ${to}\nSubject: ${subject}`);
    console.log(text);
    console.log('────────────────────────────────────────────────────\n');
    return;
  }

  await transporter.sendMail({ from, to, subject, html, text });
}

export async function sendVerificationEmail(email, otp) {
  const app = process.env.APP_NAME || 'Mantrify';
  await sendMail({
    to: email,
    subject: `Your ${app} verification code`,
    text: `Your ${app} verification code is: ${otp}\n\nExpires in 30 minutes. If you didn't sign up, ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:460px;margin:0 auto;padding:32px;background:#FBF6EC;border-radius:12px">
        <h2 style="color:#241C13;margin-bottom:4px">${app}</h2>
        <p style="color:#8A7C6A;margin-top:0">Verify your email address</p>
        <div style="background:#fff;border-radius:10px;padding:28px;text-align:center;margin:24px 0">
          <p style="color:#8A7C6A;font-size:13px;margin:0 0 12px">Your verification code</p>
          <div style="letter-spacing:10px;font-size:34px;font-weight:bold;color:#E07A1F">${otp}</div>
        </div>
        <p style="color:#8A7C6A;font-size:12px">Expires in 30 minutes. If you didn't sign up, ignore this email.</p>
      </div>`,
  });
}

export async function sendPasswordResetEmail(email, otp) {
  const app = process.env.APP_NAME || 'Mantrify';
  await sendMail({
    to: email,
    subject: `Reset your ${app} password`,
    text: `Your ${app} password reset code is: ${otp}\n\nExpires in 30 minutes. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family:sans-serif;max-width:460px;margin:0 auto;padding:32px;background:#FBF6EC;border-radius:12px">
        <h2 style="color:#241C13;margin-bottom:4px">${app}</h2>
        <p style="color:#8A7C6A;margin-top:0">Password reset</p>
        <div style="background:#fff;border-radius:10px;padding:28px;text-align:center;margin:24px 0">
          <p style="color:#8A7C6A;font-size:13px;margin:0 0 12px">Your reset code</p>
          <div style="letter-spacing:10px;font-size:34px;font-weight:bold;color:#E07A1F">${otp}</div>
        </div>
        <p style="color:#8A7C6A;font-size:12px">Expires in 30 minutes. If you didn't request this, ignore this email.</p>
      </div>`,
  });
}
