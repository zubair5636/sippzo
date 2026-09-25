import React, { useState } from 'react';
import { CreditCard, Plus, Search, CheckCircle2, X } from 'lucide-react';
import { db } from '../../lib/db';
import { PaymentReceipt } from '../../types';
import { formatINR } from '../../lib/formatters';

export const Payments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [newPay, setNewPay] = useState({
    customerName: '',
    invoiceNumber: '',
    orderNumber: '',
    amount: 372.85,
    paymentMethod: 'UPI' as PaymentReceipt['paymentMethod'],
    transactionRef: '',
    status: 'completed' as PaymentReceipt['status']
  });

  const payments = db.getPayments();

  const filtered = payments.filter(
    (p) =>
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPay.customerName || !newPay.amount) return;

    db.recordPayment({
      customerName: newPay.customerName,
      invoiceNumber: newPay.invoiceNumber || undefined,
      orderNumber: newPay.orderNumber || undefined,
      amount: Number(newPay.amount),
      paymentMethod: newPay.paymentMethod,
      transactionRef: newPay.transactionRef || 'UPI/' + Date.now(),
      status: newPay.status
    });

    setIsRecordOpen(false);
    setNewPay({
      customerName: '',
      invoiceNumber: '',
      orderNumber: '',
      amount: 372.85,
      paymentMethod: 'UPI',
      transactionRef: '',
      status: 'completed'
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search receipt, customer, transaction ID..."
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        <button
          onClick={() => setIsRecordOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Invoice / Order</th>
                <th className="py-3 px-3 text-right">Amount (₹)</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Transaction Reference</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.receiptNumber}</td>
                  <td className="py-3 px-3 text-slate-500">{p.receiptDate}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{p.customerName}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {p.invoiceNumber || p.orderNumber || 'Direct Payment'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                    {formatINR(p.amount, { showDecimals: true })}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{p.paymentMethod}</td>
                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                    {p.transactionRef}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Modal */}
      {isRecordOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Record Customer Payment Receipt
            </h3>
            <form onSubmit={handleRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newPay.customerName}
                  onChange={(e) => setNewPay({ ...newPay, customerName: e.target.value })}
                  placeholder="e.g. Amit Verma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPay.amount}
                    onChange={(e) =>
                      setNewPay({ ...newPay, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newPay.paymentMethod}
                    onChange={(e) =>
                      setNewPay({ ...newPay, paymentMethod: e.target.value as any })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Bank Transfer">NEFT / RTGS</option>
                    <option value="COD">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Ref ID</label>
                <input
                  type="text"
                  value={newPay.transactionRef}
                  onChange={(e) => setNewPay({ ...newPay, transactionRef: e.target.value })}
                  placeholder="e.g. UPI/226010091823/OKAXIS"
                  className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordOpen(false)}
                  className="px-3 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                >
                  Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
