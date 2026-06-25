"use client";

import { useState } from "react";

export function CheckoutButton({
  priceId,
  planName,
  canChange,
}: {
  priceId: string;
  planName: string;
  canChange: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!canChange || !priceId) return;
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!canChange || loading}
      style={{
        width: "100%", padding: "10px", borderRadius: "6px", border: "none",
        background: canChange ? "#6366f1" : "#e2e8f0",
        color: canChange ? "#fff" : "#94a3b8",
        cursor: canChange ? "pointer" : "not-allowed",
        fontSize: "14px", fontWeight: "500",
      }}
    >
      {loading ? "Redirecting..." : canChange ? `Select ${planName}` : "No permission to change plan"}
    </button>
  );
}