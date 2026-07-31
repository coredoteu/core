import Image from "next/image";

type Marker = {
  icon: string;
  label: string;
  top: string;
  left: string;
};

export default function ProductHoverViewer({
  frontSrc,
  backSrc,
  alt,
  markers,
}: {
  frontSrc: string;
  backSrc: string;
  alt: string;
  markers: Marker[];
}) {
  return (
    <div className="group relative aspect-[3/4] w-full max-w-xs mx-auto focus-within:outline-none">
      <div className="absolute inset-6 border border-white/10" />

      <Image
        src={frontSrc}
        alt={`${alt}, front label`}
        fill
        className="object-contain p-10 transition-opacity duration-500 opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0"
        sizes="(min-width: 768px) 320px, 70vw"
      />
      <Image
        src={backSrc}
        alt={`${alt}, ingredient panel`}
        fill
        className="object-contain p-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        sizes="(min-width: 768px) 320px, 70vw"
      />

      {markers.map((m) => (
        <div
          key={m.label}
          className="absolute flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500"
          style={{ top: m.top, left: m.left }}
        >
          <span className="h-px w-4 bg-white/40" />
          <span className="flex items-center gap-1.5 border border-white/20 bg-[#0D0D0D]/90 backdrop-blur-sm px-2 py-1">
            <img src={m.icon} alt="" className="h-3 w-3 opacity-70" />
            <span className="text-[10px] font-mono tracking-[0.1em] text-white/80 lowercase whitespace-nowrap">
              [ {m.label} ]
            </span>
          </span>
        </div>
      ))}

      <button
        type="button"
        tabIndex={0}
        aria-label={`inspect ${alt}`}
        className="absolute inset-0 cursor-default focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      />

      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-[0.2em] text-white/25 lowercase whitespace-nowrap">
        [ hover to inspect ]
      </span>
    </div>
  );
}
