import Navbar from "@/components/layout/Navbar";

export default function RefundsPage() {
  return (
    <main className="min-h-screen bg-[#0D0D0D] text-white font-sans">
      <Navbar />
      <section className="pt-32 md:pt-44 pb-16 md:pb-24 border-b border-hairline">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs tracking-[0.2em] text-text-muted">
              legal //
            </span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight lowercase">
              return & refund policy
            </h1>
            <p className="text-sm text-text-muted lowercase leading-relaxed">
              last updated: august 2026
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-10 prose prose-invert prose-p:text-text-muted prose-p:lowercase prose-h2:lowercase prose-h2:font-light prose-h2:tracking-tight prose-a:text-white prose-a:lowercase">
          <h2>1. Returns</h2>
          <p>[boilerplate return policy. to be filled in by legal team.]</p>
          <h2>2. Refunds</h2>
          <p>[boilerplate refund processing times and conditions. to be filled in by legal team.]</p>
          <h2>3. Shipping Costs</h2>
          <p>[boilerplate information regarding return shipping costs. to be filled in by legal team.]</p>
          <h2>4. Damaged Items</h2>
          <p>[boilerplate policy for items damaged in transit. to be filled in by legal team.]</p>
        </div>
      </section>
    </main>
  );
}
