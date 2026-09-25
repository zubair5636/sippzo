import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Download, CheckCircle2, Package, AlertCircle } from 'lucide-react';
import { db } from '../../lib/db';

export const BulkProductImport: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    total: number;
    imported: number;
    updated: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const template =
      'name,sku,price,mrp,cost_price,category,stock,weight,servings,shelf_life,is_vegetarian,ingredients,description\n' +
      '"Self-Heating Instant Kulhad Chai (Ginger Elaichi)","SIP-KUL-CHAI-GE99",99,120,52,"Beverages & Chai",400,"180g","1 Cup","9 Months",true,"Assam CTC, Ginger, Cardamom, Milk Solids","Authentic self-heating chai"\n' +
      '"Self-Heating Instant Poha","SIP-MEAL-POHA-119",119,149,58,"Ready Meals",300,"120g","1 Portion","12 Months",true,"Poha, Peanuts, Mustard, Curry Leaves","Indori self-steaming poha"';

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SIPPZO_Product_Catalog_Template.csv';
    link.click();
  };

  const handleImport = () => {
    if (!csvFile) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setIsProcessing(false);
        return;
      }

      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length <= 1) {
        setIsProcessing(false);
        alert('Empty CSV or missing header row.');
        return;
      }

      let imported = 0;
      let updated = 0;

      const headers = lines[0].split(',').map((h) => h.replace(/["\s]/g, '').toLowerCase());
      const nameIdx = headers.indexOf('name');
      const skuIdx = headers.indexOf('sku');
      const priceIdx = headers.indexOf('price');
      const mrpIdx = headers.indexOf('mrp');
      const stockIdx = headers.indexOf('stock');
      const catIdx = headers.indexOf('category');
      const descIdx = headers.indexOf('description');

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        const name = cols[nameIdx] || 'SIPPZO Product';
        const sku = cols[skuIdx] || 'SIP-' + Math.floor(1000 + Math.random() * 9000);
        const price = Number(cols[priceIdx]) || 99;
        const mrp = Number(cols[mrpIdx]) || price + 20;
        const stock = Number(cols[stockIdx]) || 100;
        const category = cols[catIdx] || 'Beverages & Chai';
        const description = cols[descIdx] || 'Delicious instant self-heating food.';

        const existing = db.getProductBySku(sku);
        if (existing) {
          db.saveProduct({
            id: existing.id,
            name,
            sellingPrice: price,
            mrp,
            stock,
            category,
            description
          });
          updated++;
        } else {
          db.saveProduct({
            name,
            sku,
            sellingPrice: price,
            mrp,
            stock,
            category,
            description
          });
          imported++;
        }
      }

      setResult({
        total: lines.length - 1,
        imported,
        updated
      });
      setIsProcessing(false);
      db.addAuditLog('IMPORT', 'Catalog', `Imported ${imported} new products and updated ${updated} from ${csvFile.name}`);
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Bulk Product CSV Importer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Add or batch-update SIPPZO food catalog, MRP, prices, and stock inventory.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download CSV Template</span>
        </button>
      </div>

      {/* Form Card matching video frame 00:54 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Upload Product Inventory CSV
          </div>
          <p className="text-xs text-slate-400">
            Supported columns: <span className="font-mono text-slate-700">name, sku, price, stock, description, mrp, category, weight, servings</span>
          </p>
        </div>

        <div className="p-6 border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center transition-colors">
          <input
            type="file"
            id="product-csv-file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="product-csv-file"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="w-8 h-8 text-emerald-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">
              {csvFile ? csvFile.name : 'Select Catalog CSV File'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Choose File'}
            </span>
          </label>
        </div>

        <button
          onClick={handleImport}
          disabled={!csvFile || isProcessing}
          className="py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Processing Products...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Import Products</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Import Summary
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-lg font-bold font-mono">{result.total}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Rows</div>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-lg font-bold font-mono text-emerald-700">{result.imported}</div>
              <div className="text-[10px] text-emerald-600 uppercase font-semibold">New Products</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold font-mono text-blue-700">{result.updated}</div>
              <div className="text-[10px] text-blue-600 uppercase font-semibold">Updated Existing</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
