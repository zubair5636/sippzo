import React from 'react';
import { Store, MapPin, Phone, User, Package } from 'lucide-react';
import { db } from '../../lib/db';

export const Warehouses: React.FC = () => {
  const warehouses = db.getWarehouses();

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Regional Fulfillment Hubs & Warehouses
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Strategic hubs managing stock for North, West, and Central India express logistics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {warehouses.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-orange-600">{w.code}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                  Operational
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 mt-3">{w.name}</h3>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    {w.address}, {w.city}, {w.state} - {w.pincode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    Manager: {w.managerName} ({w.managerPhone})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Current Stock:</span>
              <span className="font-bold text-slate-800">
                {w.currentStock.toLocaleString('en-IN')} / {w.capacity.toLocaleString('en-IN')} units
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
