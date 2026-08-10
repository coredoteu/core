import { Icon } from "@/components/ui/Icon";
import { CATALOG } from "@/lib/catalog";
import Image from "next/image";

type OrderItem = {
  id: string;
  product_id: string | null;
  quantity: number;
  price_at_purchase: number;
};

type OrderRecord = {
  id: string;
  stripe_session_id: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  created_at: string;
  shipping_details?: { name?: string; address?: { city?: string; country?: string } } | null;
  order_items?: OrderItem[];
};

function formatRef(order: OrderRecord) {
  return order.id.slice(0, 8).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })
    .toLowerCase();
}

function StatusPill({ status }: { status: string }) {
  const isActive = status === 'paid' || status === 'succeeded' || status === 'processing';
  return (
    <div className="flex items-center gap-2 border border-hairline bg-white/[0.01] px-2.5 py-1">
      <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white/80 shadow-[0_0_6px_rgba(255,255,255,0.6)] animate-pulse' : 'bg-white/20'}`} />
      <span className="font-mono text-[9px] tracking-[0.25em] text-white/60 lowercase leading-none pt-px">
        {status}
      </span>
    </div>
  );
}

function SingleOrder({ order }: { order: OrderRecord }) {
  const items = order.order_items ?? [];
  return (
    <div className="border border-hairline bg-[#0A0A0A]/80 backdrop-blur-md w-full shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-hairline bg-white/[0.01]">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 lowercase">
            order / #{formatRef(order)}
          </span>
          <span className="font-mono text-[9px] tracking-[0.15em] text-white/30 lowercase">
            {formatDate(order.created_at)}
          </span>
        </div>
        <StatusPill status={order.payment_status} />
      </div>

      {items.length > 0 && (
        <div className="divide-y divide-hairline">
          {items.map((item) => {
            const product = CATALOG.find((p) => p.id === item.product_id);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3 gap-4"
              >
                <div className="flex items-center gap-4 truncate">
                  {product?.image ? (
                    <div className="w-8 h-10 shrink-0 relative bg-white/[0.02] border border-hairline flex items-center justify-center">
                      <Image src={product.image} alt={product.name} fill sizes="32px" className="object-contain p-1 opacity-90 drop-shadow-sm" />
                    </div>
                  ) : (
                    <div className="w-8 h-10 shrink-0 bg-white/[0.02] border border-hairline" />
                  )}
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-white/80 lowercase truncate tracking-wide">
                      <span className="uppercase text-white font-medium">CORE.</span>{" "}
                      {product?.name ?? item.product_id ?? "item"}
                    </span>
                    {product?.size && (
                      <span className="font-mono text-[9px] tracking-wider text-white/40 mt-1">{product.size}</span>
                    )}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-white/40 shrink-0 border border-hairline px-1.5 py-0.5 bg-white/[0.02]">
                  ×{item.quantity}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between px-5 py-3.5 border-t border-hairline bg-white/[0.01]">
        <span className="font-mono text-[9px] tracking-[0.2em] text-white/40 lowercase">
          total
        </span>
        <span className="text-[13px] tracking-wide font-light text-white tabular-nums">
          €{order.amount_total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function OrderSummaryCard({
  orders,
  order,
}: {
  orders?: OrderRecord[];
  order?: OrderRecord;
}) {
  const list = orders ?? (order ? [order] : []);
  if (list.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-3">
        {list.map((o) => (
          <SingleOrder key={o.id} order={o} />
        ))}
      </div>
    </div>
  );
}
