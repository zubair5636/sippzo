import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  ExternalLink
} from 'lucide-react';
import { db } from '../../lib/db';
import { ProductBrand } from '../../types';
import {
  AdminPageHeader,
  AdminTableToolbar,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminPagination,
  AdminActionMenu,
  AdminEmptyState,
  AdminStatusBadge
} from '../common/AdminComponents';
import { AdminModal } from '../common/AdminModal';

export const Brands: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const brands = db.getBrands();
  const products = db.getProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<ProductBrand> | null>(null);

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / pageSize);
  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingBrand({
      name: '',
      slug: '',
      logoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=200',
      websiteUrl: 'https://sippzo.com',
      isFeatured: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: ProductBrand) => {
    setEditingBrand({ ...b });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete brand "${name}"?`)) {
      db.deleteBrand(id);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBrand || !editingBrand.name) return;

    const slug =
      editingBrand.slug?.trim() ||
      editingBrand.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    db.saveBrand({
      ...editingBrand,
      slug
    });

    setIsModalOpen(false);
    setEditingBrand(null);
  };

  return (
    <div className="space-y-6 w-full">
      <AdminPageHeader
        title="Product Brands"
        subtitle="Manage brand partnerships, labels, manufacturers and official websites"
        badge={`${brands.length} Brands`}
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        }
      />

      <AdminTableToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search brands..."
      />

      {filteredBrands.length === 0 ? (
        <AdminEmptyState
          title="No brands found"
          description="Try changing keywords or register a new brand."
          actionLabel="Add Brand"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-5">Brand</th>
                <th className="py-3.5 px-4">Identifier</th>
                <th className="py-3.5 px-4 text-center">Products</th>
                <th className="py-3.5 px-4">Website</th>
                <th className="py-3.5 px-4 text-center">Showcase</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {paginatedBrands.map((b) => {
                const count = products.filter((p) => p.brand === b.name).length;
                return (
                  <AdminTableRow key={b.id}>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={b.logoUrl}
                          alt={b.name}
                          className="w-10 h-10 rounded-lg border border-slate-200 object-cover shrink-0 bg-slate-50"
                        />
                        <span className="font-semibold text-slate-900 text-sm sm:text-[15px]">{b.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{b.slug}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-sm">
                      {count}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.websiteUrl ? (
                        <a
                          href={b.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1.5 text-sm font-medium"
                        >
                          <span className="truncate max-w-[180px]">{b.websiteUrl.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <AdminStatusBadge
                        status={b.isFeatured ? 'featured' : 'standard'}
                        variant={b.isFeatured ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <AdminActionMenu
                        onEdit={() => handleOpenEdit(b)}
                        onDelete={() => handleDelete(b.id, b.name)}
                      />
                    </td>
                  </AdminTableRow>
                );
              })}
            </AdminTableBody>
          </AdminTable>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredBrands.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Portal Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
        }}
        title={editingBrand?.id ? 'Edit Brand' : 'Add Brand'}
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="brand-form"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Save Brand
            </button>
          </div>
        }
      >
        {editingBrand && (
          <form id="brand-form" onSubmit={handleSaveModal} className="space-y-5 text-sm sm:text-base">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand Name *</label>
              <input
                type="text"
                required
                value={editingBrand.name || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                placeholder="e.g. SIPPZO Thermal Craft"
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Identifier Slug</label>
              <input
                type="text"
                value={editingBrand.slug || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, slug: e.target.value })}
                placeholder="sippzo-craft"
                className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Official Website URL</label>
              <input
                type="url"
                value={editingBrand.websiteUrl || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, websiteUrl: e.target.value })}
                placeholder="https://sippzo.com"
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo Image URL</label>
              <input
                type="url"
                value={editingBrand.logoUrl || ''}
                onChange={(e) => setEditingBrand({ ...editingBrand, logoUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={editingBrand.isFeatured ?? true}
                onChange={(e) => setEditingBrand({ ...editingBrand, isFeatured: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700 cursor-pointer">
                Highlight as Featured Brand partner
              </label>
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
};
