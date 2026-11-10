import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

// The studio relies on browser storage and Web Workers, so it renders after hydration.
const WinmixApp = lazy(() => import("../WinmixApp").then((m) => ({ default: m.App })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WinMix — Match Intelligence & Analytics" },
      {
        name: "description",
        content:
          "Virtual football match intelligence: walk-forward predictions, calibration, league analysis and decision ledger.",
      },
      { property: "og:title", content: "WinMix — Match Intelligence & Analytics" },
      {
        property: "og:description",
        content:
          "Virtual football match intelligence: walk-forward predictions, calibration, league analysis and decision ledger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
      <span className="animate-signal-pulse">WinMix betöltése…</span>
    </div>
  );
}

function Index() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>
        <WinmixApp />
      </Suspense>
    </ClientOnly>
  );
}
