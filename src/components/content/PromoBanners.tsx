import React, { useState } from 'react';
import { Upload, Trash2, Plus, Grid } from 'lucide-react';
import { db } from '../../lib/db';

export const PromoBanners: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtext, setSubtext] = useState('');
  const [targetLink, setTargetLink] = useState('/shop');
  const [fileName, setFileName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const promoBanners = db.getBanners().filter((b) => b.bannerType === 'promo_grid');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    db.saveBanner({
      title,
      subtitle: subtext,
      ctaText: 'Explore',
      ctaUrl: targetLink || '/shop',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      bannerType: 'promo_grid',
      isActive: true
    });

    setTitle('');
    setSubtext('');
    setTargetLink('/shop');
    setFileName('');
    setImageUrl('');
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove promotional grid banner?')) {
      db.deleteBanner(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Form matching video frame 00:10 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Add Grid Promo Banner
        </div>

        <form onSubmit={handleAddBanner} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mountain Rations & Trek Kits"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subtext
              </label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                placeholder="e.g. Up to 15% off combo boxes"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Link
              </label>
              <input
                type="text"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="/shop/category/adventure-kits"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Banner Image
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 truncate">
                  <Upload className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{fileName || 'Choose File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400 truncate">
                  {fileName ? 'Selected' : 'No file chosen'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Banner</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grid Display matching video */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {promoBanners.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
          >
            <div className="relative h-40 bg-slate-900 overflow-hidden">
              <img
                src={p.imageUrl}
                alt={p.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-end">
                <span className="text-white font-bold text-sm">{p.title}</span>
                {p.subtitle && (
                  <span className="text-orange-300 text-xs font-medium mt-0.5">
                    {p.subtitle}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 text-[11px] truncate max-w-[180px]">
                {p.ctaUrl}
              </span>
              <button
                onClick={() => handleRemove(p.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
