import React, { useState } from 'react';
import { FileImage, Upload, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { db } from '../../lib/db';

export const WebPOptimizer: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null);
  const [webpUrl, setWebpUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.85);
  const [isConverting, setIsConverting] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    convertToWebP(file, url, quality);
  };

  const convertToWebP = (file: File, url: string, q: number) => {
    setIsConverting(true);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setWebpBlob(blob);
              setWebpUrl(URL.createObjectURL(blob));
            }
            setIsConverting(false);
          },
          'image/webp',
          q
        );
      }
    };
  };

  const handleDownload = () => {
    if (!webpUrl || !originalFile) return;
    const link = document.createElement('a');
    link.href = webpUrl;
    link.download = originalFile.name.replace(/\.[^/.]+$/, '') + '.webp';
    link.click();
  };

  const handleSaveToMedia = () => {
    if (!webpUrl || !originalFile || !webpBlob) return;
    const name = originalFile.name.replace(/\.[^/.]+$/, '') + '.webp';

    db.addMediaItem({
      fileName: name,
      fileSize: webpBlob.size,
      mimeType: 'image/webp',
      publicUrl: webpUrl,
      source: 'Upload',
      category: 'WebP Optimized'
    });

    alert('Optimized WebP asset added to Media Library!');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
          Image to WebP Asset Optimizer
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Convert heavy PNG and JPEG packaging graphics to lightweight next-gen WebP for lightning-fast storefront speeds.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div className="p-6 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center transition-colors">
          <input
            type="file"
            id="webp-input"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFile}
            className="hidden"
          />
          <label htmlFor="webp-input" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">
              {originalFile ? originalFile.name : 'Select PNG / JPEG Image'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Instant in-browser lossless / lossy WebP encoding
            </span>
          </label>
        </div>

        {originalFile && (
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>WebP Compression Quality</span>
                <span className="font-mono text-orange-600">{(quality * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => {
                  const q = parseFloat(e.target.value);
                  setQuality(q);
                  if (originalFile && originalUrl) convertToWebP(originalFile, originalUrl, q);
                }}
                className="w-full accent-orange-600"
              />
            </div>

            {/* Before / After Metrics */}
            {webpBlob && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Original Size</div>
                  <div className="text-base font-bold font-mono text-slate-800 mt-1">
                    {(originalFile.size / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{originalFile.type}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-600">WebP Compressed</div>
                  <div className="text-base font-bold font-mono text-emerald-700 mt-1">
                    {(webpBlob.size / 1024).toFixed(1)} KB
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold font-mono">
                    {Math.round(((originalFile.size - webpBlob.size) / originalFile.size) * 100)}% Space Saved
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={handleSaveToMedia}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Save to Media Library
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .webp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
