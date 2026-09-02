import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, PRODUCTS } from "@/lib/products";
import ProductPageTemplate from "@/components/product/ProductPageTemplate";
import { getActiveBatch, toBatchDisplayProps } from "@/lib/batches";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.name} / ${product.size} - CORE.`,
    description: `CORE. ${product.name}. ${product.tagline} ${product.naturalOrigin} natural origin. ecocert cosmos natural certified.`,
    openGraph: {
      title: `CORE. ${product.name}`,
      description: `${product.tagline} ${product.naturalOrigin} natural origin. ecocert cosmos natural certified.`,
      url: `https://bycore.eu/products/${slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const batch = toBatchDisplayProps(await getActiveBatch());

  return <ProductPageTemplate product={product} batch={batch} />;
}
