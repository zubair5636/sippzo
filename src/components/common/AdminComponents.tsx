import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Plus,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Copy,
  Trash2
} from 'lucide-react';

/* -------------------------------------------------------------
 * 1. AdminPageHeader: Large typography (30-36px), whitespace, NO boxes
 * ------------------------------------------------------------*/
export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string | number;
  actions?: React.ReactNode;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  badge,
  actions
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 pt-1">
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-[34px] font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>
          {badge !== undefined && (
            <span className="text-xs font-medium font-mono px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-base text-slate-500 font-normal leading-relaxed">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 flex-wrap shrink-0">{actions}</div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 2. AdminTableToolbar: Clean inline search, filters, actions (14-15px typography)
 * ------------------------------------------------------------*/
export interface AdminTableToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterOptions?: {
    value: string;
    label: string;
  }[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  secondaryFilterOptions?: {
    value: string;
    label: string;
  }[];
  selectedSecondaryFilter?: string;
  onSecondaryFilterChange?: (value: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  primaryActionIcon?: React.ElementType;
}

export const AdminTableToolbar: React.FC<AdminTableToolbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filterOptions,
  selectedFilter,
  onFilterChange,
  secondaryFilterOptions,
  selectedSecondaryFilter,
  onSecondaryFilterChange,
  onRefresh,
  onExport,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionIcon: PrimaryIcon = Plus
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 pt-1">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        {/* Clean Search Input */}
        <div className="relative min-w-[240px] max-w-sm flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full text-sm sm:text-[15px] bg-white border border-slate-200/90 rounded-lg pl-10 pr-3.5 py-2.5 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all shadow-xs"
          />
        </div>

        {/* Primary Filter */}
        {filterOptions && onFilterChange && (
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="text-sm bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-700 font-medium focus:outline-hidden focus:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Secondary Filter */}
        {secondaryFilterOptions && onSecondaryFilterChange && (
          <select
            value={selectedSecondaryFilter}
            onChange={(e) => onSecondaryFilterChange(e.target.value)}
            className="text-sm bg-white border border-slate-200/90 rounded-lg px-3.5 py-2.5 text-slate-700 font-medium focus:outline-hidden focus:border-slate-300 transition-all cursor-pointer shadow-xs"
          >
            {secondaryFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
        )}
      </div>

      {primaryActionLabel && onPrimaryAction && (
        <button
          type="button"
          onClick={onPrimaryAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm cursor-pointer shrink-0"
        >
          <PrimaryIcon className="w-4 h-4" />
          <span>{primaryActionLabel}</span>
        </button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 3. AdminTable & Components: Clean typography, breathable rows, hairline dividers
 * ------------------------------------------------------------*/
export interface AdminTableProps {
  children: React.ReactNode;
}

export const AdminTable: React.FC<AdminTableProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-xl shadow-premium border border-slate-200/70 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm sm:text-[15px] text-left border-collapse">{children}</table>
      </div>
    </div>
  );
};

export const AdminTableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <thead className="border-b border-slate-200/80 text-slate-500 font-semibold text-xs tracking-wider uppercase bg-slate-50/60 select-none">
      {children}
    </thead>
  );
};

export const AdminTableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <tbody className="divide-y divide-slate-100 text-slate-700">{children}</tbody>;
};

export const AdminTableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-slate-50/70 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </tr>
  );
};

export const AdminEmptyState: React.FC<{
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-xl shadow-premium border border-slate-100">
      <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 4. AdminActionMenu: Action dropdown on subtle hover/click
 * ------------------------------------------------------------*/
export interface AdminActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  customActions?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    danger?: boolean;
  }[];
}

export const AdminActionMenu: React.FC<AdminActionMenuProps> = ({
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  deleteLabel = 'Delete',
  customActions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-xl shadow-modal border border-slate-100 py-1.5 z-40 text-sm animate-in fade-in zoom-in-95 duration-100">
          {onView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onView();
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>View Details</span>
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit();
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-slate-400" />
              <span>Edit</span>
            </button>
          )}

          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDuplicate();
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition-colors"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Duplicate</span>
            </button>
          )}

          {customActions &&
            customActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    action.onClick();
                  }}
                  className={`w-full text-left px-4 py-2 flex items-center gap-2.5 transition-colors ${
                    action.danger
                      ? 'text-rose-600 hover:bg-rose-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {ActionIcon && <ActionIcon className="w-4 h-4" />}
                  <span>{action.label}</span>
                </button>
              );
            })}

          {onDelete && (
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  onDelete();
                }}
                className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleteLabel}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------
 * 5. AdminPagination: Clean pagination with readable 14px typography
 * ------------------------------------------------------------*/
export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  pageSize,
  onPageChange
}) => {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalRecords);
  const end = Math.min(currentPage * pageSize, totalRecords);

  if (totalRecords === 0) return null;

  return (
    <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
      <div>
        Showing <span className="font-semibold text-slate-800">{start}</span>–
        <span className="font-semibold text-slate-800">{end}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalRecords}</span> entries
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-2 font-mono text-xs font-medium text-slate-700">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 6. AdminStatusBadge: High-end zero-pill status indicator with status dot
 * ------------------------------------------------------------*/
export interface AdminStatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'info';
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, variant }) => {
  let computedVariant = variant;
  const s = status.toLowerCase();

  if (!computedVariant) {
    if (['paid', 'delivered', 'active', 'published', 'completed', 'approved', 'in_stock'].includes(s)) {
      computedVariant = 'success';
    } else if (['pending', 'processing', 'in_transit', 'shipped', 'review', 'low_stock'].includes(s)) {
      computedVariant = 'warning';
    } else if (['cancelled', 'rejected', 'failed', 'out_of_stock', 'refunded', 'inactive'].includes(s)) {
      computedVariant = 'danger';
    } else {
      computedVariant = 'neutral';
    }
  }

  const dotColor = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
    info: 'bg-blue-500'
  }[computedVariant];

  const textColor = {
    success: 'text-emerald-700 font-medium',
    warning: 'text-amber-700 font-medium',
    danger: 'text-rose-700 font-medium',
    neutral: 'text-slate-600 font-normal',
    info: 'text-blue-700 font-medium'
  }[computedVariant];

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs sm:text-[13px] capitalize ${textColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
};
