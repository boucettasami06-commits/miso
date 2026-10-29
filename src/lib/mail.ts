import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "./site";

/**
 * Envoi d'e-mails par le serveur SMTP de la messagerie pro (Spaceship, client@budgemy.com).
 * Réglages : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD (+ MAIL_FROM facultatif).
 */
export const mailReady = () => !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);

let transport: ReturnType<typeof nodemailer.createTransport> | null = null;
function mailer() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "mail.spacemail.com",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  }
  return transport;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Gabarit commun : sobre, lisible sur mobile, aux couleurs de la marque. */
function layout(title: string, body: string, cta?: { label: string; url: string }) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#fafaf5;font-family:Arial,Helvetica,sans-serif;color:#10231c">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:20px;padding:32px">
<tr><td>
<p style="margin:0 0 24px;font-size:22px;font-weight:800">budgemy<span style="color:#fa654c">.</span></p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25">${esc(title)}</h1>
<div style="font-size:16px;line-height:1.6;color:#4b5b53">${body}</div>
${cta ? `<p style="margin:28px 0 8px"><a href="${cta.url}" style="display:inline-block;background:#fa654c;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:999px">${esc(cta.label)}</a></p>` : ""}
</td></tr></table>
<p style="font-size:12px;color:#8a958f;margin-top:16px">Budgemy · ${esc(SITE.url.replace(/^https?:\/\//, ""))}</p>
</td></tr></table></body></html>`;
}

async function send(to: string, subject: string, html: string, text: string) {
  if (!mailReady()) return false;
  await mailer().sendMail({
    from: process.env.MAIL_FROM ?? `Budgemy <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
  return true;
}

export function sendWelcome(to: string, firstName: string) {
  const url = `${SITE.url}/ma-semaine`;
  return send(
    to,
    "Bienvenue sur Budgemy 🍽️",
    layout(
      `Bienvenue ${firstName} !`,
      `<p>Ton compte est créé. Ta semaine de repas et ta liste de courses t'attendent, calculées pour ton budget.</p><p>Tu peux les retrouver à tout moment, sur ton téléphone comme sur ton ordinateur.</p>`,
      { label: "Voir ma semaine", url },
    ),
    `Bienvenue ${firstName} ! Ton compte Budgemy est créé. Retrouve ta semaine ici : ${url}`,
  );
}

export function sendPasswordReset(to: string, firstName: string, url: string) {
  return send(
    to,
    "Réinitialise ton mot de passe Budgemy",
    layout(
      `Bonjour ${firstName},`,
      `<p>Tu as demandé à réinitialiser ton mot de passe. Ce lien est valable <strong>1 heure</strong>.</p><p>Si tu n'es pas à l'origine de cette demande, ignore simplement cet e-mail : ton mot de passe ne change pas.</p>`,
      { label: "Choisir un nouveau mot de passe", url },
    ),
    `Bonjour ${firstName}, pour réinitialiser ton mot de passe Budgemy (lien valable 1 heure) : ${url}`,
  );
}
