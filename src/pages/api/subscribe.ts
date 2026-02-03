import type { APIRoute } from "astro";
import sgMail from "@sendgrid/mail";

const EMAILOCTOPUS_API_KEY = import.meta.env.EMAILOCTOPUS_API_KEY;
const SENDGRID_API_KEY = import.meta.env.SENDGRID_API_KEY;
const LIST_ID = "e1c19a58-fb03-11f0-b027-8d6876d28488";
const NOTIFICATION_EMAIL = "contact@bollenstreekdigitaal.nl";

export const prerender = false;

async function sendNotification(fields: {
  email: string;
  naam?: string;
  bedrijfsnaam?: string;
  telefoon?: string;
  dienst?: string;
  bericht?: string;
}) {
  if (!SENDGRID_API_KEY) return;

  sgMail.setApiKey(SENDGRID_API_KEY);

  const lines = [
    `<strong>Naam:</strong> ${fields.naam || "Niet ingevuld"}`,
    `<strong>E-mail:</strong> ${fields.email}`,
    fields.bedrijfsnaam ? `<strong>Bedrijf:</strong> ${fields.bedrijfsnaam}` : "",
    fields.telefoon ? `<strong>Telefoon:</strong> ${fields.telefoon}` : "",
    fields.dienst ? `<strong>Interesse:</strong> ${fields.dienst}` : "",
    fields.bericht ? `<strong>Bericht:</strong><br/>${fields.bericht}` : "",
  ].filter(Boolean);

  try {
    await sgMail.send({
      from: { email: "noreply@bollenstreekdigitaal.nl", name: "Bollenstreek Digitaal" },
      to: NOTIFICATION_EMAIL,
      subject: `Nieuw contactformulier: ${fields.naam || fields.email}`,
      html: `
        <h2>Nieuw bericht via het contactformulier</h2>
        <p>${lines.join("<br/>")}</p>
        <hr/>
        <p style="color: #666; font-size: 12px;">
          Dit bericht is automatisch verzonden door het contactformulier op bollenstreekdigitaal.nl
        </p>
      `,
    });
  } catch (err) {
    console.error("SendGrid notification error:", err);
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, naam, bedrijfsnaam, telefoon, dienst, bericht } = data;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "E-mailadres is verplicht" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const notesParts = [
      bedrijfsnaam ? `Bedrijf: ${bedrijfsnaam}` : "",
      telefoon ? `Telefoon: ${telefoon}` : "",
      dienst ? `Interesse: ${dienst}` : "",
      bericht ? `Bericht: ${bericht}` : "",
    ].filter(Boolean).join("\n");

    const response = await fetch(
      `https://api.emailoctopus.com/lists/${LIST_ID}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EMAILOCTOPUS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          fields: {
            FirstName: naam || "",
            Notes: notesParts || "",
          },
          tags: ["contact", "website"],
          status: "subscribed",
        }),
      },
    );

    // Send email notification (fire-and-forget, don't block the response)
    sendNotification({ email, naam, bedrijfsnaam, telefoon, dienst, bericht });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      if (response.status === 409 || error.type === "conflict") {
        return new Response(
          JSON.stringify({
            success: true,
            message:
              "Je bent al aangemeld. We nemen snel contact met je op!",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      console.error("EmailOctopus error:", error);
      return new Response(
        JSON.stringify({
          error: "Er ging iets mis. Probeer het later opnieuw.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bedankt! We nemen snel contact met je op.",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return new Response(
      JSON.stringify({
        error: "Er ging iets mis. Probeer het later opnieuw.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
