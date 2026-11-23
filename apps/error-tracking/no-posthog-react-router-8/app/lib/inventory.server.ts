export type Product = {
  sku: string;
  name: string;
  onHand: number;
  reorderPoint: number;
  supplier: string;
};

export type Tenant = { slug: string; name: string; region: string };

export class StockLedgerError extends Error {
  name = "StockLedgerError";
}
export class RecountRejectedError extends Error {
  name = "RecountRejectedError";
}
export class ReorderRejectedError extends Error {
  name = "ReorderRejectedError";
}
export class LabelTemplateError extends Error {
  name = "LabelTemplateError";
}
export class TenantLookupError extends Error {
  name = "TenantLookupError";
}
export class SyncBatchError extends Error {
  name = "SyncBatchError";
}
export class ForecastModelError extends Error {
  name = "ForecastModelError";
}

const products: Product[] = [
  { sku: "SKU-1001", name: "Oak shelf bracket", onHand: 240, reorderPoint: 60, supplier: "Harbor Hardware" },
  { sku: "SKU-1002", name: "Steel hinge 40mm", onHand: 512, reorderPoint: 100, supplier: "Harbor Hardware" },
  { sku: "SKU-2202", name: "Brass drawer pull", onHand: 88, reorderPoint: 40, supplier: "Lumen Fittings" },
  { sku: "SKU-3003", name: "Walnut veneer sheet", onHand: 12, reorderPoint: 20, supplier: "Northwind Timber" },
  { sku: "SKU-4471", name: "Pine dowel 8mm", onHand: 0, reorderPoint: 150, supplier: "Northwind Timber" },
  { sku: "SKU-4480", name: "Birch plywood 12mm", onHand: 0, reorderPoint: 25, supplier: "Northwind Timber" },
  { sku: "SKU-5150", name: "Cabinet handle set", onHand: 64, reorderPoint: 30, supplier: "Lumen Fittings" },
];

const ledgerEntries: Record<string, number[]> = {
  "SKU-4471": [120, -30, -95],
  "SKU-4480": [40, -12, -41],
};

const openCycleCounts = new Set(["SKU-2202"]);
const suppliersOnHold = new Set(["Northwind Timber"]);
const labelTemplates: Record<string, string[]> = {
  "SKU-5150": ["name", "sku"],
};

const tenants: Tenant[] = [
  { slug: "riverside", name: "Riverside Joinery", region: "eu-1" },
  { slug: "northgate", name: "Northgate Cabinets", region: "us-1" },
];

const codeFor = (prefix: string, value: string) => `${prefix}${value.replace(/\D/g, "").slice(-2)}`;

export function listProducts(): Product[] {
  return products;
}

export function getProduct(sku: string | undefined): Product | undefined {
  return products.find((product) => product.sku === sku);
}

export function stockLedger(product: Product): number[] {
  const entries = ledgerEntries[product.sku] ?? [product.onHand];
  const balance = entries.reduce((total, entry) => total + entry, 0);
  if (balance < 0) {
    throw new StockLedgerError(
      `Stock ledger out of balance for ${product.sku} (${codeFor("LB", product.sku)})`,
    );
  }
  return entries;
}

export function recordAdjustment(product: Product, quantity: number, reason: string): void {
  if (reason === "recount" && openCycleCounts.has(product.sku)) {
    throw new RecountRejectedError(
      `Recount rejected for ${product.sku}: a cycle count is still open (${codeFor("RC", product.sku)})`,
    );
  }
  product.onHand += quantity;
}

export function requestReorder(product: Product): { orderId: string } {
  if (suppliersOnHold.has(product.supplier)) {
    throw new ReorderRejectedError(
      `Supplier rejected reorder for ${product.sku} (${codeFor("RO", product.sku)})`,
    );
  }
  return { orderId: `PO-${product.sku.slice(-4)}` };
}

export function renderLabel(product: Product): string {
  const fields = labelTemplates[product.sku] ?? ["name", "sku", "barcode"];
  if (!fields.includes("barcode")) {
    throw new LabelTemplateError(
      `Label template has no barcode field for ${product.sku} (${codeFor("PD", product.sku)})`,
    );
  }
  return `${product.name}\n${product.sku}\n|| ||| | ||| ||`;
}

export function resolveTenant(slug: string): Tenant {
  const tenant = tenants.find((candidate) => candidate.slug === slug);
  if (!tenant) {
    throw new TenantLookupError(`Tenant lookup failed for "${slug}" (TN09)`);
  }
  return tenant;
}

export async function syncInventoryBatch(batch: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  throw new SyncBatchError(
    `Inventory sync batch ${batch} failed: warehouse feed closed (${batch.replace("-", "")})`,
  );
}

export type ForecastRow = { week: string; units: number };

export function forecastDemand(region: string): Promise<ForecastRow[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (region === "eu-2") {
        reject(new ForecastModelError(`Demand forecast diverged for region ${region} (FC22)`));
        return;
      }
      resolve([
        { week: "W48", units: 420 },
        { week: "W49", units: 455 },
        { week: "W50", units: 398 },
      ]);
    }, 300);
  });
}
