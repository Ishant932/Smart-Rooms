const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM || 'SmartRoooms <onboarding@resend.dev>';

async function sendPasswordResetOtp({ to, name, otp }) {
  if (!resend) {
    const err = new Error('Email service not configured (RESEND_API_KEY missing)');
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  const displayName = name || 'there';
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `${otp} is your SmartRoooms password reset code`,
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111827">
        <h1 style="font-size:22px;margin:0 0 8px">Reset your password</h1>
        <p style="color:#4b5563;line-height:1.5">Hi ${displayName},</p>
        <p style="color:#4b5563;line-height:1.5">Use this one-time code to reset your SmartRoooms account password. It expires in <strong>10 minutes</strong>.</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:700;background:#f3f4f6;border-radius:12px;padding:16px 20px;text-align:center;margin:24px 0">${otp}</p>
        <p style="color:#6b7280;font-size:13px;line-height:1.5">If you did not request this, you can ignore this email. Your password will stay the same.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:28px">SmartRoooms · Jaipur student rooms</p>
      </div>
    `,
    text: `Hi ${displayName},\n\nYour SmartRoooms password reset code is: ${otp}\n\nThis code expires in 10 minutes.\nIf you did not request this, ignore this email.`,
  });

  if (error) {
    const err = new Error(error.message || 'Failed to send email');
    err.code = 'EMAIL_SEND_FAILED';
    err.details = error;
    throw err;
  }

  return data;
}

module.exports = { sendPasswordResetOtp };
