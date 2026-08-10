import Link from "next/link";

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] font-sans text-neutral-400">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-white transition-colors mb-12"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          back to home.
        </Link>

        <h1 className="text-4xl font-normal text-white tracking-tight mb-4">
          returns & guarantee.
        </h1>
        <p className="text-sm text-neutral-500 mb-16">
          last updated: august 2026.
        </p>

        <div className="space-y-16">
          <section className="space-y-6">
            <h2 className="text-xl text-white">30-day risk-free guarantee.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                our guarantee allows you to try our products and request a
                refund if unsatisfied within 30 days of delivery. this policy is
                strictly limited to one use per product type per customer.
              </p>
              <p>
                <span className="text-white">the duo:</span> claiming the
                guarantee on "the duo" exhausts your eligibility. you cannot
                claim it again for "the duo" or any single bottles.
              </p>
              <p>
                <span className="text-white">single bottles:</span> you may
                claim the guarantee exactly once for the shampoo and once for
                the conditioner.
              </p>
              <p>
                <span className="text-white">partial duo claims:</span> if you
                previously claimed the guarantee on a single bottle and later
                claim it on "the duo", you will receive a 50% refund on the duo
                price (calculated after deducting the standard € 5,95 processing
                fee).
              </p>
              <p>
                a € 5,95 processing fee is deducted from all guarantee refunds
                to cover logistics. opened bottles do not need to be returned.
                to claim, email your order number and feedback to{" "}
                <a
                  href="mailto:contact@bycore.eu"
                  className="text-white hover:underline transition-all"
                >
                  contact@bycore.eu
                </a>
                .
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">unopened items.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                any unopened item can be returned for a refund within 30 days of
                delivery, regardless of whether it is a first purchase or a
                repeat order.
              </p>
              <p>
                to qualify, products must remain entirely unused, sealed, and in
                their original packaging.
              </p>
              <p>
                contact{" "}
                <a
                  href="mailto:contact@bycore.eu"
                  className="text-white hover:underline transition-all"
                >
                  contact@bycore.eu
                </a>{" "}
                prior to returning your package to receive shipping
                instructions. return shipping costs are the responsibility of
                the customer.
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-6">
            <h2 className="text-xl text-white">damaged or incorrect items.</h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                if your order arrives damaged or incorrect, email a photo to{" "}
                <a
                  href="mailto:contact@bycore.eu"
                  className="text-white hover:underline transition-all"
                >
                  contact@bycore.eu
                </a>{" "}
                for an immediate, free replacement.
              </p>
            </div>
          </section>
        </div>

        <hr className="border-white/10 my-16" />

        <section className="space-y-6">
          <h2 className="text-xl text-white">model withdrawal form.</h2>
          <div className="space-y-4 leading-relaxed text-sm">
            <p>
              (complete and return this form only if you wish to withdraw from
              the contract)
            </p>
            <div className="p-6 bg-white/5 rounded-lg border border-white/10 font-mono text-xs">
              <p>To: CORE. [Insert Business Address / Email]</p>
              <br />
              <p>
                I/We [*] hereby give notice that I/We [*] withdraw from my/our
                [*] contract of sale of the following goods [*],
              </p>
              <br />
              <p>Ordered on [*]/received on [*],</p>
              <br />
              <p>Name of consumer(s),</p>
              <br />
              <p>Address of consumer(s),</p>
              <br />
              <p>Signature of consumer(s) (only if notified on paper),</p>
              <br />
              <p>Date</p>
              <br />
              <p className="text-neutral-500">[*] Delete as appropriate.</p>
            </div>
            <p>
              You can also easily submit your withdrawal by emailing us at{" "}
              <a
                href="mailto:contact@bycore.eu"
                className="text-white hover:underline transition-all"
              >
                contact@bycore.eu
              </a>{" "}
              with your order number.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
