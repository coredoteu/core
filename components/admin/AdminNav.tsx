import Link from "next/link";
import Image from "next/image";
import SignOutButton from "@/components/account/SignOutButton";

export default function AdminNav({ email }: { email: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-[#0D0D0D]/90 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="flex items-baseline gap-2.5"
          aria-label="CORE. admin"
        >
          <Image
            src="/CORE_logo_trans.svg"
            alt="CORE."
            width={70}
            height={16}
            className="h-4 w-auto"
          />
          <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 lowercase">
            admin / system console
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono text-[10px] text-white/40 lowercase truncate max-w-[220px]">
            {email}
          </span>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
