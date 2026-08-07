export function Icon({
  src,
  size = 16,
  opacity = 0.4,
  className = "",
  invert = true,
}: {
  src: string;
  size?: number;
  opacity?: number;
  className?: string;
  invert?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        opacity,
        filter: invert ? "brightness(0) invert(1)" : "brightness(0)",
        flexShrink: 0,
      }}
    />
  );
}
