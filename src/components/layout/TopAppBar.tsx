import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArtisanProfile, LanguageCode, ScreenId } from '../../types';
import { LANGUAGES } from '../../data/mockData';
import { sound } from '../../services/sound';
import { ShilpSetuLogo } from '../common/ShilpSetuLogo';
import { useTranslation } from '../../services/translations';

interface TopAppBarProps {
  currentScreen: ScreenId;
  artisan: ArtisanProfile;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onNavigate: (screen: ScreenId) => void;
  isScrolled?: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onOpenVoiceAssistant?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentScreen,
  artisan,
  currentLanguage,
  onLanguageChange,
  onNavigate,
  isScrolled = false,
  isDark = false,
  onToggleTheme,
  onOpenVoiceAssistant,
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

  const screenTitles: Record<ScreenId, string> = {
    home: t('screen_home', 'SHILPSETU'),
    studio: t('screen_studio', 'AI Studio'),
    cataloger: t('screen_cataloger', 'Auto-Cataloger'),
    pricing: t('screen_pricing', 'Smart Pricing'),
    b2b: t('screen_b2b', 'B2B & GeM'),
    dashboard: t('screen_dashboard', 'Business Insights'),
    notifications: t('screen_notifications', 'Notifications & Alerts'),
    social: t('screen_social', 'Social Share Kit'),
    story: t('screen_story', 'Heritage Story'),
    profile: t('screen_profile', 'Artisan Workshop'),
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled || currentScreen !== 'home'
            ? isDark
              ? 'bg-[#121411]/95 backdrop-blur-xl border-b border-[#2D3A2B] shadow-md'
              : 'bg-[#F4ECDE]/90 backdrop-blur-xl border-b border-[#22331E]/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-md mx-auto px-3.5 pt-3 pb-2 min-h-[4.25rem] flex items-center justify-between gap-2">
          {/* Left: Back button or Official ShilpSetu Logo */}
          {currentScreen !== 'home' ? (
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('home');
              }}
              className="flex items-center gap-1.5 text-[#B5451B] font-medium text-sm p-1.5 -ml-1 rounded-full hover:bg-black/5 active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
              <span className="font-serif font-bold text-base tracking-tight hidden sm:inline">
                {t('home', 'Home')}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-left group shrink-0 py-0.5"
            >
              {/* Official ShilpSetu Logo Icon */}
              <div className="shrink-0">
                <ShilpSetuLogo size="sm" isDark={isDark} />
              </div>
              <div className="flex flex-col justify-center">
                <h1
                  className={`font-serif font-bold text-[15px] sm:text-base tracking-tight leading-normal whitespace-nowrap ${
                    isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                  }`}
                >
                  {t('app_title', 'SHILPSETU')}
                </h1>
                <p className="font-serif italic text-[10px] sm:text-[11px] text-[#B5451B] tracking-tight font-medium leading-normal whitespace-nowrap">
                  {t('app_tagline', '"Har Haath Ki Kahani"')}
                </p>
              </div>
            </button>
          )}

          {/* Center: Screen Title when not home */}
          {currentScreen !== 'home' && (
            <motion.h2
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-serif font-bold text-base truncate max-w-[140px] sm:max-w-[170px] text-center ${
                isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
              }`}
            >
              {screenTitles[currentScreen]}
            </motion.h2>
          )}

          {/* Right Controls: Dark Mode Toggle & Language Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={() => {
                  sound.playTap();
                  onToggleTheme();
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  isDark
                    ? 'text-[#E8B84B] bg-[#1C221A] hover:bg-[#2D3A2B]'
                    : 'text-[#22331E] bg-[#EFE4CF]/80 hover:bg-[#EAE0CC]'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <span className="material-symbols-outlined text-lg">
                  {isDark ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            {/* Language Toggle Chip */}
            <button
              onClick={() => {
                sound.playTap();
                setShowLangMenu(!showLangMenu);
              }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold active:scale-95 transition-all shadow-xs ${
                isDark
                  ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE] hover:bg-[#252E22]'
                  : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815] hover:bg-[#EAE0CC]'
              }`}
            >
              <span className="material-symbols-outlined text-xs text-[#B5451B]">translate</span>
              <span>{activeLangObj.nativeLabel}</span>
              <span className="material-symbols-outlined text-[10px] opacity-60">expand_more</span>
            </button>
          </div>
        </div>
      </header>

      {/* Language Selector Dropdown Modal */}
      <AnimatePresence>
        {showLangMenu && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`w-full max-w-xs rounded-3xl shadow-2xl border p-5 ${
                isDark
                  ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
                  : 'bg-[#F4ECDE] text-[#1A1815] border-[#22331E]/15'
              }`}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-current/10 mb-2">
                <h4 className="font-serif font-bold text-sm text-[#B5451B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">language</span>
                  {t('select_language', 'Select Language')}
                </h4>
                <button
                  onClick={() => {
                    setShowLangMenu(false);
                    setLangSearch('');
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {/* Language Search Input */}
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search language / भाषा खोजें..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  className={`w-full px-3 py-1.5 pl-8 text-xs rounded-xl border outline-none transition-colors ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-[#F4ECDE] placeholder:text-neutral-500 focus:border-[#B5451B]'
                      : 'bg-[#EFE4CF]/60 border-[#22331E]/15 text-[#1A1815] placeholder:text-neutral-400 focus:border-[#B5451B]'
                  }`}
                />
                <span className="material-symbols-outlined text-sm absolute left-2.5 top-2 opacity-50">search</span>
                {langSearch && (
                  <button
                    onClick={() => setLangSearch('')}
                    className="absolute right-2.5 top-2 opacity-50 hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5 max-h-80 overflow-y-auto pr-1">
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
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-[#B5451B] text-white font-semibold shadow-xs'
                          : isDark
                          ? 'hover:bg-[#252E22] text-[#F4ECDE]'
                          : 'hover:bg-[#EFE4CF] text-[#1A1815]'
                      }`}
                    >
                      <span className="font-sans font-medium">{lang.nativeLabel}</span>
                      <span className="text-xs opacity-75">{lang.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs opacity-60">
                    No language found
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
