import React, { useState } from 'react';
import { AlertOctagon, CheckSquare, Square, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';

export const BulkOutOfStock: React.FC = () => {
  const products = db.getProducts();
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [updatedCount, setUpdatedCount] = useState<number | null>(null);

  const toggleSelect = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const handleSelectAllInStock = () => {
    const inStock = products.filter((p) => p.stock > 0).map((p) => p.sku);
    setSelectedSkus(inStock);
  };

  const handleClearSelection = () => {
    setSelectedSkus([]);
  };

  const handleExecute = () => {
    if (selectedSkus.length === 0) return;
    const count = db.bulkMarkOutOfStock(selectedSkus);
    setUpdatedCount(count);
    setShowConfirm(false);
    setSelectedSkus([]);
    setTimeout(() => setUpdatedCount(null), 4000);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Bulk Out of Stock Update
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark batches or items out of stock across the store without deleting catalog records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAllInStock}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Select All In-Stock
          </button>
          {selectedSkus.length > 0 && (
            <button
              onClick={handleClearSelection}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
          )}
          <button
            disabled={selectedSkus.length === 0}
            onClick={() => setShowConfirm(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Mark {selectedSkus.length} Items Out of Stock</span>
          </button>
        </div>
      </div>

      {updatedCount !== null && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Successfully marked {updatedCount} products as Out of Stock (0 quantity).</span>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10"></th>
              <th className="py-3 px-3">Product Name</th>
              <th className="py-3 px-3">SKU</th>
              <th className="py-3 px-3 text-right">Current Stock</th>
              <th className="py-3 px-3 text-right">Price</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {products.map((p) => {
              const isSelected = selectedSkus.includes(p.sku);
              const isOutOfStock = p.stock === 0;
              return (
                <tr
                  key={p.id}
                  onClick={() => toggleSelect(p.sku)}
                  className={`cursor-pointer hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-red-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300" />
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2.5">
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
                  <td className="py-3 px-3 text-right font-mono font-bold">
                    <span className={isOutOfStock ? 'text-red-600' : 'text-slate-800'}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-900 font-medium">
                    {formatINR(p.sellingPrice)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Confirm Bulk Out of Stock Update
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You are about to set the stock to <strong>0</strong> for <strong>{selectedSkus.length}</strong> selected products. This will prevent customers from purchasing these items on the storefront until restocked.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs"
              >
                Yes, Set to Out of Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
