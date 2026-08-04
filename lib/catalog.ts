// ─── Shared product catalog ────────────────────────────────────────────────
// Import this wherever you need product data (shop page, spec sheet, etc.)

import { CartProduct } from "@/context/CartContext";

export const CATALOG: CartProduct[] = [
  {
    id: "shampoo-290",
    name: "daily balancing shampoo",
    brand: "CORE.",
    size: "290 ml / 9.81 fl oz",
    function: "cleanse & scalp equilibrium",
    price: 28.00,
    image: "/images/shampoo-front.png",
    unit: "unit 01",
  },
  {
    id: "conditioner-290",
    name: "daily nourishing conditioner",
    brand: "CORE.",
    size: "290 ml / 9.81 fl oz",
    function: "repair, lipids & weightless seal",
    price: 28.00,
    image: "/images/conditioner-front.png",
    unit: "unit 02",
  },
  {
    id: "duo-system-001",
    name: "the duo",
    brand: "CORE.",
    size: "2 × 290 ml / 9.81 fl oz",
    function: "complete daily system",
    price: 44.95,
    image: "/images/shampoo-front.png", // duo uses combined display
    unit: "system 001",
  },
];

const catalogById = new Map(CATALOG.map((p) => [p.id, p]));

export function getCatalogProduct(id: string): CartProduct {
  const product = catalogById.get(id);
  if (!product) throw new Error(`Unknown catalog product id: "${id}"`);
  return product;
}
