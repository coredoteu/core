import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] font-sans text-neutral-400">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition-colors mb-12">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          back to home.
        </Link>
        
        <h1 className="text-4xl font-normal text-white tracking-tight mb-16">
          terms of service.
        </h1>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-xl text-white">applicability.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>these terms govern all orders, purchases, and agreements on bycore.eu.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">pricing & payment.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>prices are in eur (€) and include vat. shipping costs are excluded.</p>
              <p>all payments are processed securely via stripe.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">usage & liability.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>products must be used exactly as directed on the packaging.</p>
              <p>review the inci ingredient list before use if you have known allergies. CORE. is not liable for allergic reactions caused by undisclosed sensitivities.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">intellectual property.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>all visual assets, logos, photography, formulas, and text on bycore.eu are the exclusive property of CORE.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">governing law.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>these terms are governed by european union and dutch consumer laws.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
