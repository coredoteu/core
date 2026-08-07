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
        
        <h1 className="text-4xl font-normal text-white tracking-tight mb-4">
          terms of service.
        </h1>
        <p className="text-sm text-neutral-500 mb-16">last updated: august 2026.</p>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-xl text-white">company details.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>CORE. operates under the following details:</p>
              <div className="space-y-1">
                <p>business address: [business address placeholder]</p>
                <p>kvk number: [kvk number placeholder]</p>
                <p>vat number: [vat number placeholder]</p>
                <p>email: <a href="mailto:contact@bycore.eu" className="text-white hover:underline transition-all">contact@bycore.eu</a></p>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

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
            <h2 className="text-xl text-white">statutory right of withdrawal.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>eu consumers have a statutory 14-day right of withdrawal. our 30-day risk-free guarantee extends and replaces this minimum legal requirement, giving you more time to decide.</p>
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
            <h2 className="text-xl text-white">governing law & disputes.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>these terms are governed by european union and dutch consumer laws.</p>
              <p>the european commission provides a platform for consumer redress and dispute resolution bodies, available at <a href="https://consumer-redress.ec.europa.eu/dispute-resolution-bodies" target="_blank" rel="noopener noreferrer" className="text-white hover:underline transition-all">consumer-redress.ec.europa.eu</a>.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
