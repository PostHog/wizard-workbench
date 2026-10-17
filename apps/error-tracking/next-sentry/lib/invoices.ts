export type Invoice = {
  id: string;
  customer: string;
  amountCents: number;
  status: "draft" | "sent" | "paid";
  issuedAt: string;
};

export const invoices: Invoice[] = [
  { id: "INV-1042", customer: "Northwind Traders", amountCents: 129900, status: "paid", issuedAt: "2025-08-02" },
  { id: "INV-1043", customer: "Contoso Ltd", amountCents: 45000, status: "sent", issuedAt: "2025-08-11" },
  { id: "INV-1044", customer: "Fabrikam Inc", amountCents: 880050, status: "draft", issuedAt: "2025-08-19" },
];

export function formatCents(amountCents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amountCents / 100,
  );
}
