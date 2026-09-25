import React, { useState } from 'react';
import { Briefcase, Plus, Search, Trash2, Edit2, CheckCircle2, Phone, Mail, Building } from 'lucide-react';
import { db } from '../../lib/db';
import { B2BLead } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters';

export const B2BLeads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<B2BLead>>({
    name: '',
    company: '',
    phone: '',
    email: '',
    source: 'Website Form',
    status: 'New',
    priority: 'Medium',
    expectedValue: 25000,
    assignedRep: 'Priya Singh',
    notes: ''
  });

  const leads = db.getLeads();

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || l.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.company || !newLead.name) return;

    db.saveLead(newLead);
    setIsModalOpen(false);
    setNewLead({
      name: '',
      company: '',
      phone: '',
      email: '',
      source: 'Website Form',
      status: 'New',
      priority: 'Medium',
      expectedValue: 25000,
      assignedRep: 'Priya Singh',
      notes: ''
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete B2B lead ${name}?`)) {
      db.deleteLead(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, contact, phone..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Stages ({leads.length})</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won</option>
          </select>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add B2B Lead</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Company & Account</th>
                <th className="py-3 px-3">Primary Contact</th>
                <th className="py-3 px-3">Contact Info</th>
                <th className="py-3 px-3 text-right">Expected Value (₹)</th>
                <th className="py-3 px-3 text-center">Stage</th>
                <th className="py-3 px-3 text-center">Priority</th>
                <th className="py-3 px-3">Assigned Rep</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div>{l.company}</div>
                    <div className="text-[11px] text-slate-400 font-normal">Source: {l.source}</div>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800">{l.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    <div>{l.phone}</div>
                    <div className="text-[11px] text-slate-400">{l.email}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {formatINR(l.expectedValue)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        l.priority === 'High'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {l.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{l.assignedRep}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(l.id, l.company)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              New B2B Institutional Lead
            </h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Deal (₹)</label>
                  <input
                    type="number"
                    value={newLead.expectedValue}
                    onChange={(e) =>
                      setNewLead({ ...newLead, expectedValue: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Rep</label>
                  <input
                    type="text"
                    value={newLead.assignedRep}
                    onChange={(e) => setNewLead({ ...newLead, assignedRep: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Requirement Notes</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
                />
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
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
