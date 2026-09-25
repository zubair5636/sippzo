import React, { useState } from 'react';
import { CheckSquare, Square, Save, CheckCircle2, Star, Flame, Award, Sparkles } from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';

interface CurateCollectionsProps {
  type: 'featured' | 'hero' | 'best_seller' | 'new_arrival' | 'brands';
}

export const CurateCollections: React.FC<CurateCollectionsProps> = ({ type }) => {
  const products = db.getProducts();
  const brands = db.getBrands();

  // Initial selection
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (type === 'brands') {
      return brands.filter((b) => b.isFeatured).map((b) => b.id);
    }
    if (type === 'hero') {
      return products.filter((p) => p.isHero).map((p) => p.id);
    }
    if (type === 'best_seller') {
      return products.filter((p) => p.isBestSeller).map((p) => p.id);
    }
    if (type === 'new_arrival') {
      return products.filter((p) => p.isNewArrival).map((p) => p.id);
    }
    return products.filter((p) => p.isFeatured).map((p) => p.id);
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setSavedSuccess(false);
  };

  const handleSave = () => {
    if (type === 'brands') {
      db.updateCuratedBrands(selectedIds);
    } else {
      db.updateCuratedCollection(type, selectedIds);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const titles = {
    hero: {
      heading: 'Hero Spotlight Products',
      desc: 'Manage high-converting products directly linked to hero campaign banners.',
      buttonLabel: 'Save Hero Spotlights',
      icon: Star
    },
    featured: {
      heading: 'Curate Featured Products on Homepage',
      desc: 'Check the boxes below to display items in the Homepage "Featured Products" grid section.',
      buttonLabel: 'Save Featured Selection',
      icon: Award
    },
    best_seller: {
      heading: 'Curate Best Sellers Collection',
      desc: 'Select the most popular showcase items displayed on the homepage best seller carousel.',
      buttonLabel: 'Save Best Sellers',
      icon: CheckCircle2
    },
    new_arrival: {
      heading: 'Curate New Arrivals Collection',
      desc: 'Items tagged as "New Arrivals" on the official storefront and collection filters.',
      buttonLabel: 'Save New Arrivals',
      icon: Flame
    },
    brands: {
      heading: 'Curate Featured Brand Partners',
      desc: 'Featured brand logos displayed on the storefront partner carousel.',
      buttonLabel: 'Save Featured Brands',
      icon: Sparkles
    }
  };

  const config = titles[type];
  const IconComponent = config.icon;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Bar matching video frame 00:17 - 00:31 */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-orange-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              {config.heading}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{config.desc}</p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Selection Saved!</span>
            </span>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{config.buttonLabel}</span>
          </button>
        </div>
      </div>

      {/* Grid of Selectable Items matching video */}
      {type === 'brands' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => {
            const isSelected = selectedIds.includes(b.id);
            return (
              <div
                key={b.id}
                onClick={() => toggleSelect(b.id)}
                className={`cursor-pointer p-4 rounded-xl border transition-all select-none flex items-center gap-3 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="shrink-0 text-orange-600">
                  {isSelected ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-900 truncate">{b.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{b.websiteUrl}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => {
            const isSelected = selectedIds.includes(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggleSelect(p.id)}
                className={`cursor-pointer p-3 rounded-xl border transition-all select-none flex flex-col justify-between group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                    )}
                  </div>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                      {p.name}
                    </div>
                    <div className="font-mono text-emerald-600 font-bold text-xs mt-1">
                      {formatINR(p.sellingPrice)}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{p.sku}</span>
                  <span className={p.stock <= p.lowStockThreshold ? 'text-amber-600' : 'text-slate-500'}>
                    {p.stock} in stock
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
