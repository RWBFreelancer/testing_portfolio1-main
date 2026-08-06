import { useRef, useState } from "react";

export const SERVICE_OPTIONS = [
  "AI Automation",
  "GoHighLevel",
  "Customer Service Workflow",
  "Process Improvement",
  "Other",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export interface ContactFormState {
  name: string;
  email: string;
  services: ServiceOption[];
  message: string;
  honeypot: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const submissionTimestamps: number[] = [];

function isRateLimited(): boolean {
  const windowStart = Date.now() - RATE_LIMIT_WINDOW_MS;
  return submissionTimestamps.filter((t) => t > windowStart).length >= RATE_LIMIT_MAX;
}

function recordSubmission() {
  submissionTimestamps.push(Date.now());
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Deliberately does NOT reject plain URLs — mirrors api/contact.ts, which
// stopped blocking links since prospects routinely paste their own site.
const MALICIOUS_PATTERNS = [/<script/i, /javascript:/i, /on\w+\s*=/i, /\bviagra\b/i, /\bcasino\b/i];

function containsMaliciousContent(value: string): boolean {
  return MALICIOUS_PATTERNS.some((p) => p.test(value));
}

const INITIAL_STATE: ContactFormState = {
  name: "",
  email: "",
  services: [],
  message: "",
  honeypot: "",
};

export function useContactForm() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_STATE);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleService = (service: ServiceOption) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_STATE);
    setStatus("idle");
    setErrorMessage("");
  };

  const submit = async () => {
    setErrorMessage("");

    if (form.honeypot.length > 0) {
      setStatus("success");
      return;
    }

    if (isRateLimited()) {
      setErrorMessage("Too many submissions. Please wait a few minutes and try again.");
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("Email address is required.");
      return;
    }
    if (!validateEmail(form.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setErrorMessage("Please describe what you would like to improve or automate.");
      return;
    }
    if (containsMaliciousContent(form.message) || containsMaliciousContent(form.name)) {
      setErrorMessage("Your message contains content that cannot be submitted.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || null,
          email: form.email.trim().toLowerCase(),
          services: form.services,
          message: form.message.trim(),
          honeypot: form.honeypot,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      recordSubmission();
      setStatus("success");
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again in a moment.",
      );
      setStatus("error");
    }
  };

  return {
    form,
    status,
    errorMessage,
    SERVICE_OPTIONS,
    updateField,
    toggleService,
    submit,
    resetForm,
    formRef,
  };
}
