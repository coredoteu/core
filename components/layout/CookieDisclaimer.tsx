"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CookieDisclaimer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("core-cookie-consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#0D0D0D] border-t border-hairline p-4 md:p-6 shadow-2xl">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-text-muted lowercase leading-relaxed max-w-2xl">
            we use cookies to ensure you get the best experience on our website.
            by continuing to browse the site, you agree to our use of cookies
            and our{" "}
            <Link
              href="/privacy"
              className="text-white underline underline-offset-2"
            >
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="solid"
            className="w-full md:w-auto text-xs py-3 px-6"
            onClick={() => {
              localStorage.setItem("core-cookie-consent", "accepted");
              setShow(false);
            }}
          >
            accept
          </Button>
          <Button
            variant="outline"
            className="w-full md:w-auto text-xs py-3 px-6"
            onClick={() => {
              localStorage.setItem("core-cookie-consent", "declined");
              setShow(false);
            }}
          >
            decline
          </Button>
        </div>
      </div>
    </div>
  );
}
