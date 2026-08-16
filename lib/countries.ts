// lib/countries.ts
// ISO-3166 alpha-2 → display name, for anonymized country-only surfaces
// (the backer ledger). Deliberately never resolves city/street — that data
// is never passed to this function in the first place.

const COUNTRY_NAMES: Record<string, string> = {
  NL: "netherlands",
  BE: "belgium",
  DE: "germany",
  FR: "france",
  GB: "united kingdom",
  US: "united states",
  IT: "italy",
  ES: "spain",
  AT: "austria",
  CH: "switzerland",
  IE: "ireland",
  PT: "portugal",
  SE: "sweden",
  DK: "denmark",
  NO: "norway",
  FI: "finland",
  PL: "poland",
  LU: "luxembourg",
};

export function countryNameFromCode(code?: string | null): string {
  if (!code) return "unknown";
  const upper = code.trim().toUpperCase();
  return COUNTRY_NAMES[upper] ?? upper.toLowerCase();
}
