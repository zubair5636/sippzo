import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl'
};

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '2xl'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className={`w-full ${maxWidthMap[maxWidth]} bg-white rounded-2xl shadow-modal flex flex-col max-h-[calc(100vh-3rem)] overflow-hidden transition-all animate-in zoom-in-95 duration-150 border border-slate-200/80`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Spacious & Clean */}
        <div className="flex items-start justify-between px-6 sm:px-7 pt-6 pb-4 shrink-0 border-b border-slate-100">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-slate-500 font-normal">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Independent Scroll Container */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-7 py-5 text-sm sm:text-base text-slate-700 scrollbar-thin">
          {children}
        </div>

        {/* Footer - Floating and soft */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 sm:px-7 py-4 border-t border-slate-100 shrink-0 bg-slate-50/60">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
