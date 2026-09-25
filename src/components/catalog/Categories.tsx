import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { db } from '../../lib/db';
import { ProductCategory } from '../../types';
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

export const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const categories = db.getCategories();
  const products = db.getProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<ProductCategory> | null>(null);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingCategory({
      name: '',
      slug: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=400',
      displayOrder: categories.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ProductCategory) => {
    setEditingCategory({ ...c });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete category "${name}"?`)) {
      db.deleteCategory(id);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    const slug =
      editingCategory.slug?.trim() ||
      editingCategory.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    db.saveCategory({
      ...editingCategory,
      slug
    });

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 w-full">
      <AdminPageHeader
        title="Product Categories"
        subtitle="Manage storefront taxonomy, menu groupings and catalog sorting"
        badge={`${categories.length} Categories`}
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
      />

      <AdminTableToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search categories..."
      />

      {filteredCategories.length === 0 ? (
        <AdminEmptyState
          title="No categories found"
          description="Try changing your search terms or create a new category."
          actionLabel="Add Category"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-center">Products</th>
                <th className="py-3.5 px-4 text-center">Sort Order</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {paginatedCategories.map((c) => {
                const count = products.filter((p) => p.category === c.name).length;
                return (
                  <AdminTableRow key={c.id}>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3.5">
                        {c.imageUrl ? (
                          <img
                            src={c.imageUrl}
                            alt={c.name}
                            className="w-10 h-10 rounded-lg border border-slate-200 object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 text-sm sm:text-[15px]">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{c.slug}</td>
                    <td className="py-3.5 px-4 text-slate-600 text-sm max-w-xs truncate">{c.description || '—'}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 text-sm">
                      {count}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 text-sm">{c.displayOrder}</td>
                    <td className="py-3.5 px-4 text-center">
                      <AdminStatusBadge
                        status={c.isActive ? 'active' : 'inactive'}
                        variant={c.isActive ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <AdminActionMenu
                        onEdit={() => handleOpenEdit(c)}
                        onDelete={() => handleDelete(c.id, c.name)}
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
            totalRecords={filteredCategories.length}
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
          setEditingCategory(null);
        }}
        title={editingCategory?.id ? 'Edit Category' : 'Add Category'}
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
              form="category-form"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Save Category
            </button>
          </div>
        }
      >
        {editingCategory && (
          <form id="category-form" onSubmit={handleSaveModal} className="space-y-5 text-sm sm:text-base">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name *</label>
              <input
                type="text"
                required
                value={editingCategory.name || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="e.g. Instant Chai & Premixes"
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug URL</label>
              <input
                type="text"
                value={editingCategory.slug || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                placeholder="instant-chai-premixes"
                className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                value={editingCategory.description || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder="Brief category summary for storefront..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort Priority</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      displayOrder: parseInt(e.target.value) || 1
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Active Status</label>
                <select
                  value={editingCategory.isActive ? 'true' : 'false'}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, isActive: e.target.value === 'true' })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                >
                  <option value="true">Active & Visible</option>
                  <option value="false">Hidden / Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cover Image URL</label>
              <input
                type="url"
                value={editingCategory.imageUrl || ''}
                onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>
          </form>
        )}
      </AdminModal>
    </div>
  );
};
