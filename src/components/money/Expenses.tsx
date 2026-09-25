import React, { useState } from 'react';
import { Receipt, Plus, Search, CheckCircle2 } from 'lucide-react';
import { db } from '../../lib/db';
import { Expense } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters';

export const Expenses: React.FC = () => {
  const expenses = db.getExpenses();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExp, setNewExp] = useState<Partial<Expense>>({
    category: 'Packaging',
    title: '',
    amount: 5000,
    paymentMethod: 'Bank Transfer',
    notes: ''
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.title || !newExp.amount) return;

    db.saveExpense(newExp);
    setIsAddOpen(false);
    setNewExp({
      category: 'Packaging',
      title: '',
      amount: 5000,
      paymentMethod: 'Bank Transfer',
      notes: ''
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Operating Expenses & Overhead Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total Logged Expenses:{' '}
            <span className="font-bold text-slate-900 font-mono">
              {formatINR(totalExpenseAmount, { showDecimals: true })}
            </span>
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-3">Expense Category</th>
              <th className="py-3 px-4">Expense Description</th>
              <th className="py-3 px-3">Payment Method</th>
              <th className="py-3 px-3">Ref ID</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 text-slate-500 font-mono">{formatDate(exp.expenseDate)}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                    {exp.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">{exp.title}</td>
                <td className="py-3 px-3 text-slate-600">{exp.paymentMethod}</td>
                <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{exp.receiptRef || '—'}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                  {formatINR(exp.amount, { showDecimals: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Record Operational Expense
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  placeholder="e.g. Biodegradable kulhad packing materials"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newExp.category}
                    onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  >
                    <option value="Packaging">Packaging</option>
                    <option value="Shipping">Shipping</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Salary">Salary</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Software">Software</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newExp.amount}
                    onChange={(e) =>
                      setNewExp({ ...newExp, amount: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
