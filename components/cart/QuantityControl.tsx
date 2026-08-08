export function QuantityControl({
  quantity,
  onDecrement,
  onIncrement,
  size = "md",
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  return (
    <div className="flex items-center border border-hairline">
      <button
        onClick={onDecrement}
        aria-label="decrease quantity"
        className={`min-w-[44px] min-h-[44px] ${dim} flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors duration-200 text-xs font-mono focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60`}
      >
        −
      </button>
      <span
        className={`${dim} flex items-center justify-center text-xs font-mono text-white tabular-nums`}
      >
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        aria-label="increase quantity"
        className={`min-w-[44px] min-h-[44px] ${dim} flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors duration-200 text-xs font-mono focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/60`}
      >
        +
      </button>
    </div>
  );
}
