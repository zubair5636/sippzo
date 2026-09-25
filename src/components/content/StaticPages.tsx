import React, { useState } from 'react';
import { FileCode, Plus, Edit2, ExternalLink } from 'lucide-react';
import { INITIAL_STATIC_PAGES } from '../../data/sippzoCatalog';
import { formatDate } from '../../lib/formatters';

export const StaticPages: React.FC = () => {
  const [pages] = useState(INITIAL_STATIC_PAGES);

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Static Storefront Pages</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage legal, about us, and technical explanation pages on sippzo.com.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Page Title</th>
              <th className="py-3 px-3">Slug</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">{p.title}</td>
                <td className="py-3 px-3 font-mono text-slate-500">/pages/{p.slug}</td>
                <td className="py-3 px-3 text-slate-500 font-mono">{formatDate(p.updatedAt)}</td>
                <td className="py-3 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    Published
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={`https://sippzo.com/pages/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-orange-600 hover:underline font-semibold"
                  >
                    <span>View Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
