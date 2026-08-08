export type Unit = "shampoo" | "conditioner";

export type Active = {
  code: string;
  name: string;
  desc: string;
  icon: string;
  organic: boolean;
  units: Unit[];
};

export const CORE_ACTIVES: Active[] = [
  {
    code: "act.01",
    name: "aloe barbadensis leaf juice",
    desc: "hydration delivery system. binds moisture into the scalp and cortex layer.",
    icon: "/icons/droplet.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.02",
    name: "crambe maritima (sea kale) leaf extract",
    desc: "marine mineral fortification. supports scalp equilibrium and strand structure.",
    icon: "/icons/waves-horizontal.svg",
    organic: false,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.03",
    name: "ginkgo biloba leaf extract",
    desc: "circulatory activator. antioxidant defense at the follicle.",
    icon: "/icons/activity.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.04",
    name: "arctium lappa (burdock) root extract",
    desc: "sebum regulation. root-level strength between washes.",
    icon: "/icons/waterdrops.svg",
    organic: true,
    units: ["shampoo", "conditioner"],
  },
  {
    code: "act.05",
    name: "hydrolyzed wheat protein",
    desc: "structural repair. fills micro-damage along the strand surface.",
    icon: "/icons/wheat.svg",
    organic: false,
    units: ["conditioner"],
  },
  {
    code: "act.06",
    name: "argania spinosa (argan) kernel oil",
    desc: "lipid restoration. seals the cuticle for shine without weight.",
    icon: "/icons/droplets.svg",
    organic: true,
    units: ["conditioner"],
  },
];

export const SHAMPOO_INGREDIENT_LIST = [
  {
    code: "sh.01",
    name: "aloe barbadensis leaf juice",
    desc: "hydrates the scalp directly and calms irritation on contact.",
  },
  {
    code: "sh.02",
    name: "lauryl & coco-glucoside cleansing base",
    desc: "mild coconut-derived cleansers that foam without stripping.",
  },
  {
    code: "sh.03",
    name: "crambe maritima (sea kale) leaf extract",
    desc: "marine-derived antioxidant that supports scalp equilibrium.",
  },
  {
    code: "sh.04",
    name: "ginkgo biloba leaf extract",
    desc: "organically farmed, supports micro-circulation at the follicle.",
  },
  {
    code: "sh.05",
    name: "arctium lappa (burdock) root extract",
    desc: "organically farmed, strengthens strand structure from the root.",
  },
];

export const CONDITIONER_INGREDIENT_LIST = [
  {
    code: "co.01",
    name: "hydrolyzed wheat protein",
    desc: "rebuilds strand structure from the outside in.",
  },
  {
    code: "co.02",
    name: "argania spinosa (argan) kernel oil",
    desc: "organically farmed, deep lipid nourishment without weight.",
  },
  {
    code: "co.03",
    name: "aloe barbadensis leaf juice",
    desc: "core hydration carried through from the shampoo step.",
  },
  {
    code: "co.04",
    name: "crambe maritima & burdock root extract",
    desc: "antioxidant support paired with root-level strength.",
  },
  {
    code: "co.05",
    name: "ginkgo biloba leaf extract",
    desc: "organically farmed, closes the system with circulation support.",
  },
];

export const CLINICAL_SPECS = [
  { icon: "/icons/flask-conical.svg", key: "ph range", value: "4.5 - 5.5" },
  { icon: "/icons/leaf.svg", key: "natural origin", value: "98 - 99%" },
  { icon: "/icons/ban.svg", key: "silicones", value: "0" },
  { icon: "/icons/ban.svg", key: "sulfates (sls)", value: "0" },
  {
    icon: "/icons/medal-star.svg",
    key: "organic-farmed actives",
    value: "4 / 6",
  },
  {
    icon: "/icons/map-pin-check.svg",
    key: "formulated",
    value: "netherlands / eu",
  },
  { icon: "/icons/scan.svg", key: "inci standard", value: "eu 1223/2009" },
  {
    icon: "/icons/microscope.svg",
    key: "batch validation",
    value: "per production run",
  },
];

export const CORE_BADGES = [
  { icon: "/icons/vegan.svg", label: "vegan" },
  { icon: "/icons/badge-check.svg", label: "cruelty-free" },
  { icon: "/icons/ban.svg", label: "nut-free" },
  { icon: "/icons/ban.svg", label: "gluten-free" },
  { icon: "/icons/ban.svg", label: "silicone-free" },
  { icon: "/icons/leaf.svg", label: "ecocert cosmos natural" },
];

export const SCIENCE_FAQS = [
  {
    q: "why declare an exact ph range?",
    a: "hair and scalp sit naturally around ph 4.5 to 5.5. we formulate inside that range so the system supports the barrier instead of stripping it. most mainstream shampoos sit closer to ph 7 or higher.",
  },
  {
    q: "what does 'organically farmed' mean on the label?",
    a: "four of our six core actives, aloe, ginkgo biloba, burdock root and argan oil, are sourced from certified organic farming. it is marked on every inci list with a dedicated symbol.",
  },
  {
    q: "how is each batch validated?",
    a: "every production run is checked for ph, viscosity and raw material traceability before it clears for bottling. nothing ships without a pass.",
  },
  {
    q: "why only six core actives?",
    a: "each one is declared at a functional concentration. we do not pad the formula with filler actives at trace percentages just to lengthen a label.",
  },
];
