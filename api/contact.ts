// api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const MALICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /https?:\/\//i,
  /\bviagra\b/i,
  /\bcasino\b/i,
];

function isMalicious(value: string | null | undefined) {
  if (!value) return false;
  return MALICIOUS_PATTERNS.some((p) => p.test(value));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ── CORS for local dev ──────────────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // ── Health check ────────────────────────────────────────────────────────
  if (req.method === "GET") {
    return res.json({
      ok: true,
      env: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        RESEND_TO_EMAIL: !!process.env.RESEND_TO_EMAIL,
      },
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Parse body ───────────────────────────────────────────────────────
  const body = req.body;
  if (!body) return res.status(400).json({ error: "Invalid JSON" });

  const { name, email, services, message, honeypot } = body;

  // ── 2. Basic validation ─────────────────────────────────────────────────
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required." });
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    return res.status(400).json({ error: "Message must be at least 10 characters." });
  }

  // ── 3. Honeypot ─────────────────────────────────────────────────────────
  if (honeypot && honeypot.length > 0) {
    return res.json({ success: true }); // Silent reject
  }

  // ── 4. Malicious content ────────────────────────────────────────────────
  if (isMalicious(message) || isMalicious(name)) {
    return res.status(400).json({ error: "Your message contains content that cannot be submitted." });
  }

  const cleanName = typeof name === "string" ? name.trim() || null : null;
  const cleanEmail = email.trim().toLowerCase();
  const cleanMessage = message.trim();
  const cleanServices = Array.isArray(services)
    ? services.map((s: string) => s.trim()).filter(Boolean)
    : [];

  // ── 5. Supabase insert ──────────────────────────────────────────────────
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("[contact] Missing Supabase env vars");
    return res.status(500).json({ error: "Server configuration error." });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error: dbError } = await supabase.from("contact_inquiries").insert({
    name: cleanName,
    email: cleanEmail,
    services: cleanServices,
    message: cleanMessage,
  });

  if (dbError) {
    console.error("[contact] Supabase error:", dbError);
    return res.status(500).json({ error: "Could not save your inquiry. Please try again." });
  }

  // ── 6. Resend email ─────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!resendKey || !toEmail) {
    console.warn("[contact] Resend not configured, skipping email");
    return res.json({ success: true, emailSent: false });
  }

  const serviceList = cleanServices.length ? cleanServices.join(", ") : "—";
  const emailText = [
    "New inquiry received from your portfolio.",
    "",
    `Name: ${cleanName ?? "Not provided"}`,
    `Email: ${cleanEmail}`,
    `Services of interest: ${serviceList}`,
    "",
    "Message:",
    cleanMessage,
    "",
    "---",
    `Received at: ${new Date().toISOString()}`,
  ].join("\n");

  try {
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: cleanEmail,
        subject: `New Portfolio Inquiry${cleanName ? ` from ${cleanName}` : ""}`,
        text: emailText,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("[contact] Resend error:", emailRes.status, errBody);
      return res.json({ success: true, emailSent: false });
    }
  } catch (err) {
    console.error("[contact] Resend threw:", err);
    return res.json({ success: true, emailSent: false });
  }

  return res.json({ success: true, emailSent: true });
}