import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  MapPin,
  ShoppingBag
} from 'lucide-react';
import { db } from '../../lib/db';
import { Customer } from '../../types';
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

export const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const customers = db.getCustomers();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  // Distinct cities
  const cities = Array.from(new Set(customers.map((c) => c.city).filter(Boolean)));

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.city && c.city.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = selectedCity === 'all' || c.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingCustomer({
      name: '',
      email: '',
      phone: '+91 ',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '',
      pincode: '400001',
      status: 'active',
      totalOrders: 0,
      totalSpent: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer({ ...c });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove customer record for "${name}"?`)) {
      db.deleteCustomer(id);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.name || !editingCustomer.email) return;

    db.saveCustomer(editingCustomer as Customer);
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 w-full">
      <AdminPageHeader
        title="Customers"
        subtitle="Manage verified consumer accounts, order history and communication preferences"
        badge={`${customers.length} Customers`}
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      <AdminTableToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search customer by name, email, phone or city..."
        filterOptions={[
          { value: 'all', label: `All Cities (${customers.length})` },
          ...cities.map((city) => ({ value: city, label: city }))
        ]}
        selectedFilter={selectedCity}
        onFilterChange={(v) => {
          setSelectedCity(v);
          setCurrentPage(1);
        }}
      />

      {filteredCustomers.length === 0 ? (
        <AdminEmptyState
          title="No customers found"
          description="Try changing filters or search terms."
          actionLabel="Add Customer"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">City / State</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-right">Lifetime Value</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {paginatedCustomers.map((c) => (
                <AdminTableRow key={c.id}>
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => setViewingCustomer(c)}
                          className="font-semibold text-slate-900 hover:text-orange-600 transition-colors text-left text-sm truncate block cursor-pointer"
                        >
                          {c.name}
                        </button>
                        <div className="text-xs text-slate-400">
                          Joined {new Date(c.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 text-sm">{c.email}</div>
                    <div className="font-mono text-xs text-slate-400">{c.phone}</div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 text-slate-700 text-sm">
                    {c.city ? `${c.city}, ${c.state || ''}` : 'India'}
                  </td>

                  {/* Orders */}
                  <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800 text-sm">
                    {c.totalOrders || 0}
                  </td>

                  {/* Lifetime Value */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm sm:text-[15px]">
                    {formatINR(c.totalSpent || 0)}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <AdminStatusBadge status={c.status || 'active'} />
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 px-5 text-right">
                    <AdminActionMenu
                      onView={() => setViewingCustomer(c)}
                      onEdit={() => handleOpenEdit(c)}
                      onDelete={() => handleDelete(c.id, c.name)}
                      deleteLabel="Delete Customer"
                    />
                  </td>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>

          {/* Soft Pagination */}
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={filteredCustomers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* PORTAL MODAL: Create / Edit Customer */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        title={editingCustomer?.id ? 'Edit Customer' : 'Add New Customer'}
        subtitle="Manage customer contact info, delivery address and account status"
        maxWidth="xl"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCustomer(null);
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="customer-form"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        }
      >
        {editingCustomer && (
          <form id="customer-form" onSubmit={handleSaveModal} className="space-y-5 text-sm sm:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingCustomer.name || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, name: e.target.value })
                  }
                  placeholder="e.g. Ananya Roy"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingCustomer.email || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, email: e.target.value })
                  }
                  placeholder="ananya@gmail.com"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingCustomer.phone || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, phone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={editingCustomer.city || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, city: e.target.value })
                  }
                  placeholder="Mumbai"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  value={editingCustomer.state || ''}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, state: e.target.value })
                  }
                  placeholder="Maharashtra"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Account Status
                </label>
                <select
                  value={editingCustomer.status || 'active'}
                  onChange={(e) =>
                    setEditingCustomer({ ...editingCustomer, status: e.target.value as any })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Delivery Address
              </label>
              <textarea
                rows={2}
                value={editingCustomer.address || ''}
                onChange={(e) =>
                  setEditingCustomer({ ...editingCustomer, address: e.target.value })
                }
                placeholder="Street address, apartment, landmarks..."
                className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
              />
            </div>
          </form>
        )}
      </AdminModal>

      {/* PORTAL MODAL: View Customer Details */}
      <AdminModal
        isOpen={!!viewingCustomer}
        onClose={() => setViewingCustomer(null)}
        title={viewingCustomer?.name || 'Customer Profile'}
        subtitle={`Member since ${
          viewingCustomer?.createdAt
            ? new Date(viewingCustomer.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'medium'
              })
            : ''
        }`}
        maxWidth="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (viewingCustomer) {
                  const c = viewingCustomer;
                  setViewingCustomer(null);
                  handleOpenEdit(c);
                }
              }}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setViewingCustomer(null)}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingCustomer && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-800 font-bold text-xl flex items-center justify-center shrink-0 border border-slate-200/60">
                {viewingCustomer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{viewingCustomer.name}</h4>
                <div className="text-slate-600">{viewingCustomer.email}</div>
                <div className="font-mono text-xs text-slate-400 mt-0.5">{viewingCustomer.phone}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/60">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Orders</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {viewingCustomer.totalOrders || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Lifetime Spend</div>
                <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {formatINR(viewingCustomer.totalSpent || 0)}
                </div>
              </div>
            </div>

            {viewingCustomer.address && (
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Default Shipping Address
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200/60 text-slate-700 bg-white">
                  {viewingCustomer.address}, {viewingCustomer.city}, {viewingCustomer.state} -{' '}
                  {viewingCustomer.pincode}
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </div>
  );
};
