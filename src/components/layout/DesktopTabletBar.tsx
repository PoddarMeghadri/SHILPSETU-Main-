import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageCode } from '../../types';
import { LANGUAGES } from '../../data/mockData';
import { sound } from '../../services/sound';
import { ShilpSetuLogo } from '../common/ShilpSetuLogo';
import { useTranslation } from '../../services/translations';

interface DesktopTabletBarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const DesktopTabletBar: React.FC<DesktopTabletBarProps> = ({
  currentLanguage,
  onLanguageChange,
  isDark = false,
  onToggleTheme,
}) => {
  const { t } = useTranslation(currentLanguage);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.nativeLabel.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <>
      {/* Desktop / Tablet Top Utility Bar */}
      <header
        className={`hidden md:flex w-full sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
          isDark
            ? 'bg-[#121411]/95 border-[#2D3A2B] text-[#F4ECDE]'
            : 'bg-[#F4ECDE]/95 border-[#22331E]/10 text-[#22331E]'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          {/* ShilpSetu Platform Branding for PC/Tablet */}
          <div className="flex items-center gap-3">
            <ShilpSetuLogo size="sm" isDark={isDark} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base tracking-tight text-[#B5451B]">
                  SHILPSETU
                </span>
              </div>
              <p className="text-[11px] font-serif italic text-neutral-500 dark:text-neutral-400 -mt-0.5">
                {t('app_tagline', '"Har Haath Ki Kahani"')} • Vocal for Local Digital Artisan Hub
              </p>
            </div>
          </div>

          {/* Quick Settings: Language Selector & Dark Mode Checkbox / Switch */}
          <div className="flex items-center gap-4">
            {/* Quick Popular Languages Pills for Desktop */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10">
              {(['hi', 'en', 'bn', 'ta', 'mr', 'gu'] as LanguageCode[]).map((code) => {
                const item = LANGUAGES.find((l) => l.code === code);
                if (!item) return null;
                const isSelected = currentLanguage === code;
                return (
                  <button
                    key={code}
                    onClick={() => {
                      sound.playTap();
                      onLanguageChange(code);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                      isSelected
                        ? 'bg-[#B5451B] text-white shadow-xs'
                        : 'hover:bg-black/10 dark:hover:bg-white/10 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {item.nativeLabel}
                  </button>
                );
              })}
            </div>

            {/* Language Selector Dropdown Button */}
            <button
              onClick={() => {
                sound.playTap();
                setShowLangMenu(!showLangMenu);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold shadow-xs hover:border-[#B5451B] transition-all ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
                  : 'bg-[#FAF4E8] border-[#22331E]/15 text-[#1A1815]'
              }`}
            >
              <span className="material-symbols-outlined text-sm text-[#B5451B]">translate</span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[9px] opacity-60 uppercase font-sans">Language / भाषा</span>
                <span className="font-medium">{activeLangObj.nativeLabel} ({activeLangObj.label})</span>
              </div>
              <span className="material-symbols-outlined text-sm opacity-60">expand_more</span>
            </button>

            {/* Dark Mode Checkbox / Toggle Switch */}
            {onToggleTheme && (
              <label
                onClick={() => {
                  sound.playTap();
                  onToggleTheme();
                }}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border cursor-pointer select-none transition-all shadow-xs ${
                  isDark
                    ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE] hover:border-[#E8B84B]/50'
                    : 'bg-[#FAF4E8] border-[#22331E]/15 text-[#1A1815] hover:border-[#B5451B]/50'
                }`}
                title="Toggle Dark / Light Mode"
              >
                <span className="material-symbols-outlined text-base text-amber-500">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[9px] opacity-60 uppercase font-sans font-bold">Theme / थीम</span>
                  <span className="text-xs font-medium">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                {/* Visual Checkbox / Toggle Switch UI */}
                <div
                  className={`w-9 h-5 rounded-full p-0.5 flex items-center transition-colors ${
                    isDark ? 'bg-[#B5451B] justify-end' : 'bg-neutral-300 dark:bg-neutral-700 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-white shadow-md flex items-center justify-center"
                  >
                    <span className={`material-symbols-outlined text-[10px] ${isDark ? 'text-[#B5451B]' : 'text-neutral-600'}`}>
                      {isDark ? 'check' : 'brightness_5'}
                    </span>
                  </motion.div>
                </div>
              </label>
            )}
          </div>
        </div>
      </header>

      {/* Floating Tablet / PC Quick Control Dock (Visible on tablet/pc when scrolling or floating) */}
      <div className="hidden md:flex fixed right-4 bottom-6 z-50 flex-col gap-2 items-end">
        <div
          className={`flex items-center gap-2 p-2 rounded-2xl shadow-xl border backdrop-blur-xl ${
            isDark
              ? 'bg-[#1C221A]/95 border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#FAF4E8]/95 border-[#22331E]/15 text-[#1A1815]'
          }`}
        >
          {/* Quick Lang Switch */}
          <button
            onClick={() => {
              sound.playTap();
              setShowLangMenu(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-[#B5451B] hover:text-white transition-colors text-xs font-semibold"
            title="Change Language"
          >
            <span className="material-symbols-outlined text-sm text-[#B5451B]">translate</span>
            <span>{activeLangObj.nativeLabel}</span>
          </button>

          {/* Quick Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                sound.playTap();
                onToggleTheme();
              }}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-neutral-200 text-neutral-800'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-base">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Full 22 Languages Modal for Desktop / Tablet */}
      <AnimatePresence>
        {showLangMenu && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`w-full max-w-lg rounded-3xl shadow-2xl border p-6 ${
                isDark
                  ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
                  : 'bg-[#F4ECDE] text-[#1A1815] border-[#22331E]/15'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#B5451B]">language</span>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#B5451B]">
                      {t('select_language', 'Select Language / भाषा चुनें')}
                    </h4>
                    <p className="text-xs opacity-70">
                      Supports all 22 official Indian languages + English
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowLangMenu(false);
                    setLangSearch('');
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>

              {/* Language Search Input */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search 22 languages / भाषा खोजें (e.g. Hindi, Bengali, Tamil, Telugu)..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className={`w-full px-3.5 py-2 pl-9 text-xs rounded-xl border outline-none transition-colors ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-[#F4ECDE] placeholder:text-neutral-500 focus:border-[#B5451B]'
                      : 'bg-[#EFE4CF]/60 border-[#22331E]/15 text-[#1A1815] placeholder:text-neutral-400 focus:border-[#B5451B]'
                  }`}
                />
                <span className="material-symbols-outlined text-base absolute left-2.5 top-2.5 opacity-50">search</span>
                {langSearch && (
                  <button
                    onClick={() => setLangSearch('')}
                    className="absolute right-2.5 top-2.5 opacity-50 hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>

              {/* 2-Column Responsive Grid of Languages for PC / Tablet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        sound.playTap();
                        onLanguageChange(lang.code);
                        setShowLangMenu(false);
                        setLangSearch('');
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all ${
                        currentLanguage === lang.code
                          ? 'bg-[#B5451B] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'hover:bg-[#252E22] text-[#F4ECDE] bg-black/10'
                          : 'hover:bg-[#EFE4CF] text-[#1A1815] bg-[#FAF4E8]'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="font-sans font-bold text-sm">{lang.nativeLabel}</span>
                        <span className="text-[11px] opacity-75">{lang.label}</span>
                      </div>
                      {currentLanguage === lang.code && (
                        <span className="material-symbols-outlined text-base">check_circle</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-6 text-xs opacity-60">
                    No language found for "{langSearch}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
