"use client";

import AddToCartButton from "@/components/product/AddToCartButton";
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
