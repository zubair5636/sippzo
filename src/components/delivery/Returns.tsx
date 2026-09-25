import React from 'react';
import { RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR, formatDate } from '../../lib/formatters';

export const Returns: React.FC = () => {
  const returns = db.getReturns();

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Customer Returns & Refunds
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Process damaged package claims, courier claims, and customer satisfaction resolutions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Return #</th>
              <th className="py-3 px-3">Order #</th>
              <th className="py-3 px-3">Customer</th>
              <th className="py-3 px-4">Reason / Issue</th>
              <th className="py-3 px-3">Items</th>
              <th className="py-3 px-3 text-right">Refund Amount (₹)</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-center">Refund Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {returns.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.returnNumber}</td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">{r.orderNumber}</td>
                <td className="py-3 px-3 font-medium text-slate-900">{r.customerName}</td>
                <td className="py-3 px-4 max-w-xs text-slate-600 italic">"{r.reason}"</td>
                <td className="py-3 px-3 text-slate-700">{r.items}</td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {formatINR(r.amount, { showDecimals: true })}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {r.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {r.refundStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
