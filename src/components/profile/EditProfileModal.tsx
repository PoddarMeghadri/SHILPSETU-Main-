import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArtisanProfile, LanguageCode } from '../../types';
import { sound } from '../../services/sound';
import { useTranslation } from '../../services/translations';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisan: ArtisanProfile;
  onSave: (updatedArtisan: ArtisanProfile) => void;
  language: LanguageCode;
  isDark?: boolean;
}

const AVATAR_PRESETS = [
  {
    name: 'Ranjit (Master Clay)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Meera (Madhubani)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Babulal (Terracotta)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Anandi Bai (Weaver)',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kallu Mistry (Brass/Wood)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Devaki (Pashmina/Embroidery)',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  artisan,
  onSave,
  language,
  isDark = false,
}) => {
  const { t } = useTranslation(language);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<ArtisanProfile>({ ...artisan });
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playTap();
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          setCustomPhotoUrl(resultUrl);
          setFormData((prev) => ({ ...prev, avatarUrl: resultUrl }));
          sound.playSuccess();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    sound.playSuccess();

    setTimeout(() => {
      onSave({
        ...formData,
        completeness: Math.min(
          100,
          70 + (formData.udyamNumber ? 15 : 0) + (formData.bio.length > 30 ? 15 : 0)
        ),
      });
      setIsSaving(false);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border my-8 relative overflow-hidden ${
            isDark
              ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
              : 'bg-[#F4ECDE] text-[#1A1815] border-[#22331E]/15'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#22331E]/10 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B5451B] text-2xl">
                account_circle
              </span>
              <div>
                <h3 className="font-serif font-bold text-lg leading-none">
                  {t('edit_profile', 'Edit Profile & Lineage')}
                </h3>
                <p className="text-[11px] opacity-70 mt-0.5">
                  {t('edit_heritage_desc', 'Update public craft identity & verified credentials')}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar Selector with Photo Upload */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold font-serif uppercase tracking-wider text-[#B5451B]">
                  {t('choose_portrait', 'Choose Artisan Portrait')}
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#B5451B] bg-[#B5451B]/10 hover:bg-[#B5451B]/20 px-2.5 py-1 rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                  <span>{t('upload_photo', 'Upload Photo')}</span>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="artisan-portrait-upload"
              />

              <div className="flex items-center gap-3">
                {/* Active Main Avatar Preview with edit badge */}
                <div className="relative shrink-0">
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#E8B84B] shadow-md shrink-0"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#B5451B] text-white flex items-center justify-center shadow-xs border border-white"
                    title="Upload Custom Photo"
                  >
                    <span className="material-symbols-outlined text-[13px]">add_a_photo</span>
                  </button>
                </div>

                {/* Avatar Presets & Custom Upload item */}
                <div className="flex-1 overflow-x-auto py-1 flex gap-2 no-scrollbar items-center">
                  {/* Upload button tile */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-11 h-11 rounded-full border-2 border-dashed flex flex-col items-center justify-center shrink-0 transition-all ${
                      isDark
                        ? 'border-[#E8B84B]/60 bg-[#121411] text-[#E8B84B] hover:bg-[#1C221A]'
                        : 'border-[#B5451B]/60 bg-white text-[#B5451B] hover:bg-[#FAF4EB]'
                    }`}
                    title="Upload from device"
                  >
                    <span className="material-symbols-outlined text-lg">upload</span>
                  </button>

                  {/* Custom uploaded photo tile if available */}
                  {customPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playTap();
                        setFormData({ ...formData, avatarUrl: customPhotoUrl });
                      }}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 shrink-0 transition-all ${
                        formData.avatarUrl === customPhotoUrl
                          ? 'border-[#B5451B] scale-105 shadow-md ring-2 ring-[#B5451B]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={customPhotoUrl}
                        alt="Your Uploaded Photo"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  )}

                  {/* Master presets */}
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        sound.playTap();
                        setFormData({ ...formData, avatarUrl: preset.url });
                      }}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 shrink-0 transition-all ${
                        formData.avatarUrl === preset.url
                          ? 'border-[#B5451B] scale-105 shadow-md ring-2 ring-[#B5451B]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">
                  {t('full_name', 'Artisan Full Name')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm font-serif focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-white'
                      : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                  }`}
                  placeholder="e.g. Ranjit Prajapati"
                />
              </div>

              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">
                  {t('trade_designation', 'Craft Title / Trade Designation')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-white'
                      : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                  }`}
                  placeholder="e.g. Master Clay Sculptor & Potter"
                />
              </div>
            </div>

            {/* Craft Category & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">
                  {t('craft_category_label', 'Craft Category')}
                </label>
                <select
                  value={formData.craft}
                  onChange={(e) => setFormData({ ...formData, craft: e.target.value })}
                  className={`w-full px-3 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-white'
                      : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                  }`}
                >
                  <option value="Terracotta & Heritage Pottery">Terracotta Pottery</option>
                  <option value="Banarasi Handloom Weaving">Handloom Weaving</option>
                  <option value="Channapatna Wooden Toys">Wood Sculpture</option>
                  <option value="Madhubani Folk Painting">Folk Painting</option>
                  <option value="Bidriware Metal Inlay">Metalwork & Inlay</option>
                  <option value="Pashmina Shawls & Embroidery">Textile & Zari</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">
                  {t('location_label', 'Location (City/State)')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-white'
                      : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                  }`}
                  placeholder="e.g. Varanasi, UP"
                />
              </div>
            </div>

            {/* Udyam Registration */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium opacity-80 mb-1">
                  {t('udyam_number', 'MSME Udyam Registration Number')}
                </label>
                <input
                  type="text"
                  value={formData.udyamNumber || ''}
                  onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] text-white'
                      : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                  }`}
                  placeholder="UDYAM-XX-00-0000000"
                />
              </div>
            </div>

            {/* Story Quote & Bio */}
            <div>
              <label className="block text-xs font-medium opacity-80 mb-1">
                {t('lineage_quote', 'Artisan Lineage Quote / Philosophy')}
              </label>
              <input
                type="text"
                value={formData.storyQuote}
                onChange={(e) => setFormData({ ...formData, storyQuote: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-serif italic focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-white'
                    : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                }`}
                placeholder="Every lump of earth holds a song..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium opacity-80 mb-1">
                {t('workshop_bio', 'Artisan Workshop Bio')}
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={`w-full px-3.5 py-2 rounded-2xl border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] resize-none ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-white'
                    : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                }`}
                placeholder="Describe your craft tradition..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playTap();
                  onClose();
                }}
                className={`flex-1 py-3 rounded-2xl font-serif text-xs font-bold border transition-colors ${
                  isDark
                    ? 'border-[#2D3A2B] hover:bg-white/5 text-white'
                    : 'border-[#22331E]/20 hover:bg-black/5 text-[#1A1815]'
                }`}
              >
                {t('cancel', 'Cancel')}
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#B5451B] hover:bg-[#9C3A14] text-white font-serif font-bold py-3 rounded-2xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">check</span>
                <span>{isSaving ? t('saving', 'Saving...') : t('save_changes', 'Save Changes')}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
