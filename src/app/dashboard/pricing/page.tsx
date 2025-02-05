"use client";

import { InputProvider } from "@/context/input-context";
import { PricingDashboard } from "./components/pricing-dashboard";

export default function PricingPage() {
  return (
    <InputProvider>
      <div className="px-6">
        <PricingDashboard />
      </div>
    </InputProvider>
  );
}
