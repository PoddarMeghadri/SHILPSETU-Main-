import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArtisanProfile, ProductItem, ActivityItem, ScreenId, StoryItem, LanguageCode } from '../../types';
import { StoryViewerModal } from '../common/StoryViewerModal';
import { BlueVerifiedBadge } from '../common/SocialIcons';
import { sound } from '../../services/sound';
import { useTranslation } from '../../services/translations';

interface HomeScreenProps {
  artisan: ArtisanProfile;
  products: ProductItem[];
  activities: ActivityItem[];
  stories: StoryItem[];
  onNavigate: (screen: ScreenId) => void;
  onOpenVoiceAssistant?: () => void;
  language?: LanguageCode;
  isDark?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  artisan,
  products,
  activities,
  stories,
  onNavigate,
  onOpenVoiceAssistant,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Top Welcome & Artisan Status Card */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={artisan.avatarUrl}
              alt={artisan.name}
              className="w-13 h-13 rounded-full object-cover border-2 border-[#E8B84B] shadow-md"
            />
            <span
              className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1C221A] rounded-full p-0.5 shadow-xs border border-white dark:border-[#1C221A]"
              title="Official Blue Verified Master Artisan"
            >
              <BlueVerifiedBadge size={15} />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2
                className={`font-serif font-bold text-lg leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('namaste', 'Namaste')}, {artisan.name.split(' ')[0]}
              </h2>
            </div>
            <p className="text-xs opacity-75 font-sans leading-none mt-1">
              {artisan.craft.split('&')[0]} • {artisan.location.split(',')[0]}
            </p>
          </div>
        </div>

        {/* Heritage Trust Badge */}
        <button
          onClick={() => {
            sound.playTap();
            onNavigate('profile');
          }}
          className={`flex flex-col items-end px-3 py-1.5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#E8B84B] hover:bg-[#252E22]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#22331E] hover:bg-[#EAE0CC]'
          }`}
        >
          <span className="text-[9px] uppercase font-bold tracking-widest text-[#B5451B]">
            {t('trust_score', 'Trust Score')}
          </span>
          <span className="font-serif font-bold text-sm text-[#2E4638] dark:text-[#E8B84B]">
            {artisan.trustScore ?? 98}/100 ★
          </span>
        </button>
      </div>

      {/* Hero Action Card (Bento Terracotta Card) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#B5451B] via-[#9E3913] to-[#7F2A0B] p-6 text-white shadow-xl border border-[#E8B84B]/30"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 rounded-full bg-[#E8B84B]/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-black/20 blur-xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-[#F4ECDE] text-[11px] font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-xs text-[#E8B84B]">auto_awesome</span>
              {t('screen_studio', 'AI Craft Studio')}
            </span>

            <span className="text-xs text-[#F4ECDE]/90 font-sans font-medium">
              {products.length} {t('live_listings', 'Live Listings')}
            </span>
          </div>

          <div>
            <h3 className="font-serif font-bold text-2xl leading-snug text-white">
              {t('hero_title', 'Turn today’s craft into tomorrow’s sale.')}
            </h3>
            <p className="text-xs text-white/85 mt-1.5 font-sans leading-relaxed">
              {t(
                'hero_subtitle',
                'Snap a raw workbench photo and transform it into 4K studio catalog images in seconds.'
              )}
            </p>
          </div>

          {/* Action Button with Pulse Effect */}
          <div className="pt-1">
            <button
              onClick={() => {
                sound.playTap();
                onNavigate('studio');
              }}
              className="w-full bg-[#E8B84B] hover:bg-[#F2C55E] text-[#1A1815] font-serif font-bold py-3.5 px-5 rounded-full shadow-gold-glow flex items-center justify-between transition-transform active:scale-95 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#1A1815] text-[#E8B84B] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                </div>
                <span className="text-base tracking-wide">
                  {t('enhance_photo_now', 'Enhance a Photo Now')}
                </span>
              </div>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick-Stat Bento Strip */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
        {/* Stat 1 */}
        <div
          className={`shrink-0 border rounded-2xl p-3 min-w-[124px] shadow-xs ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold font-sans">
            {t('products_live', 'Products Live')}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-2xl">{products.length}</span>
            <span className="text-[11px] text-[#B5451B] font-bold">+3 {t('new_tag', 'new')}</span>
          </div>
        </div>

        {/* Stat 2 */}
        <div
          className={`shrink-0 border rounded-2xl p-3 min-w-[124px] shadow-xs ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold font-sans">
            {t('pending_orders', 'Pending Orders')}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-2xl text-[#B5451B]">4</span>
            <span className="text-[10px] text-[#B5451B] font-bold">{t('ready_tag', 'Ready')}</span>
          </div>
        </div>

        {/* Stat 3 */}
        <div
          className={`shrink-0 border rounded-2xl p-3 min-w-[144px] shadow-xs ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold font-sans">
            {t('weeks_revenue', 'Week’s Revenue')}
          </p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-serif font-bold text-2xl">₹14,250</span>
          </div>
        </div>

        {/* Stat 4 */}
        <div
          className={`shrink-0 border rounded-2xl p-3 min-w-[130px] shadow-xs ${
            isDark
              ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
              : 'bg-[#EFE4CF] border-[#22331E]/10 text-[#1A1815]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider opacity-70 font-semibold font-sans">
            {t('gem_gateway_badge', 'GeM Gateway')}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E4638] animate-pulse" />
            <span className="font-serif font-bold text-sm">{t('live_active', 'Live & Active')}</span>
          </div>
        </div>
      </div>

      {/* Artisan Heritage Stories Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3
            className={`font-serif font-bold text-lg flex items-center gap-1.5 ${
              isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
            }`}
          >
            <span className="material-symbols-outlined text-xl text-[#B5451B]">auto_stories</span>
            {t('artisan_stories', 'Artisan Stories')}
          </h3>
          <span className="text-xs text-[#B5451B] font-semibold">
            {t('tap_to_view', 'Tap to view')}
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
          {/* Create / Add My Story Avatar */}
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('story');
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-full border-2 border-dashed border-[#B5451B] flex items-center justify-center text-[#B5451B] transition-colors shadow-xs ${
                isDark ? 'bg-[#1C221A] hover:bg-[#252E22]' : 'bg-[#EFE4CF] hover:bg-[#EAE0CC]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-center max-w-[64px] truncate opacity-90">
              {t('your_story', 'Your Story')}
            </span>
          </button>

          {/* Other Artisans Stories */}
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => {
                sound.playTap();
                setActiveStory(story);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.isViewed
                    ? 'bg-[#22331E]/20'
                    : 'bg-gradient-to-tr from-[#B5451B] via-[#E8B84B] to-[#22331E]'
                }`}
              >
                <div
                  className={`w-full h-full rounded-full overflow-hidden border-2 ${
                    isDark ? 'border-[#1C221A]' : 'border-[#F4ECDE]'
                  }`}
                >
                  <img
                    src={story.avatarUrl}
                    alt={story.artisanName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-sans font-semibold text-center max-w-[68px] truncate opacity-90">
                {story.artisanName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 7-Feature Bento Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3
            className={`font-serif font-bold text-lg ${
              isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
            }`}
          >
            {t('workshop_suite', 'Craft Workshop Suite')}
          </h3>
          <span className="text-xs text-[#B5451B] font-sans font-bold">7 AI Modules</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Bento Card 1 (Full Width Hero): AI Image Enhancer */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('studio');
            }}
            className="col-span-2 relative overflow-hidden bg-gradient-to-r from-[#22331E] to-[#162214] text-[#F4ECDE] rounded-3xl p-5 border border-[#E8B84B]/30 shadow-lg text-left group"
          >
            <div className="absolute right-0 bottom-0 w-36 h-36 opacity-30 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=300&auto=format&fit=crop&q=80"
                alt="AI Studio"
                className="w-full h-full object-cover rounded-tl-full"
              />
            </div>

            <div className="relative z-10 max-w-[72%] space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#E8B84B] text-[#1A1815] flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-2xl font-bold">photo_camera</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#E8B84B]">
                  Module 1
                </span>
                <h4 className="font-serif font-bold text-xl text-white">
                  {t('screen_studio', 'AI Image Enhancer & Studio')}
                </h4>
                <p className="text-xs text-white/75 font-sans mt-1 leading-snug">
                  {t(
                    'module1_desc',
                    '4K studio lighting, background isolation, and multi-format export.'
                  )}
                </p>
              </div>
            </div>
          </motion.button>

          {/* Bento Card 2: Multilingual Auto-Cataloger */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('cataloger');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#B5451B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">mic</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#B5451B]">
                Module 2
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_cataloger', 'Voice Auto-Cataloger')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module2_desc', 'Speak in 22 Indian tongues or in English to create listings')}
              </p>
            </div>
          </motion.button>

          {/* Bento Card 3: Dynamic Smart Pricing */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('pricing');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#22331E] text-[#F4ECDE] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">speed</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                Module 3
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_pricing', 'Smart Pricing Assistant')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module3_desc', 'Labor hours + raw materials = Fair profit.')}
              </p>
            </div>
          </motion.button>

          {/* Bento Card 4: B2B & GeM Gateway */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('b2b');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8B84B] text-[#1A1815] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">storefront</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#B5451B]">
                Module 4
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_b2b', 'B2B & GeM Gateway')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module4_desc', 'Govt procurement & institutional bulk orders.')}
              </p>
            </div>
          </motion.button>

          {/* Bento Card 5: Business Insights */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('dashboard');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#7F2A0B] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#B5451B]">
                Module 5
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_dashboard', 'Business Insights')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module5_desc', 'Revenue trends, category splits & inventory.')}
              </p>
            </div>
          </motion.button>

          {/* Bento Card 6: Automated Social Sharing */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('social');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">share</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                Module 6
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_social', 'Social Share Kit')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module6_desc', '1-tap WhatsApp, IG & FB ready templates.')}
              </p>
            </div>
          </motion.button>

          {/* Bento Card 7: Heritage Story Builder */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playTap();
              onNavigate('story');
            }}
            className={`border rounded-3xl p-4 text-left flex flex-col justify-between min-h-[155px] shadow-xs group transition-all ${
              isDark
                ? 'bg-[#1C221A] border-[#2D3A2B] hover:bg-[#252E22]'
                : 'bg-[#EFE4CF] hover:bg-[#EAE0CC] border-[#22331E]/10'
            }`}
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E8B84B] text-[#1A1815] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">history_edu</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-[#B5451B]">
                Module 7
              </span>
              <h4
                className={`font-serif font-bold text-base leading-tight ${
                  isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
                }`}
              >
                {t('screen_story', 'Heritage Story Builder')}
              </h4>
              <p className="text-[11px] opacity-70 font-sans mt-1 leading-snug">
                {t('module7_desc', 'Voice-narrated ancestral craft biographies.')}
              </p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3
            className={`font-serif font-bold text-lg flex items-center gap-1.5 ${
              isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
            }`}
          >
            <span className="material-symbols-outlined text-xl text-[#B5451B]">history</span>
            {t('recent_activity', 'Recent Workshop Activity')}
          </h3>
          <span className="text-xs opacity-70 font-sans font-bold">
            {t('real_time', 'Real-Time')}
          </span>
        </div>

        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`p-3.5 rounded-3xl border flex items-center justify-between gap-3 shadow-xs ${
                isDark ? 'bg-[#1C221A] border-[#2D3A2B]' : 'bg-[#EFE4CF] border-[#22331E]/10'
              }`}
            >
              <div className="flex items-center gap-3">
                {act.thumbnailUrl ? (
                  <img
                    src={act.thumbnailUrl}
                    alt={act.title}
                    className="w-11 h-11 rounded-2xl object-cover border border-current/10"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-[#B5451B] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-xl">draw</span>
                  </div>
                )}

                <div>
                  <h5 className="font-serif font-bold text-sm leading-tight">
                    {t(`act_${act.id.replace(/-/g, '_')}_title`, act.title)}
                  </h5>
                  <p className="text-[11px] opacity-70 font-sans line-clamp-1 mt-0.5">
                    {t(`act_${act.id.replace(/-/g, '_')}_desc`, act.description)}
                  </p>
                  <span className="text-[10px] opacity-50 font-sans">
                    {t(`act_${act.id.replace(/-/g, '_')}_time`, act.timestamp)}
                  </span>
                </div>
              </div>

              {act.statusTag && (
                <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#B5451B]/15 text-[#B5451B] border border-[#B5451B]/20">
                  {t(`act_${act.id.replace(/-/g, '_')}_tag`, act.statusTag)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      <StoryViewerModal story={activeStory} onClose={() => setActiveStory(null)} />
    </div>
  );
};
