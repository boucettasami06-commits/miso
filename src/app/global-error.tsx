"use client";

import "./globals.css";
import { ErrorScreen } from "@/components/ErrorScreen";

export default function GlobalError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="bg-cream text-ink">
        <ErrorScreen {...props} />
      </body>
    </html>
  );
}
