import React, { useState } from 'react';
import {
  Settings,
  CreditCard,
  SlidersHorizontal,
  Shield,
  History,
  CheckCircle2,
  UserPlus,
  Trash2,
  Truck,
  Percent,
  Bell
} from 'lucide-react';
import { db } from '../../lib/db';
import { AppSettings, UserProfile } from '../../types';
import { AdminModal } from '../common/AdminModal';
import { AdminPageHeader } from '../common/AdminComponents';

interface SettingsManagerProps {
  initialSubTab?: 'site' | 'payment' | 'shipping' | 'tax' | 'notifications' | 'seo' | 'team' | 'audit';
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({ initialSubTab = 'site' }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'site' | 'payment' | 'shipping' | 'tax' | 'notifications' | 'seo' | 'team' | 'audit'
  >(initialSubTab);

  const [settings, setSettings] = useState<AppSettings>(db.getSettings());
  const [saveNotice, setSaveNotice] = useState(false);

  const staffMembers = db.getStaffMembers();
  const auditLogs = db.getAuditLogs();

  // Add staff modal
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'sales_executive' as UserProfile['role'],
    title: 'Sales Associate',
    department: 'Sales'
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateSettings(settings);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName || !newStaff.email) return;

    db.addStaffMember({
      ...newStaff,
      isActive: true,
      adminSince: 'Sep 2026',
      lastLogin: 'Never'
    });
    setIsStaffOpen(false);
  };

  const handleRemoveStaff = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      const ok = db.removeStaffMember(id);
      if (!ok) alert('Cannot delete the primary Super Administrator account.');
    }
  };

  const tabs = [
    { key: 'site', label: 'General & Store', icon: Settings },
    { key: 'payment', label: 'Payments', icon: CreditCard },
    { key: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { key: 'tax', label: 'Tax & GST', icon: Percent },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'seo', label: 'SEO & Metadata', icon: SlidersHorizontal },
    { key: 'team', label: 'Team & Access', icon: Shield },
    { key: 'audit', label: 'Audit Trail', icon: History }
  ];

  return (
    <div className="space-y-8 w-full">
      <AdminPageHeader
        title="Settings"
        subtitle="Manage business configuration, payment methods, delivery zones, and staff access"
      />

      {saveNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 text-sm text-emerald-800 flex items-center gap-2.5 border border-emerald-200/60">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">Settings successfully saved.</span>
        </div>
      )}

      {/* Modern Two-Column Settings Layout (Navigation Left, Content Right) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Left Column: Clean Navigation List (NO Box) */}
        <div className="space-y-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveSubTab(tab.key as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm sm:text-[15px] rounded-lg transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Setting Forms on Soft Surface */}
        <div className="md:col-span-3 bg-white p-7 sm:p-8 rounded-2xl shadow-premium border border-slate-200/80">
          {/* 1. General & Store Settings */}
          {activeSubTab === 'site' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Business Information
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  General details displayed to customers across email invoices and receipts
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm sm:text-base">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Phone</label>
                    <input
                      type="text"
                      value={settings.storePhone}
                      onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Orders Email</label>
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">GSTIN Number</label>
                    <input
                      type="text"
                      value={settings.gstin}
                      onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 uppercase transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Timezone</label>
                    <input
                      type="text"
                      disabled
                      value="Asia/Kolkata (IST - UTC+05:30)"
                      className="w-full text-base bg-slate-100/70 border border-slate-200/70 rounded-lg px-3.5 py-2.5 text-slate-500 font-mono cursor-not-allowed shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
                    <input
                      type="text"
                      disabled
                      value="INR - Indian Rupee (₹)"
                      className="w-full text-base bg-slate-100/70 border border-slate-200/70 rounded-lg px-3.5 py-2.5 text-slate-500 font-mono cursor-not-allowed shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business Address</label>
                  <textarea
                    rows={2}
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Save Business Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Payment Settings */}
          {activeSubTab === 'payment' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Payment Gateways
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Configure domestic Indian payment methods and checkout integrations
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm sm:text-base">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={settings.razorpayKeyId}
                    onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                    placeholder="rzp_live_..."
                    className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={settings.razorpayEnabled}
                      onChange={(e) => setSettings({ ...settings, razorpayEnabled: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">Razorpay Payment Gateway</div>
                      <div className="text-xs sm:text-sm text-slate-500">Credit / Debit Cards, NetBanking, Wallets</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={settings.upiEnabled}
                      onChange={(e) => setSettings({ ...settings, upiEnabled: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">Direct UPI Payments</div>
                      <div className="text-xs sm:text-sm text-slate-500">Google Pay, PhonePe, Paytm, BHIM QR</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                    <input
                      type="checkbox"
                      checked={settings.codEnabled}
                      onChange={(e) => setSettings({ ...settings, codEnabled: e.target.checked })}
                      className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 text-sm sm:text-base">Cash on Delivery (COD)</div>
                      <div className="text-xs sm:text-sm text-slate-500">Pay cash upon delivery at verified pincodes</div>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Save Payment Options
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Shipping & Delivery Settings */}
          {activeSubTab === 'shipping' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Shipping & Courier Delivery
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Set delivery thresholds, standard charges and fulfillment rules
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm sm:text-base">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Free Shipping Cart Value (₹)
                    </label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          freeShippingThreshold: parseFloat(e.target.value) || 499
                        })
                      }
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">
                      Orders above this threshold qualify for zero shipping fee.
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Standard Shipping Charge (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={49}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50/70 rounded-xl text-sm text-slate-600 border border-slate-200/60 leading-relaxed">
                  <div className="font-semibold text-slate-800 mb-1 text-base">Integrated Logistics Dispatch</div>
                  Auto-allocation enabled for Delhivery, Blue Dart, Ekart, DTDC with automated AWB numbers and label generation.
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Save Shipping Rules
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. Tax & GST Settings */}
          {activeSubTab === 'tax' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Taxation & GST Rates
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Indian Goods and Services Tax compliance settings
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm sm:text-base">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Standard GST Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={settings.taxRatePercent}
                      onChange={(e) =>
                        setSettings({ ...settings, taxRatePercent: parseFloat(e.target.value) || 5 })
                      }
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 font-mono focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                    <span className="text-xs text-slate-500 mt-1 block">
                      Packaged self-heating food and ready-to-drink chai bracket: 5% (CGST 2.5% + SGST 2.5%).
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Pricing Tax Calculation</label>
                    <select className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs">
                      <option value="inclusive">MRP inclusive of all taxes (Default)</option>
                      <option value="exclusive">Calculate tax additionally at checkout</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Save Tax Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 5. Notifications Settings */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Notification Triggers
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Configure automated emails and SMS dispatch events
                </p>
              </div>

              <div className="space-y-3.5 text-sm sm:text-base">
                <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer" />
                  <div>
                    <div className="font-semibold text-slate-900">Order Placed Email Confirmation</div>
                    <div className="text-xs sm:text-sm text-slate-500">Send customer an instant PDF invoice upon payment</div>
                  </div>
                </label>

                <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer" />
                  <div>
                    <div className="font-semibold text-slate-900">Low Stock Alert Notifications</div>
                    <div className="text-xs sm:text-sm text-slate-500">Notify inventory managers when product stock drops below threshold</div>
                  </div>
                </label>

                <label className="flex items-center gap-3.5 p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-slate-200/60">
                  <input type="checkbox" defaultChecked className="w-4.5 h-4.5 rounded text-orange-600 focus:ring-orange-500 cursor-pointer" />
                  <div>
                    <div className="font-semibold text-slate-900">Dispatch & AWB Tracking Updates</div>
                    <div className="text-xs sm:text-sm text-slate-500">Send WhatsApp / SMS tracking links when orders are packed</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* 6. SEO Settings */}
          {activeSubTab === 'seo' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  SEO & Search Engine Metadata
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Search snippet tags and social OpenGraph definitions
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-5 text-sm sm:text-base">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Title</label>
                  <input
                    type="text"
                    value={settings.seoTitle}
                    onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Description</label>
                  <textarea
                    rows={2}
                    value={settings.seoDescription}
                    onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Meta Keywords</label>
                  <input
                    type="text"
                    value={settings.seoKeywords}
                    onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                    className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                  />
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    Save SEO Metadata
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 7. Team & Access */}
          {activeSubTab === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Team Members & Roles
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Authorized staff accounts and operational privileges
                  </p>
                </div>

                <button
                  onClick={() => setIsStaffOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {staffMembers.map((member) => (
                  <div key={member.id} className="py-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                        {member.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2.5 text-sm sm:text-base">
                          <span>{member.fullName}</span>
                          <span className="px-2.5 py-0.5 rounded-md text-xs uppercase font-semibold bg-slate-100 text-slate-700">
                            {member.role.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {member.email} · {member.title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-600 font-medium">Active</span>
                      {member.role !== 'super_admin' && (
                        <button
                          onClick={() => handleRemoveStaff(member.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer rounded-lg hover:bg-slate-50"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <AdminModal
                isOpen={isStaffOpen}
                onClose={() => setIsStaffOpen(false)}
                title="Add SIPPZO Staff Member"
                maxWidth="md"
              >
                <form onSubmit={handleAddStaff} className="space-y-4 text-sm sm:text-base">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStaff.fullName}
                      onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                    <select
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                    >
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="sales_executive">Sales Executive</option>
                      <option value="warehouse_staff">Warehouse Staff</option>
                      <option value="content_manager">Content Manager</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation Title</label>
                    <input
                      type="text"
                      value={newStaff.title}
                      onChange={(e) => setNewStaff({ ...newStaff, title: e.target.value })}
                      className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsStaffOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer"
                    >
                      Add Member
                    </button>
                  </div>
                </form>
              </AdminModal>
            </div>
          )}

          {/* 8. Audit Logs */}
          {activeSubTab === 'audit' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3.5">
                <h3 className="text-xl font-bold text-slate-900">
                  Security Audit Trail
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Logged administrative changes and action records
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 font-semibold uppercase text-xs border-b border-slate-200/80 bg-slate-50/60">
                    <tr>
                      <th className="py-3 px-3.5">Timestamp</th>
                      <th className="py-3 px-3.5">User</th>
                      <th className="py-3 px-3.5 text-center">Action</th>
                      <th className="py-3 px-3.5">Module</th>
                      <th className="py-3 px-3.5">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3.5 font-mono text-slate-400 text-xs whitespace-nowrap">
                          {log.timestamp}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-800 text-xs">{log.userEmail}</td>
                        <td className="py-3 px-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-800">{log.module}</td>
                        <td className="py-3 px-3.5 text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
