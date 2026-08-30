import React, { useState } from 'react';
import { ArtisanProfile, ProductItem, ScreenId, LanguageCode } from '../../types';
import { sound } from '../../services/sound';
import { EditProfileModal } from '../profile/EditProfileModal';
import { WhatsAppIcon, InstagramIcon, FacebookIcon, XIcon, BlueVerifiedBadge } from '../common/SocialIcons';
import { SocialRedirectModal, SocialPlatformType } from '../common/SocialRedirectModal';
import { ShareWorkshopModal } from '../common/ShareWorkshopModal';
import { useTranslation } from '../../services/translations';

interface ProfileScreenProps {
  artisan: ArtisanProfile;
  products: ProductItem[];
  isOffline: boolean;
  onToggleOffline: () => void;
  onNavigate: (screen: ScreenId) => void;
  onUpdateArtisan: (updated: ArtisanProfile) => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
  language?: LanguageCode;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  artisan,
  isOffline,
  onToggleOffline,
  onNavigate,
  onUpdateArtisan,
  isDark = false,
  onToggleTheme,
  language = 'hi',
}) => {
  const { t } = useTranslation(language);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [redirectPlatform, setRedirectPlatform] = useState<SocialPlatformType | null>(null);

  const artisanSlug = artisan.name.toLowerCase().replace(/\s+/g, '-');
  const storeUrl = `https://shilpsetu.org/${artisanSlug}`;
  const defaultShareCaption = `🏺 Discover authentic ${artisan.craft} handcrafted by master artisan ${artisan.name} from ${artisan.location}.\n\n✨ Direct from maker with zero middlemen. Certified on ShilpSetu & GeM Govt portal.\n\n#HandmadeInIndia #VocalForLocal #ArtisanDirect #ShilpSetu`;

  const handleOpenSocialRedirect = (platform: SocialPlatformType) => {
    sound.playTap();
    setRedirectPlatform(platform);
  };

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Artisan Master Identity Card */}
      <div
        className={`rounded-3xl p-6 border shadow-artisan relative overflow-hidden text-center transition-colors ${
          isDark
            ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
            : 'bg-[#EAE0CC] border-[#22331E]/15 text-[#1D1C14]'
        }`}
      >
        {/* Decorative Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#B5451B]/15 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Avatar with gold ring, Blue Verified Badge & edit badge */}
          <div
            className="relative mb-3 group cursor-pointer"
            onClick={() => setIsEditModalOpen(true)}
          >
            <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#B5451B] via-[#E8B84B] to-[#2E4638] shadow-md">
              <img
                src={artisan.avatarUrl}
                alt={artisan.name}
                className="w-full h-full rounded-full object-cover border-2 border-[#F5EFE3]"
              />
            </div>
            {/* Official Blue Verified Badge */}
            <div
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#1C221A] flex items-center justify-center border-2 border-white dark:border-[#1C221A] shadow-md"
              title="Official Blue Verified Master Artisan"
            >
              <BlueVerifiedBadge size={22} />
            </div>

            {/* Quick Edit Overlay Button */}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">edit</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h3 className="font-serif font-bold text-2xl">{artisan.name}</h3>
            <BlueVerifiedBadge size={20} />
          </div>
          <p className="text-xs font-serif font-semibold text-[#B5451B] mt-0.5">{artisan.title}</p>
          <p className="text-xs opacity-75 font-sans mt-0.5">
            {artisan.location} • {artisan.craft}
          </p>

          {/* Verification Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-3">
            <span className="px-2.5 py-0.5 bg-[#0095F6]/15 text-[#0095F6] dark:text-[#52B7FF] rounded-full text-[10px] font-bold uppercase border border-[#0095F6]/30 flex items-center gap-1">
              <BlueVerifiedBadge size={12} />
              {t('verified_artisan', 'Blue Verified')}
            </span>
            <span className="px-2.5 py-0.5 bg-[#2E4638]/15 text-[#2E4638] dark:text-[#88C498] rounded-full text-[10px] font-bold uppercase border border-[#2E4638]/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              {t('gem_govt_vendor', 'GeM Govt. Vendor')}
            </span>
            <span className="px-2.5 py-0.5 bg-[#E8B84B]/20 text-[#B5451B] rounded-full text-[10px] font-bold uppercase border border-[#E8B84B]/40 font-mono">
              {artisan.udyamNumber || 'UDYAM-UP-0029182'}
            </span>
            <span className="px-2.5 py-0.5 bg-[#B5451B]/15 text-[#B5451B] dark:text-[#FFA680] rounded-full text-[10px] font-bold uppercase border border-[#B5451B]/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">star</span>
              {t('trust_score', 'Trust Score')}: {artisan.trustScore ?? 98}/100
            </span>
          </div>

          {/* Artisan Bio & Story quote */}
          <p className="text-xs opacity-80 font-sans leading-relaxed mt-3 px-2 italic">
            "{artisan.storyQuote || artisan.bio}"
          </p>

          {/* Prominent Edit Profile Button */}
          <button
            onClick={() => {
              sound.playTap();
              setIsEditModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-2xl bg-[#B5451B]/15 hover:bg-[#B5451B]/25 text-[#B5451B] dark:text-[#FFA680] border border-[#B5451B]/30 font-serif font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            <span>{t('edit_profile', 'Edit Profile & Lineage')}</span>
          </button>
        </div>
      </div>

      {/* Profile Completeness Strip */}
      <div className="bg-[#22331E] text-[#F4ECDE] rounded-3xl p-5 border border-[#E8B84B]/40 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold font-serif text-[#FFEBB3]">
            {t('profile_completeness', 'Profile Completeness')}
          </span>
          <span className="font-bold text-[#E8B84B]">
            {artisan.completeness}% {t('completed', 'Completed')}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-[#E8B84B] rounded-full transition-all duration-500"
            style={{ width: `${artisan.completeness}%` }}
          />
        </div>
        <p className="text-[10px] text-white/70">
          {t('udyam_active_desc', 'Udyam registration and verified portfolio active.')}
        </p>
      </div>

      {/* Social Marketing Kit Hub with Official Icons & Redirect Confirmation */}
      <div
        className={`rounded-3xl p-5 border shadow-xs space-y-3 ${
          isDark
            ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
            : 'bg-[#EAE0CC] border-[#22331E]/15 text-[#1D1C14]'
        }`}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-[#B5451B] text-xl">share</span>
            {t('screen_social', 'Social Marketing Kit')}
          </h4>
          <span className="text-[10px] font-bold text-[#B5451B] uppercase tracking-wider">
            {t('official_channels', 'Official Channels')}
          </span>
        </div>

        <p className="text-xs opacity-75 leading-snug">
          {t(
            'social_share_desc',
            'Click any app to copy marketing story and redirect for instant direct publishing:'
          )}
        </p>

        {/* 4-Column Grid: WhatsApp, Instagram, Facebook, X */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {/* WhatsApp Action */}
          <button
            onClick={() => handleOpenSocialRedirect('whatsapp')}
            title="Share on WhatsApp"
            className="py-2.5 px-1 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
          >
            <WhatsAppIcon size={26} />
            <span className="text-[9.5px] font-bold font-sans text-[#128C7E] dark:text-[#25D366] whitespace-nowrap text-center">
              WhatsApp
            </span>
          </button>

          {/* Instagram Action */}
          <button
            onClick={() => handleOpenSocialRedirect('instagram')}
            title="Share on Instagram"
            className="py-2.5 px-1 bg-gradient-to-tr from-[#F58529]/15 via-[#DD2A7B]/15 to-[#8134AF]/15 hover:opacity-80 border border-[#DD2A7B]/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
          >
            <InstagramIcon size={26} />
            <span className="text-[9.5px] font-bold font-sans text-[#C13584] dark:text-[#F77737] whitespace-nowrap text-center">
              Instagram
            </span>
          </button>

          {/* Facebook Action */}
          <button
            onClick={() => handleOpenSocialRedirect('facebook')}
            title="Share on Facebook"
            className="py-2.5 px-1 bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/40 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group"
          >
            <FacebookIcon size={26} />
            <span className="text-[9.5px] font-bold font-sans text-[#1877F2] dark:text-[#64A9FF] whitespace-nowrap text-center">
              Facebook
            </span>
          </button>

          {/* X (Twitter) Action with Official X Logo */}
          <button
            onClick={() => handleOpenSocialRedirect('x')}
            title="Share on X"
            className="py-2.5 px-1 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 border border-black/20 dark:border-white/20 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 group text-black dark:text-white"
          >
            <XIcon size={24} className="text-black dark:text-white" />
            <span className="text-[9.5px] font-bold font-sans text-black dark:text-white whitespace-nowrap text-center">
              X
            </span>
          </button>
        </div>
      </div>

      {/* Workshop & Account Settings */}
      <div
        className={`rounded-3xl p-5 border shadow-xs space-y-3 ${
          isDark
            ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]'
            : 'bg-[#EAE0CC] border-[#22331E]/15 text-[#1D1C14]'
        }`}
      >
        <h4 className="font-serif font-bold text-base">
          {t('workshop_settings', 'Workshop & Account Settings')}
        </h4>

        <div className="space-y-2">
          {/* Setting 1: Dark Mode Toggle */}
          {onToggleTheme && (
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-[#121411] border-[#2D3A2B]' : 'bg-white border-[#22331E]/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDark ? 'bg-[#E8B84B] text-[#1A1815]' : 'bg-[#22331E] text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {isDark ? 'light_mode' : 'dark_mode'}
                  </span>
                </div>
                <div>
                  <p className="font-serif font-bold text-xs">
                    {isDark ? t('dark_mode_on', 'Dark Mode (Active)') : t('dark_mode_off', 'Dark Mode (Off)')}
                  </p>
                  <p className="text-[10px] opacity-70">
                    {t('dark_mode_desc', 'Switch between heritage warm theme & deep dark mode')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playTap();
                  onToggleTheme();
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  isDark ? 'bg-[#B5451B]' : 'bg-[#DDC0B8]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Setting 2: Edit Heritage Story */}
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('story');
            }}
            className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left active:scale-98 transition-all ${
              isDark
                ? 'bg-[#121411] border-[#2D3A2B] hover:bg-[#222720]'
                : 'bg-white border-[#22331E]/10 hover:bg-[#FAF4E8]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B5451B] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">history_edu</span>
              </div>
              <div>
                <p className="font-serif font-bold text-xs">{t('edit_heritage_story', 'Edit Heritage Story')}</p>
                <p className="text-[10px] opacity-70">
                  {t('edit_lineage_desc', 'Update ancestral lineage & craft philosophy')}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm opacity-60">arrow_forward_ios</span>
          </button>

          {/* Setting 3: Offline Mode Toggle */}
          <div
            className={`p-3 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-[#121411] border-[#2D3A2B]' : 'bg-white border-[#22331E]/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                  isOffline ? 'bg-amber-600' : 'bg-[#2E4638]'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isOffline ? 'cloud_off' : 'cloud_done'}
                </span>
              </div>
              <div>
                <p className="font-serif font-bold text-xs">
                  {t('simulate_offline', 'Simulate Offline Mode')}
                </p>
                <p className="text-[10px] opacity-70">
                  {t('offline_resilience_desc', 'Test cached offline resilience')}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                onToggleOffline();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                isOffline ? 'bg-[#B5451B]' : 'bg-[#DDC0B8]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isOffline ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Share Workshop QR Code Button - Opens Live QR Modal */}
      <button
        onClick={() => {
          sound.playSuccess();
          setIsShareModalOpen(true);
        }}
        className="w-full bg-[#B5451B] hover:bg-[#9C3A14] text-white font-serif font-bold py-3.5 rounded-2xl shadow-artisan flex items-center justify-center gap-2 text-sm active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-lg">qr_code_2</span>
        <span>{t('share_qr_link', 'Share Workshop Link & QR')}</span>
      </button>

      {/* Edit Profile Modal with Custom Photo Upload */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        artisan={artisan}
        onSave={(updated) => {
          onUpdateArtisan(updated);
        }}
        language={language}
        isDark={isDark}
      />

      {/* Live QR Code & Storefront Modal */}
      <ShareWorkshopModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        artisan={artisan}
        isDark={isDark}
      />

      {/* Social Redirect Confirmation Modal */}
      {redirectPlatform && (
        <SocialRedirectModal
          isOpen={!!redirectPlatform}
          onClose={() => setRedirectPlatform(null)}
          platform={redirectPlatform}
          captionText={defaultShareCaption}
          storeUrl={storeUrl}
          isDark={isDark}
        />
      )}
    </div>
  );
};

