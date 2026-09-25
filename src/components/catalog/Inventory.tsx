import React, { useState } from 'react';
import { Boxes, Search, Plus, ArrowUpDown, AlertTriangle, CheckCircle2, Warehouse } from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';

export const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const products = db.getProducts();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.costPrice * p.stock, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SKU or product title..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400">Total Units:</span>{' '}
            <span className="font-bold text-slate-800">{totalStockUnits}</span>
          </div>
          <div>
            <span className="text-slate-400">Inventory Value:</span>{' '}
            <span className="font-bold text-emerald-700">{formatINR(totalValuation)}</span>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Primary Hub</th>
                <th className="py-3 px-3 text-right">Available Stock</th>
                <th className="py-3 px-3 text-right">Low Stock Alert</th>
                <th className="py-3 px-3 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-3 text-right">Total Valuation (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                const isOut = p.stock === 0;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded object-cover border border-slate-200 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3 px-3 text-slate-600">Delhi NCR Hub</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      <span className={isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      {p.lowStockThreshold} units
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatINR(p.costPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                      {formatINR(p.costPrice * p.stock)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          isOut
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isOut ? 'Depleted' : isLow ? 'Low Stock' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
