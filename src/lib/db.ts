import {
  Product,
  ProductCategory,
  ProductBrand,
  Customer,
  Order,
  B2BLead,
  Deal,
  Invoice,
  PaymentReceipt,
  Warehouse,
  Batch,
  Shipment,
  ReturnRequest,
  Vendor,
  PurchaseOrder,
  Expense,
  Coupon,
  Campaign,
  BannerItem,
  ReviewItem,
  MediaItem,
  BlogPost,
  StaticPage,
  AppSettings,
  UserProfile,
  AuditLog
} from '../types';

import {
  INITIAL_SUPER_ADMIN,
  INITIAL_STAFF_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_WAREHOUSES,
  INITIAL_BATCHES,
  INITIAL_SHIPMENTS,
  INITIAL_RETURNS,
  INITIAL_VENDORS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_EXPENSES,
  INITIAL_COUPONS,
  INITIAL_CAMPAIGNS,
  INITIAL_BANNERS,
  INITIAL_REVIEWS,
  INITIAL_MEDIA,
  INITIAL_BLOG_POSTS,
  INITIAL_STATIC_PAGES,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS
} from '../data/sippzoCatalog';

import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const STORAGE_PREFIX = 'sippzo_db_';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

type DBListener = () => void;
const listeners = new Set<DBListener>();

export function subscribeToDB(listener: DBListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyDBChange(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error in DB change listener:', e);
    }
  });
}

class DatabaseManager {
  private products: Product[] = [];
  private categories: ProductCategory[] = [];
  private brands: ProductBrand[] = [];
  private customers: Customer[] = [];
  private orders: Order[] = [];
  private leads: B2BLead[] = [];
  private deals: Deal[] = [];
  private invoices: Invoice[] = [];
  private payments: PaymentReceipt[] = [];
  private warehouses: Warehouse[] = [];
  private batches: Batch[] = [];
  private shipments: Shipment[] = [];
  private returns: ReturnRequest[] = [];
  private vendors: Vendor[] = [];
  private purchaseOrders: PurchaseOrder[] = [];
  private expenses: Expense[] = [];
  private coupons: Coupon[] = [];
  private campaigns: Campaign[] = [];
  private banners: BannerItem[] = [];
  private reviews: ReviewItem[] = [];
  private media: MediaItem[] = [];
  private blogPosts: BlogPost[] = [];
  private staticPages: StaticPage[] = [];
  private settings: AppSettings = INITIAL_SETTINGS;
  private currentUser: UserProfile = INITIAL_SUPER_ADMIN;
  private staffMembers: UserProfile[] = [];
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.products = loadFromStorage('products', INITIAL_PRODUCTS);
    this.categories = loadFromStorage('categories', INITIAL_CATEGORIES);
    this.brands = loadFromStorage('brands', INITIAL_BRANDS);
    this.customers = loadFromStorage('customers', INITIAL_CUSTOMERS);
    this.orders = loadFromStorage('orders', INITIAL_ORDERS);
    this.leads = loadFromStorage('leads', INITIAL_LEADS);
    this.deals = loadFromStorage('deals', INITIAL_DEALS);
    this.invoices = loadFromStorage('invoices', INITIAL_INVOICES);
    this.payments = loadFromStorage('payments', INITIAL_PAYMENTS);
    this.warehouses = loadFromStorage('warehouses', INITIAL_WAREHOUSES);
    this.batches = loadFromStorage('batches', INITIAL_BATCHES);
    this.shipments = loadFromStorage('shipments', INITIAL_SHIPMENTS);
    this.returns = loadFromStorage('returns', INITIAL_RETURNS);
    this.vendors = loadFromStorage('vendors', INITIAL_VENDORS);
    this.purchaseOrders = loadFromStorage('purchase_orders', INITIAL_PURCHASE_ORDERS);
    this.expenses = loadFromStorage('expenses', INITIAL_EXPENSES);
    this.coupons = loadFromStorage('coupons', INITIAL_COUPONS);
    this.campaigns = loadFromStorage('campaigns', INITIAL_CAMPAIGNS);
    this.banners = loadFromStorage('banners', INITIAL_BANNERS);
    this.reviews = loadFromStorage('reviews', INITIAL_REVIEWS);
    this.media = loadFromStorage('media', INITIAL_MEDIA);
    this.blogPosts = loadFromStorage('blog_posts', INITIAL_BLOG_POSTS);
    this.staticPages = loadFromStorage('static_pages', INITIAL_STATIC_PAGES);
    this.settings = loadFromStorage('settings', INITIAL_SETTINGS);
    this.currentUser = loadFromStorage('current_user', INITIAL_SUPER_ADMIN);
    this.staffMembers = loadFromStorage('staff_members', INITIAL_STAFF_MEMBERS);
    this.auditLogs = loadFromStorage('audit_logs', INITIAL_AUDIT_LOGS);

    this.trySupabaseSync();
  }

  private async trySupabaseSync() {
    if (!isSupabaseConfigured()) return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      // Sync products if table exists in Supabase
      const { data: dbProducts } = await client.from('products').select('*').limit(50);
      if (dbProducts && dbProducts.length > 0) {
        console.log('Synchronized products from live Supabase:', dbProducts.length);
      }
    } catch (err) {
      console.warn('Supabase sync status:', err);
    }
  }

  // --- Audit Logging ---
  public addAuditLog(action: AuditLog['action'], module: string, details: string, recordId?: string) {
    const log: AuditLog = {
      id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
      userEmail: this.currentUser?.email || 'zubair669262@gmail.com',
      action,
      module,
      recordId,
      details,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    this.auditLogs = [log, ...this.auditLogs].slice(0, 100);
    saveToStorage('audit_logs', this.auditLogs);

    // Sync to Supabase if available
    const client = getSupabaseClient();
    if (client) {
      client.from('audit_logs').insert([{
        user_email: log.userEmail,
        action: log.action,
        module: log.module,
        record_id: log.recordId,
        details: log.details
      }]).then(() => {}, () => {});
    }

    notifyDBChange();
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- Current User & Staff ---
  public getCurrentUser(): UserProfile {
    return { ...this.currentUser };
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    saveToStorage('current_user', this.currentUser);
    notifyDBChange();
  }

  public updateCurrentUser(updates: Partial<UserProfile>): UserProfile {
    this.currentUser = { ...this.currentUser, ...updates };
    saveToStorage('current_user', this.currentUser);

    const client = getSupabaseClient();
    if (client && this.currentUser.id) {
      client.from('profiles').update({
        full_name: this.currentUser.fullName,
        phone: this.currentUser.phone,
        title: this.currentUser.title
      }).eq('id', this.currentUser.id).then(() => {}, () => {});
    }

    this.addAuditLog('UPDATE', 'Profile', `Updated profile info for ${this.currentUser.email}`);
    notifyDBChange();
    return this.currentUser;
  }

  public getStaffMembers(): UserProfile[] {
    return [...this.staffMembers];
  }

  public addStaffMember(member: Omit<UserProfile, 'id'>): UserProfile {
    const newMember: UserProfile = {
      ...member,
      id: 'usr_' + Date.now()
    };
    this.staffMembers.push(newMember);
    saveToStorage('staff_members', this.staffMembers);
    this.addAuditLog('CREATE', 'Team', `Added staff user ${newMember.fullName} (${newMember.role})`);
    notifyDBChange();
    return newMember;
  }

  public removeStaffMember(id: string): boolean {
    if (id === this.currentUser.id || id === 'usr_super_zubair_01') {
      return false;
    }
    const target = this.staffMembers.find((s) => s.id === id);
    this.staffMembers = this.staffMembers.filter((s) => s.id !== id);
    saveToStorage('staff_members', this.staffMembers);
    if (target) {
      this.addAuditLog('DELETE', 'Team', `Removed staff user ${target.fullName}`);
    }
    notifyDBChange();
    return true;
  }

  // --- Products CRUD ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getProductBySku(sku: string): Product | undefined {
    return this.products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());
  }

  public saveProduct(productData: Partial<Product>): Product {
    const client = getSupabaseClient();

    if (productData.id && this.products.some((p) => p.id === productData.id)) {
      this.products = this.products.map((p) => {
        if (p.id === productData.id) {
          return {
            ...p,
            ...productData,
            updatedAt: new Date().toISOString()
          } as Product;
        }
        return p;
      });
      saveToStorage('products', this.products);

      if (client) {
        client.from('products').update({
          name: productData.name,
          selling_price: productData.sellingPrice,
          mrp: productData.mrp,
          cost_price: productData.costPrice,
          stock: productData.stock,
          category: productData.category,
          description: productData.description
        }).eq('sku', productData.sku).then(() => {}, () => {});
      }

      this.addAuditLog('UPDATE', 'Products', `Updated product ${productData.name} (${productData.sku})`, productData.id);
      notifyDBChange();
      return this.products.find((p) => p.id === productData.id)!;
    } else {
      const newProduct: Product = {
        id: 'prod_' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: productData.name || 'New SIPPZO Item',
        sku: productData.sku || 'SIP-' + Math.floor(1000 + Math.random() * 9000),
        slug: productData.slug || (productData.name || 'product').toLowerCase().replace(/\s+/g, '-'),
        brand: productData.brand || 'SIPPZO',
        category: productData.category || 'Beverages & Chai',
        sellingPrice: Number(productData.sellingPrice) || 99,
        mrp: Number(productData.mrp) || 120,
        costPrice: Number(productData.costPrice) || 50,
        stock: Number(productData.stock) || 50,
        lowStockThreshold: Number(productData.lowStockThreshold) || 10,
        weight: productData.weight || '180g (Ready Cup)',
        servings: productData.servings || '1 Cup',
        shelfLife: productData.shelfLife || '9 Months',
        storage: productData.storage || 'Store in a cool, dry place',
        isVegetarian: productData.isVegetarian ?? true,
        ingredients: productData.ingredients || 'Natural ingredients & thermal pack',
        description: productData.description || 'Authentic SIPPZO self-heating product.',
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        galleryUrls: productData.galleryUrls || [],
        productUrl: productData.productUrl || 'https://sippzo.com/collections/all',
        sourceType: productData.sourceType || 'manual_admin',
        sourceUrl: productData.sourceUrl || 'https://sippzo.com',
        lastSyncedAt: new Date().toISOString(),
        isActive: productData.isActive ?? true,
        isFeatured: productData.isFeatured ?? false,
        isHero: productData.isHero ?? false,
        isBestSeller: productData.isBestSeller ?? false,
        isNewArrival: productData.isNewArrival ?? true,
        tags: productData.tags || ['Self-Heating'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.products.unshift(newProduct);
      saveToStorage('products', this.products);

      if (client) {
        client.from('products').insert([{
          name: newProduct.name,
          sku: newProduct.sku,
          slug: newProduct.slug,
          selling_price: newProduct.sellingPrice,
          mrp: newProduct.mrp,
          cost_price: newProduct.costPrice,
          stock: newProduct.stock,
          weight: newProduct.weight,
          servings: newProduct.servings,
          shelf_life: newProduct.shelfLife,
          storage: newProduct.storage,
          is_vegetarian: newProduct.isVegetarian,
          ingredients: newProduct.ingredients,
          description: newProduct.description,
          image_url: newProduct.imageUrl,
          product_url: newProduct.productUrl
        }]).then(() => {}, () => {});
      }

      this.addAuditLog('CREATE', 'Products', `Created product ${newProduct.name} (${newProduct.sku})`, newProduct.id);
      notifyDBChange();
      return newProduct;
    }
  }

  public deleteProduct(id: string): boolean {
    const target = this.products.find((p) => p.id === id);
    if (!target) return false;
    this.products = this.products.filter((p) => p.id !== id);
    saveToStorage('products', this.products);

    const client = getSupabaseClient();
    if (client) {
      client.from('products').delete().eq('sku', target.sku).then(() => {}, () => {});
    }

    this.addAuditLog('DELETE', 'Products', `Deleted product ${target.name} (${target.sku})`, id);
    notifyDBChange();
    return true;
  }

  public duplicateProduct(id: string): Product | null {
    const original = this.products.find((p) => p.id === id);
    if (!original) return null;
    const duplicated: Product = {
      ...original,
      id: 'prod_' + Date.now(),
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-CP-${Math.floor(Math.random() * 1000)}`,
      slug: `${original.slug}-copy`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.unshift(duplicated);
    saveToStorage('products', this.products);
    this.addAuditLog('CREATE', 'Products', `Duplicated product ${original.sku} to ${duplicated.sku}`);
    notifyDBChange();
    return duplicated;
  }

  public bulkUpdateStock(updates: { sku: string; quantity: number }[]): { success: number; failed: number } {
    let success = 0;
    let failed = 0;
    updates.forEach(({ sku, quantity }) => {
      const p = this.products.find((item) => item.sku.toLowerCase() === sku.toLowerCase());
      if (p) {
        p.stock = quantity;
        p.updatedAt = new Date().toISOString();
        success++;
      } else {
        failed++;
      }
    });
    saveToStorage('products', this.products);
    this.addAuditLog('UPDATE', 'Inventory', `Bulk stock updated for ${success} items`);
    notifyDBChange();
    return { success, failed };
  }

  public bulkMarkOutOfStock(skus: string[]): number {
    let count = 0;
    this.products.forEach((p) => {
      if (skus.includes(p.sku)) {
        p.stock = 0;
        p.updatedAt = new Date().toISOString();
        count++;
      }
    });
    saveToStorage('products', this.products);
    this.addAuditLog('UPDATE', 'Inventory', `Marked ${count} products as OUT OF STOCK`);
    notifyDBChange();
    return count;
  }

  public updateCuratedCollection(
    type: 'featured' | 'hero' | 'best_seller' | 'new_arrival',
    productIds: string[]
  ): void {
    this.products.forEach((p) => {
      if (type === 'featured') p.isFeatured = productIds.includes(p.id);
      if (type === 'hero') p.isHero = productIds.includes(p.id);
      if (type === 'best_seller') p.isBestSeller = productIds.includes(p.id);
      if (type === 'new_arrival') p.isNewArrival = productIds.includes(p.id);
    });
    saveToStorage('products', this.products);
    this.addAuditLog('UPDATE', 'Content', `Updated homepage curated collection for ${type}`);
    notifyDBChange();
  }

  // --- Categories CRUD ---
  public getCategories(): ProductCategory[] {
    return [...this.categories];
  }

  public saveCategory(category: Partial<ProductCategory>): ProductCategory {
    if (category.id && this.categories.some((c) => c.id === category.id)) {
      this.categories = this.categories.map((c) => (c.id === category.id ? { ...c, ...category } : c));
    } else {
      const newCat: ProductCategory = {
        id: 'cat_' + Date.now(),
        name: category.name || 'New Category',
        slug: category.slug || (category.name || 'cat').toLowerCase().replace(/\s+/g, '-'),
        description: category.description || '',
        displayOrder: category.displayOrder || this.categories.length + 1,
        isActive: category.isActive ?? true
      };
      this.categories.push(newCat);
    }
    saveToStorage('categories', this.categories);
    this.addAuditLog('UPDATE', 'Categories', `Saved category ${category.name}`);
    notifyDBChange();
    return this.categories[this.categories.length - 1];
  }

  public deleteCategory(id: string): boolean {
    const target = this.categories.find((c) => c.id === id);
    this.categories = this.categories.filter((c) => c.id !== id);
    saveToStorage('categories', this.categories);
    if (target) {
      this.addAuditLog('DELETE', 'Categories', `Deleted category ${target.name}`);
    }
    notifyDBChange();
    return true;
  }

  // --- Brands CRUD ---
  public getBrands(): ProductBrand[] {
    return [...this.brands];
  }

  public saveBrand(brand: Partial<ProductBrand>): ProductBrand {
    if (brand.id && this.brands.some((b) => b.id === brand.id)) {
      this.brands = this.brands.map((b) => (b.id === brand.id ? { ...b, ...brand } : b));
    } else {
      const newBrand: ProductBrand = {
        id: 'brand_' + Date.now(),
        name: brand.name || 'New Brand',
        slug: brand.slug || (brand.name || 'brand').toLowerCase().replace(/\s+/g, '-'),
        websiteUrl: brand.websiteUrl || 'https://sippzo.com',
        isFeatured: brand.isFeatured ?? true
      };
      this.brands.push(newBrand);
    }
    saveToStorage('brands', this.brands);
    this.addAuditLog('UPDATE', 'Brands', `Saved brand partner ${brand.name}`);
    notifyDBChange();
    return this.brands[this.brands.length - 1];
  }

  public deleteBrand(id: string): boolean {
    const target = this.brands.find((b) => b.id === id);
    this.brands = this.brands.filter((b) => b.id !== id);
    saveToStorage('brands', this.brands);
    if (target) {
      this.addAuditLog('DELETE', 'Brands', `Deleted brand ${target.name}`);
    }
    notifyDBChange();
    return true;
  }

  public updateCuratedBrands(brandIds: string[]): void {
    this.brands.forEach((b) => {
      b.isFeatured = brandIds.includes(b.id);
    });
    saveToStorage('brands', this.brands);
    this.addAuditLog('UPDATE', 'Content', `Updated featured brand partners`);
    notifyDBChange();
  }

  // --- Customers CRUD ---
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  public saveCustomer(customerData: Partial<Customer>): Customer {
    const client = getSupabaseClient();

    if (customerData.id && this.customers.some((c) => c.id === customerData.id)) {
      this.customers = this.customers.map((c) => (c.id === customerData.id ? { ...c, ...customerData } : c));
      saveToStorage('customers', this.customers);

      if (client) {
        client.from('customers').update({
          name: customerData.name,
          phone: customerData.phone,
          city: customerData.city,
          state: customerData.state,
          company: customerData.company
        }).eq('email', customerData.email).then(() => {}, () => {});
      }

      this.addAuditLog('UPDATE', 'Customers', `Updated customer ${customerData.name}`, customerData.id);
      notifyDBChange();
      return this.customers.find((c) => c.id === customerData.id)!;
    } else {
      const newCustomer: Customer = {
        id: 'cust_' + Date.now(),
        name: customerData.name || 'New Customer',
        email: customerData.email || 'customer@example.in',
        phone: customerData.phone || '+91 98000 00000',
        company: customerData.company || '',
        address: customerData.address || '',
        city: customerData.city || 'Lucknow',
        state: customerData.state || 'Uttar Pradesh',
        pincode: customerData.pincode || '226001',
        country: 'India',
        industry: customerData.industry || 'Consumer',
        status: customerData.status || 'active',
        totalSpent: customerData.totalSpent || 0,
        totalOrders: customerData.totalOrders || 0,
        notes: customerData.notes || '',
        tags: customerData.tags || ['Customer'],
        createdAt: new Date().toISOString()
      };
      this.customers.unshift(newCustomer);
      saveToStorage('customers', this.customers);

      if (client) {
        client.from('customers').insert([{
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          company: newCustomer.company,
          city: newCustomer.city,
          state: newCustomer.state,
          pincode: newCustomer.pincode,
          country: newCustomer.country,
          status: newCustomer.status
        }]).then(() => {}, () => {});
      }

      this.addAuditLog('CREATE', 'Customers', `Added customer ${newCustomer.name} (${newCustomer.email})`, newCustomer.id);
      notifyDBChange();
      return newCustomer;
    }
  }

  public deleteCustomer(id: string): boolean {
    const target = this.customers.find((c) => c.id === id);
    if (!target) return false;
    this.customers = this.customers.filter((c) => c.id !== id);
    saveToStorage('customers', this.customers);

    const client = getSupabaseClient();
    if (client) {
      client.from('customers').delete().eq('email', target.email).then(() => {}, () => {});
    }

    this.addAuditLog('DELETE', 'Customers', `Deleted customer ${target.name}`, id);
    notifyDBChange();
    return true;
  }

  // --- Orders CRUD ---
  public getOrders(): Order[] {
    return [...this.orders];
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id);
  }

  public saveOrder(orderData: Partial<Order>): Order {
    const client = getSupabaseClient();

    if (orderData.id && this.orders.some((o) => o.id === orderData.id)) {
      this.orders = this.orders.map((o) => {
        if (o.id === orderData.id) {
          return { ...o, ...orderData, updatedAt: new Date().toISOString() } as Order;
        }
        return o;
      });
      saveToStorage('orders', this.orders);

      if (client) {
        client.from('orders').update({
          order_status: orderData.orderStatus,
          payment_status: orderData.paymentStatus
        }).eq('order_number', orderData.orderNumber).then(() => {}, () => {});
      }

      this.addAuditLog('UPDATE', 'Orders', `Updated order ${orderData.orderNumber || orderData.id}`, orderData.id);
      notifyDBChange();
      return this.orders.find((o) => o.id === orderData.id)!;
    } else {
      const orderNum = 'SIP-ORD-' + Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber: orderNum,
        customerId: orderData.customerId || 'cust_guest',
        customerName: orderData.customerName || 'Direct Customer',
        customerEmail: orderData.customerEmail || 'orders@sippzo.com',
        customerPhone: orderData.customerPhone || '+91 98000 00000',
        shippingAddress: orderData.shippingAddress || 'Lucknow Hub',
        shippingCity: orderData.shippingCity || 'Lucknow',
        shippingState: orderData.shippingState || 'Uttar Pradesh',
        shippingPincode: orderData.shippingPincode || '226010',
        subtotal: orderData.subtotal || 198,
        discount: orderData.discount || 0,
        tax: orderData.tax || 9.9,
        shippingFee: orderData.shippingFee || 40,
        totalAmount: orderData.totalAmount || 247.9,
        orderStatus: orderData.orderStatus || 'pending',
        paymentStatus: orderData.paymentStatus || 'pending',
        paymentMethod: orderData.paymentMethod || 'UPI',
        couponCode: orderData.couponCode,
        notes: orderData.notes,
        items: orderData.items || [],
        timeline: [
          {
            title: 'Order Created',
            time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            description: `Order registered via ${orderData.paymentMethod || 'UPI'}`
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.orders.unshift(newOrder);
      saveToStorage('orders', this.orders);

      // Decrement product inventory
      newOrder.items.forEach((item) => {
        const prod = this.products.find((p) => p.id === item.productId || p.sku === item.productSku);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      saveToStorage('products', this.products);

      // Generate invoice
      this.createInvoiceFromOrder(newOrder);

      if (client) {
        client.from('orders').insert([{
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_email: newOrder.customerEmail,
          customer_phone: newOrder.customerPhone,
          shipping_address: newOrder.shippingAddress,
          shipping_city: newOrder.shippingCity,
          shipping_state: newOrder.shippingState,
          shipping_pincode: newOrder.shippingPincode,
          subtotal: newOrder.subtotal,
          total_amount: newOrder.totalAmount,
          order_status: newOrder.orderStatus,
          payment_status: newOrder.paymentStatus,
          payment_method: newOrder.paymentMethod
        }]).then(() => {}, () => {});
      }

      this.addAuditLog('CREATE', 'Orders', `Created order ${newOrder.orderNumber} for ₹${newOrder.totalAmount}`, newOrder.id);
      notifyDBChange();
      return newOrder;
    }
  }

  public deleteOrder(id: string): boolean {
    const target = this.orders.find((o) => o.id === id);
    if (!target) return false;
    this.orders = this.orders.filter((o) => o.id !== id);
    saveToStorage('orders', this.orders);

    const client = getSupabaseClient();
    if (client) {
      client.from('orders').delete().eq('order_number', target.orderNumber).then(() => {}, () => {});
    }

    this.addAuditLog('DELETE', 'Orders', `Deleted order ${target.orderNumber}`, id);
    notifyDBChange();
    return true;
  }

  public updateOrderStatus(orderId: string, status: Order['orderStatus']): void {
    const o = this.orders.find((ord) => ord.id === orderId);
    if (o) {
      o.orderStatus = status;
      o.timeline.push({
        title: `Status updated to ${status.toUpperCase()}`,
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        description: `Status changed to ${status}`
      });
      o.updatedAt = new Date().toISOString();
      saveToStorage('orders', this.orders);

      const client = getSupabaseClient();
      if (client) {
        client.from('orders').update({ order_status: status }).eq('order_number', o.orderNumber).then(() => {}, () => {});
      }

      this.addAuditLog('UPDATE', 'Orders', `Order ${o.orderNumber} status -> ${status}`, o.id);
      notifyDBChange();
    }
  }

  // --- Invoices CRUD ---
  public getInvoices(): Invoice[] {
    return [...this.invoices];
  }

  public createInvoiceFromOrder(order: Order): Invoice {
    const invNum = 'INV-2026-' + String(this.invoices.length + 45).padStart(4, '0');
    const newInvoice: Invoice = {
      id: 'inv_' + Date.now(),
      invoiceNumber: invNum,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerAddress: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} - ${order.shippingPincode}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      subtotal: order.subtotal,
      cgst: +(order.tax / 2).toFixed(2),
      sgst: +(order.tax / 2).toFixed(2),
      igst: 0,
      discount: order.discount,
      totalAmount: order.totalAmount,
      paidAmount: order.paymentStatus === 'paid' ? order.totalAmount : 0,
      balanceDue: order.paymentStatus === 'paid' ? 0 : order.totalAmount,
      status: order.paymentStatus === 'paid' ? 'paid' : 'unpaid',
      items: order.items.map((i) => ({
        description: i.productName,
        sku: i.productSku,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.totalPrice
      }))
    };
    this.invoices.unshift(newInvoice);
    saveToStorage('invoices', this.invoices);
    return newInvoice;
  }

  public saveInvoice(invoiceData: Partial<Invoice>): Invoice {
    if (invoiceData.id && this.invoices.some((i) => i.id === invoiceData.id)) {
      this.invoices = this.invoices.map((i) => (i.id === invoiceData.id ? { ...i, ...invoiceData } : i));
    } else {
      const invNum = 'INV-2026-' + String(this.invoices.length + 50).padStart(4, '0');
      const newInv: Invoice = {
        id: 'inv_' + Date.now(),
        invoiceNumber: invNum,
        customerId: invoiceData.customerId || 'cust_direct',
        customerName: invoiceData.customerName || 'Direct Customer',
        customerEmail: invoiceData.customerEmail || 'orders@sippzo.com',
        customerAddress: invoiceData.customerAddress || 'Lucknow, UP',
        issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
        subtotal: invoiceData.subtotal || 100,
        cgst: invoiceData.cgst || 2.5,
        sgst: invoiceData.sgst || 2.5,
        igst: invoiceData.igst || 0,
        discount: invoiceData.discount || 0,
        totalAmount: invoiceData.totalAmount || 105,
        paidAmount: invoiceData.paidAmount || 0,
        balanceDue: invoiceData.balanceDue || 105,
        status: invoiceData.status || 'unpaid',
        items: invoiceData.items || []
      };
      this.invoices.unshift(newInv);
    }
    saveToStorage('invoices', this.invoices);
    this.addAuditLog('UPDATE', 'Invoices', `Saved invoice ${invoiceData.invoiceNumber || 'New'}`);
    notifyDBChange();
    return this.invoices[0];
  }

  public deleteInvoice(id: string): boolean {
    this.invoices = this.invoices.filter((i) => i.id !== id);
    saveToStorage('invoices', this.invoices);
    notifyDBChange();
    return true;
  }

  // --- Payments CRUD ---
  public getPayments(): PaymentReceipt[] {
    return [...this.payments];
  }

  public recordPayment(payment: Omit<PaymentReceipt, 'id' | 'receiptNumber' | 'receiptDate'>): PaymentReceipt {
    const recNum = 'REC-2026-' + String(this.payments.length + 85).padStart(4, '0');
    const newPayment: PaymentReceipt = {
      ...payment,
      id: 'pay_' + Date.now(),
      receiptNumber: recNum,
      receiptDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    this.payments.unshift(newPayment);
    saveToStorage('payments', this.payments);

    if (payment.invoiceNumber) {
      const inv = this.invoices.find((i) => i.invoiceNumber === payment.invoiceNumber);
      if (inv) {
        inv.paidAmount = Math.min(inv.totalAmount, inv.paidAmount + payment.amount);
        inv.balanceDue = Math.max(0, inv.totalAmount - inv.paidAmount);
        inv.status = inv.balanceDue === 0 ? 'paid' : 'partially_paid';
        saveToStorage('invoices', this.invoices);
      }
    }

    if (payment.orderNumber) {
      const ord = this.orders.find((o) => o.orderNumber === payment.orderNumber);
      if (ord) {
        ord.paymentStatus = 'paid';
        saveToStorage('orders', this.orders);
      }
    }

    this.addAuditLog('CREATE', 'Payments', `Recorded payment of ₹${payment.amount} from ${payment.customerName}`, newPayment.id);
    notifyDBChange();
    return newPayment;
  }

  public deletePayment(id: string): boolean {
    this.payments = this.payments.filter((p) => p.id !== id);
    saveToStorage('payments', this.payments);
    notifyDBChange();
    return true;
  }

  // --- B2B Leads & Deals CRUD ---
  public getLeads(): B2BLead[] {
    return [...this.leads];
  }

  public saveLead(leadData: Partial<B2BLead>): B2BLead {
    if (leadData.id && this.leads.some((l) => l.id === leadData.id)) {
      this.leads = this.leads.map((l) => (l.id === leadData.id ? { ...l, ...leadData } : l));
      saveToStorage('leads', this.leads);
      this.addAuditLog('UPDATE', 'CRM Leads', `Updated lead ${leadData.name}`, leadData.id);
      notifyDBChange();
      return this.leads.find((l) => l.id === leadData.id)!;
    } else {
      const newLead: B2BLead = {
        id: 'lead_' + Date.now(),
        name: leadData.name || 'New Contact',
        company: leadData.company || 'Enterprise Partner',
        phone: leadData.phone || '+91 98000 00000',
        email: leadData.email || 'lead@example.in',
        source: leadData.source || 'Website',
        status: leadData.status || 'New',
        priority: leadData.priority || 'Medium',
        expectedValue: Number(leadData.expectedValue) || 25000,
        assignedRep: leadData.assignedRep || 'Priya Singh',
        notes: leadData.notes || '',
        createdAt: new Date().toISOString()
      };
      this.leads.unshift(newLead);
      saveToStorage('leads', this.leads);
      this.addAuditLog('CREATE', 'CRM Leads', `Added B2B lead ${newLead.company}`, newLead.id);
      notifyDBChange();
      return newLead;
    }
  }

  public deleteLead(id: string): boolean {
    const target = this.leads.find((l) => l.id === id);
    this.leads = this.leads.filter((l) => l.id !== id);
    saveToStorage('leads', this.leads);
    if (target) {
      this.addAuditLog('DELETE', 'CRM Leads', `Deleted lead ${target.company}`);
    }
    notifyDBChange();
    return true;
  }

  public convertLeadToCustomer(leadId: string): Customer | null {
    const lead = this.leads.find((l) => l.id === leadId);
    if (!lead) return null;

    const newCust = this.saveCustomer({
      name: lead.name,
      company: lead.company,
      phone: lead.phone,
      email: lead.email,
      notes: `Converted from B2B lead. ${lead.notes || ''}`,
      tags: ['B2B Converted']
    });

    lead.status = 'Won';
    saveToStorage('leads', this.leads);
    this.addAuditLog('UPDATE', 'CRM Leads', `Converted lead ${lead.company} to active customer`);
    notifyDBChange();
    return newCust;
  }

  public getDeals(): Deal[] {
    return [...this.deals];
  }

  public saveDeal(dealData: Partial<Deal>): Deal {
    if (dealData.id && this.deals.some((d) => d.id === dealData.id)) {
      this.deals = this.deals.map((d) => (d.id === dealData.id ? { ...d, ...dealData } : d));
    } else {
      const newDeal: Deal = {
        id: 'deal_' + Date.now(),
        title: dealData.title || 'New Deal',
        company: dealData.company || 'Partner Org',
        contactName: dealData.contactName || 'Lead Person',
        value: Number(dealData.value) || 30000,
        stage: dealData.stage || 'New',
        probability: Number(dealData.probability) || 50,
        expectedCloseDate: dealData.expectedCloseDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        assignedRep: dealData.assignedRep || 'Priya Singh'
      };
      this.deals.unshift(newDeal);
    }
    saveToStorage('deals', this.deals);
    notifyDBChange();
    return this.deals[0];
  }

  public deleteDeal(id: string): boolean {
    this.deals = this.deals.filter((d) => d.id !== id);
    saveToStorage('deals', this.deals);
    notifyDBChange();
    return true;
  }

  public updateDealStage(dealId: string, stage: Deal['stage']): void {
    const d = this.deals.find((deal) => deal.id === dealId);
    if (d) {
      d.stage = stage;
      saveToStorage('deals', this.deals);
      this.addAuditLog('UPDATE', 'Pipeline', `Moved deal ${d.title} to ${stage}`);
      notifyDBChange();
    }
  }

  // --- Warehouses & Inventory CRUD ---
  public getWarehouses(): Warehouse[] {
    return [...this.warehouses];
  }

  public saveWarehouse(wh: Partial<Warehouse>): Warehouse {
    if (wh.id && this.warehouses.some((w) => w.id === wh.id)) {
      this.warehouses = this.warehouses.map((w) => (w.id === wh.id ? { ...w, ...wh } : w));
    } else {
      const newWh: Warehouse = {
        id: 'wh_' + Date.now(),
        name: wh.name || 'New Regional Hub',
        code: wh.code || 'WH-' + Math.floor(100 + Math.random() * 900),
        address: wh.address || '',
        city: wh.city || 'Lucknow',
        state: wh.state || 'Uttar Pradesh',
        pincode: wh.pincode || '226010',
        managerName: wh.managerName || 'Staff Incharge',
        managerPhone: wh.managerPhone || '+91 98000 00000',
        capacity: Number(wh.capacity) || 10000,
        currentStock: Number(wh.currentStock) || 0,
        isActive: wh.isActive ?? true
      };
      this.warehouses.push(newWh);
    }
    saveToStorage('warehouses', this.warehouses);
    this.addAuditLog('UPDATE', 'Warehouses', `Saved warehouse ${wh.name}`);
    notifyDBChange();
    return this.warehouses[this.warehouses.length - 1];
  }

  public deleteWarehouse(id: string): boolean {
    this.warehouses = this.warehouses.filter((w) => w.id !== id);
    saveToStorage('warehouses', this.warehouses);
    notifyDBChange();
    return true;
  }

  public getBatches(): Batch[] {
    return [...this.batches];
  }

  public saveBatch(batch: Partial<Batch>): Batch {
    if (batch.id && this.batches.some((b) => b.id === batch.id)) {
      this.batches = this.batches.map((b) => (b.id === batch.id ? { ...b, ...batch } : b));
    } else {
      const newBatch: Batch = {
        id: 'batch_' + Date.now(),
        batchNumber: batch.batchNumber || 'BAT-2026-CHAI-' + Math.floor(10 + Math.random() * 90),
        productId: batch.productId || 'prod_kulhad_chai_ge',
        productName: batch.productName || 'Self-Heating Instant Kulhad Chai',
        warehouseId: batch.warehouseId || 'wh_delhi',
        warehouseName: batch.warehouseName || 'Delhi NCR Central Fulfillment Hub',
        manufacturingDate: batch.manufacturingDate || new Date().toISOString().split('T')[0],
        expiryDate: batch.expiryDate || new Date(Date.now() + 270 * 86400000).toISOString().split('T')[0],
        quantity: Number(batch.quantity) || 500,
        status: batch.status || 'fresh'
      };
      this.batches.unshift(newBatch);
    }
    saveToStorage('batches', this.batches);
    this.addAuditLog('UPDATE', 'Batches', `Saved batch ${batch.batchNumber || 'New'}`);
    notifyDBChange();
    return this.batches[0];
  }

  public deleteBatch(id: string): boolean {
    this.batches = this.batches.filter((b) => b.id !== id);
    saveToStorage('batches', this.batches);
    notifyDBChange();
    return true;
  }

  // --- Shipments & Returns CRUD ---
  public getShipments(): Shipment[] {
    return [...this.shipments];
  }

  public saveShipment(shipment: Partial<Shipment>): Shipment {
    if (shipment.id && this.shipments.some((s) => s.id === shipment.id)) {
      this.shipments = this.shipments.map((s) => (s.id === shipment.id ? { ...s, ...shipment } : s));
    } else {
      const newShipment: Shipment = {
        id: 'shp_' + Date.now(),
        shipmentNumber: 'SHP-' + Math.floor(9000 + Math.random() * 900),
        orderNumber: shipment.orderNumber || 'SIP-ORD-9425',
        customerName: shipment.customerName || 'Valued Customer',
        courierName: shipment.courierName || 'Delhivery',
        trackingNumber: shipment.trackingNumber || 'DL' + Math.floor(100000000 + Math.random() * 900000000),
        status: shipment.status || 'pending',
        dispatchDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      };
      this.shipments.unshift(newShipment);
    }
    saveToStorage('shipments', this.shipments);
    notifyDBChange();
    return this.shipments[0];
  }

  public deleteShipment(id: string): boolean {
    this.shipments = this.shipments.filter((s) => s.id !== id);
    saveToStorage('shipments', this.shipments);
    notifyDBChange();
    return true;
  }

  public getReturns(): ReturnRequest[] {
    return [...this.returns];
  }

  public saveReturn(ret: Partial<ReturnRequest>): ReturnRequest {
    if (ret.id && this.returns.some((r) => r.id === ret.id)) {
      this.returns = this.returns.map((r) => (r.id === ret.id ? { ...r, ...ret } : r));
    } else {
      const newRet: ReturnRequest = {
        id: 'ret_' + Date.now(),
        returnNumber: 'RET-2026-' + Math.floor(1000 + Math.random() * 9000),
        orderNumber: ret.orderNumber || 'SIP-ORD-9421',
        customerName: ret.customerName || 'Customer',
        reason: ret.reason || 'Item return requested',
        items: ret.items || 'Kulhad Chai',
        amount: Number(ret.amount) || 99,
        status: ret.status || 'requested',
        refundStatus: ret.refundStatus || 'pending',
        createdAt: new Date().toISOString()
      };
      this.returns.unshift(newRet);
    }
    saveToStorage('returns', this.returns);
    notifyDBChange();
    return this.returns[0];
  }

  public deleteReturn(id: string): boolean {
    this.returns = this.returns.filter((r) => r.id !== id);
    saveToStorage('returns', this.returns);
    notifyDBChange();
    return true;
  }

  // --- Vendors & Purchases CRUD ---
  public getVendors(): Vendor[] {
    return [...this.vendors];
  }

  public saveVendor(vendor: Partial<Vendor>): Vendor {
    if (vendor.id && this.vendors.some((v) => v.id === vendor.id)) {
      this.vendors = this.vendors.map((v) => (v.id === vendor.id ? { ...v, ...vendor } : v));
    } else {
      const newVen: Vendor = {
        id: 'ven_' + Date.now(),
        name: vendor.name || 'New Supplier',
        contactPerson: vendor.contactPerson || '',
        phone: vendor.phone || '+91 98000 00000',
        email: vendor.email || 'vendor@example.in',
        gstin: vendor.gstin || '',
        city: vendor.city || 'Lucknow',
        productsSupplied: vendor.productsSupplied || 'Raw Materials',
        outstandingBalance: Number(vendor.outstandingBalance) || 0,
        isActive: vendor.isActive ?? true
      };
      this.vendors.push(newVen);
    }
    saveToStorage('vendors', this.vendors);
    this.addAuditLog('UPDATE', 'Vendors', `Saved vendor ${vendor.name}`);
    notifyDBChange();
    return this.vendors[this.vendors.length - 1];
  }

  public deleteVendor(id: string): boolean {
    this.vendors = this.vendors.filter((v) => v.id !== id);
    saveToStorage('vendors', this.vendors);
    notifyDBChange();
    return true;
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return [...this.purchaseOrders];
  }

  public savePurchaseOrder(po: Partial<PurchaseOrder>): PurchaseOrder {
    if (po.id && this.purchaseOrders.some((p) => p.id === po.id)) {
      this.purchaseOrders = this.purchaseOrders.map((p) => (p.id === po.id ? { ...p, ...po } : p));
    } else {
      const newPo: PurchaseOrder = {
        id: 'po_' + Date.now(),
        poNumber: 'PO-2026-' + Math.floor(100 + Math.random() * 900),
        vendorId: po.vendorId || 'ven_01',
        vendorName: po.vendorName || 'Supplier Partner',
        itemsSummary: po.itemsSummary || 'Raw materials',
        totalAmount: Number(po.totalAmount) || 25000,
        status: po.status || 'ordered',
        expectedDate: po.expectedDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      this.purchaseOrders.unshift(newPo);
    }
    saveToStorage('purchase_orders', this.purchaseOrders);
    notifyDBChange();
    return this.purchaseOrders[0];
  }

  public deletePurchaseOrder(id: string): boolean {
    this.purchaseOrders = this.purchaseOrders.filter((p) => p.id !== id);
    saveToStorage('purchase_orders', this.purchaseOrders);
    notifyDBChange();
    return true;
  }

  // --- Expenses, Coupons, Campaigns CRUD ---
  public getExpenses(): Expense[] {
    return [...this.expenses];
  }

  public saveExpense(expense: Partial<Expense>): Expense {
    if (expense.id && this.expenses.some((e) => e.id === expense.id)) {
      this.expenses = this.expenses.map((e) => (e.id === expense.id ? { ...e, ...expense } : e));
    } else {
      const newExp: Expense = {
        id: 'exp_' + Date.now(),
        category: expense.category || 'Packaging',
        title: expense.title || 'Operational Cost',
        amount: Number(expense.amount) || 1000,
        expenseDate: expense.expenseDate || new Date().toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod || 'Bank Transfer',
        notes: expense.notes
      };
      this.expenses.unshift(newExp);
    }
    saveToStorage('expenses', this.expenses);
    this.addAuditLog('UPDATE', 'Expenses', `Saved expense ${expense.title}`);
    notifyDBChange();
    return this.expenses[0];
  }

  public deleteExpense(id: string): boolean {
    this.expenses = this.expenses.filter((e) => e.id !== id);
    saveToStorage('expenses', this.expenses);
    notifyDBChange();
    return true;
  }

  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public saveCoupon(coupon: Partial<Coupon>): Coupon {
    if (coupon.id && this.coupons.some((c) => c.id === coupon.id)) {
      this.coupons = this.coupons.map((c) => (c.id === coupon.id ? { ...c, ...coupon } : c));
    } else {
      const newCoupon: Coupon = {
        id: 'coup_' + Date.now(),
        code: (coupon.code || 'SAVE' + Math.floor(Math.random() * 100)).toUpperCase(),
        type: coupon.type || 'percentage',
        value: Number(coupon.value) || 10,
        minOrderValue: Number(coupon.minOrderValue) || 299,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
        usageLimit: Number(coupon.usageLimit) || 100,
        timesUsed: 0,
        isActive: coupon.isActive ?? true,
        validFrom: coupon.validFrom || new Date().toISOString().split('T')[0],
        validUntil: coupon.validUntil || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
      };
      this.coupons.unshift(newCoupon);
    }
    saveToStorage('coupons', this.coupons);
    notifyDBChange();
    return this.coupons[0];
  }

  public deleteCoupon(id: string): boolean {
    this.coupons = this.coupons.filter((c) => c.id !== id);
    saveToStorage('coupons', this.coupons);
    notifyDBChange();
    return true;
  }

  public getCampaigns(): Campaign[] {
    return [...this.campaigns];
  }

  public saveCampaign(campaign: Partial<Campaign>): Campaign {
    if (campaign.id && this.campaigns.some((c) => c.id === campaign.id)) {
      this.campaigns = this.campaigns.map((c) => (c.id === campaign.id ? { ...c, ...campaign } : c));
    } else {
      const newCamp: Campaign = {
        id: 'cmp_' + Date.now(),
        name: campaign.name || 'New Marketing Campaign',
        channel: campaign.channel || 'Instagram',
        budget: Number(campaign.budget) || 10000,
        spent: Number(campaign.spent) || 0,
        orders: 0,
        revenue: 0,
        conversions: 0,
        status: campaign.status || 'active',
        startDate: campaign.startDate || new Date().toISOString().split('T')[0],
        endDate: campaign.endDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
      };
      this.campaigns.unshift(newCamp);
    }
    saveToStorage('campaigns', this.campaigns);
    notifyDBChange();
    return this.campaigns[0];
  }

  public deleteCampaign(id: string): boolean {
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    saveToStorage('campaigns', this.campaigns);
    notifyDBChange();
    return true;
  }

  // --- Content: Banners, Reviews, Blog, Pages CRUD ---
  public getBanners(): BannerItem[] {
    return [...this.banners];
  }

  public saveBanner(banner: Partial<BannerItem>): BannerItem {
    if (banner.id && this.banners.some((b) => b.id === banner.id)) {
      this.banners = this.banners.map((b) => (b.id === banner.id ? { ...b, ...banner } : b));
    } else {
      const newBanner: BannerItem = {
        id: 'ban_' + Date.now(),
        title: banner.title || 'SIPPZO Banner',
        subtitle: banner.subtitle || '',
        ctaText: banner.ctaText || 'Shop Now',
        ctaUrl: banner.ctaUrl || '/collections/all',
        imageUrl: banner.imageUrl || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80',
        bannerType: banner.bannerType || 'hero_slider',
        displayOrder: banner.displayOrder || this.banners.length + 1,
        isActive: banner.isActive ?? true
      };
      this.banners.push(newBanner);
    }
    saveToStorage('banners', this.banners);
    this.addAuditLog('UPDATE', 'Content', `Saved banner ${banner.title || 'Item'}`);
    notifyDBChange();
    return this.banners[this.banners.length - 1];
  }

  public deleteBanner(id: string): boolean {
    this.banners = this.banners.filter((b) => b.id !== id);
    saveToStorage('banners', this.banners);
    notifyDBChange();
    return true;
  }

  public getReviews(): ReviewItem[] {
    return [...this.reviews];
  }

  public saveReview(review: Partial<ReviewItem>): ReviewItem {
    if (review.id && this.reviews.some((r) => r.id === review.id)) {
      this.reviews = this.reviews.map((r) => (r.id === review.id ? { ...r, ...review } : r));
    } else {
      const newRev: ReviewItem = {
        id: 'rev_' + Date.now(),
        productId: review.productId || 'prod_kulhad_chai_ge',
        productName: review.productName || 'Self-Heating Instant Kulhad Chai',
        reviewerName: review.reviewerName || 'Customer',
        reviewerEmail: review.reviewerEmail || 'user@example.in',
        rating: review.rating || 5,
        comment: review.comment || 'Wonderful product!',
        date: new Date().toISOString().split('T')[0],
        status: review.status || 'pending'
      };
      this.reviews.unshift(newRev);
    }
    saveToStorage('reviews', this.reviews);
    notifyDBChange();
    return this.reviews[0];
  }

  public updateReviewStatus(reviewId: string, status: ReviewItem['status']): void {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.status = status;
      saveToStorage('reviews', this.reviews);
      this.addAuditLog('UPDATE', 'Reviews', `Review status changed to ${status}`);
      notifyDBChange();
    }
  }

  public deleteReview(id: string): boolean {
    this.reviews = this.reviews.filter((r) => r.id !== id);
    saveToStorage('reviews', this.reviews);
    notifyDBChange();
    return true;
  }

  // --- Media Library CRUD ---
  public getMedia(): MediaItem[] {
    return [...this.media];
  }

  public addMediaItem(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const newMedia: MediaItem = {
      ...item,
      id: 'med_' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.media.unshift(newMedia);
    saveToStorage('media', this.media);
    this.addAuditLog('CREATE', 'Media', `Uploaded media file ${newMedia.fileName}`);
    notifyDBChange();
    return newMedia;
  }

  public deleteMediaItem(id: string): boolean {
    this.media = this.media.filter((m) => m.id !== id);
    saveToStorage('media', this.media);
    notifyDBChange();
    return true;
  }

  // --- Settings CRUD ---
  public getSettings(): AppSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<AppSettings>): AppSettings {
    this.settings = { ...this.settings, ...updates };
    saveToStorage('settings', this.settings);
    this.addAuditLog('UPDATE', 'Settings', 'Updated store configuration');
    notifyDBChange();
    return this.settings;
  }

  // Factory reset
  public resetToFactoryDefaults(): void {
    if (typeof window !== 'undefined') {
      const keys = [
        'products', 'categories', 'brands', 'customers', 'orders',
        'leads', 'deals', 'invoices', 'payments', 'warehouses',
        'batches', 'shipments', 'returns', 'vendors', 'purchase_orders',
        'expenses', 'coupons', 'campaigns', 'banners', 'reviews',
        'media', 'blog_posts', 'static_pages', 'settings', 'audit_logs'
      ];
      keys.forEach((k) => localStorage.removeItem(STORAGE_PREFIX + k));
    }
    this.init();
    this.addAuditLog('UPDATE', 'System', 'Reset all tables to official SIPPZO catalog standards');
    notifyDBChange();
  }
}

export const db = new DatabaseManager();
