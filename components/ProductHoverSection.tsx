import ProductHoverViewer from "./ProductHoverViewer";

const shampooMarkers = [
  { icon: "/icons/cylinder.svg",       label: "vol: 290ml",       top: "8%",  left: "-10%" },
  { icon: "/icons/flask-conical.svg",label: "ph 4.5 - 5.5",     top: "46%", left: "80%"  },
  { icon: "/icons/dropper.svg",      label: "precise dosage",   top: "86%", left: "-10%" },
];

const conditionerMarkers = [
  { icon: "/icons/cylinder.svg",       label: "vol: 290ml",       top: "8%",  left: "82%" },
  { icon: "/icons/flask-conical.svg",label: "ph 4.5 - 5.5",     top: "46%", left: "-14%" },
  { icon: "/icons/dropper.svg",      label: "precise dosage",   top: "86%", left: "82%" },
];

export default function ProductHoverSection() {
  return (
    <section className="relative max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-36 border-b border-white/10">
      <div className="flex items-center gap-4 mb-14">
        <span className="font-mono text-xs tracking-[0.2em] text-white/40">
          03 //
        </span>
        <h2 className="text-3xl md:text-4xl font-light lowercase text-white">
          every angle, every active.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-10">
        <div>
          <span className="block text-center text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase mb-8">
            unit 01 / shampoo
          </span>
          <ProductHoverViewer
            frontSrc="/images/shampoo-front.png"
            backSrc="/images/shampoo-back.png"
            alt="CORE. daily balancing shampoo"
            markers={shampooMarkers}
          />
        </div>
        <div>
          <span className="block text-center text-[10px] font-mono tracking-[0.2em] text-white/30 lowercase mb-8">
            unit 02 / conditioner
          </span>
          <ProductHoverViewer
            frontSrc="/images/conditioner-front.png"
            backSrc="/images/conditioner-back.png"
            alt="CORE. daily nourishing conditioner"
            markers={conditionerMarkers}
          />
        </div>
      </div>
    </section>
  );
}
