import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  AlertTriangle,
  ArrowRight,
  Flame,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { db } from '../../lib/db';
import { formatINR } from '../../lib/formatters';
import { ActiveTab } from '../layout/Sidebar';
import {
  AdminStatusBadge,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow
} from '../common/AdminComponents';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onNewProduct: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onNewProduct }) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'month'>('month');

  const products = db.getProducts();
  const orders = db.getOrders();
  const customers = db.getCustomers();

  // Metrics calculation
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);

  return (
    <div className="space-y-10 w-full">
      {/* 1. Page Header with Clean Timeframe Filter (NO Box) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pt-1">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-[36px] font-bold tracking-tight text-slate-900 leading-tight">
            Dashboard
          </h1>
          <p className="text-base text-slate-500 font-normal">
            Store performance and operational overview
          </p>
        </div>

        {/* Minimal pill timeframe toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-lg text-sm font-medium self-start sm:self-auto shadow-xs">
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'month', label: 'This Month' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-md transition-all cursor-pointer text-sm ${
                timeRange === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Sleek KPI Metrics Strip (NO Card inside card, large 32-38px metrics, whitespace-driven) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-2">
        {/* Revenue */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Revenue
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            {formatINR(totalRevenue, { showDecimals: true })}
          </div>
          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium pt-0.5">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% vs last period</span>
          </div>
        </div>

        {/* Orders */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Orders
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            {orders.length}
          </div>
          <div className="text-sm text-slate-500 pt-0.5">
            <span className="font-semibold text-amber-600">{pendingOrders.length} pending</span> fulfillment
          </div>
        </div>

        {/* Customers */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Registered Customers
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            {customers.length}
          </div>
          <div className="text-sm text-slate-500 pt-0.5">
            <span>100% active verified accounts</span>
          </div>
        </div>

        {/* Catalog Items */}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Catalog Products
          </div>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
            {products.length}
          </div>
          <div className="text-sm pt-0.5">
            {lowStockProducts.length > 0 ? (
              <span className="text-rose-600 font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {lowStockProducts.length} low stock items
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">All items stocked</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Subtle Hairline Separator */}
      <div className="h-px bg-slate-200/70 w-full" />

      {/* 4. Revenue Trend & Stock Attention Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Revenue Performance Trend */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Revenue & Sales Performance
              </h2>
              <p className="text-sm text-slate-500">
                Monthly turnover across online direct-to-consumer and corporate distribution
              </p>
            </div>
            <div className="text-sm font-mono text-slate-400 font-medium">₹ INR</div>
          </div>

          {/* Minimalist Chart Area */}
          <div className="bg-white rounded-xl p-6 shadow-premium border border-slate-200/70 space-y-5">
            <div className="flex items-center justify-between text-sm text-slate-500 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-orange-600" />
                <span className="font-semibold text-slate-800">Gross Sales</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">Jan – Jun 2026</div>
            </div>

            {/* Modern CSS Bar Flow */}
            <div className="h-48 flex items-end gap-4 sm:gap-7 pt-4 px-3">
              {[
                { month: 'Jan', val: 45, amt: '₹18,400' },
                { month: 'Feb', val: 60, amt: '₹24,500' },
                { month: 'Mar', val: 52, amt: '₹21,200' },
                { month: 'Apr', val: 78, amt: '₹31,800' },
                { month: 'May', val: 90, amt: '₹38,200' },
                { month: 'Jun', val: 100, amt: '₹42,650' }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group">
                  <div className="text-xs font-mono font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.amt}
                  </div>
                  <div
                    style={{ height: `${item.val}%` }}
                    className="w-full bg-slate-100 group-hover:bg-orange-600/90 rounded-t-md transition-all duration-300"
                  />
                  <span className="text-xs sm:text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Attention List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Inventory Attention
            </h2>
            <button
              onClick={() => setActiveTab('inventory')}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-premium border border-slate-200/70 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                All inventory items are currently at healthy levels.
              </div>
            ) : (
              lowStockProducts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveTab('inventory')}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 text-sm truncate">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        SKU: {p.sku}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-rose-600 text-sm">
                      {p.stock} left
                    </div>
                    <div className="text-xs text-slate-400">min: {p.lowStockThreshold}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Recent Orders
            </h2>
            <p className="text-sm text-slate-500">
              Latest transactions across all customer touchpoints
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>All orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <AdminTable>
          <AdminTableHeader>
            <tr>
              <th className="py-3.5 px-5">Order #</th>
              <th className="py-3.5 px-5">Customer</th>
              <th className="py-3.5 px-5">Items</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5">Payment</th>
              <th className="py-3.5 px-5 text-right">Total</th>
            </tr>
          </AdminTableHeader>
          <AdminTableBody>
            {orders.slice(0, 5).map((order) => (
              <AdminTableRow
                key={order.id}
                onClick={() => setActiveTab('orders')}
              >
                <td className="py-4 px-5 font-mono font-semibold text-slate-900">
                  {order.orderNumber}
                </td>
                <td className="py-4 px-5">
                  <div className="font-medium text-slate-900">{order.customerName}</div>
                  <div className="text-xs text-slate-400">{order.customerEmail}</div>
                </td>
                <td className="py-4 px-5 text-slate-600">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </td>
                <td className="py-4 px-5">
                  <AdminStatusBadge status={order.orderStatus} />
                </td>
                <td className="py-4 px-5">
                  <AdminStatusBadge status={order.paymentStatus} />
                </td>
                <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                  {formatINR(order.totalAmount)}
                </td>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      </div>
    </div>
  );
};
