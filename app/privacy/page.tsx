import Link from "next/link";

export default function PrivacyPage() {
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
          privacy policy.
        </h1>
        <p className="text-sm text-neutral-500 mb-16">last updated: august 2026.</p>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-xl text-white">data controller.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>CORE. / bycore.eu (<a href="mailto:contact@bycore.eu" className="text-white hover:underline transition-all">contact@bycore.eu</a>).</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">data collection.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>we collect essential shipping and billing details (name, address, email, phone number) to fulfill your order.</p>
              <p>payments are processed securely via stripe. CORE. does not store credit card or banking details.</p>
              <p>technical data, such as ip addresses and functional cookies, is collected to ensure optimal store performance.</p>
            </div>
          </section>

          <hr className="border-white/10" />
          
          <section className="space-y-6">
            <h2 className="text-xl text-white">cookies & analytics.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>we use functional cookies to operate our store. in the future, we may use analytical tools (like google analytics) and marketing cookies to understand our traffic and improve our services.</p>
              <p>you can manage or disable non-essential cookies through your browser settings at any time.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">processing purpose.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>your data is used strictly to process orders, handle customer service, manage guarantee claims, and meet legal obligations.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">third-party sharing.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>data is shared only with essential service providers: logistics partners (postnl/dhl) and payment processors (stripe). we never sell your data.</p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">your rights.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>under gdpr, you have the right to inspect, correct, or delete your personal data. submit requests to <a href="mailto:contact@bycore.eu" className="text-white hover:underline transition-all">contact@bycore.eu</a>.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
