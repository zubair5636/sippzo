import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, Download, Users } from 'lucide-react';
import { db } from '../../lib/db';
import { Customer } from '../../types';

export const BulkCustomerImport: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<{
    total: number;
    valid: number;
    newCount: number;
    updatedCount: number;
    skippedCount: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setSummary(null);
    }
  };

  const handleDownloadTemplate = () => {
    const templateContent =
      'name,email,phone,company,address,city,state,pincode,country,industry,notes,tags\n' +
      '"Amit Verma","amit.verma@example.in","+91 98201 44552","Verma Tech","B-402 Gomti Nagar","Lucknow","Uttar Pradesh","226010","India","IT","Loves Kulhad Chai","Tea Lover;Repeat"\n' +
      '"Priya Singh","priya.singh@trails.in","+91 97188 33441","Himalayan Trails","Civil Lines","Kanpur","Uttar Pradesh","208001","India","Adventure","Trek bulk order","B2B;Bulk"';

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'SIPPZO_Customer_Import_Template.csv';
    link.click();
  };

  const handleProcessImport = () => {
    if (!csvFile) {
      alert('Please choose a CSV file first.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) {
        setIsProcessing(false);
        return;
      }

      const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length <= 1) {
        alert('CSV file appears empty or has only headers.');
        setIsProcessing(false);
        return;
      }

      const existingCustomers = db.getCustomers();
      let valid = 0;
      let newCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // Parse headers
      const headers = lines[0].split(',').map((h) => h.replace(/["\s]/g, '').toLowerCase());
      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const phoneIdx = headers.indexOf('phone');
      const companyIdx = headers.indexOf('company');
      const cityIdx = headers.indexOf('city');
      const stateIdx = headers.indexOf('state');
      const pincodeIdx = headers.indexOf('pincode');
      const tagsIdx = headers.indexOf('tags');

      for (let i = 1; i < lines.length; i++) {
        // Regex to split by comma outside quotes
        const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        const cleanCol = (idx: number) =>
          idx !== -1 && cols[idx] ? cols[idx].replace(/^"|"$/g, '').trim() : '';

        const name = cleanCol(nameIdx);
        const email = cleanCol(emailIdx);
        const phone = cleanCol(phoneIdx);

        if (!name || (!email && !phone)) {
          errors.push(`Row ${i + 1}: Name and either Email or Phone are required.`);
          skippedCount++;
          continue;
        }

        valid++;
        const existing = existingCustomers.find(
          (c) =>
            (email && c.email.toLowerCase() === email.toLowerCase()) ||
            (phone && c.phone === phone)
        );

        if (existing) {
          // Update
          db.saveCustomer({
            id: existing.id,
            name: name || existing.name,
            company: cleanCol(companyIdx) || existing.company,
            city: cleanCol(cityIdx) || existing.city,
            state: cleanCol(stateIdx) || existing.state,
            pincode: cleanCol(pincodeIdx) || existing.pincode
          });
          updatedCount++;
        } else {
          // New customer
          db.saveCustomer({
            name,
            email: email || `user_${Date.now()}@sippzo.in`,
            phone: phone || '+91 98000 00000',
            company: cleanCol(companyIdx),
            city: cleanCol(cityIdx) || 'Lucknow',
            state: cleanCol(stateIdx) || 'Uttar Pradesh',
            pincode: cleanCol(pincodeIdx) || '226010',
            country: 'India',
            status: 'active',
            tags: cleanCol(tagsIdx) ? cleanCol(tagsIdx).split(';') : ['CSV Imported']
          });
          newCount++;
        }
      }

      setSummary({
        total: lines.length - 1,
        valid,
        newCount,
        updatedCount,
        skippedCount,
        errors
      });
      setIsProcessing(false);
      db.addAuditLog('IMPORT', 'Customers', `Imported ${valid} customers from ${csvFile.name} (${newCount} new, ${updatedCount} updated)`);
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            Bulk Customer CSV Import
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Import existing retail buyers, corporate pantry partners, or event leads into SIPPZO CRM.
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

      {/* Main Import Card directly matching video frame 00:41 */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Import Customers via CSV
          </div>
          <p className="text-xs text-slate-400">
            Upload a CSV file containing columns: <span className="font-mono text-slate-700">name, email, phone, company, city, state, pincode, tags</span>
          </p>
        </div>

        <div className="p-6 border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center transition-colors">
          <input
            type="file"
            id="csv-file-input"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="csv-file-input"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            <Upload className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-xs font-bold text-slate-800">
              {csvFile ? csvFile.name : 'Choose CSV File'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {csvFile ? `${(csvFile.size / 1024).toFixed(1)} KB` : 'Click to browse from your device'}
            </span>
          </label>
        </div>

        {/* Notice banner matching video */}
        <div className="p-3.5 rounded-lg bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Security Credential Notice</div>
            <div className="text-[11px] text-amber-800 mt-0.5">
              Imported customers will be initialized with temporary default password <span className="font-mono font-bold">Customer@12345</span>. They can reset it upon first storefront login.
            </div>
          </div>
        </div>

        <button
          onClick={handleProcessImport}
          disabled={!csvFile || isProcessing}
          className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <span>Processing CSV Rows...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Process Customer Import</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Report if available */}
      {summary && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Import Execution Summary
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {summary.valid} of {summary.total} Rows Processed
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-lg font-bold text-slate-800 font-mono">{summary.total}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Rows</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-bold text-emerald-700 font-mono">{summary.newCount}</div>
              <div className="text-[10px] uppercase font-bold text-emerald-600">New Customers</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-lg font-bold text-blue-700 font-mono">{summary.updatedCount}</div>
              <div className="text-[10px] uppercase font-bold text-blue-600">Updated</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-lg font-bold text-amber-700 font-mono">{summary.skippedCount}</div>
              <div className="text-[10px] uppercase font-bold text-amber-600">Skipped</div>
            </div>
          </div>

          {summary.errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs space-y-1">
              <div className="font-bold">Errors Encountered:</div>
              {summary.errors.slice(0, 5).map((err, i) => (
                <div key={i} className="text-[11px] font-mono">{err}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
