// ─── Full product data for individual product pages ─────────────────────────

import { getActivePrice } from "@/lib/storeConfig";

export interface ProductActive {
  name: string;
  benefit: string;
}

export interface ProductUsageStep {
  index: string;
  label: string;
  description: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface ProductCertification {
  label: string;
  icon: string;
}

export interface ProductPageData {
  id: string;
  slug: string;
  unit: string;
  name: string;
  fullName: string;
  size: string;
  price: number;
  function: string;
  tagline: string;
  targetAudience: string;
  scent: string;
  naturalOrigin: string;
  certifications: ProductCertification[];
  claims: string[];
  actives: ProductActive[];
  usageSteps: ProductUsageStep[];
  inci: string;
  inciNote: string;
  faqs: ProductFAQ[];
  images: { src: string; alt: string }[];
}

export const PRODUCTS: ProductPageData[] = [
  {
    id: "shampoo-290",
    slug: "daily-balancing-shampoo",
    unit: "unit 01",
    name: "daily balancing shampoo",
    fullName: "CORE. daily balancing shampoo",
    size: "290 ml / 9.81 fl oz",
    price: getActivePrice("shampoo-290"),
    function: "cleanse & scalp equilibrium",
    tagline: "precision cleanse. scalp in equilibrium.",
    targetAudience: "all hair types. special focus on scalp hydration and volume restoration.",
    scent: "juicy fruits / warm woods",
    naturalOrigin: "99%",
    certifications: [
      { label: "vegan", icon: "/icons/vegan.svg" },
      { label: "gluten-free", icon: "/icons/ban.svg" },
      { label: "nut-free", icon: "/icons/ban.svg" },
      { label: "ecocert cosmos natural", icon: "/icons/leaf.svg" },
    ],
    claims: [
      "gluten-free",
      "nut-free",
      "vegan",
      "ecocert cosmos natural certified",
      "99% natural origin",
      "silicone-free",
      "sulfate-free (SLS-free)",
    ],
    actives: [
      {
        name: "aloe vera juice",
        benefit: "deep scalp hydration. soothes irritation and conditions at the root.",
      },
      {
        name: "sea kale extract",
        benefit: "marine-derived fortification. strengthens the hair shaft from within.",
      },
      {
        name: "ginkgo biloba leaf extract",
        benefit: "circulatory activator. stimulates scalp microcirculation for density.",
      },
      {
        name: "burdock root extract",
        benefit: "sebum regulation. keeps scalp in clean equilibrium between washes.",
      },
    ],
    usageSteps: [
      {
        index: "01",
        label: "massage",
        description: "apply to wet hair and scalp. work in with fingertips using circular pressure to activate the formula.",
      },
      {
        index: "02",
        label: "cleanse",
        description: "lather for 60 seconds minimum. allow actives full contact time with the scalp.",
      },
      {
        index: "03",
        label: "rinse",
        description: "rinse thoroughly with lukewarm water. follow immediately with CORE. conditioner for the complete system.",
      },
    ],
    inci: "Aloe Barbadensis (Aloe) Leaf Juice➀, Lauryl Glucoside, Sodium Coco-Sulfate, Aqua/Water, Citric Acid, Disodium Cocoyl Glutamate, Sodium PCA, Coco-Glucoside, Glyceryl Oleate, Butylene Glycol, Parfum/Fragrance, Benzyl Alcohol, Sodium Cocoyl Glutamate, Sodium Benzoate, Glycerin, Potassium Sorbate, Crambe Maritima (Sea Kale) Leaf Extract, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Arctium Lappa (Burdock) Root Extract➀, Linalool➁, Limonene➁",
    inciNote: "➀ organic farming  |  ➁ naturally occurring in fragrance",
    faqs: [
      {
        question: "does the scent contain phthalates?",
        answer: "no. our perfume compositions are 100% free of phthalates and built from natural raw materials.",
      },
      {
        question: "can this be combined with conditioner?",
        answer: "yes. use the CORE. conditioner immediately after washing to enhance softness and shine.",
      },
      {
        question: "can it be used with scalp scrubs?",
        answer: "yes. use this shampoo after a scrub to cleanse and calm the scalp.",
      },
    ],
    images: [
      { src: "/images/shampoo-front.png", alt: "CORE. daily balancing shampoo - front" },
      { src: "/images/shampoo-back.png", alt: "CORE. daily balancing shampoo - back" },
    ],
  },
  {
    id: "conditioner-290",
    slug: "daily-nourishing-conditioner",
    unit: "unit 02",
    name: "daily nourishing conditioner",
    fullName: "CORE. daily nourishing conditioner",
    size: "290 ml / 9.81 fl oz",
    price: getActivePrice("conditioner-290"),
    function: "repair, lipids & weightless seal",
    tagline: "repair. seal. natural shine. no weight.",
    targetAudience: "all hair types. helps repair dry ends and gives a natural shine without weighing the hair down.",
    scent: "juicy fruits / warm woods",
    naturalOrigin: "98%",
    certifications: [
      { label: "vegan", icon: "/icons/vegan.svg" },
      { label: "nut-free", icon: "/icons/ban.svg" },
      { label: "ecocert cosmos natural", icon: "/icons/leaf.svg" },
    ],
    claims: [
      "nut-free",
      "vegan",
      "ecocert cosmos natural certified",
      "98% natural origin",
      "11% organic",
      "silicone-free",
    ],
    actives: [
      {
        name: "aloe vera juice",
        benefit: "hydration delivery system. binds moisture into the cortex layer.",
      },
      {
        name: "hydrolyzed wheat protein",
        benefit: "structural repair. fills micro-damage along the hair shaft surface.",
      },
      {
        name: "argan oil",
        benefit: "lipid restoration. seals the cuticle for shine without grease.",
      },
      {
        name: "sea kale extract",
        benefit: "marine mineral complex. fortifies and thickens each strand.",
      },
      {
        name: "ginkgo biloba leaf extract",
        benefit: "antioxidant defense. protects against oxidative strand degradation.",
      },
      {
        name: "burdock root extract",
        benefit: "scalp carry-on benefit. extends the equilibrium from your shampoo step.",
      },
    ],
    usageSteps: [
      {
        index: "01",
        label: "apply",
        description: "after shampooing, apply generously from mid-length to ends. avoid direct scalp application.",
      },
      {
        index: "02",
        label: "nourish",
        description: "leave for 1-2 minutes. use a wide-tooth comb to distribute evenly through strands.",
      },
      {
        index: "03",
        label: "rinse",
        description: "rinse thoroughly with cool water to lock in the cuticle-sealing effect.",
      },
    ],
    inci: "Aloe Barbadensis (Aloe) Leaf Juice➀, Cetearyl Alcohol, Aqua, Glycerin, Distearoylethyl Dimonium Chloride, Betaine, Cocos Nucifera (Coconut) Oil➀, Sodium PCA, Parfum, Tocopherol, Butylene Glycol, Benzyl Alcohol, Guar Hydroxypropyltrimonium Chloride, Hydrolyzed Wheat Protein, Sodium Benzoate, Lactic Acid, Argania Spinosa (Argan) Kernel Oil➀, Potassium Sorbate, Crambe Maritima (Sea Kale) Leaf Extract, Citric Acid, Arctium Lappa (Burdock) Root Extract➀, Ginkgo Biloba (Gingko) Leaf Extract➀, Linalool, Limonene",
    inciNote: "➀ organic farming",
    faqs: [
      {
        question: "does it help detangle hair?",
        answer: "yes. it softens the hair strands making combing easier and reducing breakage.",
      },
      {
        question: "does it enhance hair shine?",
        answer: "yes. the smoothing properties provide a healthy, natural shine.",
      },
      {
        question: "suitable for dry or damaged hair?",
        answer: "yes. it restores softness and improves hair manageability.",
      },
    ],
    images: [
      { src: "/images/conditioner-front.png", alt: "CORE. daily nourishing conditioner - front" },
      { src: "/images/conditioner-back.png", alt: "CORE. daily nourishing conditioner - back" },
    ],
  },
];

export function getProductBySlug(slug: string): ProductPageData | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
