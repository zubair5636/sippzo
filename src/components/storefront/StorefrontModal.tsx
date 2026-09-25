import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Flame,
  CheckCircle2,
  ExternalLink,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';
import { db } from '../../lib/db';
import { Product, OrderItem } from '../../types';
import { formatINR } from '../../lib/formatters';

interface StorefrontModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorefrontModal: React.FC<StorefrontModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const products = db.getProducts();
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccessNotice, setOrderSuccessNotice] = useState<string | null>(null);

  // Self heating interactive demo simulation state
  const [simStep, setSimStep] = useState(1);
  const [simProgress, setSimProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimProgress(10);

    setTimeout(() => {
      setSimStep(2);
      setSimProgress(45);
    }, 1200);

    setTimeout(() => {
      setSimStep(3);
      setSimProgress(80);
    }, 2500);

    setTimeout(() => {
      setSimStep(4);
      setSimProgress(100);
      setIsSimulating(false);
    }, 3800);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + tax + shippingFee;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    const items: OrderItem[] = cart.map((c) => ({
      id: 'item_' + Date.now() + Math.random().toString(36).substr(2, 4),
      productId: c.product.id,
      productName: c.product.name,
      productSku: c.product.sku,
      productImage: c.product.imageUrl,
      unitPrice: c.product.sellingPrice,
      quantity: c.quantity,
      totalPrice: c.product.sellingPrice * c.quantity
    }));

    const order = db.saveOrder({
      customerName: 'Zubair (Storefront Visitor)',
      customerEmail: 'zubair669262@gmail.com',
      customerPhone: '+91 98765 00001',
      shippingAddress: 'SIPPZO Innovation Center, Gomti Nagar Extension',
      shippingCity: 'Lucknow',
      shippingState: 'Uttar Pradesh',
      shippingPincode: '226010',
      subtotal,
      discount: 0,
      tax,
      shippingFee,
      totalAmount: total,
      orderStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      items
    });

    setCart([]);
    setIsCheckingOut(false);
    setOrderSuccessNotice(`Order ${order.orderNumber} successfully registered in CRM database!`);
    setTimeout(() => {
      setOrderSuccessNotice(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 z-50 overflow-y-auto">
      <div className="bg-[#fcfbf9] rounded-2xl border border-stone-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Storefront Header */}
        <div className="h-16 px-6 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              S
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-stone-900 flex items-center gap-1.5">
                <span>SIPPZO</span>
                <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider bg-orange-50 px-1.5 py-0.5 rounded">
                  Official Storefront
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-medium -mt-0.5">
                World's First Instant Self-Heating Kulhad Chai & Meals
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://sippzo.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              <span>sippzo.com</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {orderSuccessNotice && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>{orderSuccessNotice}</span>
          </div>
        )}

        {/* Storefront Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Hero Banner with Self-Heating Interactive Simulation */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-white/20 backdrop-blur-xs text-white">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Proprietary HH-Food Technology™
              </span>

              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Piping Hot Kulhad Chai at 95°C in Just 4 Minutes.
              </h2>
              <p className="text-xs md:text-sm text-orange-100 leading-relaxed">
                Add ordinary room temperature water, wait 240 seconds, and enjoy traditional earthen aroma on highways, mountain camps, train journeys, or late-night desk work.
              </p>

              {/* Simulation Trigger */}
              <div className="pt-2">
                <button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 text-xs font-bold bg-white text-orange-700 hover:bg-orange-50 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>{isSimulating ? 'Reaction Active (Heating up...)' : 'Test 4-Minute Self-Heating Demo'}</span>
                </button>
              </div>

              {/* Interactive Steps Visualizer */}
              {(isSimulating || simStep > 1) && (
                <div className="p-4 bg-black/25 backdrop-blur-md rounded-xl mt-3 text-xs space-y-2 border border-white/20 animate-fade-in">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span>Step {simStep} of 4:</span>
                    <span>
                      {simStep === 1 && 'Pouring 50ml water into reaction chamber'}
                      {simStep === 2 && 'Calibrated exothermic reaction activating...'}
                      {simStep === 3 && 'Boiling steam heating terracotta kulhad (88°C - 95°C)'}
                      {simStep === 4 && 'Piping Hot & Ready to Sip!'}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-700 ease-out"
                      style={{ width: `${simProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Showcase Grid & Cart Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products List (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-stone-900 tracking-tight">
                  Instant Self-Heating Collection
                </h3>
                <span className="text-xs text-stone-400 font-mono">
                  {products.length} Products Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-stone-200 p-3.5 flex flex-col justify-between shadow-2xs hover:border-orange-300 transition-all group"
                  >
                    <div>
                      <div className="relative h-40 rounded-lg overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        {p.isBestSeller && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-orange-600 text-white shadow-xs">
                            Best Seller
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/90 text-stone-800 backdrop-blur-xs">
                          {p.weight}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm font-mono text-stone-900">
                          {formatINR(p.sellingPrice)}
                        </span>
                        <span className="text-xs font-mono text-stone-400 line-through ml-2">
                          {formatINR(p.mrp)}
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(p)}
                        className="px-3 py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shopping Cart Drawer / Order Simulation */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs h-fit space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-orange-600" />
                  <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-[11px] text-stone-400 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="py-10 text-center text-xs text-stone-400">
                  Your cart is empty. Add SIPPZO Kulhad Chai or meals to test ordering!
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-2 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 mr-2">
                          <div className="font-semibold text-stone-800 truncate">
                            {item.product.name}
                          </div>
                          <div className="font-mono text-[11px] text-stone-500">
                            {formatINR(item.product.sellingPrice)} each
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="p-1 rounded bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="p-1 rounded bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="p-3 bg-stone-50 rounded-lg text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal:</span>
                      <span>{formatINR(subtotal, { showDecimals: true })}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>GST (5% Tax):</span>
                      <span>{formatINR(tax, { showDecimals: true })}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery:</span>
                      <span>{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-stone-900 pt-1.5 border-t border-stone-200 text-sm">
                      <span>Total:</span>
                      <span className="text-orange-600 font-extrabold">
                        {formatINR(total, { showDecimals: true })}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isCheckingOut}
                    className="w-full py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{isCheckingOut ? 'Registering Order...' : 'Place Order & Send to Admin'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-[10px] text-stone-400 text-center leading-relaxed">
                    Orders placed here write directly to your database and update the Orders and Inventory metrics in real-time.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
