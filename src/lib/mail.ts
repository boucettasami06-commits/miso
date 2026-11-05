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
<p style="margin:0 0 24px"><img src="${SITE.url}/brand/budgemy-logo-email.png" width="180" height="56" alt="budgemy." style="display:block;border:0;height:auto;max-width:180px;font-size:22px;font-weight:800;color:#10231c"></p>
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
  const url = `${SITE.url}/ma-semaine?utm_source=bienvenue&utm_medium=email`;
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

export function sendClaimCode(to: string, code: string) {
  return send(
    to,
    `${code} est ton code Budgemy`,
    layout(
      "Relie ton abonnement à ton compte",
      `<p>Voici ton code de confirmation, valable <strong>15 minutes</strong> :</p><p style="font-size:32px;font-weight:800;letter-spacing:6px;color:#10231c;margin:16px 0">${code}</p><p>Saisis-le sur Budgemy pour débloquer ta semaine et ta liste de courses. Si tu n'es pas à l'origine de cette demande, ignore cet e-mail.</p>`,
    ),
    `Ton code Budgemy (valable 15 minutes) : ${code}`,
  );
}

export function sendPaywallReminder(to: string, firstName: string) {
  const url = `${SITE.url}/ma-semaine?utm_source=relance&utm_medium=email`;
  return send(
    to,
    `${firstName}, ta semaine de repas t'attend 🛒`,
    layout(
      `Ta semaine est prête, ${firstName} !`,
      `<p>Tu as généré ta semaine de repas sur Budgemy, calculée pour ton budget et tes magasins. Il ne manque plus qu'une étape pour débloquer :</p><ul style="padding-left:20px;margin:12px 0"><li>toutes tes recettes détaillées, du petit-déj au dîner ;</li><li>ta liste de courses complète, rangée par rayon ;</li><li>le remplacement d'un plat en un clic.</li></ul><p>Résiliable à tout moment. Pense à payer avec cette adresse e-mail (${esc(to)}) pour que ta semaine se débloque automatiquement.</p><p style="font-size:13px;color:#8a958f">C'est le seul rappel que tu recevras.</p>`,
      { label: "Débloquer ma liste de courses et mes recettes", url },
    ),
    `${firstName}, ta semaine Budgemy est prête. Débloque ta liste de courses et tes recettes : ${url}`,
  );
}
