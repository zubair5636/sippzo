export type Role =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'sales_executive'
  | 'warehouse_staff'
  | 'content_manager';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: Role;
  title: string;
  department: string;
  isActive: boolean;
  adminSince?: string;
  lastLogin?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  websiteUrl?: string;
  isFeatured: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  brand: string;
  category: string;
  sellingPrice: number;
  mrp: number;
  costPrice: number;
  stock: number;
  lowStockThreshold: number;
  weight: string;
  servings: string;
  shelfLife: string;
  storage: string;
  isVegetarian: boolean;
  ingredients: string;
  description: string;
  imageUrl: string;
  galleryUrls: string[];
  productUrl: string;
  sourceType: 'official_sippzo_website' | 'manual_admin' | 'bulk_import';
  sourceUrl: string;
  lastSyncedAt?: string;
  isActive: boolean;
  isFeatured: boolean;
  isHero: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  managerName: string;
  managerPhone: string;
  capacity: number;
  currentStock: number;
  isActive: boolean;
}

export interface Batch {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  status: 'fresh' | 'expiring_soon' | 'expired';
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  warehouseName: string;
  changeType: 'restock' | 'sale' | 'return' | 'adjustment' | 'damage';
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceId?: string;
  notes?: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  industry?: string;
  status: 'active' | 'inactive' | 'vip';
  totalSpent: number;
  totalOrders: number;
  lastOrderAt?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export interface B2BLead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  source: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  priority: 'Low' | 'Medium' | 'High';
  expectedValue: number;
  assignedRep: string;
  notes?: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  company: string;
  contactName: string;
  value: number;
  stage: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  probability: number;
  expectedCloseDate: string;
  assignedRep: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'Razorpay' | 'Card' | 'COD' | 'Bank Transfer';
  couponCode?: string;
  notes?: string;
  items: OrderItem[];
  timeline: { title: string; time: string; description: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  orderNumber?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerGstin?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
  items: {
    description: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

export interface PaymentReceipt {
  id: string;
  receiptNumber: string;
  receiptDate: string;
  customerName: string;
  invoiceNumber?: string;
  orderNumber?: string;
  amount: number;
  paymentMethod: 'UPI' | 'Bank Transfer' | 'Cash' | 'Card' | 'COD' | 'Wallet';
  transactionRef: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Shipment {
  id: string;
  shipmentNumber: string;
  orderNumber: string;
  customerName: string;
  courierName: string;
  trackingNumber: string;
  trackingUrl?: string;
  status:
    | 'pending'
    | 'packed'
    | 'shipped'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'returned';
  dispatchDate?: string;
  expectedDelivery?: string;
  deliveredDate?: string;
}

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderNumber: string;
  customerName: string;
  reason: string;
  items: string;
  amount: number;
  status: 'requested' | 'approved' | 'received' | 'rejected';
  refundStatus: 'pending' | 'processed' | 'failed';
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  gstin: string;
  city: string;
  productsSupplied: string;
  outstandingBalance: number;
  isActive: boolean;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  itemsSummary: string;
  totalAmount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  expectedDate: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category:
    | 'Packaging'
    | 'Shipping'
    | 'Marketing'
    | 'Warehouse'
    | 'Salary'
    | 'Utilities'
    | 'Software'
    | 'Other';
  title: string;
  amount: number;
  expenseDate: string;
  paymentMethod: string;
  receiptRef?: string;
  notes?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Google' | 'Email' | 'SMS';
  budget: number;
  spent: number;
  orders: number;
  revenue: number;
  conversions: number;
  status: 'active' | 'scheduled' | 'paused' | 'ended';
  startDate: string;
  endDate: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl: string;
  imageUrl: string;
  bannerType: 'hero_slider' | 'promo_grid';
  displayOrder: number;
  isActive: boolean;
}

export interface ReviewItem {
  id: string;
  productId: string;
  productName: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface MediaItem {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  publicUrl: string;
  source: 'Upload' | 'SIPPZO Store' | 'Generated';
  category: string;
  usedBy?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  coverImage: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'IMPORT' | 'EXPORT' | 'SYNC' | 'LOGIN' | 'LOGOUT';
  module: string;
  recordId?: string;
  details: string;
  timestamp: string;
}

export interface AppSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  gstin: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxRatePercent: number;
  freeShippingThreshold: number;
  defaultShippingFee: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId: string;
  razorpayKeyId: string;
  razorpayEnabled: boolean;
  codEnabled: boolean;
  upiEnabled: boolean;
  autoOrderConfirmationEmail: boolean;
  lowStockNotificationThreshold: number;
}
