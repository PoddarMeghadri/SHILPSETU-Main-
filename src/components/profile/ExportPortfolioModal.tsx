import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ArtisanProfile, ProductItem } from '../../types';
import { sound } from '../../services/sound';
import { ShilpSetuLogo } from '../common/ShilpSetuLogo';
import { BlueVerifiedBadge } from '../common/SocialIcons';
import { useTranslation } from '../../services/translations';

interface ExportPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisan: ArtisanProfile;
  products: ProductItem[];
  isDark?: boolean;
}

export const ExportPortfolioModal: React.FC<ExportPortfolioModalProps> = ({
  isOpen,
  onClose,
  artisan,
  products,
  isDark = false,
}) => {
  const { t } = useTranslation();
  const documentRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const artisanSlug = artisan.name.toLowerCase().replace(/\s+/g, '-');
  const verificationUrl = `https://shilpsetu.org/verify/${artisanSlug}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPDF = async () => {
    if (!documentRef.current || isGenerating) return;
    try {
      sound.playTap();
      setIsGenerating(true);

      const canvas = await html2canvas(documentRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ShilpSetu_Heritage_Portfolio_${artisan.name.replace(/\s+/g, '_')}.pdf`);

      sound.playSuccess();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    sound.playTap();
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className={`w-full max-w-2xl rounded-3xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden ${
            isDark ? 'bg-[#1C221A] border-[#2D3A2B] text-[#F4ECDE]' : 'bg-[#FDFBF7] border-[#22331E]/20 text-[#1A1815]'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-current/10 flex items-center justify-between shrink-0 bg-black/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#B5451B]">picture_as_pdf</span>
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#B5451B]">
                  {t('export_portfolio_pdf', "Export Artisan Portfolio & Heritage (PDF)")}
                </h3>
                <p className="text-[11px] opacity-75">
                  {t('export_portfolio_desc', 'Download official verifiable portfolio for exhibitions, grants & buyers')}
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
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          {/* Scrollable Printable Document Preview */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-neutral-100 dark:bg-black/40">
            {/* The printable A4 Sheet Canvas */}
            <div
              ref={documentRef}
              id="printable-portfolio"
              className="bg-white text-[#1A1815] p-6 sm:p-8 rounded-xl shadow-lg border border-neutral-300 max-w-xl mx-auto space-y-6"
            >
              {/* Document Letterhead */}
              <div className="flex items-center justify-between border-b-2 border-[#B5451B]/40 pb-4">
                <div className="flex items-center gap-3">
                  <ShilpSetuLogo size="md" />
                  <div>
                    <h1 className="font-serif font-black text-xl text-[#B5451B] tracking-wider leading-none">
                      SHILPSETU
                    </h1>
                    <p className="text-[9px] uppercase tracking-widest text-[#22331E] font-semibold mt-1">
                      National Heritage Craft Repository & GeM Direct Bridge
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] text-neutral-600 font-sans">
                  <p className="font-mono font-bold text-[#B5451B]">DOC-ID: SHILP-{artisan.id.toUpperCase()}</p>
                  <p>{currentDate}</p>
                </div>
              </div>

              {/* Artisan Profile Hero */}
              <div className="flex items-center gap-4 bg-[#FBF7F0] p-4 rounded-2xl border border-[#E8B84B]/30">
                <div className="relative shrink-0">
                  <img
                    src={artisan.avatarUrl}
                    alt={artisan.name}
                    crossOrigin="anonymous"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#E8B84B] shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                    <BlueVerifiedBadge size={18} />
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-bold text-lg text-[#22331E]">
                      {artisan.name}
                    </h2>
                    <span className="bg-[#2E4638] text-[#E8B84B] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Blue Verified
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#B5451B]">
                    {artisan.craft} • {artisan.location}
                  </p>
                  <p className="text-[11px] text-neutral-600 font-mono">
                    MSME Udyam: {artisan.udyamNumber || 'UDYAM-RJ-14-0028911'}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] font-sans font-medium text-neutral-700 pt-0.5">
                    <span>★ Trust Score: {artisan.trustScore ?? 98}/100</span>
                    <span>• {artisan.experienceYears || '28'} Years Mastery</span>
                  </div>
                </div>
              </div>

              {/* Ancestral Heritage Story Section */}
              <div className="space-y-2 border-l-3 border-[#B5451B] pl-3 py-1">
                <h3 className="font-serif font-bold text-sm text-[#B5451B] uppercase tracking-wider">
                  Heritage Lineage & Craft Philosophy
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed font-serif italic">
                  "{artisan.bio || 'Preserving four generations of ancestral handcrafted terracotta pottery and clay sculptures, honoring sacred soil and pure traditional wood kiln firing techniques.'}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md font-sans">
                    🌱 100% Organic Local Clay
                  </span>
                  <span className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md font-sans">
                    🔥 Traditional Wood-Fired Kiln
                  </span>
                  <span className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-md font-sans">
                    🇮🇳 GI Geographic Indication
                  </span>
                </div>
              </div>

              {/* Masterpiece Portfolio Catalog */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                  <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#22331E]">
                    Curated Masterpiece Catalog ({products.length} Authenticated Pieces)
                  </h3>
                  <span className="text-[10px] font-mono text-[#B5451B]">GeM Institutional Direct</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {products.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="border border-neutral-200 rounded-xl p-2.5 flex items-start gap-2.5 bg-neutral-50"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        crossOrigin="anonymous"
                        className="w-14 h-14 rounded-lg object-cover border border-neutral-300 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-serif font-bold text-xs text-neutral-900 truncate">
                          {p.title}
                        </h4>
                        <p className="text-[10px] text-neutral-500 font-sans truncate">
                          {p.category}
                        </p>
                        <p className="text-xs font-bold text-[#B5451B] font-mono">
                          ₹{p.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-[9px] text-emerald-800 font-semibold font-sans">
                          ✓ Verified Handcrafted
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official Digital Seal & Verifiable QR */}
              <div className="pt-2 border-t-2 border-dashed border-neutral-300 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B]">
                    Digital Heritage Verification
                  </p>
                  <p className="text-[10px] text-neutral-600 max-w-[260px] leading-tight font-sans">
                    Scan this QR code to view live audio lineage recordings, 4K studio views, and verify the blockchain-backed craft certificate.
                  </p>
                  <p className="text-[9px] font-mono text-neutral-400">
                    URL: {verificationUrl}
                  </p>
                </div>

                <div className="flex flex-col items-center p-2 bg-white rounded-xl border border-neutral-300 shadow-xs shrink-0">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={68}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="text-[8px] font-bold text-[#B5451B] tracking-wider mt-1 uppercase">
                    Scan to Verify
                  </span>
                </div>
              </div>

              {/* Footer Declaration */}
              <div className="text-center text-[9px] text-neutral-400 font-sans pt-1">
                Certified by ShilpSetu Indigenous Artisan Trust in compliance with MSME & National Handicrafts Council.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-current/10 bg-black/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs">
              {downloadSuccess ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  {t('portfolio_exported_success', 'Artisan Portfolio PDF Exported!')}
                </span>
              ) : (
                <span className="opacity-75 text-[11px]">
                  Format: High-Res A4 Printable Document
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                  isDark ? 'border-[#2D3A2B] hover:bg-[#252E22]' : 'border-[#22331E]/20 hover:bg-[#FAF4E8]'
                }`}
              >
                <span className="material-symbols-outlined text-base">print</span>
                <span>Print Document</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-4 py-2 bg-[#B5451B] hover:bg-[#9C3A14] text-white text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base">
                  {isGenerating ? 'sync' : 'download'}
                </span>
                <span>
                  {isGenerating
                    ? t('generating_pdf', 'Generating Portfolio PDF...')
                    : t('download_pdf', 'Download PDF Document')}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
