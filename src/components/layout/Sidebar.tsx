import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  Warehouse,
  Boxes,
  RefreshCw,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  Truck,
  RotateCcw,
  FileText,
  CreditCard,
  Receipt,
  Store,
  FileSpreadsheet,
  SlidersHorizontal,
  Grid,
  Star,
  Award,
  Flame,
  BadgeCheck,
  BookOpen,
  FileCode,
  MessageSquareQuote,
  Image,
  ImageIcon,
  FileImage,
  UserPlus,
  Upload,
  ArrowUpDown,
  AlertOctagon,
  Settings,
  Shield,
  History,
  UserCircle,
  LogOut,
  FlameKindling,
  KanbanSquare,
  Briefcase
} from 'lucide-react';
import { UserProfile } from '../../types';
import { db } from '../../lib/db';

export type ActiveTab =
  // Main
  | 'dashboard'
  // Catalog
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory'
  | 'batches'
  | 'warehouses'
  | 'product_migration'
  // Sales
  | 'orders'
  | 'customers'
  | 'leads'
  | 'pipeline'
  | 'coupons'
  | 'reports'
  // Delivery
  | 'shipments'
  | 'returns'
  // Money
  | 'invoices'
  | 'payments'
  | 'expenses'
  // Purchase
  | 'vendors'
  | 'purchase_orders'
  // Content
  | 'banner_slider'
  | 'promo_banners'
  | 'hero_products'
  | 'featured_products'
  | 'new_arrivals'
  | 'best_sellers'
  | 'featured_brands'
  | 'blog_posts'
  | 'static_pages'
  // Reviews
  | 'reviews'
  // Media
  | 'media_library'
  | 'image_management'
  | 'image_webp'
  // Tools
  | 'customer_import'
  | 'bulk_product_import'
  | 'bulk_stock_update'
  | 'bulk_out_of_stock'
  // Settings
  | 'site_settings'
  | 'payment_settings'
  | 'seo_settings'
  | 'team_access'
  | 'audit_logs'
  | 'admin_profile';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  isCollapsed,
  onLogout
}) => {
  const productsCount = db.getProducts().length;
  const ordersCount = db.getOrders().length;
  const pendingReviewsCount = db.getReviews().filter((r) => r.status === 'pending').length;
  const lowStockCount = db.getProducts().filter((p) => p.stock <= p.lowStockThreshold).length;

  const navItem = (
    tab: ActiveTab,
    label: string,
    Icon: React.ElementType,
    badge?: string | number,
    badgeVariant?: 'default' | 'alert'
  ) => {
    const isActive = activeTab === tab;
    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`w-full flex items-center gap-3 px-3.5 py-2 text-[14px] sm:text-[15px] rounded-lg transition-all text-left group cursor-pointer relative ${
          isActive
            ? 'bg-orange-50/70 text-slate-900 font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 font-medium'
        }`}
        title={label}
      >
        {/* Subtle orange indicator bar on active item */}
        {isActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-orange-600" />
        )}
        <Icon
          className={`w-4.5 h-4.5 shrink-0 transition-colors ${
            isActive ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'
          }`}
        />
        {!isCollapsed && <span className="truncate flex-1 tracking-tight">{label}</span>}
        {!isCollapsed && badge !== undefined && (
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-mono font-medium ${
              badgeVariant === 'alert'
                ? 'bg-rose-100 text-rose-700'
                : isActive
                ? 'bg-orange-100 text-orange-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  const navSection = (title: string, children: React.ReactNode) => (
    <div className="mb-4">
      {!isCollapsed && (
        <div className="px-3.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-[#fafaf9] border-r border-slate-200/70 transition-all duration-200 shrink-0 select-none z-30 ${
        isCollapsed ? 'w-16' : 'w-68'
      }`}
    >
      {/* Brand Header - Clean & Minimal */}
      <div className="h-16 flex items-center px-4.5 shrink-0 border-b border-slate-200/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FlameKindling className="w-4.5 h-4.5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-wider text-slate-900 uppercase">
                SIPPZO
              </span>
              <span className="text-xs text-slate-400 font-mono -mt-0.5">
                Food-Tech Admin
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        {navSection('Main', [
          navItem('dashboard', 'Dashboard', LayoutDashboard)
        ])}

        {navSection('Catalog & Inventory', [
          navItem('products', 'Products', Package, productsCount),
          navItem('categories', 'Categories', Layers),
          navItem('brands', 'Brands', Sparkles),
          navItem('inventory', 'Inventory & Stock', Boxes, lowStockCount > 0 ? `${lowStockCount} low` : undefined, lowStockCount > 0 ? 'alert' : 'default'),
          navItem('batches', 'Batches & Expiry', Warehouse),
          navItem('warehouses', 'Warehouses', Store),
          navItem('product_migration', 'Product Migration', RefreshCw)
        ])}

        {navSection('Sales & Customers', [
          navItem('orders', 'Orders', ShoppingBag, ordersCount),
          navItem('customers', 'Customers', Users),
          navItem('leads', 'B2B Leads', Briefcase),
          navItem('pipeline', 'Sales Pipeline', KanbanSquare),
          navItem('coupons', 'Coupons', Ticket),
          navItem('reports', 'Sales Analytics', BarChart3)
        ])}

        {navSection('Delivery & Logistics', [
          navItem('shipments', 'Shipments', Truck),
          navItem('returns', 'Returns & Refunds', RotateCcw)
        ])}

        {navSection('Finance & Invoices', [
          navItem('invoices', 'Invoices', FileText),
          navItem('payments', 'Payments Ledger', CreditCard),
          navItem('expenses', 'Expenses', Receipt)
        ])}

        {navSection('Purchasing & Vendors', [
          navItem('vendors', 'Vendors & Suppliers', Store),
          navItem('purchase_orders', 'Purchase Orders', FileSpreadsheet)
        ])}

        {navSection('Storefront Content', [
          navItem('banner_slider', 'Banner Slider', SlidersHorizontal),
          navItem('promo_banners', 'Promo Banners', Grid),
          navItem('hero_products', 'Hero Products', Star),
          navItem('featured_products', 'Featured Products', Award),
          navItem('new_arrivals', 'New Arrivals', Flame),
          navItem('best_sellers', 'Best Sellers', BadgeCheck),
          navItem('featured_brands', 'Brand Partners', Sparkles),
          navItem('blog_posts', 'Blog Articles', BookOpen),
          navItem('static_pages', 'Static CMS Pages', FileCode)
        ])}

        {navSection('Social Proof', [
          navItem('reviews', 'Customer Reviews', MessageSquareQuote, pendingReviewsCount > 0 ? pendingReviewsCount : undefined)
        ])}

        {navSection('Media & Assets', [
          navItem('media_library', 'Media Library', Image),
          navItem('image_management', 'Image Management', ImageIcon),
          navItem('image_webp', 'WebP Optimizer', FileImage)
        ])}

        {navSection('Operations Tools', [
          navItem('customer_import', 'Bulk Customers', UserPlus),
          navItem('bulk_product_import', 'Bulk Products', Upload),
          navItem('bulk_stock_update', 'Bulk Stock Sync', ArrowUpDown),
          navItem('bulk_out_of_stock', 'Zero Stock Action', AlertOctagon)
        ])}

        {navSection('Platform Settings', [
          navItem('site_settings', 'Store Settings', Settings),
          navItem('payment_settings', 'Payment Gateways', CreditCard),
          navItem('seo_settings', 'SEO & Meta Tags', SlidersHorizontal),
          navItem('team_access', 'Team & Roles', Shield),
          navItem('audit_logs', 'Security Audit Logs', History)
        ])}

        {navSection('Account', [
          navItem('admin_profile', 'Admin Profile', UserCircle)
        ])}
      </div>

      {/* Footer Profile / Logout */}
      <div className="p-3 border-t border-slate-200/60 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer group font-medium"
          title="Sign out from SIPPZO"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          {!isCollapsed && <span className="truncate">Sign out</span>}
        </button>
      </div>
    </aside>
  );
};
