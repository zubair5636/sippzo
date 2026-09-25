import React, { useState } from 'react';
import { Store, Plus, Search, FileSpreadsheet, Building, Phone, Mail } from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR, formatDate } from '../../lib/formatters';

export const Vendors: React.FC = () => {
  const vendors = db.getVendors();
  const purchaseOrders = db.getPurchaseOrders();
  const [activeSubTab, setActiveSubTab] = useState<'vendors' | 'po'>('vendors');

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Subtab navigation */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('vendors')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'vendors'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Raw Material Suppliers ({vendors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('po')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeSubTab === 'po'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'vendors' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Contact Info</th>
                <th className="py-3 px-3">GSTIN</th>
                <th className="py-3 px-3">Products Supplied</th>
                <th className="py-3 px-3 text-right">Outstanding (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{v.name}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{v.city}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{v.contactPerson}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    <div>{v.phone}</div>
                    <div className="text-[11px] text-slate-400">{v.email}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600 font-semibold">{v.gstin}</td>
                  <td className="py-3 px-3 text-slate-700 max-w-xs">{v.productsSupplied}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(v.outstandingBalance)}
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
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-3 text-right">PO Total (₹)</th>
                <th className="py-3 px-3">Expected Date</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{po.poNumber}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{po.vendorName}</td>
                  <td className="py-3 px-4 text-slate-700">{po.itemsSummary}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(po.totalAmount)}
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">{formatDate(po.expectedDate)}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        po.status === 'received'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
