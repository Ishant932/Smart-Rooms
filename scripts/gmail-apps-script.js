/**
 * Paste this into https://script.google.com (New project).
 * Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the Web App URL and send it in chat.
 *
 * Optional: change SCRIPT_SECRET below to a private string.
 */
const SCRIPT_SECRET = 'SmartRooomsMailRelay2026';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.secret !== SCRIPT_SECRET) {
      return json_({ ok: false, error: 'unauthorized' });
    }
    if (!data.to || !data.subject || (!data.text && !data.html)) {
      return json_({ ok: false, error: 'missing fields' });
    }

    GmailApp.sendEmail(data.to, data.subject, data.text || '', {
      htmlBody: data.html || undefined,
      name: data.fromName || 'SmartRoooms',
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'SmartRoooms Gmail relay' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
