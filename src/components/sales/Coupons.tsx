import React, { useState } from 'react';
import { Ticket, Plus, CheckCircle2, Trash2 } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters';

export const Coupons: React.FC = () => {
  const coupons = db.getCoupons();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: '',
    type: 'fixed',
    value: 50,
    minOrderValue: 299,
    usageLimit: 200
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    db.saveCoupon(newCoupon);
    setIsAddOpen(false);
    setNewCoupon({
      code: '',
      type: 'fixed',
      value: 50,
      minOrderValue: 299,
      usageLimit: 200
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Promotional Coupons & Voucher Codes
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage checkout discounts, festive vouchers, and trekker community promo codes.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Coupon Code</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3 text-right">Discount Value</th>
              <th className="py-3 px-3 text-right">Min Order (₹)</th>
              <th className="py-3 px-3 text-center">Times Used</th>
              <th className="py-3 px-3">Validity</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-orange-600 tracking-wider">
                  {c.code}
                </td>
                <td className="py-3 px-3 capitalize text-slate-700">{c.type}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {c.type === 'percentage' ? `${c.value}%` : formatINR(c.value)}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-600">
                  {formatINR(c.minOrderValue)}
                </td>
                <td className="py-3 px-3 text-center font-mono">
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {c.timesUsed} / {c.usageLimit}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                  {formatDate(c.validFrom)} - {formatDate(c.validUntil)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Create Promotional Coupon
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE100"
                  className="w-full font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="fixed">Fixed INR (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, value: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minOrderValue}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, minOrderValue: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value, 10) || 100 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
