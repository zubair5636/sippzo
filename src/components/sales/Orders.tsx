import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Eye,
  Trash2,
  ExternalLink,
  Printer
} from 'lucide-react';
import { db } from '../../lib/db';
import { Order } from '../../types';
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

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const orders = db.getOrders();
  const products = db.getProducts();

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Partial<Order> | null>(null);

  // View modal state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || o.orderStatus === selectedStatus;

    const matchesPayment =
      selectedPaymentStatus === 'all' || o.paymentStatus === selectedPaymentStatus;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    const defaultProduct = products[0];
    const unitPrice = defaultProduct?.sellingPrice || 199;

    setEditingOrder({
      orderNumber: `SIP-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: '',
      customerEmail: '',
      customerPhone: '+91 98765 43210',
      shippingAddress: '42, Brigade Road',
      shippingCity: 'Bengaluru',
      shippingState: 'Karnataka',
      shippingPincode: '560001',
      orderStatus: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'UPI',
      subtotal: unitPrice,
      tax: Math.round(unitPrice * 0.05),
      shippingFee: 0,
      discount: 0,
      totalAmount: Math.round(unitPrice * 1.05),
      items: [
        {
          id: 'item-1',
          productId: defaultProduct?.id || '1',
          productName: defaultProduct?.name || 'Instant Kulhad Chai (Ginger Elaichi)',
          productSku: defaultProduct?.sku || 'SIP-KUL-CHAI-99',
          productImage: defaultProduct?.imageUrl || '',
          quantity: 1,
          unitPrice: unitPrice,
          totalPrice: unitPrice
        }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (o: Order) => {
    setEditingOrder({ ...o });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, orderNumber: string) => {
    if (confirm(`Cancel and delete order "${orderNumber}"?`)) {
      db.deleteOrder(id);
    }
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder || !editingOrder.customerName || !editingOrder.orderNumber) return;

    db.saveOrder(editingOrder as Order);
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6 w-full">
      <AdminPageHeader
        title="Orders"
        subtitle="Manage customer orders, fulfillment stages and delivery tracking"
        badge={`${orders.length} Orders`}
        actions={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        }
      />

      <AdminTableToolbar
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search order number, customer, city..."
        filterOptions={[
          { value: 'all', label: `All Statuses (${orders.length})` },
          { value: 'pending', label: 'Pending' },
          { value: 'processing', label: 'Processing' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' }
        ]}
        selectedFilter={selectedStatus}
        onFilterChange={(v) => {
          setSelectedStatus(v);
          setCurrentPage(1);
        }}
        secondaryFilterOptions={[
          { value: 'all', label: 'All Payments' },
          { value: 'paid', label: 'Paid' },
          { value: 'pending', label: 'Unpaid / Pending' },
          { value: 'failed', label: 'Failed' },
          { value: 'refunded', label: 'Refunded' }
        ]}
        selectedSecondaryFilter={selectedPaymentStatus}
        onSecondaryFilterChange={(v) => {
          setSelectedPaymentStatus(v);
          setCurrentPage(1);
        }}
      />

      {filteredOrders.length === 0 ? (
        <AdminEmptyState
          title="No orders found"
          description="Try changing filters or search terms."
          actionLabel="Create Order"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="space-y-4">
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <th className="py-3.5 px-5">Order #</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4 text-center">Items</th>
                <th className="py-3.5 px-4 text-center">Fulfillment</th>
                <th className="py-3.5 px-4 text-center">Payment</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </AdminTableHeader>
            <AdminTableBody>
              {paginatedOrders.map((o) => (
                <AdminTableRow key={o.id}>
                  {/* Order Number */}
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-sm">
                    <button
                      type="button"
                      onClick={() => setViewingOrder(o)}
                      className="hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      {o.orderNumber}
                    </button>
                    <div className="text-xs font-normal text-slate-400 font-sans mt-0.5">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 text-sm">{o.customerName}</div>
                    <div className="text-xs text-slate-500 truncate">{o.customerEmail}</div>
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-4 text-slate-700 text-sm font-medium">
                    {o.shippingCity}, {o.shippingState}
                  </td>

                  {/* Items */}
                  <td className="py-3.5 px-4 text-center text-slate-600 font-mono text-sm">
                    {o.items?.length || 1}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <AdminStatusBadge status={o.orderStatus} />
                  </td>

                  {/* Payment Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <AdminStatusBadge status={o.paymentStatus} />
                  </td>

                  {/* Total */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm sm:text-[15px]">
                    {formatINR(o.totalAmount, { showDecimals: true })}
                  </td>

                  {/* Action Menu */}
                  <td className="py-3.5 px-5 text-right">
                    <AdminActionMenu
                      onView={() => setViewingOrder(o)}
                      onEdit={() => handleOpenEdit(o)}
                      onDelete={() => handleDelete(o.id, o.orderNumber)}
                      deleteLabel="Cancel Order"
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
            totalRecords={filteredOrders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* PORTAL MODAL: Create / Edit Order */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        title={editingOrder?.id ? 'Edit Order' : 'Create New Order'}
        subtitle="Manage recipient, delivery addresses and order items"
        maxWidth="2xl"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingOrder(null);
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="order-form"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Save Order
            </button>
          </div>
        }
      >
        {editingOrder && (
          <form id="order-form" onSubmit={handleSaveModal} className="space-y-5 text-sm sm:text-base">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={editingOrder.orderNumber || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, orderNumber: e.target.value })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingOrder.customerName || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, customerName: e.target.value })
                  }
                  placeholder="e.g. Ramesh Sharma"
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
                  value={editingOrder.customerEmail || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, customerEmail: e.target.value })
                  }
                  placeholder="ramesh@gmail.com"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingOrder.customerPhone || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, customerPhone: e.target.value })
                  }
                  placeholder="+91 98765 43210"
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Order Status
                </label>
                <select
                  value={editingOrder.orderStatus || 'pending'}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, orderStatus: e.target.value as any })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Payment Status
                </label>
                <select
                  value={editingOrder.paymentStatus || 'pending'}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, paymentStatus: e.target.value as any })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all cursor-pointer shadow-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Shipping City
                </label>
                <input
                  type="text"
                  value={editingOrder.shippingCity || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, shippingCity: e.target.value })
                  }
                  className="w-full text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Total Amount (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={editingOrder.totalAmount ?? ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      totalAmount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="w-full font-mono text-base bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-hidden focus:border-orange-500 transition-all shadow-xs"
                />
              </div>
            </div>
          </form>
        )}
      </AdminModal>

      {/* PORTAL MODAL: View Order Details */}
      <AdminModal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title={viewingOrder?.orderNumber || 'Order Details'}
        subtitle={`Placed on ${
          viewingOrder?.createdAt
            ? new Date(viewingOrder.createdAt).toLocaleDateString('en-IN', {
                dateStyle: 'long'
              })
            : ''
        }`}
        maxWidth="lg"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setViewingOrder(null)}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingOrder && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Fulfillment</div>
                <div className="mt-1">
                  <AdminStatusBadge status={viewingOrder.orderStatus} />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Payment</div>
                <div className="mt-1">
                  <AdminStatusBadge status={viewingOrder.paymentStatus} />
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-semibold uppercase">Total Paid</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {formatINR(viewingOrder.totalAmount, { showDecimals: true })}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer & Shipping
              </div>
              <div className="p-4 rounded-xl border border-slate-200/60 space-y-1.5 bg-white">
                <div className="font-semibold text-slate-900 text-base">{viewingOrder.customerName}</div>
                <div className="text-slate-600">{viewingOrder.customerEmail} · {viewingOrder.customerPhone}</div>
                <div className="text-slate-500 pt-1">
                  {viewingOrder.shippingAddress}, {viewingOrder.shippingCity},{' '}
                  {viewingOrder.shippingState} - {viewingOrder.shippingPincode}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Order Items
              </div>
              <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-xl overflow-hidden bg-white">
                {viewingOrder.items?.map((item) => (
                  <div key={item.id} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{item.productName}</div>
                      <div className="font-mono text-slate-400 text-xs">{item.productSku}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">
                        {formatINR(item.totalPrice)}
                      </div>
                      <div className="text-xs text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};
