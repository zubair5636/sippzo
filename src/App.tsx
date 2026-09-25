import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Sidebar
} from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { Products } from './components/catalog/Products';
import { Categories } from './components/catalog/Categories';
import { Brands } from './components/catalog/Brands';
import { Inventory } from './components/catalog/Inventory';
import { Batches } from './components/catalog/Batches';
import { Warehouses } from './components/catalog/Warehouses';
import { ProductMigration } from './components/catalog/ProductMigration';
import { Orders } from './components/sales/Orders';
import { Customers } from './components/sales/Customers';
import { B2BLeads } from './components/sales/B2BLeads';
import { SalesPipeline } from './components/sales/SalesPipeline';
import { Coupons } from './components/sales/Coupons';
import { Reports } from './components/reports/Reports';
import { Shipments } from './components/delivery/Shipments';
import { Returns } from './components/delivery/Returns';
import { Invoices } from './components/money/Invoices';
import { Payments } from './components/money/Payments';
import { Expenses } from './components/money/Expenses';
import { Vendors } from './components/purchase/Vendors';
import { BannerSlider } from './components/content/BannerSlider';
import { PromoBanners } from './components/content/PromoBanners';
import { CurateCollections } from './components/content/CurateCollections';
import { BlogPosts } from './components/content/BlogPosts';
import { StaticPages } from './components/content/StaticPages';
import { Reviews } from './components/reviews/Reviews';
import { MediaLibrary } from './components/media/MediaLibrary';
import { WebPOptimizer } from './components/media/WebPOptimizer';
import { BulkCustomerImport } from './components/tools/BulkCustomerImport';
import { BulkProductImport } from './components/tools/BulkProductImport';
import { BulkStockUpdate } from './components/tools/BulkStockUpdate';
import { BulkOutOfStock } from './components/tools/BulkOutOfStock';
import { SettingsManager } from './components/settings/SettingsManager';
import { AdminProfile } from './components/account/AdminProfile';
import { StorefrontModal } from './components/storefront/StorefrontModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { db, subscribeToDB } from './lib/db';
import { UserProfile } from './types';
import {
  getSupabaseSession,
  signOutSupabase,
  onSupabaseAuthStateChange,
  mapSupabaseUserToProfile
} from './lib/supabase';
import { FlameKindling } from 'lucide-react';

const pathToTabMap: Record<string, ActiveTab> = {
  '': 'dashboard',
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/products': 'products',
  '/categories': 'categories',
  '/brands': 'brands',
  '/inventory': 'inventory',
  '/batches': 'batches',
  '/warehouses': 'warehouses',
  '/product_migration': 'product_migration',
  '/orders': 'orders',
  '/customers': 'customers',
  '/leads': 'leads',
  '/pipeline': 'pipeline',
  '/coupons': 'coupons',
  '/campaigns': 'coupons',
  '/reports': 'reports',
  '/shipments': 'shipments',
  '/returns': 'returns',
  '/invoices': 'invoices',
  '/payments': 'payments',
  '/expenses': 'expenses',
  '/vendors': 'vendors',
  '/purchase_orders': 'purchase_orders',
  '/banner_slider': 'banner_slider',
  '/promo_banners': 'promo_banners',
  '/hero_products': 'hero_products',
  '/featured_products': 'featured_products',
  '/new_arrivals': 'new_arrivals',
  '/best_sellers': 'best_sellers',
  '/featured_brands': 'featured_brands',
  '/blog_posts': 'blog_posts',
  '/static_pages': 'static_pages',
  '/reviews': 'reviews',
  '/media_library': 'media_library',
  '/image_management': 'image_management',
  '/image_webp': 'image_webp',
  '/customer_import': 'customer_import',
  '/bulk_product_import': 'bulk_product_import',
  '/bulk_stock_update': 'bulk_stock_update',
  '/bulk_out_of_stock': 'bulk_out_of_stock',
  '/site_settings': 'site_settings',
  '/settings': 'site_settings',
  '/payment_settings': 'payment_settings',
  '/seo_settings': 'seo_settings',
  '/team_access': 'team_access',
  '/team': 'team_access',
  '/audit_logs': 'audit_logs',
  '/admin_profile': 'admin_profile',
};

const getTabFromPath = (path: string): ActiveTab => {
  const cleanPath = path.replace(/\/$/, '') || '/';
  return pathToTabMap[cleanPath] || 'dashboard';
};

export default function App() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'dashboard';
  });

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const newPath = tab === 'dashboard' ? '/' : `/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTabState(getTabFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(db.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Modals
  const [isStorefrontModalOpen, setIsStorefrontModalOpen] = useState(false);

  // Verify real Supabase session on startup
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const session = await getSupabaseSession();
        if (session && session.user && isMounted) {
          const profile = await mapSupabaseUserToProfile(session.user);
          setCurrentUser(profile);
          db.setCurrentUser(profile);
          setIsAuthenticated(true);
        } else if (isMounted) {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Supabase session verification error:', err);
        if (isMounted) setIsAuthenticated(false);
      } finally {
        if (isMounted) setIsAuthChecking(false);
      }
    }

    checkSession();

    // Listen to real-time auth changes from Supabase
    const subscription = onSupabaseAuthStateChange(async (event, session) => {
      if (session && session.user && isMounted) {
        const profile = await mapSupabaseUserToProfile(session.user);
        setCurrentUser(profile);
        db.setCurrentUser(profile);
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setIsAuthenticated(false);
      }
    });

    return () => {
      isMounted = false;
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Re-render when database changes anywhere
  useEffect(() => {
    const unsubscribe = subscribeToDB(() => {
      setCurrentUser(db.getCurrentUser());
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutSupabase();
    } catch (e) {
      console.error('Supabase sign-out error:', e);
    }
    setIsAuthenticated(false);
  };

  // Auth checking loader
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center text-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-xs mb-3 animate-pulse">
          <FlameKindling className="w-5 h-5" />
        </div>
        <div className="w-4 h-4 border-2 border-slate-300 border-t-orange-600 rounded-full animate-spin mb-2" />
        <p className="text-xs text-slate-400 font-medium">Verifying admin session...</p>
      </div>
    );
  }

  // If not authenticated via Supabase, strictly show AuthScreen
  if (!isAuthenticated) {
    return (
      <AuthScreen
        onAuthenticated={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            onNewProduct={() => setActiveTab('products')}
          />
        );
      case 'reports':
        return <Reports />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'brands':
        return <Brands />;
      case 'inventory':
        return <Inventory />;
      case 'batches':
        return <Batches />;
      case 'warehouses':
        return <Warehouses />;
      case 'product_migration':
        return <ProductMigration />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'leads':
        return <B2BLeads />;
      case 'pipeline':
        return <SalesPipeline />;
      case 'coupons':
        return <Coupons />;
      case 'shipments':
        return <Shipments />;
      case 'returns':
        return <Returns />;
      case 'invoices':
        return <Invoices />;
      case 'payments':
        return <Payments />;
      case 'expenses':
        return <Expenses />;
      case 'vendors':
      case 'purchase_orders':
        return <Vendors />;
      case 'banner_slider':
        return <BannerSlider />;
      case 'promo_banners':
        return <PromoBanners />;
      case 'hero_products':
        return <CurateCollections type="hero" />;
      case 'featured_products':
        return <CurateCollections type="featured" />;
      case 'new_arrivals':
        return <CurateCollections type="new_arrival" />;
      case 'best_sellers':
        return <CurateCollections type="best_seller" />;
      case 'featured_brands':
        return <CurateCollections type="brands" />;
      case 'blog_posts':
        return <BlogPosts />;
      case 'static_pages':
        return <StaticPages />;
      case 'reviews':
        return <Reviews />;
      case 'media_library':
      case 'image_management':
        return <MediaLibrary />;
      case 'image_webp':
        return <WebPOptimizer />;
      case 'customer_import':
        return <BulkCustomerImport />;
      case 'bulk_product_import':
        return <BulkProductImport />;
      case 'bulk_stock_update':
        return <BulkStockUpdate />;
      case 'bulk_out_of_stock':
        return <BulkOutOfStock />;
      case 'site_settings':
        return <SettingsManager initialSubTab="site" />;
      case 'payment_settings':
        return <SettingsManager initialSubTab="payment" />;
      case 'seo_settings':
        return <SettingsManager initialSubTab="seo" />;
      case 'team_access':
        return <SettingsManager initialSubTab="team" />;
      case 'audit_logs':
        return <SettingsManager initialSubTab="audit" />;
      case 'admin_profile':
        return <AdminProfile currentUser={currentUser} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} onNewProduct={() => setActiveTab('products')} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafaf9] text-slate-800 antialiased font-sans selection:bg-orange-500 selection:text-white">
      {/* Sleek, lightweight sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Floating Topbar */}
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onOpenStorefront={() => setIsStorefrontModalOpen(true)}
          onNewProduct={() => setActiveTab('products')}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Spacious, unboxed canvas (occupies 92-96% available width) */}
        <main className="flex-1 w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-12 py-8 pb-20 overflow-y-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Interactive Storefront Customer Preview Modal */}
      <StorefrontModal
        isOpen={isStorefrontModalOpen}
        onClose={() => setIsStorefrontModalOpen(false)}
      />
    </div>
  );
}
