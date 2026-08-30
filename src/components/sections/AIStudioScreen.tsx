import React, { useState, useEffect } from 'react';
import { ProductItem, ScreenId, LanguageCode } from '../../types';
import { sound } from '../../services/sound';
import { PotterWheelSpinner } from '../common/PotterWheelSpinner';
import { SuccessModal } from '../common/SuccessModal';
import { useTranslation } from '../../services/translations';

interface AIStudioScreenProps {
  products: ProductItem[];
  onNavigate: (screen: ScreenId) => void;
  onSelectProductForCatalog?: (prod: ProductItem) => void;
  language?: LanguageCode;
  isDark?: boolean;
}

export const AIStudioScreen: React.FC<AIStudioScreenProps> = ({
  products,
  onNavigate,
  language = 'hi',
  isDark = false,
}) => {
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'camera' | 'slider' | 'gallery'>('slider');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(products[0] || {} as ProductItem);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeLighting, setActiveLighting] = useState<string>('warm_studio');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9'>('1:1');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!products.some((p) => p.id === selectedProduct?.id) && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const handleCapture = () => {
    sound.playShutter();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      sound.playSuccess();
      setActiveTab('slider');
      setShowSuccess(true);
    }, 2000);
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (offsetX / rect.width) * 100;
    setSliderPosition(percentage);
    sound.playTick();
  };

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Sub-navigation pill tabs */}
      <div
        className={`flex p-1 rounded-2xl border ${
          isDark
            ? 'bg-[#1C221A] border-[#2D3A2B]'
            : 'bg-[#EFE4CF] border-[#22331E]/10'
        }`}
      >
        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('slider');
          }}
          className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
            activeTab === 'slider'
              ? 'bg-[#B5451B] text-white shadow-xs'
              : isDark
              ? 'text-[#F4ECDE]/70 hover:text-white'
              : 'text-[#22331E]/70 hover:text-[#1A1815]'
          }`}
        >
          {t('before_and_after', 'Before & After')}
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('camera');
          }}
          className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
            activeTab === 'camera'
              ? 'bg-[#B5451B] text-white shadow-xs'
              : isDark
              ? 'text-[#F4ECDE]/70 hover:text-white'
              : 'text-[#22331E]/70 hover:text-[#1A1815]'
          }`}
        >
          {t('ai_viewfinder', 'AI Viewfinder')}
        </button>

        <button
          onClick={() => {
            sound.playTap();
            setActiveTab('gallery');
          }}
          className={`flex-1 py-2 text-xs font-serif font-bold rounded-xl transition-all ${
            activeTab === 'gallery'
              ? 'bg-[#B5451B] text-white shadow-xs'
              : isDark
              ? 'text-[#F4ECDE]/70 hover:text-white'
              : 'text-[#22331E]/70 hover:text-[#1A1815]'
          }`}
        >
          {t('studio_gallery', 'Studio Gallery')}
        </button>
      </div>

      {/* AI Processing Shimmer Loader State */}
      {isProcessing && (
        <div
          className={`rounded-3xl p-8 text-center space-y-4 border shadow-2xl ${
            isDark
              ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
              : 'bg-[#22331E] text-[#F4ECDE] border-[#E8B84B]/40'
          }`}
        >
          <PotterWheelSpinner size="lg" text={t('enhancing_photo', 'Enhancing Photo with AI...')} />
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-lg text-white">
              {t('isolating_clay', 'Isolating Clay & Adding 4K Studio Light')}
            </h4>
            <p className="text-xs text-white/70 font-sans">
              {t('removing_background', 'Removing cluttered workshop background and generating soft natural shadows.')}
            </p>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden shimmer-gold" />
        </div>
      )}

      {/* TAB 1: BEFORE / AFTER INTERACTIVE SLIDER */}
      {activeTab === 'slider' && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3
                className={`font-serif font-bold text-lg ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('interactive_compare', 'Interactive Studio Compare')}
              </h3>
              <p className="text-xs opacity-70 font-sans">
                {t('drag_divider', 'Drag the divider to compare raw workbench photo with AI polish.')}
              </p>
            </div>

            <span className="px-2.5 py-1 bg-[#22331E]/10 dark:bg-[#E8B84B]/15 text-[#22331E] dark:text-[#E8B84B] text-[10px] font-bold uppercase rounded-full border border-[#22331E]/20">
              4K Enhanced
            </span>
          </div>

          {/* Interactive Split Canvas */}
          <div
            onMouseMove={(e) => e.buttons === 1 && handleSliderMove(e)}
            onTouchMove={handleSliderMove}
            onClick={handleSliderMove}
            className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-artisan border-2 border-[#22331E]/15 cursor-ew-resize select-none bg-[#1A1815]"
          >
            {/* Background Layer: Polished Studio Photo (Right side) */}
            <img
              src={selectedProduct.polishedImageUrl}
              alt="Polished Studio"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute top-4 right-4 bg-[#22331E]/85 backdrop-blur-md text-[#F4ECDE] text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border border-[#E8B84B]/40 shadow-md">
              {t('ai_studio_polish', 'AI Studio Polish')}
            </div>

            {/* Foreground Layer: Raw Workbench Photo */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={selectedProduct.rawImageUrl}
                alt="Raw Workbench"
                className="absolute top-0 left-0 max-w-none w-full h-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border border-white/20 shadow-md">
                {t('raw_photo', 'Raw Photo')}
              </div>
            </div>

            {/* Vertical Divider Handle Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#E8B84B] shadow-[0_0_12px_rgba(232,184,75,0.8)] pointer-events-none flex items-center justify-center -ml-0.5"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#B5451B] border-2 border-[#E8B84B] text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-sm font-bold">
                  unfold_more
                </span>
              </div>
            </div>
          </div>

          {/* Product Switcher Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#B5451B] uppercase tracking-wider">
              {t('select_sample_craft', 'Select Sample Craft:')}
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {products.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    sound.playTap();
                    setSelectedProduct(prod);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs shrink-0 transition-all ${
                    selectedProduct.id === prod.id
                      ? 'bg-[#B5451B] text-white border-[#B5451B] font-medium shadow-xs'
                      : isDark
                      ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
                      : 'bg-[#EFE4CF] text-[#1A1815] border-[#22331E]/10'
                  }`}
                >
                  <img
                    src={prod.polishedImageUrl}
                    alt={prod.title}
                    className="w-5 h-5 rounded-lg object-cover"
                  />
                  <span className="truncate max-w-[120px] font-medium">{prod.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('cataloger');
              }}
              className="bg-[#B5451B] hover:bg-[#9E3913] text-white font-serif font-bold py-3.5 px-4 rounded-3xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              <span>{t('catalog_with_voice', 'Catalog with Voice')}</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                onNavigate('social');
              }}
              className={`border font-serif font-bold py-3.5 px-4 rounded-3xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE] hover:bg-[#252E22]'
                  : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10 text-[#1A1815]'
              }`}
            >
              <span className="material-symbols-outlined text-lg text-[#25D366]">share</span>
              <span>{t('create_share_kit', 'Create Share Kit')}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AI VIEWFINDER / CAMERA MODE */}
      {activeTab === 'camera' && !isProcessing && (
        <div className="space-y-4">
          <div className="relative w-full aspect-square bg-[#1A1815] rounded-3xl overflow-hidden border-2 border-[#D9A441]/40 shadow-2xl flex flex-col justify-between p-4">
            <img
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80"
              alt="Live Viewfinder"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />

            {showGrid && (
              <div className="absolute inset-0 woven-viewfinder pointer-events-none" />
            )}

            {/* Top Camera Controls */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20">
                {(['1:1', '4:5', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => {
                      sound.playTap();
                      setAspectRatio(ratio);
                    }}
                    className={`px-2.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      aspectRatio === ratio ? 'bg-[#E8B84B] text-[#1A1815]' : 'text-white/80'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sound.playTap();
                    setShowGrid(!showGrid);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border ${
                    showGrid
                      ? 'bg-[#E8B84B] text-[#1A1815] border-[#E8B84B]'
                      : 'bg-black/60 text-white border-white/20'
                  }`}
                  title="Toggle Framing Grid"
                >
                  <span className="material-symbols-outlined text-base">grid_4x4</span>
                </button>

                <button
                  onClick={() => sound.playTap()}
                  className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20"
                  title="Toggle Flash"
                >
                  <span className="material-symbols-outlined text-base">flash_on</span>
                </button>
              </div>
            </div>

            {/* Center Focus Box Indicator */}
            <div className="relative z-10 mx-auto w-24 h-24 border-2 border-dashed border-[#E8B84B] rounded-2xl flex items-center justify-center pointer-events-none animate-pulse">
              <span className="text-[9px] uppercase tracking-widest text-[#E8B84B] font-bold bg-black/60 px-1.5 py-0.5 rounded">
                Clay Detected
              </span>
            </div>

            {/* Bottom Lighting Presets Bar */}
            <div className="relative z-10 flex justify-center gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'warm_studio', label: 'Warm Studio', icon: 'wb_sunny' },
                { id: 'soft_diffused', label: 'Diffused Soft', icon: 'cloud' },
                { id: 'velvet_dark', label: 'Velvet Charcoal', icon: 'nightlight' },
              ].map((light) => (
                <button
                  key={light.id}
                  onClick={() => {
                    sound.playTap();
                    setActiveLighting(light.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-medium backdrop-blur-md transition-all ${
                    activeLighting === light.id
                      ? 'bg-[#B5451B] text-white border border-[#E8B84B]'
                      : 'bg-black/60 text-white/80 border border-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">{light.icon}</span>
                  <span>{light.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shutter Button Row */}
          <div className="flex items-center justify-around pt-2">
            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('gallery');
              }}
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#22331E]/20 shadow-xs"
            >
              <img
                src={products[0].polishedImageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </button>

            <button
              onClick={handleCapture}
              className="w-20 h-20 rounded-full bg-[#B5451B] border-4 border-[#F4ECDE] shadow-xl flex items-center justify-center text-white active:scale-90 transition-transform group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-[#E8B84B] flex items-center justify-center bg-[#9E3913] group-hover:bg-[#B5451B] transition-colors">
                <span className="material-symbols-outlined text-2xl text-[#E8B84B]">
                  camera
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('slider');
              }}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
                  : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#22331E]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">compare</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STUDIO GALLERY */}
      {activeTab === 'gallery' && !isProcessing && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3
              className={`font-serif font-bold text-lg ${
                isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
              }`}
            >
              {t('enhanced_catalog', 'Enhanced Studio Catalog')}
            </h3>
            <span className="text-xs text-[#B5451B] font-sans font-bold">
              {products.length} High-Res Crafts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className={`rounded-3xl p-3.5 border flex flex-col justify-between shadow-xs group ${
                  isDark
                    ? 'bg-[#1C221A] border-[#2D3A2B]'
                    : 'bg-[#EFE4CF] border-[#22331E]/10'
                }`}
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-2">
                  <img
                    src={prod.polishedImageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#22331E]/90 text-white rounded-full text-[9px] font-bold">
                    ₹{prod.price}
                  </div>
                </div>

                <h4
                  className={`font-serif font-bold text-xs line-clamp-1 ${
                    isDark ? 'text-[#F4ECDE]' : 'text-[#1A1815]'
                  }`}
                >
                  {prod.title}
                </h4>
                <p className="text-[10px] opacity-70 font-sans mt-0.5">
                  {prod.category} • {prod.stock} in stock
                </p>

                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => {
                      sound.playTap();
                      setSelectedProduct(prod);
                      setActiveTab('slider');
                    }}
                    className="flex-1 bg-[#B5451B] text-white text-[10px] font-semibold py-2 rounded-xl text-center"
                  >
                    {t('compare', 'Compare')}
                  </button>
                  <button
                    onClick={() => {
                      sound.playTap();
                      onNavigate('social');
                    }}
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center text-[#25D366] ${
                      isDark
                        ? 'bg-[#121411] border-[#2D3A2B]'
                        : 'bg-white border-[#22331E]/10'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t('photo_enhanced_success', 'Photo Enhanced in 4K!')}
        subtitle={t('photo_enhanced_sub', 'Workshop background replaced with warm studio lighting and soft shadows.')}
        actionLabel={t('view_before_after', 'View Before & After')}
        isDark={isDark}
      />
    </div>
  );
};
