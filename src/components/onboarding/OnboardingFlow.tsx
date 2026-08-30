import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../../services/sound';
import { ShilpSetuLogo } from '../common/ShilpSetuLogo';

interface OnboardingFlowProps {
  onComplete: (selectedCraft: string) => void;
}

interface SlideData {
  id: number;
  title: string;
  taglineHindi: string;
  description: string;
  bgImage: string;
  icon: string;
  highlightText: string;
}

const ONBOARDING_SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'Your heritage is a living story, waiting to be shared.',
    taglineHindi: 'हर हाथ की कहानी • Har Haath Ki Kahani',
    description: 'Centuries of tradition meet the precision of modern AI. Capture, preserve, and showcase your handmade craft to the world.',
    bgImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&auto=format&fit=crop&q=80',
    icon: 'all_inclusive',
    highlightText: 'Ancient Craft. Modern Bridge.',
  },
  {
    id: 2,
    title: 'Connect with global and government buyers directly.',
    taglineHindi: 'कारीगर से खरीदार तक • No Middlemen',
    description: 'Sell seamlessly to GeM (Government e-Marketplace) and bulk buyers with automated compliance and fair pricing.',
    bgImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=80',
    icon: 'handshake',
    highlightText: 'Direct Marketplace Access',
  },
  {
    id: 3,
    title: 'Step into your digital studio.',
    taglineHindi: 'तस्वीर, आवाज़, और कहानी • AI Powered',
    description: 'AI image enhancement, native voice cataloging in 7+ languages, and dynamic pricing built specifically for Indian artisans.',
    bgImage: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=1200&auto=format&fit=crop&q=80',
    icon: 'auto_awesome',
    highlightText: 'Full AI Studio Suite',
  },
];

const CRAFT_OPTIONS = [
  {
    id: 'pottery',
    name: 'Pottery & Clay',
    hindiName: 'कुम्हारी व मृत्तिका',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&auto=format&fit=crop&q=80',
    icon: 'potted_plant',
  },
  {
    id: 'weaving',
    name: 'Handloom & Weaving',
    hindiName: 'बुनकरी व वस्त्र',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
    icon: 'texture',
  },
  {
    id: 'woodwork',
    name: 'Woodwork & Carving',
    hindiName: 'काष्ठकला व नक्काशी',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&auto=format&fit=crop&q=80',
    icon: 'carpenter',
  },
  {
    id: 'metalwork',
    name: 'Metal & Brass Craft',
    hindiName: 'धातु व पीतल शिल्प',
    image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=400&auto=format&fit=crop&q=80',
    icon: 'hardware',
  },
  {
    id: 'jewelry',
    name: 'Artisan Jewelry',
    hindiName: 'आभूषण व मीनाकारी',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&auto=format&fit=crop&q=80',
    icon: 'diamond',
  },
  {
    id: 'painting',
    name: 'Heritage Painting',
    hindiName: 'मधुबनी व चित्रकला',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=400&auto=format&fit=crop&q=80',
    icon: 'palette',
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0, 1, 2 = slides, 3 = craft selection
  const [selectedCraft, setSelectedCraft] = useState<string>('pottery');

  const handleNext = () => {
    sound.playTap();
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      sound.playSuccess();
      onComplete(selectedCraft);
    }
  };

  const handleSkip = () => {
    sound.playTap();
    setCurrentStep(3); // Jump straight to craft selection
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1815] text-[#F5EFE3] overflow-hidden flex flex-col justify-between">
      {/* Step 0, 1, 2: Immersive 3-Slide Flow */}
      {currentStep < 3 ? (
        <div className="relative w-full h-full flex flex-col justify-between">
          {/* Background Image with Parallax & Dark Charcoal Overlay */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${ONBOARDING_SLIDES[currentStep].bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815] via-[#1A1815]/75 to-[#1A1815]/40" />
            </motion.div>
          </AnimatePresence>

          {/* Top Bar: Official ShilpSetu Logo & Skip Button */}
          <div className="relative z-10 p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ShilpSetuLogo size="sm" isDark={true} />
              <span className="font-serif font-bold text-xl tracking-wider text-white">
                SHILPSETU
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-white/80 hover:bg-white/20 active:scale-95 transition-all"
            >
              Skip
            </button>
          </div>

          {/* Center Graphic Animation */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 rounded-full bg-[#2E4638]/90 border-2 border-[#D9A441] flex items-center justify-center shadow-[0_0_30px_rgba(217,164,65,0.4)] mb-4"
            >
              <span className="material-symbols-outlined text-4xl text-[#D9A441]">
                {ONBOARDING_SLIDES[currentStep].icon}
              </span>
            </motion.div>

            <span className="text-xs uppercase tracking-widest text-[#D9A441] font-semibold mb-2">
              {ONBOARDING_SLIDES[currentStep].highlightText}
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 p-6 pb-10 flex flex-col gap-6 max-w-md mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#2B2823]/85 backdrop-blur-md border border-[#D9A441]/30 rounded-3xl p-6 shadow-2xl text-center"
              >
                {/* Hindi Script Accent */}
                <p className="font-serif italic text-sm text-[#D9A441] mb-2 font-medium">
                  {ONBOARDING_SLIDES[currentStep].taglineHindi}
                </p>

                {/* English Headline */}
                <h2 className="font-serif font-bold text-2xl text-[#F5EFE3] leading-snug mb-3">
                  {ONBOARDING_SLIDES[currentStep].title}
                </h2>

                {/* Description */}
                <p className="text-xs text-white/75 leading-relaxed font-sans">
                  {ONBOARDING_SLIDES[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress Dots & Next Button */}
            <div className="flex items-center justify-between gap-4">
              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep === idx
                        ? 'w-8 bg-[#D9A441]'
                        : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Start / Next Circular Button */}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#D9A441] hover:bg-[#E8B84B] text-[#1A1815] font-serif font-bold px-6 py-3.5 rounded-full shadow-lg transition-transform active:scale-95"
              >
                <span>{currentStep === 2 ? 'Choose Craft' : 'Next'}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 3: Craft Selection ("What is your heritage?") */
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative w-full h-full bg-[#F5EFE3] text-[#1D1C14] flex flex-col justify-between p-6 overflow-y-auto"
        >
          <div className="max-w-md mx-auto w-full">
            {/* Header */}
            <div className="text-center pt-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#9C3F1E] text-[#D9A441] flex items-center justify-center mx-auto mb-3 shadow-md">
                <span className="material-symbols-outlined text-2xl">interests</span>
              </div>
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#1D1C14] mb-1">
                What is your heritage?
              </h2>
              <p className="text-xs text-[#56423C] font-sans">
                Select your primary craft to customize your AI Studio & Pricing Assistant.
              </p>
            </div>

            {/* 6 Craft Options Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {CRAFT_OPTIONS.map((craft) => {
                const isSelected = selectedCraft === craft.id;
                return (
                  <button
                    key={craft.id}
                    onClick={() => {
                      sound.playTap();
                      setSelectedCraft(craft.id);
                    }}
                    className={`relative rounded-2xl p-3 flex flex-col items-center text-center transition-all duration-200 border-2 overflow-hidden group ${
                      isSelected
                        ? 'bg-[#EAE0CC] border-[#9C3F1E] shadow-lg scale-[1.02]'
                        : 'bg-white border-[#DDC0B8]/60 hover:border-[#D9A441]'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full h-24 rounded-xl overflow-hidden mb-2 relative">
                      <img
                        src={craft.image}
                        alt={craft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#9C3F1E] text-white flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-sm text-[#1D1C14] leading-tight">
                      {craft.name}
                    </h4>
                    <p className="text-[11px] text-[#7A5500] font-sans mt-0.5">
                      {craft.hindiName}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action: Enter Workshop */}
          <div className="max-w-md mx-auto w-full pt-2 pb-4">
            <button
              onClick={handleNext}
              className="w-full bg-[#D9A441] hover:bg-[#E8B84B] text-[#1A1815] font-serif font-bold text-base py-4 rounded-full shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Enter Your Workshop</span>
              <span className="material-symbols-outlined text-xl">store</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
