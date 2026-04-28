import "dotenv/config";
import Stripe from "stripe";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

async function setup() {
  console.log("Creating Stripe products and prices...\n");

  const basicProduct = await stripe.products.create({
    name: "Basic Plan",
    description: "Basic SaaS subscription — $10/month",
  });
  console.log(`✅ Created product: ${basicProduct.name} (${basicProduct.id})`);

  const basicPrice = await stripe.prices.create({
    product: basicProduct.id,
    unit_amount: 1000,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log(`✅ Created price: $10/mo (${basicPrice.id})`);

  const proProduct = await stripe.products.create({
    name: "Pro Plan",
    description: "Pro SaaS subscription — $25/month",
  });
  console.log(`✅ Created product: ${proProduct.name} (${proProduct.id})`);

  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2500,
    currency: "usd",
    recurring: { interval: "month" },
  });
  console.log(`✅ Created price: $25/mo (${proPrice.id})`);

  // Update .env files with the new price IDs
  const rootEnvPath = resolve(__dirname, "../.env");
  const frontendEnvPath = resolve(__dirname, "../frontend/.env");

  updateEnvFile(rootEnvPath, {
    STRIPE_BASIC_PRICE_ID: basicPrice.id,
    STRIPE_PRO_PRICE_ID: proPrice.id,
    VITE_STRIPE_BASIC_PRICE_ID: basicPrice.id,
    VITE_STRIPE_PRO_PRICE_ID: proPrice.id,
  });

  updateEnvFile(frontendEnvPath, {
    VITE_STRIPE_BASIC_PRICE_ID: basicPrice.id,
    VITE_STRIPE_PRO_PRICE_ID: proPrice.id,
  });

  console.log("\n✅ Updated .env with price IDs");
  console.log("\nSetup complete! You can now run:");
  console.log("  cd backend && npm run dev");
  console.log("  cd frontend && npm run dev");
}

function updateEnvFile(path: string, updates: Record<string, string>) {
  let content: string;
  try {
    content = readFileSync(path, "utf-8");
  } catch {
    content = "";
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(content)) {
      content = content.replace(regex, `${key}=${value}`);
    } else {
      content += `\n${key}=${value}`;
    }
  }

  writeFileSync(path, content.trim() + "\n");
}

setup().catch((err) => {
  console.error("Setup failed:", err.message);
  process.exit(1);
});
