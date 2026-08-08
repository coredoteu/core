"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import AddToCartButton from "@/components/product/AddToCartButton";
import { ProductPageData } from "@/lib/products";
import { CATALOG } from "@/lib/catalog";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";

import ProductGallery from "@/components/product/ProductGallery";
import HeroPanel from "@/components/product/HeroPanel";
import FormulationSection from "@/components/product/FormulationSection";
import UsageSection from "@/components/product/UsageSection";
import TechnicalSpecsSection from "@/components/product/TechnicalSpecsSection";
import ProductFAQ from "@/components/product/ProductFAQ";
import CrossSell from "@/components/product/CrossSell";

export default function ProductPageTemplate({
  product,
}: {
  product: ProductPageData;
}) {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `CORE. ${product.name}`,
            image: product.images.map((img) => `https://bycore.eu${img.src}`),
            description: product.tagline,
            sku: product.id,
            brand: {
              "@type": "Brand",
              name: "CORE.",
            },
            offers: {
              "@type": "Offer",
              url: `https://bycore.eu/products/${product.slug}`,
              priceCurrency: "EUR",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 0,
                  currency: "EUR",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: {
                    "@type": "QuantitativeValue",
                    minValue: 0,
                    maxValue: 1,
                    unitCode: "d",
                  },
                  transitTime: {
                    "@type": "QuantitativeValue",
                    minValue: 1,
                    maxValue: 5,
                    unitCode: "d",
                  },
                },
              },
            },
          }),
        }}
      />

      <section
        data-mobile-sticky-trigger="true"
        className="pt-28 md:pt-36 pb-20 md:pb-28"
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 xl:gap-28 items-start">
            <ProductGallery images={product.images} name={product.name} />
            <HeroPanel product={product} />
          </div>
        </div>
      </section>

      <FormulationSection product={product} />
      <UsageSection product={product} />
      <TechnicalSpecsSection product={product} />
      <ProductFAQ product={product} />
      <CrossSell currentSlug={product.slug} />
    </main>
  );
}
