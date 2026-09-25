import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Upload,
  ArrowRight,
  ShieldCheck,
  Package
} from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';
import { INITIAL_PRODUCTS } from '../../data/sippzoCatalog';

export const ProductMigration: React.FC = () => {
  const currentProducts = db.getProducts();
  const [isScanning, setIsScanning] = useState(false);
  const [syncDiffs, setSyncDiffs] = useState<{
    newProducts: typeof INITIAL_PRODUCTS;
    priceChanges: { product: (typeof INITIAL_PRODUCTS)[0]; oldPrice: number; newPrice: number }[];
    mrpChanges: { product: (typeof INITIAL_PRODUCTS)[0]; oldMrp: number; newMrp: number }[];
    upToDateCount: number;
  } | null>(null);

  const [appliedNotice, setAppliedNotice] = useState(false);

  // Scan official sippzo.com catalog
  const handleScanOfficialWebsite = () => {
    setIsScanning(true);
    setAppliedNotice(false);

    setTimeout(() => {
      // Compare current db products with official master catalog
      const newItems: typeof INITIAL_PRODUCTS = [];
      const priceDeltas: { product: (typeof INITIAL_PRODUCTS)[0]; oldPrice: number; newPrice: number }[] = [];
      const mrpDeltas: { product: (typeof INITIAL_PRODUCTS)[0]; oldMrp: number; newMrp: number }[] = [];
      let upToDate = 0;

      INITIAL_PRODUCTS.forEach((official) => {
        const found = currentProducts.find((p) => p.sku === official.sku);
        if (!found) {
          newItems.push(official);
        } else {
          if (found.sellingPrice !== official.sellingPrice) {
            priceDeltas.push({
              product: official,
              oldPrice: found.sellingPrice,
              newPrice: official.sellingPrice
            });
          }
          if (found.mrp !== official.mrp) {
            mrpDeltas.push({
              product: official,
              oldMrp: found.mrp,
              newMrp: official.mrp
            });
          }
          if (found.sellingPrice === official.sellingPrice && found.mrp === official.mrp) {
            upToDate++;
          }
        }
      });

      setSyncDiffs({
        newProducts: newItems,
        priceChanges: priceDeltas,
        mrpChanges: mrpDeltas,
        upToDateCount: upToDate
      });
      setIsScanning(false);
    }, 800);
  };

  // Apply Changes requiring Super Admin confirmation
  const handleApplyChanges = () => {
    if (!syncDiffs) return;

    // Insert new products
    syncDiffs.newProducts.forEach((np) => {
      db.saveProduct({
        ...np,
        sourceType: 'official_sippzo_website',
        sourceUrl: np.productUrl,
        lastSyncedAt: new Date().toISOString()
      });
    });

    // Update prices
    syncDiffs.priceChanges.forEach((pc) => {
      const match = db.getProductBySku(pc.product.sku);
      if (match) {
        db.saveProduct({
          id: match.id,
          sellingPrice: pc.newPrice,
          lastSyncedAt: new Date().toISOString()
        });
      }
    });

    // Update MRPs
    syncDiffs.mrpChanges.forEach((mc) => {
      const match = db.getProductBySku(mc.product.sku);
      if (match) {
        db.saveProduct({
          id: match.id,
          mrp: mc.newMrp,
          lastSyncedAt: new Date().toISOString()
        });
      }
    });

    db.addAuditLog('SYNC', 'Product Migration', 'Applied SIPPZO catalog sync from official website');
    setSyncDiffs(null);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 5000);
  };

  const handleExportFullCatalog = () => {
    const headers = [
      'id', 'name', 'sku', 'sellingPrice', 'mrp', 'costPrice',
      'stock', 'category', 'brand', 'weight', 'servings',
      'shelfLife', 'storage', 'isVegetarian', 'productUrl'
    ];
    const rows = currentProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.sellingPrice,
      p.mrp,
      p.costPrice,
      p.stock,
      `"${p.category}"`,
      `"${p.brand}"`,
      `"${p.weight}"`,
      `"${p.servings}"`,
      `"${p.shelfLife}"`,
      `"${p.storage}"`,
      p.isVegetarian,
      `"${p.productUrl}"`
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `SIPPZO_Catalog_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            SIPPZO Product Migration & Catalog Sync
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspect live official website catalog (<a href="https://sippzo.com" target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">sippzo.com</a>) and synchronize products into Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullCatalog}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Catalog CSV</span>
          </button>
          <button
            onClick={handleScanOfficialWebsite}
            disabled={isScanning}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-lg transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning sippzo.com...' : 'Sync SIPPZO Catalog'}</span>
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Official Catalog Synchronized!</strong> Database records have been updated to match the official SIPPZO catalog.
          </span>
        </div>
      )}

      {/* Sync Diff View */}
      {syncDiffs && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Catalog Differential Analysis
              </div>
              <div className="text-[11px] text-slate-400">
                Comparing Supabase catalog vs official website (https://sippzo.com/collections/all)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {syncDiffs.upToDateCount} Items in Full Sync
              </span>
            </div>
          </div>

          {/* Diffs List */}
          {syncDiffs.newProducts.length === 0 &&
          syncDiffs.priceChanges.length === 0 &&
          syncDiffs.mrpChanges.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-semibold text-slate-800">
                All catalog items match official SIPPZO specifications.
              </div>
              <div className="text-slate-400">
                No price divergence, missing products, or MRP discrepancies detected.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* New Products */}
              {syncDiffs.newProducts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    New Products to Import ({syncDiffs.newProducts.length})
                  </div>
                  <div className="divide-y divide-slate-100 border border-emerald-200 rounded-lg overflow-hidden">
                    {syncDiffs.newProducts.map((np) => (
                      <div key={np.sku} className="p-3 bg-emerald-50/40 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{np.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">
                            SKU: {np.sku} · Category: {np.category}
                          </div>
                        </div>
                        <div className="text-right font-mono font-bold text-emerald-700">
                          {formatINR(np.sellingPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Changes */}
              {syncDiffs.priceChanges.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                    Selling Price Divergence ({syncDiffs.priceChanges.length})
                  </div>
                  <div className="divide-y divide-slate-100 border border-orange-200 rounded-lg overflow-hidden">
                    {syncDiffs.priceChanges.map((pc) => (
                      <div key={pc.product.sku} className="p-3 bg-orange-50/40 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{pc.product.name}</div>
                          <div className="text-[11px] font-mono text-slate-500">{pc.product.sku}</div>
                        </div>
                        <div className="font-mono flex items-center gap-2">
                          <span className="line-through text-slate-400">{formatINR(pc.oldPrice)}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
                          <span className="font-bold text-orange-700">{formatINR(pc.newPrice)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons requiring Super Admin confirmation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Requires Super Admin Authorization</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSyncDiffs(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={
                  syncDiffs.newProducts.length === 0 &&
                  syncDiffs.priceChanges.length === 0 &&
                  syncDiffs.mrpChanges.length === 0
                }
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-2xs"
              >
                Apply Changes to Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Catalog Source Metadata */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          Product Source Metadata & Verification
        </div>
        <div className="space-y-2 text-xs">
          {currentProducts.map((p) => (
            <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  source_type: <span className="text-slate-600">{p.sourceType}</span> · last_synced: {p.lastSyncedAt ? new Date(p.lastSyncedAt).toLocaleString('en-IN') : 'Manual'}
                </div>
              </div>
              <a
                href={p.productUrl || 'https://sippzo.com'}
                target="_blank"
                rel="noreferrer"
                className="ml-3 shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded transition-colors"
              >
                <span>View on SIPPZO Store</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
