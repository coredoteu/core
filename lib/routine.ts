export type HairType = "oily" | "dry" | "normal" | "damaged" | "fine" | "thick";
export type ScalpCondition = "balanced" | "oily" | "dry" | "sensitive" | "flaky";
export type Concern = "frizz" | "breakage" | "volume" | "shine" | "dandruff" | "color-treated";

export function buildRoutine({
  hairType,
  scalpCondition = "balanced",
  concerns = [],
}: {
  hairType: HairType;
  scalpCondition?: ScalpCondition;
  concerns?: Concern[];
}) {
  const washesPerWeek = scalpCondition === "oily" ? 4 : scalpCondition === "dry" ? 2 : 3;
  const conditionerFocus =
    hairType === "dry" || hairType === "damaged" || concerns.includes("breakage")
      ? "ends"
      : "mid-lengths to ends";
  const waitMinutes = hairType === "damaged" || concerns.includes("breakage") ? 3 : 2;

  const steps = [
    {
      order: 1,
      product: "shampoo-290",
      action: "massage",
      detail:
        scalpCondition === "sensitive"
          ? "gentle circular massage, avoid vigorous scrubbing on the scalp."
          : "massage vigorously into wet scalp for 60 seconds to activate the formula.",
    },
    { order: 2, product: "shampoo-290", action: "rinse", detail: "rinse thoroughly with lukewarm water until it runs clear." },
    { order: 3, product: "conditioner-290", action: "apply", detail: `apply through the ${conditionerFocus}, avoiding the scalp.` },
    { order: 4, product: "conditioner-290", action: "wait", detail: `leave in for ${waitMinutes} minutes to let actives penetrate the cuticle.` },
    { order: 5, product: "conditioner-290", action: "rinse", detail: "rinse with cool water to seal the cuticle and lock in shine." },
  ];

  const notes: string[] = [];
  if (concerns.includes("dandruff") || scalpCondition === "flaky") {
    notes.push("space washes evenly across the week; consistency matters more than frequency for scalp equilibrium.");
  }
  if (concerns.includes("color-treated")) {
    notes.push("use cool water on the final rinse to help protect color vibrancy.");
  }
  if (hairType === "fine") {
    notes.push("apply conditioner from mid-length down only, keeping roots product-free.");
  }

  return { hairType, scalpCondition, concerns, washesPerWeek, steps, notes, recommendedSystem: "duo-system-001" };
}
