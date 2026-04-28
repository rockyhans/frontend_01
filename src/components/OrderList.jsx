import React, { useEffect, useState, useCallback } from "react";
import { getAllOrders } from "../services/api";
import OrderItem from "./OrderItem";

const STATUS_FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrderList({ refresh, onStatsUpdate }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllOrders(); // ✅ already normalized

      setOrders(data);
      if (onStatsUpdate) onStatsUpdate(data);
    } catch (e) {
      setError(
        "Could not connect to backend. Make sure it's running on port 5000.",
      );
    } finally {
      setLoading(false);
    }
  }, [onStatsUpdate]);
  useEffect(() => {
    fetchOrders();
  }, [refresh, fetchOrders]);

  const handleDelete = (id) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o._id !== id); // ✅ only _id

      if (onStatsUpdate) onStatsUpdate(updated);
      return updated;
    });
  };

  const handleUpdate = (updated) => {
    setOrders((prev) => {
      const next = prev.map(
        (o) => (o._id === updated._id ? updated : o), // ✅ only _id
      );

      if (onStatsUpdate) onStatsUpdate(next);
      return next;
    });
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filter === "all" || o.status === filter;
    const matchSearch =
      !search ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-paper placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-display font-semibold capitalize transition-all
                ${
                  filter === s
                    ? "bg-accent text-ink"
                    : "bg-surface border border-border text-muted hover:text-paper hover:border-accent/40"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading orders...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
              />
            </svg>
          </div>
          <p className="text-danger text-sm text-center max-w-xs">{error}</p>
          <button
            onClick={fetchOrders}
            className="text-xs text-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-border flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted"
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
          <p className="text-muted text-sm">No orders found</p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-xs text-accent hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((order, i) => (
            <div key={order._id} style={{ animationDelay: `${i * 60}ms` }}>
              <OrderItem
                order={order}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <p className="text-center text-xs text-muted pb-2">
          Showing {filtered.length} of {orders.length} order
          {orders.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
