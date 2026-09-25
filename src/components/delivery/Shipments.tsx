import React, { useState } from 'react';
import { Truck, Search, Plus, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { db } from '../../lib/db';
import { Shipment } from '../../types';

export const Shipments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const shipments = db.getShipments();

  const filtered = shipments.filter(
    (s) =>
      s.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking #, order, customer..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} logistics consignments
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Shipment #</th>
              <th className="py-3 px-3">Order Number</th>
              <th className="py-3 px-3">Recipient</th>
              <th className="py-3 px-3">Courier Partner</th>
              <th className="py-3 px-3">Tracking Number</th>
              <th className="py-3 px-3">Dispatch Date</th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.shipmentNumber}</td>
                <td className="py-3 px-3 font-mono font-semibold text-slate-800">{s.orderNumber}</td>
                <td className="py-3 px-3 font-medium text-slate-900">{s.customerName}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800">{s.courierName}</span>
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">
                  {s.trackingUrl ? (
                    <a
                      href={s.trackingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <span>{s.trackingNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    s.trackingNumber
                  )}
                </td>
                <td className="py-3 px-3 text-slate-500">{s.dispatchDate || 'Pending dispatch'}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                      s.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : s.status === 'in_transit'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {s.status.replace('_', ' ')}
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
