const { Resend } = require('resend');
const nodemailer = require('nodemailer');

function getResend() {
  return process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
}

function buildOtpEmail({ name, otp }) {
  const displayName = name || 'there';
  return {
    subject: `${otp} is your SmartRoooms password reset code`,
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="font-size:22px;margin:0 0 8px">Reset your password</h1>
        <p style="color:#4b5563;line-height:1.5">Hi ${displayName},</p>
        <p style="color:#4b5563;line-height:1.5">Use this one-time code to reset your SmartRoooms account password. It expires in <strong>10 minutes</strong>.</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;background:#f3f4f6;border-radius:12px;padding:16px 20px;text-align:center;margin:24px 0">${otp}</p>
        <p style="color:#6b7280;font-size:13px;line-height:1.5">If you did not request this, ignore this email. Your password will stay the same.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:28px">SmartRoooms · Jaipur student rooms</p>
      </div>
    `,
    text: `Hi ${displayName},\n\nYour SmartRoooms password reset code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, ignore this email.`,
  };
}

async function sendViaResend({ to, name, otp }) {
  const resend = getResend();
  if (!resend) return null;

  const from = process.env.RESEND_FROM || 'SmartRoooms <onboarding@resend.dev>';
  const content = buildOtpEmail({ name, otp });
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  if (error) {
    const err = new Error(error.message || 'Failed to send email via Resend');
    err.code = 'EMAIL_SEND_FAILED';
    err.provider = 'resend';
    err.details = error;
    throw err;
  }
  return { provider: 'resend', id: data?.id };
}

async function sendViaSmtp({ to, name, otp }) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const port = Number(process.env.SMTP_PORT || 587);
  if (!host || !user || !pass) return null;

  const from = process.env.SMTP_FROM || process.env.RESEND_FROM || `SmartRoooms <${user}>`;
  const content = buildOtpEmail({ name, otp });
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return { provider: 'smtp', id: info.messageId };
}

/**
 * Sends OTP email to the user's real inbox.
 * Prefers Resend (RESEND_API_KEY). Falls back to SMTP/Gmail if configured.
 */
async function sendPasswordResetOtp({ to, name, otp }) {
  const providers = [];

  // Prefer SMTP/Gmail when configured — can deliver to any recipient without Resend domain.
  if (process.env.SMTP_HOST || process.env.GMAIL_APP_PASSWORD) {
    providers.push(() => sendViaSmtp({ to, name, otp }));
  }
  if (process.env.RESEND_API_KEY) {
    providers.push(() => sendViaResend({ to, name, otp }));
  }

  if (!providers.length) {
    const err = new Error('Email service not configured (set RESEND_API_KEY or GMAIL_APP_PASSWORD/SMTP_*)');
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  let lastError;
  for (const send of providers) {
    try {
      const result = await send();
      if (result) return result;
    } catch (err) {
      lastError = err;
      console.error(`[email] provider failed:`, err.message);
    }
  }

  throw lastError || new Error('All email providers failed');
}

module.exports = { sendPasswordResetOtp };
