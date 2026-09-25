import React, { useState } from 'react';
import { ArrowUpDown, CheckCircle2, AlertCircle, Upload, Download, Package } from 'lucide-react';
import { db } from '../../lib/db';

export const BulkStockUpdate: React.FC = () => {
  const [csvText, setCsvText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('wh_delhi');
  const [updateResult, setUpdateResult] = useState<{ success: number; failed: number } | null>(null);

  const products = db.getProducts();
  const warehouses = db.getWarehouses();

  const handleApplyStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const updates: { sku: string; quantity: number }[] = [];

    lines.forEach((line) => {
      const parts = line.split(/[,;\t]/).map((s) => s.trim());
      if (parts.length >= 2) {
        const sku = parts[0];
        const qty = parseInt(parts[1], 10);
        if (sku && !isNaN(qty)) {
          updates.push({ sku, quantity: qty });
        }
      }
    });

    if (updates.length === 0) {
      alert('No valid SKU and quantity lines found. Format: SKU, Quantity (e.g. SIP-KUL-CHAI-GE99, 450)');
      return;
    }

    const res = db.bulkUpdateStock(updates);
    setUpdateResult(res);
  };

  const handleSampleFill = () => {
    const sample = products
      .slice(0, 5)
      .map((p) => `${p.sku}, ${p.stock + 50}`)
      .join('\n');
    setCsvText(sample);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Bulk Stock Quantity Update
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update current available quantities across regional fulfillment warehouses via CSV or direct entry.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <form onSubmit={handleApplyStockUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Warehouse Hub
            </label>
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
            >
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.code} - {w.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Paste Stock Data (Format: SKU, Quantity)
              </label>
              <button
                type="button"
                onClick={handleSampleFill}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                Insert Sample Rows
              </button>
            </div>
            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="SIP-KUL-CHAI-GE99, 450&#10;SIP-MEAL-POHA-119, 320&#10;SIP-KIT-TREK-699, 85"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>Apply Bulk Stock Update</span>
          </button>
        </form>

        {updateResult && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Successfully updated <strong>{updateResult.success}</strong> products.
                {updateResult.failed > 0 && ` (${updateResult.failed} SKUs not found)`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
