import React, { useState, useCallback } from "react";
import OrderList from "./components/OrderList";
import OrderForm from "./components/OrderForm";

const STAT_STATUS = [
  {
    key: "pending",
    label: "Pending",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
  },
  {
    key: "processing",
    label: "Processing",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    key: "delivered",
    label: "Delivered",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/20",
  },
];

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [stats, setStats] = useState({ total: 0, revenue: 0, counts: {} });

  const handleStatsUpdate = useCallback((orders) => {
    const counts = {};
    let revenue = 0;
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      revenue += Number(o.totalAmount || o.total || 0);
    });
    setStats({ total: orders.length, revenue, counts });
  }, []);

  const handleCreated = () => {
    setRefresh((r) => r + 1);
  };

  return (
    <div className="min-h-screen bg-ink grid-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-ink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-paper text-base leading-none">
                OrderFlow
              </h1>
              <p className="text-muted text-xs mt-0.5 leading-none">
                Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
              <span className="text-success text-xs font-mono">API :5000</span>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-ink font-display font-bold px-4 py-2 rounded-xl text-sm active:scale-95 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="hidden sm:inline">New Order</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total orders */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-muted text-xs font-display uppercase tracking-wider">
                Total Orders
              </p>
              <p className="font-display font-bold text-2xl text-paper">
                {stats.total}
              </p>
            </div>
          </div>

          {/* Revenue */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2 bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-muted text-xs font-display uppercase tracking-wider">
                Revenue
              </p>
              <p className="font-display font-bold text-2xl text-paper">
                ₹
                {stats.revenue >= 1000
                  ? (stats.revenue / 1000).toFixed(1) + "K"
                  : stats.revenue}
              </p>
            </div>
          </div>

          {/* Per-status mini stats */}
          {STAT_STATUS.map((s) => (
            <div
              key={s.key}
              className={`${s.bg} border ${s.border} rounded-2xl p-3 flex flex-col justify-between`}
            >
              <p
                className={`text-xs font-display font-semibold ${s.color} uppercase tracking-wider`}
              >
                {s.label}
              </p>
              <p className={`font-display font-bold text-xl ${s.color} mt-2`}>
                {stats.counts[s.key] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* Section header */}
        <div className="flex items-center gap-4">
          <h2 className="font-display font-bold text-xl text-paper">Orders</h2>
          <div className="flex-1 h-px bg-border" />
          <button
            onClick={() => setRefresh((r) => r + 1)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-paper transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Order list */}
        <OrderList refresh={refresh} onStatsUpdate={handleStatsUpdate} />
      </main>

      {/* Create order modal */}
      {showForm && (
        <OrderForm
          onCreated={handleCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
