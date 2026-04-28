import React, { useState } from "react";
import { deleteOrder, updateOrder } from "../services/api";

const STATUS_CONFIG = {
  pending: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    dot: "bg-warning",
  },
  processing: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
    dot: "bg-blue-400",
  },
  shipped: {
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
    dot: "bg-accent",
  },
  delivered: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    dot: "bg-success",
  },
  cancelled: {
    color: "text-danger",
    bg: "bg-danger/10",
    border: "border-danger/30",
    dot: "bg-danger",
  },
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderItem({ order, onDelete, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const handleDelete = async () => {
    if (!window.confirm("Delete this order?")) return;
    setLoading(true);
    try {
      await deleteOrder(order._id);
      onDelete(order._id);
    } catch (e) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (newStatus) => {
    setShowStatusMenu(false);

    const updated = { ...order, status: newStatus };
    onUpdate(updated);

    try {
      const res = await updateOrder(order._id, { status: newStatus });
      onUpdate(res);
    } catch {
      alert("Update failed");
      onUpdate(order);
    }
  };
  return (
    <div className="group relative bg-surface border border-border rounded-2xl p-5 hover:border-accent/40 transition-all duration-300 animate-fade-up overflow-hidden">
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-4">
        {/* Left: Order info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-muted">
              #{String(order._id).slice(-6).toUpperCase()}
            </span>
            {/* Status badge */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.border} ${cfg.color} hover:opacity-80 transition-opacity`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse-dot`}
                />
                {order.status}
              </button>
              {showStatusMenu && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-ink border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/60 min-w-[140px]">
                  {STATUSES.map((s) => {
                    const c = STATUS_CONFIG[s];
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-white/5 transition-colors ${s === order.status ? "opacity-40 cursor-default" : ""}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                        <span className="capitalize font-medium text-paper/80">
                          {s}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <h3 className="font-display font-semibold text-paper text-base truncate">
            {order.customerName}
          </h3>
          <p className="text-muted text-sm mt-0.5 truncate">
            {order.customerEmail}
          </p>

          {order.items && order.items.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {order.items.slice(0, 3).map((item, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-xs text-paper/70"
                >
                  {item.name} ×{item.quantity}{" "}
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-muted">
                  +{order.items.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Amount + actions */}
        <div className="flex flex-col items-end gap-3">
          <span className="font-display font-bold text-xl text-accent">
            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
          </span>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 rounded-lg border border-danger/20 text-danger hover:bg-danger/10 transition-colors text-xs disabled:opacity-40"
              title="Delete order"
            >
              {loading ? (
                "..."
              ) : (
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer: date */}
      {order.createdAt && (
        <p className="mt-3 pt-3 border-t border-border/60 text-xs text-muted font-mono">
          {new Date(order.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
