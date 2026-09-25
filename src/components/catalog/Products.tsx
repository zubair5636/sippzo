import React, { useState } from 'react';
import {
  Package,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Upload
} from 'lucide-react';
import { db } from '../../lib/db';
import { Product } from '../../types';
import { formatINR } from '../../lib/formatters';
import {
  AdminPageHeader,
  AdminTableToolbar,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminPagination,
  AdminStatusBadge,
  AdminActionMenu,
  AdminEmptyState
} from '../common/AdminComponents';
import { AdminModal } from '../common/AdminModal';

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Real data from database
  const products = db.getProducts();
  const categories = db.getCategories();

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // View modal state
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStock =
      selectedStockFilter === 'all'
        ? true
        : selectedStockFilter === 'low'
        ? p.stock <= p.lowStockThreshold && p.stock > 0
        : selectedStockFilter === 'out'
        ? p.stock === 0
        : p.stock > p.lowStockThreshold;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingProduct({
      name: '',
      sku: `SIP-AUTO-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: 'SIPPZO',
      category: categories[0]?.name || 'Beverages & Chai',
      sellingPrice: 199,
      mrp: 249,
      costPrice: 90,
      stock: 100,
      lowStockThreshold: 20,
      weight: '180g (Ready Cup)',
      servings: '1 Kulhad Cup',
      shelfLife: '9 Months',
      storage: 'Cool & dry place',
      isVegetarian: true,
      ingredients: 'CTC Tea, Cardamom, Ginger, Milk Solids, Thermal Reaction Pack',
      description: 'Authentic Indian instant kulhad experience with instant thermal self-heating system.',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
      productUrl: 'https://sippzo.com'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      db.deleteProduct(id);
    }
  };

  const handleDuplicate = (p: Product) => {
    const copy: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: `${p.sku}-CPY`
    };
    db.saveProduct(copy);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.sku) return;

    const fullProduct: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      slug: (editingProduct.name || '').toLowerCase().replace(/\s+/g, '-'),
      sku: editingProduct.sku,
      brand: editingProduct.brand || 'SIPPZO',
      category: editingProduct.category || categories[0]?.name || 'Beverages & Chai',
      sellingPrice: Number(editingProduct.sellingPrice) || 0,
      mrp: Number(editingProduct.mrp) || 0,
      costPrice: Number(editingProduct.costPrice) || 0,
      stock: Number(editingProduct.stock) || 0,
      lowStockThreshold: Number(editingProduct.lowStockThreshold) || 20,
      weight: editingProduct.weight || '180g',
      servings: editingProduct.servings || '1 Cup',
      shelfLife: editingProduct.shelfLife || '9 Months',
      storage: editingProduct.storage || 'Cool & dry place',
      isVegetarian: editingProduct.isVegetarian ?? true,
      ingredients: editingProduct.ingredients || '',
      description: editingProduct.description || '',
      galleryUrls: editingProduct.galleryUrls || [editingProduct.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600'],
      sourceType: editingProduct.sourceType || 'manual_admin',
      sourceUrl: editingProduct.sourceUrl || 'https://sippzo.com',
      isFeatured: editingProduct.isFeatured ?? true,
      isHero: editingProduct.isHero ?? false,
      isBestSeller: editingProduct.isBestSeller ?? false,
      isNewArrival: editingProduct.isNewArrival ?? false,
      tags: editingProduct.tags || ['beverage', 'instant-chai'],
      updatedAt: new Date().toISOString(),
      imageUrl: editingProduct.imageUrl || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600',
      productUrl: editingProduct.productUrl || 'https://sippzo.com',
      isActive: editingProduct.isActive ?? true,
      createdAt: editingProduct.createdAt || new Date().toISOString()
    };

    db.saveProduct(fullProduct);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Spacious Page Header (30-36px typography, NO card) */}
      <AdminPageHeader
        title="Products"
        subtitle="Manage SIPPZO food-tech products, inventory levels and pricing"
        badge={`${products.length} Products`}
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        }
      />

      {/* Lightweight Inline Filter Controls (No Card) */}
      <AdminTableToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search products or SKU..."
        filterOptions={[
          { value: 'all', label: `All Categories (${products.length})` },
          ...categories.map((c) => ({ value: c.name, label: c.name }))
        ]}
        selectedFilter={selectedCategory}
        onFilterChange={(v) => {
          setSelectedCategory(v);
          setCurrentPage(1);
        }}
        secondaryFilterOptions={[
          { value: 'all', label: 'All Stock Levels' },
          { value: 'normal', label: 'In Stock' },
          { value: 'low', label: 'Low Stock' },
          { value: 'out', label: 'Out of Stock' }
        ]}
        selectedSecondaryFilter={selectedStockFilter}
        onSecondaryFilterChange={(v) => {
          setSelectedStockFilter(v);
          setCurrentPage(1);
        }}
      />

      {/* Product Table (Unboxed single-layer container) */}
      {filteredProducts.length === 0 ? (
        <AdminEmptyState
          title="No products found"
          description="Try changing keywords or reset active filters."
          actionLabel="Add Product"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-5">Product</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Price</th>
                <th className="py-3.5 px-4 text-right">MRP</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {paginatedProducts.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold && p.stock > 0;
                const isOut = p.stock === 0;

                return (
                  <AdminTableRow key={p.id}>
                    {/* Product Cell */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5 min-w-[220px]">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-11 h-11 rounded-lg object-cover shrink-0 bg-slate-100"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200';
                          }}
                        />
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => setViewingProduct(p)}
                            className="text-sm font-semibold text-slate-900 hover:text-orange-600 truncate block text-left transition-colors cursor-pointer"
                          >
                            {p.name}
                          </button>
                          <div className="text-xs text-slate-500 truncate mt-0.5">
                            {p.weight} · {p.brand}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      {p.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {p.category}
                    </td>

                    {/* Selling Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm sm:text-[15px]">
                      {formatINR(p.sellingPrice, { showDecimals: true })}
                    </td>

                    {/* MRP */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400 line-through">
                      {formatINR(p.mrp, { showDecimals: true })}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`font-mono text-sm font-bold ${
                          isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-slate-800'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <AdminStatusBadge
                        status={isOut ? 'out_of_stock' : isLow ? 'low_stock' : 'in_stock'}
                      />
                    </td>

                    {/* Action Menu */}
                    <td className="py-3.5 px-5 text-right">
                      <AdminActionMenu
                        onView={() => setViewingProduct(p)}
                        onEdit={() => handleOpenEdit(p)}
                        onDuplicate={() => handleDuplicate(p)}
                        onDelete={() => handleDelete(p.id, p.name)}
                        deleteLabel="Delete Product"
                      />
                    </td>
                  </AdminTableRow>
                );
              })}
            </AdminTableBody>
          </AdminTable>

          {/* Soft Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* PORTAL MODAL: Create / Edit Product Form (15-16px inputs, 13-14px labels) */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct?.id ? 'Edit Product' : 'Add New Product'}
        subtitle="Manage product specifications, pricing, inventory and thermal heating details"
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Product
            </button>
          </div>
        }
      >
        {editingProduct && (
          <form id="product-form" onSubmit={handleSaveModal} className="space-y-5 text-sm sm:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="e.g. Instant Kulhad Chai (Ginger Elaichi)"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.sku || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, sku: e.target.value })
                  }
                  placeholder="SIP-KUL-CHAI-99"
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={editingProduct.category || categories[0]?.name || 'Beverages & Chai'}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Brand
                </label>
                <input
                  type="text"
                  value={editingProduct.brand || 'SIPPZO'}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, brand: e.target.value })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editingProduct.sellingPrice ?? ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      sellingPrice: parseFloat(e.target.value) || 0
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  MRP (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={editingProduct.mrp ?? ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      mrp: parseFloat(e.target.value) || 0
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Available Stock
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingProduct.stock ?? 100}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock: parseInt(e.target.value) || 0
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Low Stock Buffer
                </label>
                <input
                  type="number"
                  min={1}
                  value={editingProduct.lowStockThreshold ?? 20}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      lowStockThreshold: parseInt(e.target.value) || 20
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Product Image URL */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                value={editingProduct.imageUrl || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                placeholder="Enter taste profile, brewing instructions, self-heating mechanism details..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>
          </form>
        )}
      </AdminModal>

      {/* PORTAL MODAL: View Product Details */}
      <AdminModal
        isOpen={!!viewingProduct}
        onClose={() => setViewingProduct(null)}
        title={viewingProduct?.name || 'Product Details'}
        subtitle={`SKU: ${viewingProduct?.sku} · Category: ${viewingProduct?.category}`}
        maxWidth="lg"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (viewingProduct) {
                  const p = viewingProduct;
                  setViewingProduct(null);
                  handleOpenEdit(p);
                }
              }}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Edit Product
            </button>
            <button
              onClick={() => setViewingProduct(null)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingProduct && (
          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <img
                src={viewingProduct.imageUrl}
                alt={viewingProduct.name}
                className="w-24 h-24 rounded-xl object-cover bg-slate-100 shadow-sm shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-lg">{viewingProduct.name}</h4>
                <div className="font-mono text-xs text-slate-500">{viewingProduct.sku}</div>
                <div className="text-sm text-slate-600">{viewingProduct.brand} · {viewingProduct.weight}</div>
                <div className="pt-1">
                  <AdminStatusBadge
                    status={
                      viewingProduct.stock === 0
                        ? 'out_of_stock'
                        : viewingProduct.stock <= viewingProduct.lowStockThreshold
                        ? 'low_stock'
                        : 'in_stock'
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Selling Price</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {formatINR(viewingProduct.sellingPrice, { showDecimals: true })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">MRP</div>
                <div className="text-lg font-mono text-slate-400 line-through mt-0.5">
                  {formatINR(viewingProduct.mrp, { showDecimals: true })}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Current Stock</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
                  {viewingProduct.stock} units
                </div>
              </div>
            </div>

            {viewingProduct.description && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {viewingProduct.description}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
};
