"use client";

// ShopAddToCart wraps AddToCartButton for use in server component pages.
// The shop page (server component) passes a CartProduct — this thin client
// wrapper ensures the button can access the CartContext.

import AddToCartButton from "@/components/AddToCartButton";
import { CartProduct } from "@/context/CartContext";

export default function ShopAddToCart({
  product,
  label,
}: {
  product: CartProduct;
  label?: string;
}) {
  return <AddToCartButton product={product} label={label} />;
}
