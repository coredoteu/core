export function Icon({
  src,
  size = 16,
  opacity = 0.4,
  className = "",
}: {
  src: string;
  size?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, opacity, filter: "brightness(0) invert(1)", flexShrink: 0 }}
    />
  );
}
