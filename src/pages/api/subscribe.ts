import type { APIRoute } from "astro";

const EMAILOCTOPUS_API_KEY = import.meta.env.EMAILOCTOPUS_API_KEY;
const LIST_ID = "e1c19a58-fb03-11f0-b027-8d6876d28488";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { email, naam } = data;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "E-mailadres is verplicht" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

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
          },
          tags: ["contact", "website"],
          status: "subscribed",
        }),
      },
    );

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
