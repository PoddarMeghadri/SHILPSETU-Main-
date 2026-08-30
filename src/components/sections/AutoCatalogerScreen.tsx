import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductItem, LanguageCode, ScreenId } from '../../types';
import { LANGUAGES } from '../../data/mockData';
import { sound } from '../../services/sound';
import { SuccessModal } from '../common/SuccessModal';
import { useTranslation } from '../../services/translations';

interface AutoCatalogerProps {
  products: ProductItem[];
  onAddProduct: (newProduct: ProductItem) => void;
  onNavigate: (screen: ScreenId) => void;
  language?: LanguageCode;
  isDark?: boolean;
}

interface SampleVoicePrompt {
  lang: LanguageCode;
  nativeTranscript: string;
  englishTitle: string;
  englishDesc: string;
  category: string;
  materials: string[];
  suggestedPrice: number;
}

const SPEECH_LANG_MAP: Partial<Record<LanguageCode, string>> = {
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  en: 'en-IN',
};

const SAMPLE_TRANSCRIPTS: Partial<Record<LanguageCode, SampleVoicePrompt>> = {
  hi: {
    lang: 'hi',
    nativeTranscript:
      'यह लाल मिट्टी का कलश और सुराही है, जिसे हमने गंगा की बालू और नदी की चिकनी मिट्टी मिलाकर चाक पर गढ़ा है। इस पर सरसों के तेल की मालिश करके धीमी लकड़ी की भट्टी में पकाया गया है।',
    englishTitle: 'Handcrafted Terracotta Ganga Riverbed Earthenware Urn',
    englishDesc:
      'Masterfully hand-thrown on a traditional stone wheel using rich alluvial clay from the Ganges basin. Burnished with river pebbles and wood-fired to achieve a rich natural terracotta patina that naturally cools water.',
    category: 'Pottery & Earthenware',
    materials: ['Alluvial Riverbed Clay', 'Natural River Silt', 'Organic Mustard Oil Polish'],
    suggestedPrice: 1250,
  },
  bn: {
    lang: 'bn',
    nativeTranscript:
      'এটি একটি হস্তনির্মিত পোড়ামাটির পুতুল ও ফুলদানি। লাল মাটি ও নদীর পলি দিয়ে তৈরি, নিখুঁত খোদাই করা হয়েছে এবং কাঠের আগুনে পোড়ানো হয়েছে।',
    englishTitle: 'Artisanal Bankura Terracotta Floral Vase & Figurine',
    englishDesc:
      'Authentic Bengal terracotta crafted with pure red earth and fine river silt. Features intricate chiseled floral filigree inspired by ancient Bishnupur temple architecture.',
    category: 'Terracotta Craft',
    materials: ['Red Clay Earth', 'Organic Mineral Wash', 'Wood Ash Glaze'],
    suggestedPrice: 1100,
  },
  ta: {
    lang: 'ta',
    nativeTranscript:
      'இது பாரம்பரிய சுடுமண் கலசம் மற்றும் அலங்கார பாத்திரம். ஆற்று களிமண் கொண்டு சக்கரத்தால் உருவாக்கப்பட்டு மரச் சூளையில் சுடப்பட்டது.',
    englishTitle: 'Traditional Tamil Nadu Terracotta Heritage Urli & Pot',
    englishDesc:
      'Hand-molded traditional earthenware vessel crafted using heritage riverbed clay. Perfect for festive floating flower displays and sustainable home décor.',
    category: 'Heritage Pottery',
    materials: ['Riverbed Silt', 'Natural Earth Clay', 'Herbal Polish'],
    suggestedPrice: 1350,
  },
  mr: {
    lang: 'mr',
    nativeTranscript:
      'हा पारंपरिक लाल मातीचा कलश आहे. चाकावर हाताने घडवलेला आणि लाकडाच्या मंद भट्टीत भाजलेला आहे.',
    englishTitle: 'Heritage Handcrafted Red Clay Kumbha & Planter',
    englishDesc:
      'Authentic earthenware pot wheel-thrown with natural organic clay and fired in wood kilns for timeless strength and rustic charm.',
    category: 'Pottery',
    materials: ['Natural Red Clay', 'River Sand', 'Organic Glaze'],
    suggestedPrice: 950,
  },
  te: {
    lang: 'te',
    nativeTranscript:
      'ఇది సంప్రదాయ ఎర్రమట్టి కుండ. నది ఒండ్రు మట్టితో చేతితో చక్రంపై తయారుచేయబడి సహజమైన పొయ్యిలో కాల్చబడింది.',
    englishTitle: 'Artisanal Terracotta Water Cooler & Planter Vessel',
    englishDesc:
      'Handcrafted on a stone potter wheel using natural river clay. Designed for optimal evaporative cooling and earthy rustic aesthetics.',
    category: 'Terracotta',
    materials: ['Alluvial Clay', 'Natural River Soil'],
    suggestedPrice: 1050,
  },
  gu: {
    lang: 'gu',
    nativeTranscript:
      'આ લાલ માટીનો કલાત્મક ઘડો છે. નદીની માટીમાંથી ચાકડા પર હાથેથી બનાવીને દેશી ભઠ્ઠીમાં પકવેલો છે.',
    englishTitle: 'Handcrafted Kutch Terracotta Hand-Painted Urn',
    englishDesc:
      'Hand-thrown terracotta pot with subtle artisan carvings made using sustainable riverbed clay and fired in traditional pit kilns.',
    category: 'Pottery',
    materials: ['Natural Clay', 'Earth Pigments'],
    suggestedPrice: 1150,
  },
  kn: {
    lang: 'kn',
    nativeTranscript:
      'ಇದು ಸಾಂಪ್ರದಾಯಿಕ ಮಣ್ಣಿನ ಕುಡಿಕೆ ಮತ್ತು ಹೂದಾನಿ. ನದಿಯ ಮೆಕ್ಕಲು ಮಣ್ಣಿನಿಂದ ಚಕ್ರದ ಮೇಲೆ ಕೈಯಿಂದ ತಯಾರಿಸಿ ಮರದ ಬೆಂಕಿಯಲ್ಲಿ ಸುಡಲಾಗಿದೆ.',
    englishTitle: 'Traditional Karnataka Terracotta Handcrafted Planter',
    englishDesc:
      'Handcrafted on a stone potter wheel using natural river clay. Durable and eco-friendly home decor item.',
    category: 'Pottery & Ceramics',
    materials: ['River Clay', 'Natural Mineral Polish'],
    suggestedPrice: 1180,
  },
  ml: {
    lang: 'ml',
    nativeTranscript:
      'ഇത് പരമ്പരാഗത കളിമൺ പാത്രവും പൂപ്പാത്രവുമാണ്. പുഴയിലെ കളിമണ്ണിൽ ചക്രത്തിൽ കൈകൊണ്ട് നിർമ്മിച്ച് വിറക് അടുപ്പിൽ ചുട്ടെടുത്തത്.',
    englishTitle: 'Heritage Kerala Hand-Molded Terracotta Urli & Pot',
    englishDesc:
      'Authentic Kerala earthenware crafted with pure riverbed clay, sun-dried and kiln-fired for natural cool storage.',
    category: 'Pottery & Ceramics',
    materials: ['Natural River Clay', 'Herbal Finish'],
    suggestedPrice: 1280,
  },
  pa: {
    lang: 'pa',
    nativeTranscript:
      'ਇਹ ਹੱਥ ਨਾਲ ਬਣਿਆ ਲਾਲ ਮਿੱਟੀ ਦਾ ਘੜਾ ਅਤੇ ਫੁੱਲਦਾਨ ਹੈ, ਜੋ ਕੁਦਰਤੀ ਮਿੱਟੀ ਨਾਲ ਚੱਕ ਉੱਤੇ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।',
    englishTitle: 'Artisanal Hand-Thrown Terracotta Punjabi Matka',
    englishDesc:
      'Handmade terracotta matka vessel wheel-thrown with pure river silt and kiln fired for cooling water naturally.',
    category: 'Pottery',
    materials: ['River Silt Clay', 'Organic Wash'],
    suggestedPrice: 1020,
  },
  or: {
    lang: 'or',
    nativeTranscript:
      'ଏହା ପାରମ୍ପରିକ ମାଟିର ପାତ୍ର ଏବଂ କଳସ, ଯାହା ନଦୀର ଚିକ୍କଣ ମାଟିରେ ଚକରେ ହାତରେ ତିଆରି ହୋଇ କାଠ ନିଆଁରେ ପୋଡାଯାଇଛି।',
    englishTitle: 'Handcrafted Odisha Earthenware Heritage Urn',
    englishDesc:
      'Masterfully hand-thrown on a traditional wheel using rich alluvial clay from Odisha riverbeds.',
    category: 'Pottery & Earthenware',
    materials: ['Alluvial Clay', 'Natural Polish'],
    suggestedPrice: 1120,
  },
  as: {
    lang: 'as',
    nativeTranscript:
      'এইটো ব্ৰহ্মপুত্ৰৰ পলি মাটিৰে হাতেৰে তৈয়াৰ কৰা পোৰামাটিৰ পাত্ৰ আৰু ফুলদানি, যিটো কাঠৰ জুয়েৰে পুৰি মজবুত কৰা হৈছে।',
    englishTitle: 'Handcrafted Assam Terracotta Earthenware Vase',
    englishDesc:
      'Authentic Assam terracotta crafted with rich alluvial soil from the Brahmaputra basin.',
    category: 'Terracotta Craft',
    materials: ['Riverbed Clay', 'Wood Ash Finish'],
    suggestedPrice: 1150,
  },
  ur: {
    lang: 'ur',
    nativeTranscript:
      'یہ سرخ مٹی کا روایتی صراحی اور گلدان ہے جسے ندی کی مٹی سے چاک پر ہاتھ سے تراشا گیا ہے اور دھیمی آنچ پر پکایا گیا ہے۔',
    englishTitle: 'Artisanal Hand-Crafted Red Terracotta Surahi & Urn',
    englishDesc:
      'Authentic handcrafted earthenware shaped on a stone wheel, polished with river stones and kiln-fired.',
    category: 'Pottery & Ceramics',
    materials: ['Red Alluvial Clay', 'Natural Polish'],
    suggestedPrice: 1200,
  },
  en: {
    lang: 'en',
    nativeTranscript:
      'This is a hand-thrown red clay terracotta vase crafted from local riverbed clay and wood-fired in an open kiln with organic oil polish.',
    englishTitle: 'Artisan Hand-Thrown Red Terracotta Urli Vase',
    englishDesc:
      'Authentic handcrafted earthenware vase shaped on a stone wheel, polished with river stones and fired in wood kilns for rustic durability.',
    category: 'Pottery & Ceramics',
    materials: ['Red Alluvial Clay', 'River Sand', 'Mustard Oil Wash'],
    suggestedPrice: 1200,
  },
};

export const AutoCatalogerScreen: React.FC<AutoCatalogerProps> = ({
  onAddProduct,
  language = 'hi',
  isDark = false,
}) => {
  const { t } = useTranslation(language);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(language);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Sync selectedLang with active global language
  useEffect(() => {
    setSelectedLang(language);
  }, [language]);

  const currentSample = SAMPLE_TRANSCRIPTS[selectedLang] || SAMPLE_TRANSCRIPTS.hi;
  const [spokenTranscript, setSpokenTranscript] = useState<string>(currentSample.nativeTranscript);
  const [isLiveSpeech, setIsLiveSpeech] = useState<boolean>(false);

  // Editable Form Fields
  const [title, setTitle] = useState<string>(currentSample.englishTitle);
  const [description, setDescription] = useState<string>(currentSample.englishDesc);
  const [category, setCategory] = useState<string>(currentSample.category);
  const [price, setPrice] = useState<number>(currentSample.suggestedPrice);
  const [materials, setMaterials] = useState<string>(currentSample.materials.join(', '));
  const [hoursWorked, setHoursWorked] = useState<number>(5);
  const [materialCost, setMaterialCost] = useState<number>(140);

  // Speech Recognition Reference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // When speaking language changes, update sample prompt if no custom speech recorded
  const handleLanguageChange = (langCode: LanguageCode) => {
    sound.playTap();
    setSelectedLang(langCode);
    const newPrompt = SAMPLE_TRANSCRIPTS[langCode] || SAMPLE_TRANSCRIPTS.hi;
    setSpokenTranscript(newPrompt.nativeTranscript);
    setTitle(newPrompt.englishTitle);
    setDescription(newPrompt.englishDesc);
    setCategory(newPrompt.category);
    setPrice(newPrompt.suggestedPrice);
    setMaterials(newPrompt.materials.join(', '));
    setIsLiveSpeech(false);
  };

  const handleStartVoice = () => {
    sound.playMicStart();
    setIsRecording(true);
    setIsLiveSpeech(false);

    // Initialize Web Speech API if supported in browser
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    let speechCapturedText = '';

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.lang = SPEECH_LANG_MAP[selectedLang] || 'hi-IN';
        recognition.continuous = true;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          if (currentTranscript.trim()) {
            speechCapturedText = currentTranscript.trim();
            setSpokenTranscript(speechCapturedText);
            setIsLiveSpeech(true);
          }
        };

        recognition.onerror = () => {
          // Graceful fallback to rich native speech prompt
        };

        recognition.start();
      } catch (err) {
        console.warn('Speech recognition not available:', err);
      }
    }

    // Record for 3.5s or until manually stopped
    setTimeout(() => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      setIsRecording(false);
      setIsTranslating(true);

      setTimeout(() => {
        setIsTranslating(false);

        // If user spoke live words, reflect them clearly in the generated listing
        if (speechCapturedText && speechCapturedText.length > 5) {
          setTitle(`Artisanal Handcrafted ${category} (${speechCapturedText.slice(0, 30)}...)`);
          setDescription(
            `Masterfully handcrafted following authentic artisan traditions: "${speechCapturedText}". Natural materials and traditional wood-fire finishing.`
          );
        } else {
          const prompt = SAMPLE_TRANSCRIPTS[selectedLang] || SAMPLE_TRANSCRIPTS.hi;
          setTitle(prompt.englishTitle);
          setDescription(prompt.englishDesc);
          setCategory(prompt.category);
          setPrice(prompt.suggestedPrice);
          setMaterials(prompt.materials.join(', '));
        }

        sound.playSuccess();
      }, 1400);
    }, 3600);
  };

  const handlePublish = () => {
    sound.playTap();
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      title,
      description,
      category,
      price,
      materialCost,
      hoursWorked,
      stock: 12,
      rawImageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
      polishedImageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
      materials: materials.split(',').map((m) => m.trim()),
      status: 'live',
      dateAdded: 'Just now',
      gemSyncStatus: 'synced',
    };

    onAddProduct(newProd);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen pb-28 pt-2 px-4 max-w-md mx-auto space-y-5">
      {/* Top Banner / Explainer */}
      <div
        className={`rounded-3xl p-4 border flex items-center gap-3 shadow-xs ${
          isDark
            ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
            : 'bg-[#EFE4CF] text-[#22331E] border-[#22331E]/10'
        }`}
      >
        <div className="w-10 h-10 rounded-2xl bg-[#B5451B] text-white flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-xl">translate</span>
        </div>
        <div>
          <h3 className="font-serif font-bold text-sm">
            {t('speak_mother_tongue', 'Speak in Your Mother Tongue')}
          </h3>
          <p className="text-[11px] opacity-75 font-sans leading-tight mt-0.5">
            {t(
              'speak_mother_tongue_sub',
              'AI instantly translates your speech into polished SEO listings ready for GeM & global buyers.'
            )}
          </p>
        </div>
      </div>

      {/* Language Selector Pills */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#B5451B] block">
          {t('select_speaking_lang', 'Select Speaking Language:')}
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-sans font-medium shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#B5451B] text-white font-semibold shadow-xs'
                    : isDark
                    ? 'bg-[#1C221A] text-[#F4ECDE] hover:bg-[#252E22] border border-[#2D3A2B]'
                    : 'bg-[#EFE4CF] text-[#1A1815] hover:bg-[#EAE0CC]'
                }`}
              >
                <span>{lang.nativeLabel}</span>
                <span className="text-[10px] opacity-70 ml-1 font-normal">({lang.label})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Circular Microphone Card */}
      <div
        className={`rounded-3xl p-6 text-center relative overflow-hidden border shadow-2xl ${
          isDark
            ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
            : 'bg-[#22331E] text-[#F4ECDE] border-[#E8B84B]/30'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8B84B]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <p className="text-xs uppercase tracking-widest text-[#E8B84B] font-semibold">
            {isRecording
              ? t('recording_dialect', 'Listening to your voice...')
              : isTranslating
              ? t('analyzing_voice', 'Translating to English SEO...')
              : t('tap_to_record_craft', 'Tap to Record Craft Details')}
          </p>

          {/* Concentric Pulsing Mic Button */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-[#E8B84B] animate-ping opacity-50" />
                <div className="absolute -inset-3 rounded-full border border-[#B5451B] animate-pulse opacity-40" />
              </>
            )}

            <button
              onClick={handleStartVoice}
              disabled={isRecording || isTranslating}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-artisan ${
                isRecording
                  ? 'bg-[#B5451B] text-white scale-105'
                  : 'bg-[#E8B84B] hover:bg-[#D4A33B] text-[#1A1815] active:scale-90'
              }`}
            >
              <span className="material-symbols-outlined text-4xl">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
            </button>
          </div>

          {/* Animated Waveform Visualizer */}
          {isRecording && (
            <div className="flex items-center justify-center gap-1 h-8">
              {[12, 28, 16, 32, 22, 14, 30, 18, 26, 12].map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#E8B84B] rounded-full wave-bar"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: `${height}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Spoken Native Script Transcript Preview */}
          <div className="p-3.5 bg-black/40 rounded-2xl border border-white/10 text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#E8B84B] uppercase tracking-wider font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">record_voice_over</span>
                {t('spoken_transcript', 'Spoken Transcript')} (
                {LANGUAGES.find((l) => l.code === selectedLang)?.nativeLabel}):
              </span>
              {isLiveSpeech && (
                <span className="text-[9px] bg-[#B5451B] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                  {t('live_speech_detected', 'Live Voice')}
                </span>
              )}
            </div>
            <p className="font-serif italic text-sm text-white/95 leading-relaxed">
              "{spokenTranscript}"
            </p>
          </div>
        </div>
      </div>

      {/* Generated English SEO Listing Card */}
      <div
        className={`rounded-3xl p-5 border shadow-xs space-y-4 ${
          isDark
            ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
            : 'bg-[#EFE4CF] text-[#22331E] border-[#22331E]/10'
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#22331E]/10">
          <h4 className="font-serif font-bold text-base flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg text-[#B5451B]">verified</span>
            {t('ai_generated_listing', 'AI Generated Listing')}
          </h4>
          <span className="px-2.5 py-0.5 bg-[#22331E]/10 text-[#22331E] dark:text-[#E8B84B] dark:bg-[#E8B84B]/10 text-[10px] font-bold uppercase rounded-full border border-[#22331E]/20">
            {t('seo_optimized', 'SEO Optimized')}
          </span>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
              {t('craft_title', 'Craft Title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-sm font-serif focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                isDark
                  ? 'bg-[#121411] border-[#2D3A2B] text-white'
                  : 'bg-white border-[#22331E]/20 text-[#1A1815]'
              }`}
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
                {t('craft_category', 'Category')}
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-white'
                    : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
                {t('calculated_fair_price', 'Fair Price (₹)')}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-[#FFEBB3]'
                    : 'bg-white border-[#22331E]/20 text-[#22331E]'
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
              {t('craft_description', 'Story & Description')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-2xl border text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] resize-none ${
                isDark
                  ? 'bg-[#121411] border-[#2D3A2B] text-white'
                  : 'bg-white border-[#22331E]/20 text-[#1A1815]'
              }`}
            />
          </div>

          {/* Materials Used */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
              {t('materials_used', 'Materials Used')}
            </label>
            <input
              type="text"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                isDark
                  ? 'bg-[#121411] border-[#2D3A2B] text-white'
                  : 'bg-white border-[#22331E]/20 text-[#1A1815]'
              }`}
            />
          </div>

          {/* Hours of Work & Material Cost */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
                {t('hours_worked', 'Hours Worked')}
              </label>
              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-white'
                    : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                }`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#B5451B] block mb-1">
                {t('material_cost', 'Material Cost (₹)')}
              </label>
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(Number(e.target.value))}
                className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-[#B5451B] ${
                  isDark
                    ? 'bg-[#121411] border-[#2D3A2B] text-white'
                    : 'bg-white border-[#22331E]/20 text-[#1A1815]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          className="w-full bg-[#B5451B] hover:bg-[#9C3A14] text-white font-serif font-bold py-3.5 rounded-2xl text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span className="material-symbols-outlined text-xl">cloud_upload</span>
          <span>{t('publish_craft', 'Publish to GeM & Storefront')}</span>
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={t('listing_published_success', 'Product Published Successfully!')}
        subtitle={t('listing_published_sub', 'Your listing is now live on GeM and your digital storefront.')}
        actionLabel={t('done', 'Done')}
        onAction={() => setShowSuccess(false)}
        isDark={isDark}
      />
    </div>
  );
};
