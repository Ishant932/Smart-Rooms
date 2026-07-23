const { Resend } = require('resend');
const nodemailer = require('nodemailer');
const dns = require('dns');

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  /* ignore */
}

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

/** HTTPS Gmail relay via Google Apps Script (works on Railway; SMTP is often blocked). */
async function sendViaGmailScript({ to, name, otp }) {
  const url = process.env.GMAIL_SCRIPT_URL;
  if (!url) return null;

  const secret = process.env.GMAIL_SCRIPT_SECRET || 'SmartRooomsMailRelay2026';
  const content = buildOtpEmail({ name, otp });

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret,
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
      fromName: 'SmartRoooms',
    }),
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { ok: false, error: raw.slice(0, 200) };
  }

  if (!res.ok || !data.ok) {
    const err = new Error(data.error || `Gmail script failed (${res.status})`);
    err.code = 'EMAIL_SEND_FAILED';
    err.provider = 'gmail-script';
    throw err;
  }

  return { provider: 'gmail-script', id: data.id || 'ok' };
}

function smtpConfigured() {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || (pass ? 'smtp.gmail.com' : '');
  return Boolean(host && user && pass);
}

async function sendWithTransport({ host, port, secure, user, pass, from, to, content }) {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    family: 4,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
    tls: { minVersion: 'TLSv1.2' },
    lookup: (hostname, _opts, cb) => dns.lookup(hostname, { family: 4 }, cb),
  });

  const info = await transporter.sendMail({
    from,
    to,
    subject: content.subject,
    html: content.html,
    text: content.text,
  });

  return { provider: 'smtp', id: info.messageId, port };
}

async function sendViaSmtp({ to, name, otp }) {
  if (!smtpConfigured()) return null;

  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const from = process.env.SMTP_FROM || process.env.RESEND_FROM || `SmartRoooms <${user}>`;
  const content = buildOtpEmail({ name, otp });

  const attempts = [
    { port: Number(process.env.SMTP_PORT_SSL || 465), secure: true },
    { port: Number(process.env.SMTP_PORT || 587), secure: false },
  ];

  let lastError;
  for (const attempt of attempts) {
    try {
      return await sendWithTransport({
        host,
        port: attempt.port,
        secure: attempt.secure,
        user,
        pass,
        from,
        to,
        content,
      });
    } catch (err) {
      lastError = err;
      console.error(`[email] SMTP ${host}:${attempt.port} failed:`, err.message);
    }
  }

  throw lastError || new Error('SMTP send failed');
}

/**
 * Prefer Gmail Apps Script (HTTPS) on cloud hosts, then SMTP, then Resend.
 */
async function sendPasswordResetOtp({ to, name, otp }) {
  const providers = [];

  if (process.env.GMAIL_SCRIPT_URL) {
    providers.push(() => sendViaGmailScript({ to, name, otp }));
  }
  if (smtpConfigured()) {
    providers.push(() => sendViaSmtp({ to, name, otp }));
  }
  if (process.env.RESEND_API_KEY) {
    providers.push(() => sendViaResend({ to, name, otp }));
  }

  if (!providers.length) {
    const err = new Error('Email service not configured');
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
      console.error('[email] provider failed:', err.message);
    }
  }

  throw lastError || new Error('All email providers failed');
}

module.exports = { sendPasswordResetOtp };
