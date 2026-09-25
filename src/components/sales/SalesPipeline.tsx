import React, { useState } from 'react';
import { KanbanSquare, Plus, ArrowRight, ArrowLeft, CheckCircle2, Building, Calendar, User } from 'lucide-react';
import { db } from '../../lib/db';
import { Deal } from '../../types';
import { formatINR } from '../../lib/formatters';

const STAGES: Deal['stage'][] = [
  'New',
  'Contacted',
  'Qualified',
  'Proposal',
  'Negotiation',
  'Won',
  'Lost'
];

export const SalesPipeline: React.FC = () => {
  const deals = db.getDeals();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    title: '',
    company: '',
    contactName: '',
    value: 50000,
    stage: 'New',
    probability: 30,
    expectedCloseDate: '2026-10-30',
    assignedRep: 'Priya Singh'
  });

  const handleMoveStage = (dealId: string, currentStage: Deal['stage'], direction: 'next' | 'prev') => {
    const curIdx = STAGES.indexOf(currentStage);
    const nextIdx = direction === 'next' ? curIdx + 1 : curIdx - 1;
    if (nextIdx >= 0 && nextIdx < STAGES.length) {
      db.updateDealStage(dealId, STAGES[nextIdx]);
    }
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.title || !newDeal.company) return;

    db.saveDeal(newDeal);
    setIsAddOpen(false);
    setNewDeal({
      title: '',
      company: '',
      contactName: '',
      value: 50000,
      stage: 'New',
      probability: 30,
      expectedCloseDate: '2026-10-30',
      assignedRep: 'Priya Singh'
    });
  };

  const totalPipelineValue = deals
    .filter((d) => d.stage !== 'Lost')
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Enterprise Sales Pipeline Kanban
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active B2B pipeline value:{' '}
            <span className="font-bold text-emerald-600 font-mono">
              {formatINR(totalPipelineValue)}
            </span>{' '}
            across institutional deals.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={stage}
              className="bg-slate-50/80 rounded-xl border border-slate-200 p-2.5 flex flex-col min-w-[200px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-700">{stage}</span>
                <span className="text-[10px] font-mono font-bold bg-white text-slate-500 px-1.5 py-0.2 rounded border border-slate-200">
                  {stageDeals.length}
                </span>
              </div>
              <div className="text-[11px] font-mono font-semibold text-slate-400 mb-2">
                {formatINR(stageTotal)}
              </div>

              {/* Cards in column */}
              <div className="space-y-2 flex-1">
                {stageDeals.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 hover:border-orange-300 transition-colors"
                  >
                    <div className="font-bold text-xs text-slate-900 leading-snug">{d.title}</div>
                    <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{d.company}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-bold font-mono text-emerald-700 text-xs">
                        {formatINR(d.value)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {d.probability}% prob
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                      <span>{d.assignedRep}</span>
                      <div className="flex items-center gap-1">
                        {stage !== 'New' && (
                          <button
                            onClick={() => handleMoveStage(d.id, d.stage, 'prev')}
                            className="p-1 hover:bg-slate-100 text-slate-500 rounded"
                            title="Move back"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        {stage !== 'Lost' && (
                          <button
                            onClick={() => handleMoveStage(d.id, d.stage, 'next')}
                            className="p-1 hover:bg-slate-100 text-orange-600 rounded"
                            title="Advance stage"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              New Sales Deal Opportunity
            </h3>
            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={newDeal.title}
                  onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                  placeholder="e.g. Highway Fuel Station Chain Pilot"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company *</label>
                <input
                  type="text"
                  required
                  value={newDeal.company}
                  onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Value (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newDeal.value}
                    onChange={(e) =>
                      setNewDeal({ ...newDeal, value: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Probability (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newDeal.probability}
                    onChange={(e) =>
                      setNewDeal({ ...newDeal, probability: parseInt(e.target.value, 10) || 0 })
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
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
