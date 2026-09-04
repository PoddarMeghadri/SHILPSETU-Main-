import React, { useState } from 'react';
import { motion } from 'motion/react';
import { OrderItem, ScreenId, LanguageCode } from '../../types';
import { PENDING_ORDERS } from '../../data/mockData';
import { sound } from '../../services/sound';
import { SuccessModal } from '../common/SuccessModal';
import { useTranslation } from '../../services/translations';

interface BusinessDashboardProps {
  onNavigate: (screen: ScreenId) => void;
  language?: LanguageCode;
  isDark?: boolean;
}

type Period = 'today' | 'week' | 'month';

export const BusinessDashboardScreen: React.FC<BusinessDashboardProps> = ({
  onNavigate,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('week');
  const [orders, setOrders] = useState<OrderItem[]>(PENDING_ORDERS);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Dynamic metrics based on period
  const metrics = {
    today: { revenue: 3450, units: 4, aov: 860, views: 240 },
    week: { revenue: 14250, units: 18, aov: 1120, views: 1840 },
    month: { revenue: 68400, units: 76, aov: 1240, views: 7920 },
  }[period];

  const handleFulfill = (orderId: string) => {
    sound.playSuccess();
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'shipped' } : ord))
    );
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Time Period Filter Pill Bar */}
      <div
        className={`flex p-1.5 rounded-2xl border ${
          isDark ? 'bg-[#1C221A] border-[#2D3A2B]' : 'bg-[#EFE4CF] border-[#22331E]/10'
        }`}
      >
        {(['today', 'week', 'month'] as Period[]).map((p) => {
          const isSelected = period === p;
          const label =
            p === 'today'
              ? t('today', 'Today')
              : p === 'week'
              ? t('this_week', 'This Week')
              : t('this_month', 'This Month');
          return (
            <button
              key={p}
              onClick={() => {
                sound.playTap();
                setPeriod(p);
              }}
              className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
                isSelected
                  ? 'bg-[#B5451B] text-white shadow-xs'
                  : isDark
                  ? 'text-[#F4ECDE]/70 hover:text-white'
                  : 'text-[#22331E]/70 hover:text-[#1A1815]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Main Revenue Card */}
      <div
        className={`rounded-3xl p-6 border shadow-2xl relative overflow-hidden ${
          isDark
            ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
            : 'bg-[#22331E] text-[#F4ECDE] border-[#E8B84B]/40'
        }`}
      >
        <div className="absolute -right-6 -top-6 w-36 h-36 bg-[#E8B84B]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B84B]">
              {t('total_revenue', 'Total Craft Revenue')} ({period})
            </span>
            <span className="text-xs font-bold text-[#E8B84B] bg-[#E8B84B]/20 px-2.5 py-0.5 rounded-full border border-[#E8B84B]/30">
              +24% vs last period
            </span>
          </div>

          <div>
            <motion.h2
              key={metrics.revenue}
              initial={{ opacity: 0.5, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif font-bold text-4xl text-white tracking-tight"
            >
              ₹{metrics.revenue.toLocaleString('en-IN')}
            </motion.h2>
            <p className="text-xs text-white/80 font-sans mt-0.5">
              {t('across_gem_store', 'Across GeM Government Portal & Direct Digital Store')}
            </p>
          </div>

          {/* Quick 3-metric row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
            <div>
              <p className="text-[10px] text-white/60 uppercase">{t('units_sold', 'Units Sold')}</p>
              <p className="font-serif font-bold text-lg text-[#E8B84B]">{metrics.units}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase">{t('avg_order', 'Avg Order')}</p>
              <p className="font-serif font-bold text-lg text-[#E8B84B]">₹{metrics.aov}</p>
            </div>
            <div>
              <p className="text-[10px] text-white/60 uppercase">{t('store_views', 'Store Views')}</p>
              <p className="font-serif font-bold text-lg text-[#E8B84B]">{metrics.views}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid: Donut + Revenue Area Curve */}
      <div className="grid grid-cols-1 gap-4">
        {/* Chart 1: Donut (Sales by Craft Category) */}
        <div
          className={`rounded-3xl p-5 border shadow-xs space-y-3 ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-serif font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#B5451B]">pie_chart</span>
              {t('sales_by_category', 'Sales by Craft Category')}
            </h4>
            <span className="text-[10px] text-[#B5451B] font-bold">Top: Pottery</span>
          </div>

          <div className="flex items-center justify-around py-2">
            {/* SVG Donut */}
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#B5451B"
                  strokeWidth="14"
                  strokeDasharray="107 238"
                  strokeDashoffset="0"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#22331E"
                  strokeWidth="14"
                  strokeDasharray="71 238"
                  strokeDashoffset="-107"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#E8B84B"
                  strokeWidth="14"
                  strokeDasharray="36 238"
                  strokeDashoffset="-178"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#8C7355"
                  strokeWidth="14"
                  strokeDasharray="24 238"
                  strokeDashoffset="-214"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-serif font-bold text-sm">45%</span>
                <span className="text-[9px] text-[#B5451B] font-medium">Pottery</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B5451B]" />
                <span className="font-medium">Pottery (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22331E] dark:bg-[#344E41]" />
                <span className="font-medium">Weaving (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8B84B]" />
                <span className="font-medium">Woodwork (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8C7355]" />
                <span className="font-medium">Brass (10%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Revenue Trend Waveform */}
        <div
          className={`rounded-3xl p-5 border shadow-xs space-y-3 ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-serif font-bold text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#22331E] dark:text-[#E8B84B]">
                show_chart
              </span>
              {t('daily_sales_volume', 'Daily Sales Volume')}
            </h4>
            <span className="text-[10px] text-[#B5451B] font-bold">
              {t('peak_on_weekends', 'Peak on Weekends')}
            </span>
          </div>

          <div className="h-24 w-full relative pt-2">
            <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
              <path
                d="M 10 65 Q 40 20, 80 50 T 160 30 T 240 15 T 290 25 L 290 80 L 10 80 Z"
                fill="rgba(181, 69, 27, 0.15)"
              />
              <path
                d="M 10 65 Q 40 20, 80 50 T 160 30 T 240 15 T 290 25"
                fill="none"
                stroke="#B5451B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[10px] opacity-60 font-sans font-medium">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Low-Stock Warning Alert Card */}
      <div className="bg-[#FFF5F2] dark:bg-[#2A1713] border border-[#B5451B]/30 rounded-3xl p-4 flex items-center gap-3.5 shadow-xs">
        <div className="w-10 h-10 rounded-2xl bg-[#B5451B] text-white flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-lg animate-pulse">warning</span>
        </div>
        <div className="flex-1">
          <h5 className="font-serif font-bold text-xs text-[#B5451B]">
            {t('low_inventory_alert', 'Low Inventory Alert')}
          </h5>
          <p className="text-[11px] opacity-80 font-sans">
            Red Terracotta Urli {t('has_left_stock', 'has only 2 units left in workshop stock.')}
          </p>
        </div>
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('studio');
          }}
          className="text-xs text-[#B5451B] font-bold underline shrink-0"
        >
          {t('add_stock', 'Add Stock')}
        </button>
      </div>

      {/* Pending Customer Orders */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4
            className={`font-serif font-bold text-base flex items-center gap-1.5 ${
              isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
            }`}
          >
            <span className="material-symbols-outlined text-lg text-[#B5451B]">local_shipping</span>
            {t('customer_orders_dispatch', 'Customer Orders to Dispatch')}
          </h4>
          <span className="text-xs text-[#B5451B] font-sans font-bold">
            {orders.filter((o) => o.status !== 'shipped').length} {t('pending_label', 'Pending')}
          </span>
        </div>

        <div className="space-y-2.5">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className={`rounded-3xl p-4 border flex items-center justify-between gap-3 shadow-xs ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
                  : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={ord.itemImage}
                  alt={ord.itemTitle}
                  className="w-12 h-12 rounded-2xl object-cover border border-black/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#B5451B] font-sans">
                      {ord.orderNumber}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        ord.status === 'shipped'
                          ? 'bg-[#22331E] text-white'
                          : 'bg-[#B5451B] text-white'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <h5 className="font-serif font-bold text-xs line-clamp-1 mt-0.5">
                    {ord.itemTitle}
                  </h5>
                  <p className="text-[10px] opacity-70 font-sans">
                    {ord.customerName} • {ord.location}
                  </p>
                </div>
              </div>

              {ord.status !== 'shipped' && (
                <button
                  onClick={() => handleFulfill(ord.id)}
                  className="shrink-0 bg-[#22331E] text-white text-[11px] font-serif font-bold px-3.5 py-2.5 rounded-2xl shadow-xs hover:bg-[#1A2817] active:scale-95 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">done_all</span>
                  <span>{t('ship_action', 'Ship')}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t('waybill_generated_title', 'Waybill & Shipping Label Generated!')}
        subtitle={t('waybill_generated_sub', 'The parcel status has been updated to Shipped with courier tracking assigned.')}
        actionLabel={t('done', 'Done')}
        onAction={() => setShowSuccess(false)}
        isDark={isDark}
      />
    </div>
  );
};
