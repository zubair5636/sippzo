import React, { useState } from 'react';
import { Warehouse, Plus, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { db } from '../../lib/db';
import { Batch } from '../../types';
import { formatDate } from '../../lib/formatters';

export const Batches: React.FC = () => {
  const batches = db.getBatches();
  const products = db.getProducts();
  const warehouses = db.getWarehouses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBatch, setNewBatch] = useState<Partial<Batch>>({
    productId: products[0]?.id || '',
    warehouseId: warehouses[0]?.id || '',
    quantity: 500,
    manufacturingDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 270 * 86400000).toISOString().split('T')[0]
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === newBatch.productId);
    const wh = warehouses.find((w) => w.id === newBatch.warehouseId);

    db.saveBatch({
      ...newBatch,
      productName: prod?.name || 'Kulhad Chai',
      warehouseName: wh?.name || 'Delhi Hub'
    });

    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Batches & Expiry Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor production lots, quality release dates, and shelf-life expiry dates.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Batch</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Batch Number</th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">Warehouse Hub</th>
              <th className="py-3 px-3">Mfg Date</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3 text-right">Lot Quantity</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {batches.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.batchNumber}</td>
                <td className="py-3 px-3 font-semibold text-slate-800">{b.productName}</td>
                <td className="py-3 px-3 text-slate-600">{b.warehouseName}</td>
                <td className="py-3 px-3 text-slate-500 font-mono">{formatDate(b.manufacturingDate)}</td>
                <td className="py-3 px-3 font-mono font-medium text-slate-700">
                  {formatDate(b.expiryDate)}
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {b.quantity} units
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      b.status === 'fresh'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Register Production Batch
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product</label>
                <select
                  value={newBatch.productId}
                  onChange={(e) => setNewBatch({ ...newBatch, productId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warehouse Hub</label>
                <select
                  value={newBatch.warehouseId}
                  onChange={(e) => setNewBatch({ ...newBatch, warehouseId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lot Quantity</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newBatch.quantity}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, quantity: parseInt(e.target.value, 10) || 100 })
                  }
                  className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mfg Date</label>
                  <input
                    type="date"
                    required
                    value={newBatch.manufacturingDate}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, manufacturingDate: e.target.value })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newBatch.expiryDate}
                    onChange={(e) => setNewBatch({ ...newBatch, expiryDate: e.target.value })}
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
