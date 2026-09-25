import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ExternalLink,
  Bell,
  Plus,
  ShoppingBag,
  Package,
  Users,
  X,
  Menu,
  ChevronRight
} from 'lucide-react';
import { UserProfile, Product, Order, Customer } from '../../types';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';
import { ActiveTab } from './Sidebar';

interface TopbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onOpenStorefront: () => void;
  onNewProduct: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenStorefront,
  onNewProduct,
  onLogout,
  isCollapsed,
  setIsCollapsed
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    orders: Order[];
    customers: Customer[];
  }>({
    products: [],
    orders: [],
    customers: []
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live global search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], orders: [], customers: [] });
      return;
    }

    const q = searchQuery.toLowerCase();
    const p = db.getProducts().filter(
      (item) => item.name.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q)
    );
    const o = db.getOrders().filter(
      (item) => item.orderNumber.toLowerCase().includes(q) || item.customerName.toLowerCase().includes(q)
    );
    const c = db.getCustomers().filter(
      (item) => item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)
    );

    setSearchResults({
      products: p.slice(0, 4),
      orders: o.slice(0, 4),
      customers: c.slice(0, 4)
    });
  }, [searchQuery]);

  const hasResults =
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.customers.length > 0;

  const lowStockAlerts = db.getProducts().filter((p) => p.stock <= p.lowStockThreshold);

  return (
    <header className="h-16 sticky top-0 bg-[#fafaf9]/90 backdrop-blur-md border-b border-slate-200/70 z-20 flex items-center justify-between px-6 sm:px-10 lg:px-12 transition-all">
      {/* Left: Mobile collapse toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 font-medium">
          <span className="hover:text-slate-600 transition-colors">SIPPZO</span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="font-semibold text-slate-900 capitalize">
            {activeTab.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Middle: Minimal Soft Global Search */}
      <div className="relative flex-1 max-w-md mx-6" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-8 py-2 text-sm sm:text-[15px] bg-white hover:bg-white focus:bg-white border border-slate-200/80 focus:border-orange-500 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && searchQuery && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-modal border border-slate-100 max-h-96 overflow-y-auto z-50 text-sm divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            {!hasResults ? (
              <div className="p-5 text-center text-slate-400 text-sm">
                No matching records for "{searchQuery}"
              </div>
            ) : (
              <>
                {searchResults.products.length > 0 && (
                  <div className="p-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-2.5">
                      Products
                    </div>
                    {searchResults.products.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveTab('products');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Package className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium text-slate-800 text-sm">{p.name}</span>
                        </div>
                        <span className="font-mono text-slate-600 font-semibold text-sm shrink-0">
                          {formatINR(p.sellingPrice)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.orders.length > 0 && (
                  <div className="p-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-2.5">
                      Orders
                    </div>
                    {searchResults.orders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          setActiveTab('orders');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="font-mono font-semibold text-slate-800 text-sm">{o.orderNumber}</span>
                          <span className="truncate text-slate-500 text-sm">({o.customerName})</span>
                        </div>
                        <span className="font-mono text-slate-900 font-bold text-sm shrink-0">
                          {formatINR(o.totalAmount)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.customers.length > 0 && (
                  <div className="p-2.5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-2.5">
                      Customers
                    </div>
                    {searchResults.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveTab('customers');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left p-2.5 hover:bg-slate-50 rounded-lg flex items-center justify-between group cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Users className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate font-medium text-slate-800 text-sm">{c.name}</span>
                          <span className="truncate text-slate-400 text-xs">({c.email})</span>
                        </div>
                        <span className="font-mono text-slate-500 text-xs shrink-0">
                          {c.totalOrders || 0} orders
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Navigation & User Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* + Add Product Primary CTA (SIPPZO Orange Accent) */}
        <button
          onClick={onNewProduct}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Product</span>
        </button>

        {/* Live Customer Storefront */}
        <button
          onClick={onOpenStorefront}
          className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Open Live Customer Storefront"
        >
          <ExternalLink className="w-4.5 h-4.5" />
        </button>

        {/* Inventory Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {lowStockAlerts.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full ring-2 ring-[#fafaf9]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-modal border border-slate-100 p-4 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
              <div className="font-semibold text-slate-900 text-sm mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span>Stock Notifications</span>
                <span className="text-xs text-slate-500 font-normal">{lowStockAlerts.length} items</span>
              </div>
              {lowStockAlerts.length === 0 ? (
                <div className="text-slate-400 text-sm py-3 text-center">All stock levels are optimal.</div>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto">
                  {lowStockAlerts.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveTab('inventory');
                        setShowNotifications(false);
                      }}
                      className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="font-medium text-slate-800 text-sm truncate">{p.name}</div>
                      <div className="text-xs text-rose-600 font-mono mt-0.5">
                        {p.stock} units remaining (buffer: {p.lowStockThreshold})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Account Avatar & Dropdown */}
        <div className="relative pl-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="hidden md:inline text-sm font-semibold text-slate-800">
              {currentUser.fullName}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-modal border border-slate-100 py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-900 truncate">{currentUser.fullName}</div>
                <div className="text-xs text-slate-500 font-mono truncate">{currentUser.email}</div>
              </div>
              <button
                onClick={() => {
                  setActiveTab('admin_profile');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Profile & Security
              </button>
              <button
                onClick={() => {
                  setActiveTab('site_settings');
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
              >
                Store Settings
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
