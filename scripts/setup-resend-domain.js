/**
 * Create/verify a Resend sending domain (requires FULL ACCESS API key).
 *
 * Usage:
 *   set RESEND_API_KEY=re_xxx
 *   node scripts/setup-resend-domain.js mail.yourdomain.com
 */
const domain = process.argv[2];
const key = process.env.RESEND_API_KEY;

if (!domain || !key) {
  console.error('Usage: RESEND_API_KEY=re_xxx node scripts/setup-resend-domain.js mail.yourdomain.com');
  process.exit(1);
}

async function main() {
  const headers = {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  };

  const created = await fetch('https://api.resend.com/domains', {
    method: 'POST',
    headers,
    body: JSON.stringify({ name: domain }),
  }).then((r) => r.json());

  if (created.statusCode && created.statusCode >= 400) {
    console.error('Create domain failed:', created);
    process.exit(1);
  }

  console.log('\nDomain created/registered:');
  console.log(JSON.stringify(created, null, 2));
  console.log('\nAdd these DNS records at your domain registrar, then run verify.\n');

  const id = created.id;
  if (id) {
    const verified = await fetch(`https://api.resend.com/domains/${id}/verify`, {
      method: 'POST',
      headers,
    }).then((r) => r.json());
    console.log('Verify response:', JSON.stringify(verified, null, 2));
  }

  console.log(`\nAfter DNS is green in Resend, set:`);
  console.log(`RESEND_FROM=SmartRoooms <noreply@${domain}>`);
  console.log(`OTP_INLINE_FALLBACK=false`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
