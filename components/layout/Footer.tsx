import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1 flex justify-center sm:justify-start">
          <Link href="/" aria-label="CORE. home" className="flex items-baseline gap-3 group">
            <Image
              src="/CORE_logo_trans.svg"
              alt="CORE."
              width={64}
              height={15}
              className="h-3.5 w-auto opacity-40 group-hover:opacity-70 transition-opacity duration-300"
            />
            <span className="text-[10px] text-text-muted font-mono tracking-[0.1em] opacity-80 group-hover:opacity-100 transition-opacity duration-300 lowercase hidden sm:inline-block">
              refined to the core.
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {["shop", "science", "roadmap", "cart"].map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="text-xs tracking-[0.15em] text-text-muted hover:text-white transition-colors duration-300 lowercase"
            >
              {l}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-center sm:justify-end">
          <span className="text-[10px] text-text-muted font-mono tracking-[0.1em] text-center sm:text-right">
            © {new Date().getFullYear()} CORE.
          </span>
        </div>
      </div>
    </footer>
  );
}
