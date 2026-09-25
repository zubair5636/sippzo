import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { db } from '../../lib/db';
import { ReviewItem } from '../../types';

export const Reviews: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const reviews = db.getReviews();

  const filtered = reviews.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const handleToggleStatus = (id: string, currentStatus: ReviewItem['status']) => {
    const nextStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    db.updateReviewStatus(id, nextStatus);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this customer review permanently?')) {
      db.deleteReview(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header and Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Product Reviews & Ratings Moderation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate consumer feedback submitted on sippzo.com before public visibility.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(['all', 'approved', 'pending', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table matching video frame 00:36 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-3">Reviewer</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-4">Comment / Feedback</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No reviews matching current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      {rev.productName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{rev.reviewerName}</div>
                      {rev.reviewerEmail && (
                        <div className="text-[11px] text-slate-400">{rev.reviewerEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-md italic text-slate-600">
                      "{rev.comment}"
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                          rev.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(rev.id, rev.status)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                            rev.status === 'approved'
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {rev.status === 'approved' ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(rev.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
