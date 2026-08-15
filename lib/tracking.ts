type Carrier = "postnl" | "dhl";

function carrierForOrder(orderId: string): Carrier {
  const sum = orderId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return sum % 2 === 0 ? "postnl" : "dhl";
}

function trackingNumberForOrder(orderId: string, carrier: Carrier) {
  const digits = orderId.replace(/-/g, "").slice(0, 10).toUpperCase();
  return carrier === "postnl" ? `3S${digits}NL` : `JD${digits}DE`;
}

const STAGE_ORDER = ["picked_up", "in_transit", "out_for_delivery", "delivered"] as const;

export function buildMockTrackingPayload(order: {
  id: string;
  created_at: string;
  shipping_details?: any;
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipping_status?: string;
}) {
  const country = order.shipping_details?.address?.country ?? "NL";

  if (order.tracking_number && order.tracking_url) {
    const status = order.shipping_status || "in_transit";
    const stageIndex = STAGE_ORDER.indexOf(status as any);

    return {
      orderId: order.id,
      carrier: (order.carrier || "postnl").toLowerCase(),
      trackingNumber: order.tracking_number,
      trackingUrl: order.tracking_url,
      currentStatus: status as any,
      checkpoints: [
        { status: "label_created", at: order.created_at },
        ...(stageIndex >= 0
          ? STAGE_ORDER.slice(0, stageIndex + 1).map((s) => ({
              status: s,
              at: new Date().toISOString(),
            }))
          : []),
      ],
      estimatedDeliveryAt: new Date(
        new Date(order.created_at).getTime() + 72 * 3_600_000,
      ).toISOString(),
      destinationCountry: country,
    };
  }

  const carrier = carrierForOrder(order.id);
  const trackingNumber = trackingNumberForOrder(order.id, carrier);
  const isDomestic = country === "NL" || country === "BE";

  const hoursSinceOrder = (Date.now() - new Date(order.created_at).getTime()) / 3_600_000;

  const stageHours = isDomestic
    ? { picked_up: 24, in_transit: 36, out_for_delivery: 60, delivered: 72 }
    : { picked_up: 24, in_transit: 48, out_for_delivery: 96, delivered: 120 };

  let currentStatus: "label_created" | (typeof STAGE_ORDER)[number] = "label_created";
  for (const stage of STAGE_ORDER) {
    if (hoursSinceOrder >= stageHours[stage]) currentStatus = stage;
  }

  const checkpoints = [
    { status: "label_created", at: order.created_at },
    ...STAGE_ORDER.filter((s) => hoursSinceOrder >= stageHours[s]).map((s) => ({
      status: s,
      at: new Date(new Date(order.created_at).getTime() + stageHours[s] * 3_600_000).toISOString(),
    })),
  ];

  return {
    orderId: order.id,
    carrier,
    trackingNumber,
    trackingUrl:
      carrier === "postnl"
        ? `https://postnl.nl/tracktrace/?B=${trackingNumber}`
        : `https://www.dhl.com/nl-en/home/tracking.html?tracking-id=${trackingNumber}`,
    currentStatus,
    checkpoints,
    estimatedDeliveryAt: new Date(
      new Date(order.created_at).getTime() + stageHours.delivered * 3_600_000,
    ).toISOString(),
    destinationCountry: country,
  };
}
