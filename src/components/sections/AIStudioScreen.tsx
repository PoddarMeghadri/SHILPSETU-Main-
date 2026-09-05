import React, { useState, useEffect, useRef } from 'react';
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
  onSelectProductForCatalog,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'camera' | 'gallery'>('camera');
  const [selectedProduct, setSelectedProduct] = useState<ProductItem>(products[0] || {} as ProductItem);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [activeLighting, setActiveLighting] = useState<string>('soft_cinematic');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '16:9'>('1:1');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!products.some((p) => p.id === selectedProduct?.id) && products.length > 0) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  // Handle Capture with realistic processing simulation
  const handleCapture = () => {
    sound.playShutter();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      sound.playSuccess();
      setActiveTab('gallery');
      setShowSuccess(true);
    }, 2000);
  };

  // Custom photo upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const uploadedUrl = event.target?.result as string;
        // Create dynamic preview item
        setSelectedProduct((prev) => ({
          ...prev,
          rawImageUrl: uploadedUrl,
        }));
        handleCapture();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* Sub-navigation pill tabs - 2 options: AI Viewfinder & Studio Gallery */}
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
          className={`rounded-3xl p-7 text-center space-y-4 border shadow-2xl ${
            isDark
              ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
              : 'bg-[#22331E] text-[#F4ECDE] border-[#E8B84B]/40'
          }`}
        >
          <PotterWheelSpinner size="lg" text={t('enhancing_photo', 'Enhancing Photo with AI...')} />
          
          <div className="space-y-1.5 px-2">
            <h4 className="font-serif font-bold text-base text-white">
              Professional Studio Product Photography
            </h4>
            <p className="text-xs text-white/80 font-sans leading-relaxed">
              Soft cinematic lighting, 4k resolution, clean neutral background, sharp focus, exact original object preservation, highly detailed native texture, photorealistic enhancement.
            </p>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden shimmer-gold" />
        </div>
      )}

      {/* TAB 1: AI VIEWFINDER / CAMERA MODE */}
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

                {/* Upload custom craft photo */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md border border-white/20 hover:border-[#E8B84B]"
                  title="Upload Craft Photo"
                >
                  <span className="material-symbols-outlined text-base">upload</span>
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
            <div className="relative z-10 mx-auto w-28 h-28 border-2 border-dashed border-[#E8B84B] rounded-2xl flex flex-col items-center justify-center pointer-events-none animate-pulse">
              <span className="text-[9px] uppercase tracking-widest text-[#E8B84B] font-bold bg-black/70 px-2 py-0.5 rounded">
                {t('focus_locked', 'Sharp Focus Locked')}
              </span>
              <span className="text-[8px] text-white/80 mt-1">
                {t('geometry_preserved', 'Exact Geometry Preserved')}
              </span>
            </div>

            {/* Bottom Lighting Presets Bar */}
            <div className="relative z-10 flex justify-center gap-1.5 overflow-x-auto py-1">
              {[
                { id: 'soft_cinematic', label: t('lighting_soft_cinematic', 'Soft Cinematic'), icon: 'wb_incandescent' },
                { id: 'clean_neutral', label: t('lighting_direct_sunlight', 'Clean Neutral'), icon: 'wb_sunny' },
                { id: 'texture_macro', label: t('lighting_heritage_museum', 'High Detail Macro'), icon: 'texture' },
                { id: 'photorealistic', label: t('lighting_boutique_gallery', 'Editorial Polish'), icon: 'auto_awesome' },
              ].map((light) => (
                <button
                  key={light.id}
                  onClick={() => {
                    sound.playTap();
                    setActiveLighting(light.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-medium backdrop-blur-md transition-all shrink-0 ${
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

          {/* Shutter & Actions Row */}
          <div className="flex items-center justify-around pt-2">
            <button
              onClick={() => {
                sound.playTap();
                setActiveTab('gallery');
              }}
              className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#22331E]/20 shadow-xs"
              title={t('studio_gallery', 'Studio Gallery')}
            >
              <img
                src={products[0].polishedImageUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Master Capture Button */}
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
              onClick={() => fileInputRef.current?.click()}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
                  : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#22331E]'
              }`}
              title={t('upload_craft_photo', 'Upload Craft Photo')}
            >
              <span className="material-symbols-outlined text-2xl">upload_file</span>
            </button>
          </div>

          {/* Hint to upload or capture */}
          <div className="text-center pt-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-serif font-bold text-[#B5451B] hover:underline inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">file_upload</span>
              <span>{t('upload_hint', 'Or upload raw workshop photo to enhance in 4K studio')}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: STUDIO GALLERY */}
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
              {t('high_res_crafts_count', '{count} High-Res Crafts').replace(
                '{count}',
                String(products.length)
              )}
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
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-[8px] font-bold text-[#E8B84B] rounded">
                    4K Studio
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
                      if (onSelectProductForCatalog) {
                        onSelectProductForCatalog(prod);
                      }
                      onNavigate('cataloger');
                    }}
                    className="flex-1 bg-[#B5451B] text-white text-[10px] font-semibold py-2 rounded-xl text-center flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">mic</span>
                    <span>{t('catalog', 'Catalog')}</span>
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
        onClose={() => {
          setShowSuccess(false);
          setActiveTab('gallery');
        }}
        title="Studio Enhancement Complete!"
        subtitle="Professional studio product photography, soft cinematic lighting, 4k resolution, clean neutral background, sharp focus, exact original object preservation, highly detailed native texture, photorealistic enhancement."
        actionLabel={t('view_gallery', 'View Studio Gallery')}
        isDark={isDark}
      />
    </div>
  );
};

