import React, { useState } from "react";
import { createOrder } from "../services/api";
import { toast } from "react-toastify";

const EMPTY_ITEM = { name: "", qty: 1, price: 0 };

export default function OrderForm({ onCreated, onClose }) {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    status: "pending",
    items: [{ ...EMPTY_ITEM }],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Required";
    if (!form.customerEmail.trim() || !/\S+@\S+\.\S+/.test(form.customerEmail))
      e.customerEmail = "Valid email required";
    if (form.items.some((i) => !i.name.trim()))
      e.items = "All items need a name";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const total = form.items.reduce(
    (s, i) => s + Number(i.price) * Number(i.qty),
    0,
  );

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const setItem = (idx, key, val) => {
    const items = [...form.items];
    items[idx] = { ...items[idx], [key]: val };
    setField("items", items);
  };

  const addItem = () => setField("items", [...form.items, { ...EMPTY_ITEM }]);
  const removeItem = (idx) =>
    setField(
      "items",
      form.items.filter((_, i) => i !== idx),
    );

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = {
        ...form,
        items: form.items.map((i) => ({
          name: i.name,
          quantity: Number(i.qty),
          price: Number(i.price),
        })),
        totalAmount: total,
      };

      const res = await createOrder(payload);

      onCreated(res); // ✅ fixed
      onClose();
    } catch (e) {
      // alert("Failed to create order");
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };
  const inputClass =
    "w-full bg-ink border border-border rounded-xl px-4 py-3 text-paper text-sm font-body placeholder-muted focus:outline-none focus:border-accent/60 transition-colors";
  const labelClass =
    "block text-xs font-display font-semibold uppercase tracking-widest text-muted mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface border border-border sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl shadow-black/80 animate-slide-in max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-lg text-paper">
              New Order
            </h2>
            <p className="text-muted text-xs mt-0.5">
              Fill in the details below
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-muted hover:text-paper transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Customer name */}
          <div>
            <label className={labelClass}>Customer Name</label>
            <input
              className={inputClass}
              placeholder="John Doe"
              value={form.customerName}
              onChange={(e) => setField("customerName", e.target.value)}
            />
            {errors.customerName && (
              <p className="text-danger text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              className={inputClass}
              type="email"
              placeholder="john@example.com"
              value={form.customerEmail}
              onChange={(e) => setField("customerEmail", e.target.value)}
            />
            {errors.customerEmail && (
              <p className="text-danger text-xs mt-1">{errors.customerEmail}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className={labelClass}>Initial Status</label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              {[
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
              ].map((s) => (
                <option key={s} value={s} className="bg-ink capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass + " mb-0"}>Order Items</label>
              <button
                onClick={addItem}
                className="text-xs text-accent font-display font-semibold hover:underline"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    className={inputClass + " flex-[3]"}
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => setItem(idx, "name", e.target.value)}
                  />
                  <input
                    className={inputClass + " flex-1"}
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => setItem(idx, "qty", e.target.value)}
                  />
                  <input
                    className={inputClass + " flex-1"}
                    type="number"
                    min="0"
                    placeholder="₹"
                    value={item.price}
                    onChange={(e) => setItem(idx, "price", e.target.value)}
                  />
                  {form.items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-danger p-2 hover:bg-danger/10 rounded-lg transition-colors shrink-0"
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
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.items && (
              <p className="text-danger text-xs mt-1">{errors.items}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="font-display font-bold text-xl text-accent">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-accent text-ink font-display font-bold px-6 py-3 rounded-xl hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
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
            )}
            {loading ? "Creating..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
