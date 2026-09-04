import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, LanguageCode, ProductItem, ActivityItem, ArtisanProfile, StoryAvatar } from './types';
import { INITIAL_ARTISAN, INITIAL_PRODUCTS, INITIAL_ACTIVITIES, ARTISAN_STORIES } from './data/mockData';
import { TopAppBar } from './components/layout/TopAppBar';
import { BottomNavBar } from './components/layout/BottomNavBar';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { OnboardingFlow, OnboardingUserData } from './components/onboarding/OnboardingFlow';
import { HomeScreen } from './components/sections/HomeScreen';
import { AIStudioScreen } from './components/sections/AIStudioScreen';
import { AutoCatalogerScreen } from './components/sections/AutoCatalogerScreen';
import { SmartPricingScreen } from './components/sections/SmartPricingScreen';
import { B2BIntegrationScreen } from './components/sections/B2BIntegrationScreen';
import { BusinessDashboardScreen } from './components/sections/BusinessDashboardScreen';
import { NotificationsScreen } from './components/sections/NotificationsScreen';
import { SocialShareScreen } from './components/sections/SocialShareScreen';
import { HeritageStoryScreen } from './components/sections/HeritageStoryScreen';
import { ProfileScreen } from './components/sections/ProfileScreen';
import { ShilpiVoiceFAB } from './components/voice/ShilpiVoiceFAB';
import { ShilpiVoiceModal } from './components/voice/ShilpiVoiceModal';
import { sound } from './services/sound';
import { useLanguage } from './context/LanguageContext';

export function App() {
  const { language, setLanguage } = useLanguage();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('shilpsetu_auth_done') === 'true';
  });
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('shilpsetu_theme') === 'dark';
  });
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // App State with localStorage persistence
  const [artisan, setArtisan] = useState<ArtisanProfile>(() => {
    const saved = localStorage.getItem('shilpsetu_artisan');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_ARTISAN,
          ...parsed,
          trustScore: parsed.trustScore ?? INITIAL_ARTISAN.trustScore ?? 98,
        };
      } catch (_) {}
    }
    return INITIAL_ARTISAN;
  });

  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [stories] = useState<StoryAvatar[]>(ARTISAN_STORIES);

  // Persist theme changes
  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('shilpsetu_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  // Persist language changes
  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem('shilpsetu_lang', newLang);
  };

  // Persist artisan profile changes
  const handleUpdateArtisan = (updated: ArtisanProfile) => {
    setArtisan(updated);
    localStorage.setItem('shilpsetu_artisan', JSON.stringify(updated));
  };

  // Scroll listener for sticky app bar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
    // Add new activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      title: 'New Listing Published',
      description: `${newProduct.title} created with multilingual voice cataloger.`,
      timestamp: 'Just now',
      type: 'listing_published',
      statusTag: 'Live on GeM',
      thumbnailUrl: newProduct.polishedImageUrl,
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const handleLogout = () => {
    sound.playTap();
    localStorage.removeItem('shilpsetu_auth_done');
    setHasCompletedOnboarding(false);
    setCurrentScreen('home');
  };

  const handleOnboardingComplete = (data: OnboardingUserData) => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('shilpsetu_auth_done', 'true');

    const craftTitles: Record<string, { title: string; craft: string }> = {
      pottery: { title: 'Master Clay Sculptor & Potter', craft: 'Terracotta & Heritage Pottery' },
      weaving: { title: 'Master Handloom Weaver', craft: 'Banarasi Handloom Weaving' },
      woodwork: { title: 'Master Wood Sculptor', craft: 'Channapatna Wooden Toys' },
      metalwork: { title: 'Master Brass Artisan', craft: 'Heritage Metal & Brass Craft' },
      jewelry: { title: 'Master Jewelry Maker', craft: 'Artisan Kundan & Meenakari' },
      painting: { title: 'Master Folk Painter', craft: 'Madhubani & Heritage Painting' },
    };

    const craftInfo = craftTitles[data.selectedCraft] || {
      title: 'Master Heritage Artisan',
      craft: 'Traditional Indian Handicrafts',
    };

    const userLocation =
      data.city && data.state ? `${data.city.trim()}, ${data.state.trim()}` : artisan.location;

    const updatedArtisan: ArtisanProfile = {
      ...artisan,
      name: data.fullName?.trim() || artisan.name,
      location: userLocation,
      mobile: data.mobile?.trim() || artisan.mobile,
      email: data.email?.trim() ? data.email.trim() : undefined,
      craft: craftInfo.craft,
      title: craftInfo.title,
    };

    handleUpdateArtisan(updatedArtisan);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start font-sans relative selection:bg-[#B5451B]/20 transition-colors duration-300 ${
        isDark ? 'bg-[#121411] text-[#F4ECDE]' : 'bg-[#F4ECDE] text-[#1A1815]'
      }`}
    >
      {/* 4-Step Onboarding Flow if not completed */}
      {!hasCompletedOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
        />
      )}

      {/* Main Mobile App Container Frame */}
      <div
        className={`w-full max-w-md min-h-screen flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.15)] transition-colors duration-300 ${
          isDark ? 'bg-[#121411]' : 'bg-[#F4ECDE] khadi-bg'
        }`}
      >
        {/* Offline Banner */}
        <OfflineBanner
          isOffline={isOffline}
          onToggleSimulatedOffline={() => setIsOffline(false)}
        />

        {/* Top App Bar */}
        <TopAppBar
          currentScreen={currentScreen}
          artisan={artisan}
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
          onNavigate={(screen) => {
            sound.playTap();
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isScrolled={isScrolled}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        />

        {/* Main Content Stage with Screen Transition Animation */}
        <main className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {currentScreen === 'home' && (
                <HomeScreen
                  artisan={artisan}
                  products={products}
                  activities={activities}
                  stories={stories}
                  isDark={isDark}
                  language={language}
                  onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'studio' && (
                <AIStudioScreen
                  products={products}
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'cataloger' && (
                <AutoCatalogerScreen
                  products={products}
                  onAddProduct={handleAddProduct}
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'pricing' && (
                <SmartPricingScreen
                  products={products}
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'b2b' && (
                <B2BIntegrationScreen
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'dashboard' && (
                <BusinessDashboardScreen
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'notifications' && (
                <NotificationsScreen
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'social' && (
                <SocialShareScreen
                  products={products}
                  artisan={artisan}
                  isDark={isDark}
                  language={language}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'story' && (
                <HeritageStoryScreen
                  artisan={artisan}
                  language={language}
                  isDark={isDark}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

              {currentScreen === 'profile' && (
                <ProfileScreen
                  artisan={artisan}
                  products={products}
                  isOffline={isOffline}
                  onToggleOffline={() => setIsOffline(!isOffline)}
                  onUpdateArtisan={handleUpdateArtisan}
                  isDark={isDark}
                  onToggleTheme={handleToggleTheme}
                  language={language}
                  onLogout={handleLogout}
                  onNavigate={(scr) => {
                    sound.playTap();
                    setCurrentScreen(scr);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Persistent Bottom Floating Pill Navigation */}
        <BottomNavBar
          currentScreen={currentScreen}
          isDark={isDark}
          language={language}
          onNavigate={(scr) => {
            setCurrentScreen(scr);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Floating "Tap to Speak" Action Button for SHILPI AI */}
        <ShilpiVoiceFAB
          onClick={() => setIsVoiceModalOpen(true)}
          isDark={isDark}
          currentLanguage={language}
        />

        {/* SHILPI AI Interactive Voice Assistant Modal */}
        <ShilpiVoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onNavigate={(screen) => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLanguageChange={handleLanguageChange}
          onToggleTheme={handleToggleTheme}
          currentLanguage={language}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

export default App;
