import "server-only";

import { Resend } from "resend";

type SendEmailInput = {
  html: string;
  subject: string;
  text: string;
  to: readonly string[];
};

export type SendEmailResult = {
  reason?: "missing_provider" | "send_failed" | "no_recipient";
  sent: boolean;
};

export async function sendEmail({
  html,
  subject,
  text,
  to,
}: SendEmailInput): Promise<SendEmailResult> {
  const recipients = [...new Set(to.map((email) => email.trim()).filter(Boolean))];

  if (recipients.length === 0) {
    return {
      reason: "no_recipient",
      sent: false,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    return {
      reason: "missing_provider",
      sent: false,
    };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      html,
      subject,
      text,
      to: recipients,
    });

    return {
      sent: true,
    };
  } catch {
    return {
      reason: "send_failed",
      sent: false,
    };
  }
}
