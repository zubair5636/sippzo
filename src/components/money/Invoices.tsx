import React, { useState } from 'react';
import { FileText, Search, Printer, Download, Eye, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { db } from '../../lib/db';
import { Invoice } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters';

export const Invoices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const invoices = db.getInvoices();

  const filtered = invoices.filter(
    (i) =>
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.orderNumber && i.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice #, customer name, order..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Showing {filtered.length} tax invoices
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-3">Order Ref</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Issue Date</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
                <th className="py-3 px-3 text-right">Total (₹)</th>
                <th className="py-3 px-3 text-right">Balance Due (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">{inv.orderNumber || '—'}</td>
                  <td className="py-3 px-3 font-medium text-slate-900">{inv.customerName}</td>
                  <td className="py-3 px-3 text-slate-500">{formatDate(inv.issueDate)}</td>
                  <td className="py-3 px-3 text-right font-mono">{formatINR(inv.subtotal)}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(inv.totalAmount, { showDecimals: true })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`font-semibold ${
                        inv.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatINR(inv.balanceDue, { showDecimals: true })}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                    >
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-8 space-y-6 my-8 print:p-0 print:border-none print:shadow-none">
            {/* Invoice Top Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold uppercase text-slate-400 font-mono">
                Tax Invoice / Bill of Supply
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="space-y-6">
              {/* Brand and Invoice Info */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">SIPPZO</h1>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Innovative Self-Heating Food Technology
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Gomti Nagar Extension, Lucknow, UP - 226010
                  </p>
                  <p className="text-[11px] font-mono text-slate-600 font-semibold mt-1">
                    GSTIN: 09AAICS8812K1Z9
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900 font-mono">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Order Ref: {selectedInvoice.orderNumber}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Date: {formatDate(selectedInvoice.issueDate)}
                  </div>
                  <div className="text-xs font-bold uppercase text-emerald-700 mt-1">
                    Status: {selectedInvoice.status.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                <span className="font-bold uppercase text-[10px] text-slate-400">Billed To:</span>
                <div className="font-bold text-slate-900">{selectedInvoice.customerName}</div>
                <div className="text-slate-600">{selectedInvoice.customerAddress}</div>
                <div className="text-slate-500 font-mono">{selectedInvoice.customerEmail}</div>
                {selectedInvoice.customerGstin && (
                  <div className="text-slate-700 font-mono font-semibold">
                    GSTIN: {selectedInvoice.customerGstin}
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-slate-900">
                          {item.description}
                          {item.sku && (
                            <span className="block text-[10px] font-mono text-slate-400">
                              SKU: {item.sku}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {formatINR(item.unitPrice, { showDecimals: true })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatINR(item.total, { showDecimals: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax & Totals Breakdown */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatINR(selectedInvoice.subtotal, { showDecimals: true })}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>- {formatINR(selectedInvoice.discount, { showDecimals: true })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (2.5%):</span>
                    <span>{formatINR(selectedInvoice.cgst, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (2.5%):</span>
                    <span>{formatINR(selectedInvoice.sgst, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span>{formatINR(selectedInvoice.totalAmount, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Paid Amount:</span>
                    <span>{formatINR(selectedInvoice.paidAmount, { showDecimals: true })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Balance Due:</span>
                    <span className={selectedInvoice.balanceDue > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {formatINR(selectedInvoice.balanceDue, { showDecimals: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
