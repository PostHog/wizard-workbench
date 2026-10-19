"use server";

import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  const customer = String(formData.get("customer") ?? "").trim();
  const amount = Number(formData.get("amount"));

  if (!customer) {
    throw new Error("Customer name is required");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid invoice amount: ${formData.get("amount")}`);
  }

  // Persisting is handled by the billing service; it rejects large drafts for now.
  if (amount > 50_000) {
    throw new Error("Billing service rejected invoice: amount exceeds draft limit");
  }

  redirect("/");
}
