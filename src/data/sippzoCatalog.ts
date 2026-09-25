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

export const INITIAL_SUPER_ADMIN: UserProfile = {
  id: 'usr_super_zubair_01',
  fullName: 'Zubair',
  email: 'zubair669262@gmail.com',
  phone: '+91 98765 00001',
  role: 'super_admin',
  title: 'Super Admin',
  department: 'Management',
  isActive: true,
  adminSince: 'Sep 2026',
  lastLogin: 'Current session'
};

export const INITIAL_STAFF_MEMBERS: UserProfile[] = [
  INITIAL_SUPER_ADMIN,
  {
    id: 'usr_staff_02',
    fullName: 'Amit Verma',
    email: 'amit.verma@sippzo.com',
    phone: '+91 98234 11223',
    role: 'manager',
    title: 'Operations Manager',
    department: 'Fulfillment & Logistics',
    isActive: true,
    adminSince: 'Aug 2026',
    lastLogin: 'Yesterday 17:40'
  },
  {
    id: 'usr_staff_03',
    fullName: 'Priya Singh',
    email: 'priya.singh@sippzo.com',
    phone: '+91 98111 44556',
    role: 'sales_executive',
    title: 'B2B Key Account Lead',
    department: 'Sales & Institutional',
    isActive: true,
    adminSince: 'Aug 2026',
    lastLogin: 'Today 09:15'
  },
  {
    id: 'usr_staff_04',
    fullName: 'Rohit Yadav',
    email: 'rohit.yadav@sippzo.com',
    phone: '+91 97999 88321',
    role: 'warehouse_staff',
    title: 'Warehouse Specialist',
    department: 'Inventory Control',
    isActive: true,
    adminSince: 'Sep 2026',
    lastLogin: 'Today 08:30'
  }
];

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat_beverages',
    name: 'Beverages & Chai',
    slug: 'beverages-chai',
    description: 'Instant self-heating traditional kulhad teas, filter coffees, and hot chocolates',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'cat_ready_meals',
    name: 'Ready Meals',
    slug: 'ready-meals',
    description: 'Hot authentic Indian meals self-steamed in 4 minutes with water activation',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'cat_combos',
    name: 'Combos & Adventure Kits',
    slug: 'combos-adventure-kits',
    description: 'Curated value bundles for office desks, road trips, and outdoor expeditions',
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'cat_institutional',
    name: 'B2B & Institutional',
    slug: 'b2b-institutional',
    description: 'Bulk packs for corporate pantries, defense forces, hospitality, and travel caterers',
    displayOrder: 4,
    isActive: true
  }
];

export const INITIAL_BRANDS: ProductBrand[] = [
  {
    id: 'brand_sippzo',
    name: 'SIPPZO',
    slug: 'sippzo',
    websiteUrl: 'https://sippzo.com',
    isFeatured: true
  },
  {
    id: 'brand_hh_tech',
    name: 'HH-Food Technology™',
    slug: 'hh-food-technology',
    websiteUrl: 'https://sippzo.com/pages/technology',
    isFeatured: true
  },
  {
    id: 'brand_kulhad_craft',
    name: 'Kulhad Craft Terrains',
    slug: 'kulhad-craft',
    websiteUrl: 'https://sippzo.com',
    isFeatured: false
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_kulhad_chai_ge',
    name: 'Self-Heating Instant Kulhad Chai (Ginger Elaichi)',
    sku: 'SIP-KUL-CHAI-GE99',
    slug: 'self-heating-kulhad-chai-ginger-elaichi',
    brand: 'SIPPZO',
    category: 'Beverages & Chai',
    sellingPrice: 99,
    mrp: 120,
    costPrice: 52,
    stock: 420,
    lowStockThreshold: 30,
    weight: '180g (Ready Cup)',
    servings: '1 Kulhad Cup',
    shelfLife: '9 Months',
    storage: 'Store in a cool, dry place away from direct sunlight',
    isVegetarian: true,
    ingredients: 'Instant Assam CTC Tea Extract, Pure Whole Milk Solids, Crushed Sun-Dried Ginger, Handpicked Green Cardamom, Natural Cane Sugar, HH-Thermal Pack',
    description: 'Authentic Indian Kulhad Chai that heats itself to 95°C in just 4 minutes with ordinary water activation using proprietary HH-Food Technology™. Enjoy earthy aroma in a traditional clay cup anywhere without stove, kettle, or electricity.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
    ],
    productUrl: 'https://sippzo.com/products/self-heating-kulhad-chai-ginger-elaichi',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Chai', 'Kulhad', 'Self-Heating', 'Beverage', 'Best Seller'],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-20T14:30:00Z'
  },
  {
    id: 'prod_kulhad_chai_mk',
    name: 'Self-Heating Instant Kulhad Chai (Masala Kadak)',
    sku: 'SIP-KUL-CHAI-MK99',
    slug: 'self-heating-kulhad-chai-masala-kadak',
    brand: 'SIPPZO',
    category: 'Beverages & Chai',
    sellingPrice: 99,
    mrp: 120,
    costPrice: 52,
    stock: 385,
    lowStockThreshold: 30,
    weight: '180g (Ready Cup)',
    servings: '1 Kulhad Cup',
    shelfLife: '9 Months',
    storage: 'Store in cool and dry place',
    isVegetarian: true,
    ingredients: 'Assam Strong CTC Tea Extract, Clove, Black Pepper, Cinnamon, Mace, Dry Ginger, Milk Solids, Sugar, HH Water-Activated Thermal Core',
    description: 'Kadak dhaba style strong masala tea with real spices in an authentic terracotta kulhad cup. Reaches 95°C piping hot in 4 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-kulhad-chai-masala-kadak',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Chai', 'Masala', 'Spicy', 'Kadak'],
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-09-18T11:00:00Z'
  },
  {
    id: 'prod_kulhad_coffee_fr',
    name: 'Self-Heating Instant Kulhad Coffee (Filter Style)',
    sku: 'SIP-KUL-COF-FR119',
    slug: 'self-heating-kulhad-coffee-filter-style',
    brand: 'SIPPZO',
    category: 'Beverages & Chai',
    sellingPrice: 119,
    mrp: 140,
    costPrice: 62,
    stock: 295,
    lowStockThreshold: 25,
    weight: '180g (Ready Cup)',
    servings: '1 Kulhad Cup',
    shelfLife: '9 Months',
    storage: 'Room temperature below 30°C',
    isVegetarian: true,
    ingredients: 'South Indian Roasted Coffee Blend (80% Arabica/Robusta, 20% Chicory), Creamy Whole Milk Solids, Caramelized Sugar, Food-Grade Thermal Pack',
    description: 'Frothy and aromatic South Indian style filter coffee in an artisanal terracotta kulhad. Self-heats instantly upon pouring room temperature water into the bottom heating compartment.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-kulhad-coffee',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: true,
    isBestSeller: false,
    isNewArrival: false,
    tags: ['Coffee', 'Filter Coffee', 'Kulhad', 'Morning'],
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'prod_kulhad_hot_chocolate',
    name: 'Self-Heating Instant Kulhad Hot Chocolate',
    sku: 'SIP-KUL-CHO-HC119',
    slug: 'self-heating-kulhad-hot-chocolate',
    brand: 'SIPPZO',
    category: 'Beverages & Chai',
    sellingPrice: 119,
    mrp: 150,
    costPrice: 64,
    stock: 210,
    lowStockThreshold: 20,
    weight: '190g (Ready Cup)',
    servings: '1 Kulhad Cup',
    shelfLife: '9 Months',
    storage: 'Store in dry ambient conditions',
    isVegetarian: true,
    ingredients: 'Dutch Processed Dark Cocoa, Dairy Cream Solids, Cane Sugar, Micro Dark Chocolate Flakes, Vanilla Extract, Water-Activated Heating Cell',
    description: 'Velvety rich hot chocolate served in an earthen clay cup. Perfect for winter camps, chilly late nights, and monsoon evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-kulhad-hot-chocolate',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: false,
    isHero: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['Chocolate', 'Kids', 'Dessert', 'Winter'],
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z'
  },
  {
    id: 'prod_meal_poha_119',
    name: 'Self-Heating Instant Poha with Crunchy Peanuts & Sev',
    sku: 'SIP-MEAL-POHA-119',
    slug: 'self-heating-instant-poha',
    brand: 'SIPPZO',
    category: 'Ready Meals',
    sellingPrice: 119,
    mrp: 149,
    costPrice: 58,
    stock: 310,
    lowStockThreshold: 25,
    weight: '120g (Dry) / 260g (Prepared)',
    servings: '1 Hearty Portion',
    shelfLife: '12 Months',
    storage: 'Store in cool dry conditions',
    isVegetarian: true,
    ingredients: 'Flattened Rice (Poha), Roasted Peanuts, Crispy Sev, Mustard Seeds, Curry Leaves, Green Chili, Turmeric, Cumin, Rock Salt, Dehydrated Onion, Edible Oil',
    description: 'Authentic Indori style breakfast Poha with crunchy peanuts and fragrant tempering. Self-steamed to hot perfection in 4 minutes with water activation.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-instant-poha',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Poha', 'Breakfast', 'Self-Steaming', 'Travel Food'],
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'prod_meal_upma_119',
    name: 'Self-Heating Instant Upma with Cashews & Pure Ghee',
    sku: 'SIP-MEAL-UPMA-119',
    slug: 'self-heating-instant-upma',
    brand: 'SIPPZO',
    category: 'Ready Meals',
    sellingPrice: 119,
    mrp: 149,
    costPrice: 60,
    stock: 220,
    lowStockThreshold: 20,
    weight: '120g (Dry) / 250g (Prepared)',
    servings: '1 Portion',
    shelfLife: '12 Months',
    storage: 'Store in cool and dry place',
    isVegetarian: true,
    ingredients: 'Roasted Semolina (Rava), Golden Roasted Cashew Nuts, Clarified Butter (Desi Ghee), Mustard Seeds, Split Urad Dal, Curry Leaves, Ginger, Green Chili',
    description: 'Comforting, fluffy South Indian Upma garnished with crunchy cashews and tempered in pure desi ghee. Cooks itself with zero mess.',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-instant-upma',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: false,
    isHero: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['Upma', 'Cashew', 'Ghee', 'Breakfast'],
    createdAt: '2026-08-04T10:00:00Z',
    updatedAt: '2026-09-21T12:00:00Z'
  },
  {
    id: 'prod_meal_khichdi_139',
    name: 'Self-Heating Instant Dal Khichdi (Comfort Meal)',
    sku: 'SIP-MEAL-KHIC-139',
    slug: 'self-heating-dal-khichdi',
    brand: 'SIPPZO',
    category: 'Ready Meals',
    sellingPrice: 139,
    mrp: 169,
    costPrice: 68,
    stock: 180,
    lowStockThreshold: 20,
    weight: '140g (Dry) / 320g (Prepared)',
    servings: '1 Bowl',
    shelfLife: '12 Months',
    storage: 'Keep away from moisture',
    isVegetarian: true,
    ingredients: 'Yellow Moong Dal, Dehydrated Basmati Rice, Cumin Seeds, Desi Ghee, Pure Turmeric, Fresh Ginger Powder, Pink Himalayan Rock Salt',
    description: 'The ultimate comforting Indian meal. Piping hot, nutritious dal khichdi prepared without any cookware in 4 minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-dal-khichdi',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Khichdi', 'Dal', 'Comfort Food', 'Healthy'],
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-09-23T11:45:00Z'
  },
  {
    id: 'prod_meal_biryani_149',
    name: 'Self-Heating Instant Veg Biryani with Fragrant Basmati',
    sku: 'SIP-MEAL-BIRY-149',
    slug: 'self-heating-vegetable-biryani',
    brand: 'SIPPZO',
    category: 'Ready Meals',
    sellingPrice: 149,
    mrp: 189,
    costPrice: 74,
    stock: 155,
    lowStockThreshold: 15,
    weight: '150g (Dry) / 340g (Prepared)',
    servings: '1 Meal Portion',
    shelfLife: '12 Months',
    storage: 'Store in cool dry conditions',
    isVegetarian: true,
    ingredients: 'Long-Grain Aged Basmati Rice, Dehydrated Carrots, Green Peas, French Beans, Saffron Strands, Royal Biryani Spice Masala, Mint Leaves, Caramelized Onion, Pure Ghee',
    description: 'Aromatic Lucknowi veg biryani cooked in royal spices and saffron. Steams to fluffy perfection with water activation.',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/self-heating-vegetable-biryani',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Biryani', 'Basmati', 'Royal Spices', 'Lunch'],
    createdAt: '2026-08-08T10:00:00Z',
    updatedAt: '2026-09-24T14:10:00Z'
  },
  {
    id: 'prod_combo_explorer_449',
    name: 'SIPPZO Explorer Combo Pack (Chai + Coffee + Poha + Khichdi)',
    sku: 'SIP-COMBO-EXPL-449',
    slug: 'sippzo-explorer-combo-pack',
    brand: 'SIPPZO',
    category: 'Combos & Adventure Kits',
    sellingPrice: 449,
    mrp: 549,
    costPrice: 220,
    stock: 95,
    lowStockThreshold: 15,
    weight: '620g Total',
    servings: '4 Complete Items',
    shelfLife: '9 Months',
    storage: 'Store in cool, dry place',
    isVegetarian: true,
    ingredients: 'Complete tasting kit containing: 1x Masala Kulhad Chai, 1x Kulhad Coffee, 1x Indori Poha, 1x Dal Khichdi + Self-Heating Activation kits.',
    description: 'The all-in-one introductory bundle for tea lovers and travelers. Experience the full spectrum of SIPPZO self-heating beverage and dining technology.',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/sippzo-explorer-combo-pack',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ['Combo', 'Gift Pack', 'Trial', 'Trekking'],
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-09-20T10:30:00Z'
  },
  {
    id: 'prod_kit_trek_699',
    name: 'SIPPZO Trekker & Defense Travel Kit (6 Self-Heating Meals + Chai)',
    sku: 'SIP-KIT-TREK-699',
    slug: 'sippzo-trekker-defense-kit',
    brand: 'SIPPZO',
    category: 'Combos & Adventure Kits',
    sellingPrice: 699,
    mrp: 849,
    costPrice: 345,
    stock: 75,
    lowStockThreshold: 10,
    weight: '980g Total',
    servings: '6 Ready Items',
    shelfLife: '12 Months',
    storage: 'Weatherproof packaging, ambient storage',
    isVegetarian: true,
    ingredients: 'Heavy-duty weather sealed travel ration pack: 2x Ginger Elaichi Chai, 1x Kulhad Coffee, 1x Poha, 1x Dal Khichdi, 1x Veg Biryani.',
    description: 'Designed specifically for high-altitude trekking, defense personnel on patrol, train journeys, and remote emergency situations.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
    galleryUrls: ['https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80'],
    productUrl: 'https://sippzo.com/products/sippzo-trekker-defense-kit',
    sourceType: 'official_sippzo_website',
    sourceUrl: 'https://sippzo.com/collections/all',
    lastSyncedAt: new Date().toISOString(),
    isActive: true,
    isFeatured: true,
    isHero: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ['Trekking', 'Defense', 'Emergency Ration', 'Self-Heating'],
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-23T16:20:00Z'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    name: 'Amit Verma',
    email: 'amit.verma@gmail.com',
    phone: '+91 98201 44552',
    company: 'Verma Tech Solutions',
    address: 'B-402, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    country: 'India',
    industry: 'Information Technology',
    status: 'vip',
    totalSpent: 1248,
    totalOrders: 4,
    lastOrderAt: '2026-09-24T14:20:00Z',
    notes: 'Regular customer for Ginger Elaichi Kulhad Chai and Poha for office desk.',
    tags: ['Tea Enthusiast', 'Repeat Customer', 'Lucknow'],
    createdAt: '2026-08-10T11:00:00Z'
  },
  {
    id: 'cust_02',
    name: 'Priya Singh',
    email: 'priya.singh@outlook.com',
    phone: '+91 97188 33441',
    company: 'Himalayan Trails Trekking Co',
    address: 'Flat 12, Civil Lines',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208001',
    country: 'India',
    industry: 'Adventure & Travel',
    status: 'vip',
    totalSpent: 4194,
    totalOrders: 6,
    lastOrderAt: '2026-09-25T08:15:00Z',
    notes: 'Orders Trekker Defense Kits in batches for hiking expeditions.',
    tags: ['B2B Lead', 'Outdoor', 'Bulk Buyer'],
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'cust_03',
    name: 'Rahul Gupta',
    email: 'rahul.gupta@fintech.in',
    phone: '+91 99102 77889',
    company: 'Apex Advisory',
    address: 'Sector 62, Green Boulevard',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    country: 'India',
    industry: 'Financial Services',
    status: 'active',
    totalSpent: 668,
    totalOrders: 3,
    lastOrderAt: '2026-09-22T19:40:00Z',
    notes: 'Prefers Filter Coffee and Poha combo.',
    tags: ['Late Night Consumer', 'Noida Hub'],
    createdAt: '2026-08-18T09:10:00Z'
  },
  {
    id: 'cust_04',
    name: 'Neha Sharma',
    email: 'neha.sharma@delhiuni.ac.in',
    phone: '+91 98112 00982',
    address: 'Chhatra Marg, North Campus',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110007',
    country: 'India',
    industry: 'Education & Research',
    status: 'active',
    totalSpent: 476,
    totalOrders: 2,
    lastOrderAt: '2026-09-21T16:00:00Z',
    tags: ['Student', 'Late Night Study', 'Chai Lover'],
    createdAt: '2026-08-22T11:20:00Z'
  },
  {
    id: 'cust_05',
    name: 'Rohit Yadav',
    email: 'rohit.yadav92@gmail.com',
    phone: '+91 97999 12345',
    address: 'C-Scheme, Ashok Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302001',
    country: 'India',
    status: 'active',
    totalSpent: 357,
    totalOrders: 1,
    lastOrderAt: '2026-09-23T11:05:00Z',
    tags: ['First Time Buyer'],
    createdAt: '2026-09-23T10:45:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1001',
    orderNumber: 'SIP-ORD-9421',
    customerId: 'cust_01',
    customerName: 'Amit Verma',
    customerEmail: 'amit.verma@gmail.com',
    customerPhone: '+91 98201 44552',
    shippingAddress: 'B-402, Gomti Nagar',
    shippingCity: 'Lucknow',
    shippingState: 'Uttar Pradesh',
    shippingPincode: '226010',
    subtotal: 317,
    discount: 0,
    tax: 15.85,
    shippingFee: 40,
    totalAmount: 372.85,
    orderStatus: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    items: [
      {
        id: 'item_1',
        productId: 'prod_kulhad_chai_ge',
        productName: 'Self-Heating Instant Kulhad Chai (Ginger Elaichi)',
        productSku: 'SIP-KUL-CHAI-GE99',
        productImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        unitPrice: 99,
        quantity: 2,
        totalPrice: 198
      },
      {
        id: 'item_2',
        productId: 'prod_meal_poha_119',
        productName: 'Self-Heating Instant Poha with Crunchy Peanuts & Sev',
        productSku: 'SIP-MEAL-POHA-119',
        productImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
        unitPrice: 119,
        quantity: 1,
        totalPrice: 119
      }
    ],
    timeline: [
      { title: 'Order Placed', time: '2026-09-20 10:14', description: 'Paid via Google Pay UPI' },
      { title: 'Packed at Lucknow Hub', time: '2026-09-20 12:30', description: 'Batch #SIP-26-08 verified' },
      { title: 'Dispatched via Delhivery', time: '2026-09-20 16:00', description: 'Tracking #DL982348123' },
      { title: 'Delivered', time: '2026-09-21 14:10', description: 'Delivered to recipient with OTP' }
    ],
    createdAt: '2026-09-20T10:14:00Z',
    updatedAt: '2026-09-21T14:10:00Z'
  },
  {
    id: 'ord_1002',
    orderNumber: 'SIP-ORD-9422',
    customerId: 'cust_02',
    customerName: 'Priya Singh',
    customerEmail: 'priya.singh@outlook.com',
    customerPhone: '+91 97188 33441',
    shippingAddress: 'Flat 12, Civil Lines',
    shippingCity: 'Kanpur',
    shippingState: 'Uttar Pradesh',
    shippingPincode: '208001',
    subtotal: 1398,
    discount: 100,
    tax: 64.90,
    shippingFee: 0,
    totalAmount: 1362.90,
    orderStatus: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Razorpay',
    couponCode: 'WELCOME100',
    items: [
      {
        id: 'item_3',
        productId: 'prod_kit_trek_699',
        productName: 'SIPPZO Trekker & Defense Travel Kit (6 Self-Heating Meals + Chai)',
        productSku: 'SIP-KIT-TREK-699',
        productImage: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80',
        unitPrice: 699,
        quantity: 2,
        totalPrice: 1398
      }
    ],
    timeline: [
      { title: 'Order Placed', time: '2026-09-23 08:30', description: 'Razorpay NetBanking payment confirmed' },
      { title: 'Dispatched', time: '2026-09-24 10:00', description: 'Courier: Blue Dart #BD77281923' },
      { title: 'In Transit', time: '2026-09-25 04:30', description: 'Arrived at Kanpur Hub' }
    ],
    createdAt: '2026-09-23T08:30:00Z',
    updatedAt: '2026-09-24T10:00:00Z'
  },
  {
    id: 'ord_1003',
    orderNumber: 'SIP-ORD-9423',
    customerId: 'cust_03',
    customerName: 'Rahul Gupta',
    customerEmail: 'rahul.gupta@fintech.in',
    customerPhone: '+91 99102 77889',
    shippingAddress: 'Sector 62, Green Boulevard',
    shippingCity: 'Noida',
    shippingState: 'Uttar Pradesh',
    shippingPincode: '201301',
    subtotal: 357,
    discount: 0,
    tax: 17.85,
    shippingFee: 40,
    totalAmount: 414.85,
    orderStatus: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    items: [
      {
        id: 'item_4',
        productId: 'prod_meal_poha_119',
        productName: 'Self-Heating Instant Poha with Crunchy Peanuts & Sev',
        productSku: 'SIP-MEAL-POHA-119',
        productImage: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
        unitPrice: 119,
        quantity: 3,
        totalPrice: 357
      }
    ],
    timeline: [
      { title: 'Order Received', time: '2026-09-24 16:45', description: 'Payment verified via PhonePe UPI' },
      { title: 'Processing', time: '2026-09-24 17:15', description: 'Allocated to Delhi NCR Hub' }
    ],
    createdAt: '2026-09-24T16:45:00Z',
    updatedAt: '2026-09-24T17:15:00Z'
  },
  {
    id: 'ord_1004',
    orderNumber: 'SIP-ORD-9424',
    customerId: 'cust_04',
    customerName: 'Neha Sharma',
    customerEmail: 'neha.sharma@delhiuni.ac.in',
    customerPhone: '+91 98112 00982',
    shippingAddress: 'Chhatra Marg, North Campus',
    shippingCity: 'Delhi',
    shippingState: 'Delhi',
    shippingPincode: '110007',
    subtotal: 198,
    discount: 0,
    tax: 9.90,
    shippingFee: 40,
    totalAmount: 247.90,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'COD',
    items: [
      {
        id: 'item_5',
        productId: 'prod_kulhad_chai_mk',
        productName: 'Self-Heating Instant Kulhad Chai (Masala Kadak)',
        productSku: 'SIP-KUL-CHAI-MK99',
        productImage: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80',
        unitPrice: 99,
        quantity: 2,
        totalPrice: 198
      }
    ],
    timeline: [
      { title: 'Order Placed (COD)', time: '2026-09-25 09:20', description: 'Awaiting phone verification' }
    ],
    createdAt: '2026-09-25T09:20:00Z',
    updatedAt: '2026-09-25T09:20:00Z'
  },
  {
    id: 'ord_1005',
    orderNumber: 'SIP-ORD-9425',
    customerId: 'cust_05',
    customerName: 'Rohit Yadav',
    customerEmail: 'rohit.yadav92@gmail.com',
    customerPhone: '+91 97999 12345',
    shippingAddress: 'C-Scheme, Ashok Nagar',
    shippingCity: 'Jaipur',
    shippingState: 'Rajasthan',
    shippingPincode: '302001',
    subtotal: 449,
    discount: 50,
    tax: 19.95,
    shippingFee: 0,
    totalAmount: 418.95,
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    couponCode: 'CHAI50',
    items: [
      {
        id: 'item_6',
        productId: 'prod_combo_explorer_449',
        productName: 'SIPPZO Explorer Combo Pack (Chai + Coffee + Poha + Khichdi)',
        productSku: 'SIP-COMBO-EXPL-449',
        productImage: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80',
        unitPrice: 449,
        quantity: 1,
        totalPrice: 449
      }
    ],
    timeline: [
      { title: 'Order Placed & Paid', time: '2026-09-25 09:55', description: 'Paid via Paytm UPI' }
    ],
    createdAt: '2026-09-25T09:55:00Z',
    updatedAt: '2026-09-25T09:55:00Z'
  }
];

export const INITIAL_LEADS: B2BLead[] = [
  {
    id: 'lead_01',
    name: 'Kavita Mishra',
    company: 'Northern Railway Catering Services',
    phone: '+91 98100 23411',
    email: 'kavita.mishra@nrcatering.gov.in',
    source: 'Trade Fair Expo',
    status: 'Proposal',
    priority: 'High',
    expectedValue: 85000,
    assignedRep: 'Priya Singh',
    notes: 'Interested in stocking 1,000 units of Kulhad Chai & Poha for premium Vande Bharat express routes.',
    createdAt: '2026-09-10T10:00:00Z'
  },
  {
    id: 'lead_02',
    name: 'Arjun Mehta',
    company: 'Peak Adventures Uttarakhand',
    phone: '+91 98760 11998',
    email: 'arjun@peakadventures.in',
    source: 'Website Form',
    status: 'Negotiation',
    priority: 'High',
    expectedValue: 45000,
    assignedRep: 'Priya Singh',
    notes: 'Self-heating travel kits for Kedarkantha and Roopkund trek seasons.',
    createdAt: '2026-09-14T11:30:00Z'
  },
  {
    id: 'lead_03',
    name: 'Saurabh Singh',
    company: 'Apex Co-Working Hubs',
    phone: '+91 99200 48821',
    email: 'saurabh@apexwork.co',
    source: 'LinkedIn Inbound',
    status: 'Qualified',
    priority: 'Medium',
    expectedValue: 32000,
    assignedRep: 'Priya Singh',
    notes: 'Pantry tea & coffee kulhad dispenser trials for 4 centers across Delhi NCR.',
    createdAt: '2026-09-18T15:20:00Z'
  },
  {
    id: 'lead_04',
    name: 'Pooja Agarwal',
    company: 'Highway Oasis Retails',
    phone: '+91 98390 77123',
    email: 'pooja@highwayoasis.com',
    source: 'Referral',
    status: 'Contacted',
    priority: 'Medium',
    expectedValue: 24000,
    assignedRep: 'Zubair',
    notes: 'Expressway fuel pump convenience stores pilot.',
    createdAt: '2026-09-22T14:00:00Z'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal_01',
    title: 'Northern Railway Vande Bharat Pilot',
    company: 'Northern Railway Catering',
    contactName: 'Kavita Mishra',
    value: 85000,
    stage: 'Proposal',
    probability: 60,
    expectedCloseDate: '2026-10-15',
    assignedRep: 'Priya Singh'
  },
  {
    id: 'deal_02',
    title: 'Autumn Trek Rations Contract',
    company: 'Peak Adventures',
    contactName: 'Arjun Mehta',
    value: 45000,
    stage: 'Negotiation',
    probability: 80,
    expectedCloseDate: '2026-10-05',
    assignedRep: 'Priya Singh'
  },
  {
    id: 'deal_03',
    title: 'Co-Working Pantry Dispenser Trial',
    company: 'Apex Co-Working Hubs',
    contactName: 'Saurabh Singh',
    value: 32000,
    stage: 'Qualified',
    probability: 40,
    expectedCloseDate: '2026-10-25',
    assignedRep: 'Priya Singh'
  },
  {
    id: 'deal_04',
    title: 'Yamuna Expressway Oasis Stores',
    company: 'Highway Oasis Retails',
    contactName: 'Pooja Agarwal',
    value: 24000,
    stage: 'Contacted',
    probability: 25,
    expectedCloseDate: '2026-11-01',
    assignedRep: 'Zubair'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2026-0041',
    orderId: 'ord_1001',
    orderNumber: 'SIP-ORD-9421',
    customerId: 'cust_01',
    customerName: 'Amit Verma',
    customerEmail: 'amit.verma@gmail.com',
    customerAddress: 'B-402, Gomti Nagar, Lucknow, UP - 226010',
    customerGstin: '09AAECV1234A1Z5',
    issueDate: '2026-09-20',
    dueDate: '2026-09-20',
    subtotal: 317,
    cgst: 7.92,
    sgst: 7.92,
    igst: 0,
    discount: 0,
    totalAmount: 372.85,
    paidAmount: 372.85,
    balanceDue: 0,
    status: 'paid',
    items: [
      { description: 'Self-Heating Instant Kulhad Chai (Ginger Elaichi)', sku: 'SIP-KUL-CHAI-GE99', quantity: 2, unitPrice: 99, total: 198 },
      { description: 'Self-Heating Instant Poha', sku: 'SIP-MEAL-POHA-119', quantity: 1, unitPrice: 119, total: 119 }
    ]
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-2026-0042',
    orderId: 'ord_1002',
    orderNumber: 'SIP-ORD-9422',
    customerId: 'cust_02',
    customerName: 'Priya Singh',
    customerEmail: 'priya.singh@outlook.com',
    customerAddress: 'Flat 12, Civil Lines, Kanpur, UP - 208001',
    issueDate: '2026-09-23',
    dueDate: '2026-09-23',
    subtotal: 1398,
    cgst: 32.45,
    sgst: 32.45,
    igst: 0,
    discount: 100,
    totalAmount: 1362.90,
    paidAmount: 1362.90,
    balanceDue: 0,
    status: 'paid',
    items: [
      { description: 'SIPPZO Trekker & Defense Travel Kit (6 Items)', sku: 'SIP-KIT-TREK-699', quantity: 2, unitPrice: 699, total: 1398 }
    ]
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-2026-0043',
    orderId: 'ord_1003',
    orderNumber: 'SIP-ORD-9423',
    customerId: 'cust_03',
    customerName: 'Rahul Gupta',
    customerEmail: 'rahul.gupta@fintech.in',
    customerAddress: 'Sector 62, Green Boulevard, Noida, UP - 201301',
    issueDate: '2026-09-24',
    dueDate: '2026-09-24',
    subtotal: 357,
    cgst: 8.92,
    sgst: 8.92,
    igst: 0,
    discount: 0,
    totalAmount: 414.85,
    paidAmount: 414.85,
    balanceDue: 0,
    status: 'paid',
    items: [
      { description: 'Self-Heating Instant Poha', sku: 'SIP-MEAL-POHA-119', quantity: 3, unitPrice: 119, total: 357 }
    ]
  },
  {
    id: 'inv_104',
    invoiceNumber: 'INV-2026-0044',
    orderId: 'ord_1004',
    orderNumber: 'SIP-ORD-9424',
    customerId: 'cust_04',
    customerName: 'Neha Sharma',
    customerEmail: 'neha.sharma@delhiuni.ac.in',
    customerAddress: 'Chhatra Marg, North Campus, Delhi - 110007',
    issueDate: '2026-09-25',
    dueDate: '2026-09-28',
    subtotal: 198,
    cgst: 0,
    sgst: 0,
    igst: 9.90,
    discount: 0,
    totalAmount: 247.90,
    paidAmount: 0,
    balanceDue: 247.90,
    status: 'unpaid',
    items: [
      { description: 'Self-Heating Instant Kulhad Chai (Masala Kadak)', sku: 'SIP-KUL-CHAI-MK99', quantity: 2, unitPrice: 99, total: 198 }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentReceipt[] = [
  {
    id: 'pay_01',
    receiptNumber: 'REC-2026-0081',
    receiptDate: '2026-09-20 10:14',
    customerName: 'Amit Verma',
    invoiceNumber: 'INV-2026-0041',
    orderNumber: 'SIP-ORD-9421',
    amount: 372.85,
    paymentMethod: 'UPI',
    transactionRef: 'UPI/226010091823/OKAXIS',
    status: 'completed'
  },
  {
    id: 'pay_02',
    receiptNumber: 'REC-2026-0082',
    receiptDate: '2026-09-23 08:30',
    customerName: 'Priya Singh',
    invoiceNumber: 'INV-2026-0042',
    orderNumber: 'SIP-ORD-9422',
    amount: 1362.90,
    paymentMethod: 'Card',
    transactionRef: 'RZP_PAY_9281740192',
    status: 'completed'
  },
  {
    id: 'pay_03',
    receiptNumber: 'REC-2026-0083',
    receiptDate: '2026-09-24 16:45',
    customerName: 'Rahul Gupta',
    invoiceNumber: 'INV-2026-0043',
    orderNumber: 'SIP-ORD-9423',
    amount: 414.85,
    paymentMethod: 'UPI',
    transactionRef: 'UPI/201301994821/YBL',
    status: 'completed'
  },
  {
    id: 'pay_04',
    receiptNumber: 'REC-2026-0084',
    receiptDate: '2026-09-25 09:55',
    customerName: 'Rohit Yadav',
    orderNumber: 'SIP-ORD-9425',
    amount: 418.95,
    paymentMethod: 'UPI',
    transactionRef: 'UPI/302001445102/PAYTM',
    status: 'completed'
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh_delhi',
    name: 'Delhi NCR Central Fulfillment Hub',
    code: 'WH-DEL-01',
    address: 'Plot 45, Udyog Vihar Phase 4',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122016',
    managerName: 'Rohit Yadav',
    managerPhone: '+91 97999 88321',
    capacity: 25000,
    currentStock: 12450,
    isActive: true
  },
  {
    id: 'wh_lucknow',
    name: 'Lucknow Regional Depot & Packaging Cell',
    code: 'WH-LKO-02',
    address: 'Transport Nagar, Kanpur Road',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226012',
    managerName: 'Amit Verma',
    managerPhone: '+91 98234 11223',
    capacity: 15000,
    currentStock: 8200,
    isActive: true
  },
  {
    id: 'wh_mumbai',
    name: 'Mumbai West Logistics Hub',
    code: 'WH-BOM-03',
    address: 'Bhiwandi Warehousing Complex',
    city: 'Thane',
    state: 'Maharashtra',
    pincode: '421302',
    managerName: 'Sanjay Deshmukh',
    managerPhone: '+91 98200 99122',
    capacity: 20000,
    currentStock: 6800,
    isActive: true
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'batch_01',
    batchNumber: 'BAT-2026-CHAI-08',
    productId: 'prod_kulhad_chai_ge',
    productName: 'Self-Heating Instant Kulhad Chai (Ginger Elaichi)',
    warehouseId: 'wh_delhi',
    warehouseName: 'Delhi NCR Central Fulfillment Hub',
    manufacturingDate: '2026-08-01',
    expiryDate: '2027-05-01',
    quantity: 1200,
    status: 'fresh'
  },
  {
    id: 'batch_02',
    batchNumber: 'BAT-2026-POHA-07',
    productId: 'prod_meal_poha_119',
    productName: 'Self-Heating Instant Poha',
    warehouseId: 'wh_lucknow',
    warehouseName: 'Lucknow Regional Depot',
    manufacturingDate: '2026-07-15',
    expiryDate: '2027-07-15',
    quantity: 850,
    status: 'fresh'
  },
  {
    id: 'batch_03',
    batchNumber: 'BAT-2026-COF-06',
    productId: 'prod_kulhad_coffee_fr',
    productName: 'Self-Heating Instant Kulhad Coffee',
    warehouseId: 'wh_delhi',
    warehouseName: 'Delhi NCR Central Fulfillment Hub',
    manufacturingDate: '2026-06-20',
    expiryDate: '2027-03-20',
    quantity: 650,
    status: 'fresh'
  },
  {
    id: 'batch_04',
    batchNumber: 'BAT-2025-UPMA-11',
    productId: 'prod_meal_upma_119',
    productName: 'Self-Heating Instant Upma',
    warehouseId: 'wh_mumbai',
    warehouseName: 'Mumbai West Logistics Hub',
    manufacturingDate: '2025-11-10',
    expiryDate: '2026-11-10',
    quantity: 90,
    status: 'expiring_soon'
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'shp_01',
    shipmentNumber: 'SHP-9021',
    orderNumber: 'SIP-ORD-9421',
    customerName: 'Amit Verma',
    courierName: 'Delhivery',
    trackingNumber: 'DL982348123',
    trackingUrl: 'https://www.delhivery.com/track/package/DL982348123',
    status: 'delivered',
    dispatchDate: '2026-09-20 16:00',
    expectedDelivery: '2026-09-21 18:00',
    deliveredDate: '2026-09-21 14:10'
  },
  {
    id: 'shp_02',
    shipmentNumber: 'SHP-9022',
    orderNumber: 'SIP-ORD-9422',
    customerName: 'Priya Singh',
    courierName: 'Blue Dart',
    trackingNumber: 'BD77281923',
    trackingUrl: 'https://www.bluedart.com/tracking/BD77281923',
    status: 'in_transit',
    dispatchDate: '2026-09-24 10:00',
    expectedDelivery: '2026-09-26 12:00'
  }
];

export const INITIAL_RETURNS: ReturnRequest[] = [
  {
    id: 'ret_01',
    returnNumber: 'RET-2026-0012',
    orderNumber: 'SIP-ORD-9390',
    customerName: 'Kavita Mishra',
    reason: 'Outer shipping carton crushed during courier transit (product seals safe)',
    items: '1x Self-Heating Kulhad Coffee (119)',
    amount: 119,
    status: 'approved',
    refundStatus: 'processed',
    createdAt: '2026-09-18T11:20:00Z'
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'ven_01',
    name: 'ClayCraft Traditional Potters Co-op',
    contactPerson: 'Rameshwar Prajapati',
    phone: '+91 94150 99881',
    email: 'contact@claycraft-pottery.in',
    gstin: '09AAACG7781R1ZT',
    city: 'Khurja',
    productsSupplied: 'Terracotta Kulhad Cups (Food Grade, Kiln Baked)',
    outstandingBalance: 18500,
    isActive: true
  },
  {
    id: 'ven_02',
    name: 'ThermalSafe Food Tech Packs Ltd',
    contactPerson: 'Dr. Nikhil Rao',
    phone: '+91 98801 44550',
    email: 'nikhil@thermalsafepacks.com',
    gstin: '29AABCT9981K1ZA',
    city: 'Bengaluru',
    productsSupplied: 'HH-Water Activated Thermal Exothermic Reaction Sachets',
    outstandingBalance: 42000,
    isActive: true
  },
  {
    id: 'ven_03',
    name: 'Assam Valley Organic Estates',
    contactPerson: 'Diganta Borah',
    phone: '+91 94350 22119',
    email: 'orders@assamvalleytea.in',
    gstin: '18AABFA3311E1ZR',
    city: 'Guwahati',
    productsSupplied: 'CTC Premium Orthodox Tea Extracts & Whole Spices',
    outstandingBalance: 28000,
    isActive: true
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_01',
    poNumber: 'PO-2026-051',
    vendorId: 'ven_01',
    vendorName: 'ClayCraft Traditional Potters Co-op',
    itemsSummary: '10,000 Pcs Handcrafted Food-Grade Terracotta Kulhad Cups',
    totalAmount: 38000,
    status: 'received',
    expectedDate: '2026-09-15',
    createdAt: '2026-09-02T10:00:00Z'
  },
  {
    id: 'po_02',
    poNumber: 'PO-2026-052',
    vendorId: 'ven_02',
    vendorName: 'ThermalSafe Food Tech Packs Ltd',
    itemsSummary: '8,000 Pcs Exothermic Water Reaction Packs (HH-Tech)',
    totalAmount: 76000,
    status: 'ordered',
    expectedDate: '2026-09-28',
    createdAt: '2026-09-18T12:00:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_01',
    category: 'Packaging',
    title: 'Food-grade moisture barrier seal pouches & box cartons',
    amount: 14500,
    expenseDate: '2026-09-22',
    paymentMethod: 'Bank Transfer',
    receiptRef: 'TXN-HDFC-9912',
    notes: 'Batch for festive season stock'
  },
  {
    id: 'exp_02',
    category: 'Shipping',
    title: 'Delhivery & Blue Dart monthly logistics invoice',
    amount: 18450,
    expenseDate: '2026-09-20',
    paymentMethod: 'Bank Transfer',
    receiptRef: 'INV-DEL-8821'
  },
  {
    id: 'exp_03',
    category: 'Marketing',
    title: 'Instagram & YouTube Food Creator campaign (Self-heating demo reels)',
    amount: 22000,
    expenseDate: '2026-09-15',
    paymentMethod: 'Card',
    receiptRef: 'META-ADS-991'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup_01',
    code: 'WELCOME100',
    type: 'fixed',
    value: 100,
    minOrderValue: 499,
    maxDiscount: 100,
    usageLimit: 500,
    timesUsed: 42,
    isActive: true,
    validFrom: '2026-08-01',
    validUntil: '2026-12-31'
  },
  {
    id: 'coup_02',
    code: 'CHAI50',
    type: 'fixed',
    value: 50,
    minOrderValue: 299,
    maxDiscount: 50,
    usageLimit: 1000,
    timesUsed: 88,
    isActive: true,
    validFrom: '2026-09-01',
    validUntil: '2026-10-31'
  },
  {
    id: 'coup_03',
    code: 'TREK15',
    type: 'percentage',
    value: 15,
    minOrderValue: 599,
    maxDiscount: 150,
    usageLimit: 300,
    timesUsed: 26,
    isActive: true,
    validFrom: '2026-09-10',
    validUntil: '2026-11-15'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_01',
    name: 'Viral 4-Minute Kulhad Chai Challenge',
    channel: 'Instagram',
    budget: 35000,
    spent: 24500,
    orders: 142,
    revenue: 56800,
    conversions: 184,
    status: 'active',
    startDate: '2026-09-05',
    endDate: '2026-10-05'
  },
  {
    id: 'cmp_02',
    name: 'Trekker & Mountain Highway WhatsApp Community',
    channel: 'WhatsApp',
    budget: 12000,
    spent: 8500,
    orders: 68,
    revenue: 41200,
    conversions: 89,
    status: 'active',
    startDate: '2026-09-12',
    endDate: '2026-10-12'
  }
];

export const INITIAL_BANNERS: BannerItem[] = [
  {
    id: 'ban_01',
    title: 'World First Instant Self-Heating Kulhad Chai',
    subtitle: 'Heats to 95°C in 4 Minutes with Pure Water Activation · No Stove or Gas Needed',
    ctaText: 'Shop Instant Chai (₹99)',
    ctaUrl: '/products/self-heating-kulhad-chai-ginger-elaichi',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1600&q=80',
    bannerType: 'hero_slider',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'ban_02',
    title: 'Hot Meals Anywhere: On Highway, Train, or Mountain Camps',
    subtitle: 'Self-Steaming Indori Poha, Dal Khichdi & Veg Biryani at Your Fingertips',
    ctaText: 'Explore Ready Meals (From ₹119)',
    ctaUrl: '/collections/ready-meals',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80',
    bannerType: 'hero_slider',
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'ban_03',
    title: 'Office Desk Chai Craving? No Pantries Required',
    subtitle: 'Pour Water, Wait 4 Minutes, Enjoy Fresh Steaming Earthen Aroma',
    ctaText: 'Order Explorer Combo',
    ctaUrl: '/products/sippzo-explorer-combo-pack',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1600&q=80',
    bannerType: 'promo_grid',
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'ban_04',
    title: 'High Altitude Tested & Defense Approved',
    subtitle: 'Functions flawlessly at -15°C in mountain sub-zero environments',
    ctaText: 'View Adventure Kits',
    ctaUrl: '/products/sippzo-trekker-defense-kit',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1600&q=80',
    bannerType: 'promo_grid',
    displayOrder: 2,
    isActive: true
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_01',
    productId: 'prod_kulhad_chai_ge',
    productName: 'Self-Heating Instant Kulhad Chai (Ginger Elaichi)',
    reviewerName: 'Rahul Sharma',
    reviewerEmail: 'rahul.sharma@gmail.com',
    rating: 5,
    comment: 'The Self-Heating Kulhad Chai was a game changer during our late-night drive on Yamuna Expressway. Reached piping hot 95°C in exactly 4 minutes. Real clay cup gives authentic earthy flavour!',
    date: '2026-09-22',
    status: 'approved'
  },
  {
    id: 'rev_02',
    productId: 'prod_meal_poha_119',
    productName: 'Self-Heating Instant Poha with Crunchy Peanuts & Sev',
    reviewerName: 'Ananya Deshpande',
    reviewerEmail: 'ananya.d@gmail.com',
    rating: 5,
    comment: 'Poha was remarkably fresh and fluffy! Peanuts stayed crunchy because they came in a separate pouch. Incredible food technology.',
    date: '2026-09-23',
    status: 'approved'
  },
  {
    id: 'rev_03',
    productId: 'prod_kulhad_coffee_fr',
    productName: 'Self-Heating Instant Kulhad Coffee',
    reviewerName: 'Venkatesh Iyer',
    reviewerEmail: 'venkat.iyer@chennai.in',
    rating: 4,
    comment: 'Very authentic South Indian filter roast taste. The aroma when the heating pack activates is soothing.',
    date: '2026-09-24',
    status: 'approved'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med_01',
    fileName: 'sippzo_kulhad_chai_studio.jpg',
    fileSize: 184500,
    mimeType: 'image/jpeg',
    publicUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    source: 'SIPPZO Store',
    category: 'Products',
    usedBy: 'SIP-KUL-CHAI-GE99',
    createdAt: '2026-09-01'
  },
  {
    id: 'med_02',
    fileName: 'sippzo_instant_poha_table.jpg',
    fileSize: 215400,
    mimeType: 'image/jpeg',
    publicUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    source: 'SIPPZO Store',
    category: 'Products',
    usedBy: 'SIP-MEAL-POHA-119',
    createdAt: '2026-09-02'
  },
  {
    id: 'med_03',
    fileName: 'sippzo_hero_mountains_banner.jpg',
    fileSize: 450200,
    mimeType: 'image/jpeg',
    publicUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1600&q=80',
    source: 'SIPPZO Store',
    category: 'Banners',
    usedBy: 'Homepage Hero Slider',
    createdAt: '2026-09-05'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_01',
    title: 'How SIPPZO Proprietary HH-Food Technology™ Works Without Fire or Gas',
    slug: 'how-hh-food-technology-works',
    excerpt: 'Deep dive into the controlled exothermic water-activated thermal engineering that brings kulhad chai to 95°C in 4 minutes.',
    content: `When you pour ordinary ambient water into the bottom thermal activation compartment of your SIPPZO canister, you trigger a calibrated, food-grade exothermic reaction between purified minerals and water.

The reaction releases controlled pure steam that transfers heat through the thermal conductive base directly into the traditional terracotta kulhad. Within 240 seconds (4 minutes), your beverage or meal reaches optimal serving temperature of 95°C.

It is 100% non-toxic, odorless, emission-safe, and approved for indoor rooms, train berths, tents, and corporate offices.`,
    authorName: 'SIPPZO Food-Tech Labs',
    coverImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    publishedAt: '2026-09-10'
  },
  {
    id: 'post_02',
    title: 'The Lost Art of Kulhad: Why Clay Matters for Tea and Digestion',
    slug: 'why-kulhad-matters-for-tea',
    excerpt: 'Exploring the alkaline mineral infusion and earthy petrichor notes that only genuine baked clay cups can deliver.',
    content: `Since ancient times in India, tea enjoyed in a terracotta kulhad has offered distinct health and taste benefits. The porous alkaline clay balances acidity in the tea, while infusing a distinct earthy petrichor scent known as 'Sondhi Khushboo'.

SIPPZO partners with traditional pottery artisan clusters in Uttar Pradesh and Rajasthan to mold biodegradable, disposable kulhads that respect tradition while powering modern food technology.`,
    authorName: 'SIPPZO Culture',
    coverImage: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    publishedAt: '2026-09-18'
  }
];

export const INITIAL_STATIC_PAGES: StaticPage[] = [
  {
    id: 'page_tech',
    title: 'Our Technology - HH-Food Tech™',
    slug: 'technology',
    content: `SIPPZO is pioneer of Water-Activated Self-Heating Food Engineering in India. Our mission is to make hot meals and authentic beverages accessible anywhere on Earth.`,
    metaTitle: 'SIPPZO HH-Food Technology™ | Self Heating Tea and Meals',
    metaDescription: 'Learn how SIPPZO heats meals to 95C in 4 minutes without fire, electricity, or gas.',
    isPublished: true,
    updatedAt: '2026-09-20'
  },
  {
    id: 'page_about',
    title: 'About SIPPZO',
    slug: 'about-us',
    content: `SIPPZO is an innovative food-tech startup based in India. We combine ancient culinary heritage—like the traditional kulhad—with cutting-edge thermodynamic packaging.`,
    metaTitle: 'About SIPPZO | Instant Self Heating Food & Kulhad Beverages',
    metaDescription: 'Discover SIPPZO story, products, and mission to revolutionize on-the-go food.',
    isPublished: true,
    updatedAt: '2026-09-20'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  storeName: 'SIPPZO',
  storePhone: '+91 98765 00001',
  storeEmail: 'orders@sippzo.com',
  storeAddress: 'SIPPZO Innovation Labs, Gomti Nagar Extension, Lucknow, UP - 226010, India',
  gstin: '09AAICS8812K1Z9',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  taxRatePercent: 5.0,
  freeShippingThreshold: 499,
  defaultShippingFee: 40,
  seoTitle: 'SIPPZO - World First Instant Self-Heating Kulhad Chai & Food',
  seoDescription: 'Order instant self-heating kulhad chai, coffee, poha and meals. Heats to 95°C in 4 minutes with water. Made in India.',
  seoKeywords: 'sippzo, self heating chai, kulhad chai, instant chai, ready meals, poha, adventure food, food tech india',
  googleAnalyticsId: 'G-SIPPZO2026',
  razorpayKeyId: 'rzp_live_sippzo99201',
  razorpayEnabled: true,
  codEnabled: true,
  upiEnabled: true,
  autoOrderConfirmationEmail: true,
  lowStockNotificationThreshold: 20
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_01',
    userEmail: 'zubair669262@gmail.com',
    action: 'LOGIN',
    module: 'Authentication',
    details: 'Super Admin Zubair logged in securely from Asia/Kolkata',
    timestamp: '2026-09-25 10:11:00'
  },
  {
    id: 'log_02',
    userEmail: 'zubair669262@gmail.com',
    action: 'SYNC',
    module: 'Catalog',
    details: 'Synchronized official SIPPZO catalog from sippzo.com (10 active products)',
    timestamp: '2026-09-25 09:45:00'
  },
  {
    id: 'log_03',
    userEmail: 'amit.verma@sippzo.com',
    action: 'UPDATE',
    module: 'Inventory',
    recordId: 'SIP-KUL-CHAI-GE99',
    details: 'Restocked 100 units to Delhi NCR Central Fulfillment Hub',
    timestamp: '2026-09-24 18:20:00'
  }
];
