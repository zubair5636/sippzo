import React, { useState } from 'react';
import { Upload, Trash2, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { db } from '../../lib/db';
import { BannerItem } from '../../types';

export const BannerSlider: React.FC = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('/collections/all');
  const [imageUrl, setImageUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const banners = db.getBanners().filter((b) => b.bannerType === 'hero_slider');

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
      subtitle,
      ctaText: 'Shop Now',
      ctaUrl: linkUrl || '/collections/all',
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80',
      bannerType: 'hero_slider',
      isActive: true
    });

    setTitle('');
    setSubtitle('');
    setLinkUrl('/collections/all');
    setImageUrl('');
    setFileName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this hero slide?')) {
      db.deleteBanner(id);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* ADD NEW HERO SLIDE Form directly matching video frame 00:07 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Add New Hero Slide
        </div>

        <form onSubmit={handleAddBanner} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World's First Self-Heating Kulhad Chai"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Subtitle / Callout */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Subtitle / Callout
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Ready in 4 minutes with water activation"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Link URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Link URL
              </label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/products/self-heating-kulhad-chai-ginger-elaichi"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Banner Image (1920x800) *
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
              <span>Upload & Add to Slider</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Active Banners matching video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
          >
            <div className="relative h-44 bg-slate-900 overflow-hidden">
              <img
                src={b.imageUrl}
                alt={b.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <span className="text-white font-bold text-base">{b.title}</span>
                {b.subtitle && (
                  <span className="text-slate-200 text-xs mt-0.5 line-clamp-1">
                    {b.subtitle}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-500 text-[11px] truncate max-w-xs">
                {b.ctaUrl}
              </span>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 p-1 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
