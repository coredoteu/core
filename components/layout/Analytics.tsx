"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

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

  if (!hasConsent) return null;

  // Replace 'G-XXXXXXXXXX' with the actual Google Analytics Measurement ID
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

  return (
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
  );
}
