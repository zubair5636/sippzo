import React, { useState } from 'react';
import { Upload, Trash2, Copy, Check, Image as ImageIcon, Search, Filter, Sparkles, ExternalLink } from 'lucide-react';
import { db } from '../../lib/db';
import { MediaItem } from '../../types';

export const MediaLibrary: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const media = db.getMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles.length === 0) return;

    Array.from(selectedFiles).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        db.addMediaItem({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'image/jpeg',
          publicUrl: (event.target?.result as string) || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
          source: 'Upload',
          category: 'General'
        });
      };
      reader.readAsDataURL(file);
    });

    setSelectedFiles(null);
    const input = document.getElementById('media-upload-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this media asset from library?')) {
      db.deleteMediaItem(id);
    }
  };

  const filteredMedia = media.filter((m) => {
    const matchesSearch = m.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || m.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Upload Form matching video frame 00:48 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Upload Images to Media Cloud
        </div>

        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-lg">
            <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Choose Files</span>
              <input
                id="media-upload-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <span className="text-xs text-slate-500 truncate">
              {selectedFiles && selectedFiles.length > 0
                ? `${selectedFiles.length} file(s) selected`
                : 'No file chosen'}
            </span>
          </div>

          <button
            type="submit"
            disabled={!selectedFiles || selectedFiles.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </form>
      </div>

      {/* Stored Assets Header & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Stored Media Assets ({filteredMedia.length})
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Media Assets */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
          <ImageIcon className="w-10 h-10 mx-auto mb-2 text-slate-300" />
          <span>No media files uploaded yet.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs group flex flex-col justify-between"
            >
              <div className="relative h-36 bg-slate-100 overflow-hidden flex items-center justify-center">
                <img
                  src={item.publicUrl}
                  alt={item.fileName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="p-2.5 space-y-1 text-xs">
                <div className="font-semibold text-slate-800 truncate" title={item.fileName}>
                  {item.fileName}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{(item.fileSize / 1024).toFixed(0)} KB</span>
                  <span className="truncate max-w-[80px]">{item.source}</span>
                </div>
              </div>

              <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item.id, item.publicUrl)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                  title="Delete asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
