import { Icon } from "@/components/ui/Icon";

export function SectionHeader({
  index,
  title,
  icon,
  variant = "default",
}: {
  index: string;
  title: string;
  icon?: string;
  variant?: "default" | "compact";
}) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <span className="font-mono text-xs tracking-[0.2em] text-white/40 shrink-0">
        {index} {"//"}
      </span>
      {icon && <Icon src={icon} size={13} opacity={0.2} />}
      {variant === "compact" ? (
        <>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-mono tracking-[0.25em] text-white/30 lowercase shrink-0">
            {title}
          </span>
        </>
      ) : (
        <h2 className="text-3xl md:text-4xl font-light tracking-tight lowercase text-white">
          {title}
        </h2>
      )}
    </div>
  );
}
