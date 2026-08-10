"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

function PageTracker({ hasConsent, gaId }: { hasConsent: boolean; gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasConsent || !gaId || typeof window === "undefined") return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    if (window.gtag) {
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, hasConsent, gaId]);

  return null;
}

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    // Check initial consent on mount
    const consent = localStorage.getItem("core-cookie-consent");
    if (consent === "accepted") {
      setHasConsent(true);
    }

    // Listen for custom event when consent is granted
    const handleConsentGranted = () => {
      setHasConsent(true);
    };

    window.addEventListener("core-consent-granted", handleConsentGranted);
    return () => {
      window.removeEventListener("core-consent-granted", handleConsentGranted);
    };
  }, []);

  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {hasConsent && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      <Suspense fallback={null}>
        <PageTracker hasConsent={hasConsent} gaId={GA_MEASUREMENT_ID} />
      </Suspense>
    </>
  );
}

