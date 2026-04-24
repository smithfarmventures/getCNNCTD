// Welcome email helper.
//
// Uses Resend (https://resend.com). Requires:
//   RESEND_API_KEY  — API key from Resend dashboard
//   EMAIL_FROM      — e.g. "CNNCTD <hello@getcnnctd.com>"
//                    (domain must be DNS-verified in Resend first)
//
// Fail-soft design: if the email fails to send, we log and move on —
// the DB insert is the source of truth and the signup should never fail
// just because an email couldn't be delivered.

import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || 'CNNCTD <hello@getcnnctd.com>';

const resend = apiKey ? new Resend(apiKey) : null;

export type WelcomeEmailInput = {
  to: string;
  name?: string | null;
  role?: string | null;
};

export async function sendWelcomeEmail({ to, name, role }: WelcomeEmailInput): Promise<void> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping welcome email to', to);
    return;
  }

  const firstName = (name || '').trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
  const roleLabel = role === 'investor' ? 'investor' : role === 'founder' ? 'founder' : null;

  const subject = "You're CNNCTD.";

  const text = [
    greeting,
    '',
    `Thanks for joining the CNNCTD waitlist${roleLabel ? ` as a ${roleLabel}` : ''} — you're in.`,
    '',
    "We're heads down building the app right now. When early access opens, you'll hear from us first with the details.",
    '',
    'Until then: stay CNNCTD.',
    '',
    '— The CNNCTD Team',
    'hello@getcnnctd.com',
  ].join('\n');

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f7f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0c0f0e;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:40px;">
            <tr>
              <td style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#1a7a5e;font-weight:600;padding-bottom:20px;">
                CNNCTD
              </td>
            </tr>
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;color:#0c0f0e;padding-bottom:20px;">
                You&rsquo;re <em style="color:#1a7a5e;">CNNCTD.</em>
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.7;color:#3a3f3c;padding-bottom:12px;">
                ${greeting}
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.7;color:#3a3f3c;padding-bottom:16px;">
                Thanks for joining the CNNCTD waitlist${roleLabel ? ` as a ${roleLabel}` : ''} &mdash; you&rsquo;re in.
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.7;color:#3a3f3c;padding-bottom:16px;">
                We&rsquo;re heads down building the app right now. When early access opens, you&rsquo;ll hear from us first with the details.
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.7;color:#3a3f3c;padding-bottom:28px;">
                Until then: stay CNNCTD.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;color:#7a8480;border-top:1px solid #ede9e1;padding-top:20px;">
                &mdash; The CNNCTD Team<br/>
                <a href="mailto:hello@getcnnctd.com" style="color:#1a7a5e;text-decoration:none;">hello@getcnnctd.com</a>
              </td>
            </tr>
          </table>
          <div style="font-size:11px;color:#7a8480;padding-top:16px;letter-spacing:0.08em;text-transform:uppercase;">
            getCNNCTD, stay CNNCTD
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  try {
    const result = await resend.emails.send({ from, to, subject, text, html });
    if (result.error) {
      console.error('[email] Resend returned error for', to, result.error);
      return;
    }
    console.log('[email] Welcome email sent to', to, 'id:', result.data?.id);
  } catch (err) {
    console.error('[email] Failed to send welcome email to', to, err);
  }
}
