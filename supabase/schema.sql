-- ============================================================
-- SIPPZO E-COMMERCE CRM & ADMIN PANEL
-- SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'manager',
  'sales_executive',
  'warehouse_staff',
  'content_manager'
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'admin' NOT NULL,
  title TEXT DEFAULT 'Admin Staff',
  department TEXT DEFAULT 'Operations',
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. PRODUCT CATEGORIES & BRANDS
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id UUID REFERENCES public.product_brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  selling_price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  cost_price NUMERIC(10,2) NOT NULL,
  stock INT DEFAULT 0 NOT NULL,
  low_stock_threshold INT DEFAULT 10 NOT NULL,
  weight TEXT,
  servings TEXT,
  shelf_life TEXT,
  storage TEXT,
  is_vegetarian BOOLEAN DEFAULT true NOT NULL,
  ingredients TEXT,
  description TEXT,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  product_url TEXT,
  source_type TEXT DEFAULT 'official_sippzo_website',
  source_url TEXT,
  last_synced_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_hero BOOLEAN DEFAULT false NOT NULL,
  is_best_seller BOOLEAN DEFAULT false NOT NULL,
  is_new_arrival BOOLEAN DEFAULT false NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. WAREHOUSES & INVENTORY
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  manager_name TEXT,
  manager_phone TEXT,
  capacity INT DEFAULT 10000,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.warehouse_stock (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  available_stock INT DEFAULT 0 NOT NULL,
  reserved_stock INT DEFAULT 0 NOT NULL,
  damaged_stock INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(warehouse_id, product_id)
);

CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  manufacturing_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  quantity INT NOT NULL,
  status TEXT DEFAULT 'fresh' NOT NULL, -- fresh, expiring_soon, expired
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.inventory_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  warehouse_id UUID REFERENCES public.warehouses(id) ON DELETE SET NULL,
  change_type TEXT NOT NULL, -- restock, sale, return, adjustment, damage
  quantity INT NOT NULL,
  previous_stock INT NOT NULL,
  new_stock INT NOT NULL,
  reference_id TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. CUSTOMERS & ADDRESSES
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India' NOT NULL,
  industry TEXT,
  status TEXT DEFAULT 'active' NOT NULL,
  total_spent NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  total_orders INT DEFAULT 0 NOT NULL,
  last_order_at TIMESTAMPTZ,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. B2B LEADS & SALES PIPELINE
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'Website' NOT NULL,
  status TEXT DEFAULT 'New' NOT NULL, -- New, Contacted, Qualified, Proposal, Negotiation, Won, Lost
  priority TEXT DEFAULT 'Medium' NOT NULL, -- Low, Medium, High
  expected_value NUMERIC(10,2) DEFAULT 0 NOT NULL,
  assigned_rep TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. ORDERS & ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_pincode TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  tax NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  shipping_fee NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  order_status TEXT DEFAULT 'pending' NOT NULL, -- pending, confirmed, processing, packed, shipped, delivered, cancelled, returned
  payment_status TEXT DEFAULT 'pending' NOT NULL, -- pending, paid, partially_paid, refunded
  payment_method TEXT DEFAULT 'UPI' NOT NULL, -- UPI, Razorpay, Card, COD, Bank Transfer
  coupon_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_image TEXT,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);

-- 8. INVOICES & PAYMENTS
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_gstin TEXT,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  cgst NUMERIC(10,2) DEFAULT 0 NOT NULL,
  sgst NUMERIC(10,2) DEFAULT 0 NOT NULL,
  igst NUMERIC(10,2) DEFAULT 0 NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0 NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  paid_amount NUMERIC(10,2) DEFAULT 0 NOT NULL,
  balance_due NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'unpaid' NOT NULL, -- unpaid, partially_paid, paid, overdue
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_ref TEXT NOT NULL,
  status TEXT DEFAULT 'completed' NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  notes TEXT
);

-- 9. SHIPMENTS & RETURNS
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  courier_name TEXT NOT NULL, -- Delhivery, Blue Dart, Shiprocket, DTDC
  tracking_number TEXT NOT NULL,
  tracking_url TEXT,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, packed, shipped, in_transit, out_for_delivery, delivered, returned
  dispatch_date TIMESTAMPTZ,
  expected_delivery TIMESTAMPTZ,
  delivered_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  return_number TEXT UNIQUE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'requested' NOT NULL, -- requested, approved, received, rejected
  refund_status TEXT DEFAULT 'pending' NOT NULL, -- pending, processed, failed
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. CONTENT MANAGEMENT & BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  cta_text TEXT,
  cta_url TEXT,
  image_url TEXT NOT NULL,
  banner_type TEXT DEFAULT 'hero_slider' NOT NULL, -- hero_slider, promo_grid
  display_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  status TEXT DEFAULT 'approved' NOT NULL, -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author_name TEXT DEFAULT 'SIPPZO Editorial',
  is_published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.static_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  is_published BOOLEAN DEFAULT true NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS public.media_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  file_size INT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. COUPONS & EXPENSES
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'percentage' NOT NULL, -- percentage, fixed
  value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount NUMERIC(10,2),
  usage_limit INT DEFAULT 100,
  times_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  valid_from DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL, -- Packaging, Shipping, Marketing, Warehouse, Salary, Utilities, Software, Other
  title TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
  payment_method TEXT DEFAULT 'Bank Transfer',
  receipt_ref TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  gstin TEXT,
  city TEXT NOT NULL,
  products_supplied TEXT,
  outstanding_balance NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_number TEXT UNIQUE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  vendor_name TEXT NOT NULL,
  items_summary TEXT NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending, ordered, received, cancelled
  expected_delivery DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. AUDIT LOGS & SETTINGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL, -- CREATE, UPDATE, DELETE, IMPORT, EXPORT, SYNC, LOGIN
  module TEXT NOT NULL,
  record_id TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Admins and staff have full access to business records
CREATE POLICY "Staff read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Staff write access" ON public.products FOR ALL USING (true);
CREATE POLICY "Staff order access" ON public.orders FOR ALL USING (true);
CREATE POLICY "Staff customer access" ON public.customers FOR ALL USING (true);
CREATE POLICY "Staff invoices access" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Staff payments access" ON public.payments FOR ALL USING (true);
CREATE POLICY "Staff leads access" ON public.leads FOR ALL USING (true);
CREATE POLICY "Staff banners access" ON public.banners FOR ALL USING (true);
CREATE POLICY "Staff reviews access" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Staff audit logs access" ON public.audit_logs FOR ALL USING (true);
CREATE POLICY "Staff settings access" ON public.settings FOR ALL USING (true);
