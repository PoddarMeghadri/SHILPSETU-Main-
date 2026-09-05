import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScreenId, LanguageCode } from '../../types';
import { sound } from '../../services/sound';
import { ShilpSetuLogo } from '../common/ShilpSetuLogo';
import { useTranslation } from '../../services/translations';

interface ShilpiVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onToggleTheme: () => void;
  currentLanguage: LanguageCode;
  isDark?: boolean;
}

interface CommandSuggestion {
  text: string;
  actionDesc: string;
  icon: string;
  action: () => void;
}

export const ShilpiVoiceModal: React.FC<ShilpiVoiceModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLanguageChange,
  onToggleTheme,
  currentLanguage,
  isDark = false,
}) => {
  const { t, language } = useTranslation();
  const effectiveLanguage = currentLanguage || language;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isSpeakingResponse, setIsSpeakingResponse] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');
  const fallbackIntervalRef = useRef<any>(null);

  // Command Suggestions in Indian context
  const suggestions: CommandSuggestion[] = [
    {
      text: currentLanguage === 'hi' ? 'एआई स्टूडियो खोलो' : 'Open AI Studio',
      actionDesc: 'Enhance craft photos to 4K',
      icon: 'photo_camera',
      action: () => {
        respondAndExecute('Opening AI Photo Studio for 4K craft enhancement.', 'studio');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'उचित मूल्य कैलकुलेटर' : 'Calculate Fair Price',
      actionDesc: 'Zero middleman craft pricing',
      icon: 'calculate',
      action: () => {
        respondAndExecute('Opening Fair Pricing algorithm.', 'pricing');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'नया शिल्प कैटलॉग करो' : 'Voice Catalog New Item',
      actionDesc: 'Speak craft specs in mother tongue',
      icon: 'mic',
      action: () => {
        respondAndExecute('Starting multilingual voice cataloger.', 'cataloger');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'आज की बिक्री और हिसाब' : "Show Today's Sales",
      actionDesc: 'Revenue & pending dispatches',
      icon: 'analytics',
      action: () => {
        respondAndExecute("Fetching today's workshop revenue and orders.", 'dashboard');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'सरकारी जेम टेंडर' : 'Check GeM B2B Tenders',
      actionDesc: 'Direct institutional orders',
      icon: 'gavel',
      action: () => {
        respondAndExecute('Opening GeM Portal & direct buyer inquiries.', 'b2b');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'व्हाट्सएप पर शेयर करो' : 'Social Marketing Kit',
      actionDesc: 'WhatsApp & Instagram posters',
      icon: 'share',
      action: () => {
        respondAndExecute('Generating Instagram & WhatsApp marketing kit.', 'social');
      },
    },
    {
      text: currentLanguage === 'hi' ? 'सूचनाएं और अलर्ट देखो' : 'Check Notifications & Alerts',
      actionDesc: 'Orders, tenders & studio alerts',
      icon: 'notifications',
      action: () => {
        respondAndExecute('Opening Notifications and Alerts tab.', 'notifications');
      },
    },
    {
      text: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      actionDesc: 'Change visual theme',
      icon: isDark ? 'light_mode' : 'dark_mode',
      action: () => {
        respondAndExecute('Toggling theme mode.', 'profile', () => onToggleTheme());
      },
    },
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const langMap: Partial<Record<LanguageCode, string>> = {
        hi: 'hi-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        gu: 'gu-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        or: 'or-IN',
        as: 'as-IN',
        ur: 'ur-IN',
        en: 'en-IN',
      };
      utterance.lang = langMap[currentLanguage] || 'en-IN';

      utterance.onstart = () => setIsSpeakingResponse(true);
      utterance.onend = () => setIsSpeakingResponse(false);
      utterance.onerror = () => setIsSpeakingResponse(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const respondAndExecute = (msg: string, screen?: ScreenId, extraAction?: () => void) => {
    setFeedbackMessage(msg);
    speakText(msg);
    sound.playSuccess();

    if (extraAction) extraAction();

    setTimeout(() => {
      if (screen) onNavigate(screen);
      onClose();
    }, 1100);
  };

  // Process freeform voice input query
  const processVoiceQuery = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('studio') || q.includes('photo') || q.includes('camera') || q.includes('lighting') || q.includes('फोटो')) {
      respondAndExecute('Opening AI Artisan Photo Studio.', 'studio');
    } else if (q.includes('catalog') || q.includes('item') || q.includes('naya') || q.includes('add') || q.includes('समान') || q.includes('कैटलॉग')) {
      respondAndExecute('Launching Voice Auto-Cataloger.', 'cataloger');
    } else if (q.includes('price') || q.includes('dam') || q.includes('bhav') || q.includes('margin') || q.includes('मूल्य') || q.includes('भाव')) {
      respondAndExecute('Opening Fair Price Calculator.', 'pricing');
    } else if (q.includes('gem') || q.includes('tender') || q.includes('bulk') || q.includes('b2b') || q.includes('order') || q.includes('सरकारी')) {
      respondAndExecute('Opening B2B and GeM Portal Gateway.', 'b2b');
    } else if (q.includes('sales') || q.includes('dashboard') || q.includes('income') || q.includes('revenue') || q.includes('hisab') || q.includes('बिक्री')) {
      respondAndExecute('Loading your business revenue insights.', 'dashboard');
    } else if (q.includes('instagram') || q.includes('whatsapp') || q.includes('facebook') || q.includes('social') || q.includes('share') || q.includes('शेयर')) {
      respondAndExecute('Opening 1-Click Social Marketing Kit.', 'social');
    } else if (q.includes('story') || q.includes('lineage') || q.includes('kahani') || q.includes('virasat') || q.includes('कहानी')) {
      respondAndExecute('Opening Heritage Story Builder.', 'story');
    } else if (q.includes('notification') || q.includes('alert') || q.includes('soochana') || q.includes('suchana') || q.includes('सूचना') || q.includes('বিজ্ঞপ্তি') || q.includes('அறிவிப்பு')) {
      respondAndExecute('Opening Notifications and Alerts.', 'notifications');
    } else if (q.includes('dark') || q.includes('light') || q.includes('theme') || q.includes('मोड')) {
      respondAndExecute('Toggling display theme.', undefined, () => onToggleTheme());
    } else if (q.includes('hindi') || q.includes('हिंदी')) {
      onLanguageChange('hi');
      respondAndExecute('भाषा बदलकर हिंदी कर दी गई है।');
    } else if (q.includes('english') || q.includes('अंग्रेजी')) {
      onLanguageChange('en');
      respondAndExecute('Language switched to English.');
    } else if (q.includes('bengali') || q.includes('বাংলা')) {
      onLanguageChange('bn');
      respondAndExecute('ভাষা পরিবর্তন করে বাংলা করা হয়েছে।');
    } else {
      respondAndExecute(`I understood: "${query}". Navigating to Artisan Workshop.`, 'profile');
    }
  };

  const stopListeningAndProcess = () => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }

    setIsListening(false);
    const captured = transcriptRef.current.trim();
    if (captured) {
      processVoiceQuery(captured);
    }
  };

  const startListening = () => {
    if (fallbackIntervalRef.current) {
      clearInterval(fallbackIntervalRef.current);
      fallbackIntervalRef.current = null;
    }

    sound.playVoiceStart();
    setIsListening(true);
    setTranscript('');
    transcriptRef.current = '';
    setFeedbackMessage('Listening...');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;

        const langMap: Partial<Record<LanguageCode, string>> = {
          hi: 'hi-IN',
          bn: 'bn-IN',
          ta: 'ta-IN',
          te: 'te-IN',
          mr: 'mr-IN',
          gu: 'gu-IN',
          kn: 'kn-IN',
          ml: 'ml-IN',
          pa: 'pa-IN',
          or: 'or-IN',
          as: 'as-IN',
          ur: 'ur-IN',
          en: 'en-IN',
        };
        recognition.lang = langMap[currentLanguage] || 'en-IN';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          const cleaned = currentText.trim();
          if (cleaned) {
            transcriptRef.current = cleaned;
            setTranscript(cleaned);
          }
        };

        recognition.onerror = () => {
          // Keep listening or fallback gracefully
        };

        recognition.onend = () => {
          setIsListening(false);
          const captured = transcriptRef.current.trim();
          if (captured) {
            processVoiceQuery(captured);
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.error(err);
      }
    }

    // Fallback simulation only if browser speech recognition is completely unsupported
    const samplePhrases = [
      currentLanguage === 'hi' ? 'एआई स्टूडियो खोलो' : 'Open AI Studio',
      currentLanguage === 'hi' ? 'आज का हिसाब दिखाओ' : "Show today's sales",
      currentLanguage === 'hi' ? 'उचित मूल्य निकालो' : 'Calculate fair price',
      currentLanguage === 'hi' ? 'जेम ऑर्डर चेक करो' : 'Check GeM bulk tenders',
    ];
    const picked = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];

    let currentChars = '';
    let index = 0;
    fallbackIntervalRef.current = setInterval(() => {
      if (index < picked.length) {
        currentChars += picked[index];
        transcriptRef.current = currentChars;
        setTranscript(currentChars);
        index++;
      } else {
        if (fallbackIntervalRef.current) {
          clearInterval(fallbackIntervalRef.current);
          fallbackIntervalRef.current = null;
        }
        setTimeout(() => {
          setIsListening(false);
          processVoiceQuery(picked);
        }, 500);
      }
    }, 60);
  };

  useEffect(() => {
    if (isOpen) {
      startListening();
    } else {
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current);
        fallbackIntervalRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsListening(false);
      setTranscript('');
      transcriptRef.current = '';
      setFeedbackMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border relative overflow-hidden ${
            isDark
              ? 'bg-[#1C221A] text-[#F4ECDE] border-[#2D3A2B]'
              : 'bg-[#F4ECDE] text-[#1A1815] border-[#22331E]/15'
          }`}
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#E8B84B]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#B5451B]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors z-20"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          {/* Assistant Header */}
          <div className="flex items-center gap-3 mb-5">
            <ShilpSetuLogo size="sm" isDark={isDark} />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-lg text-[#B5451B]">
                  SHILPI AI
                </h3>
                <span className="px-2 py-0.5 bg-[#E8B84B]/20 text-[#B5451B] border border-[#E8B84B]/40 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Voice Assistant
                </span>
              </div>
              <p className="text-xs opacity-75 font-serif">
                {t('shilpi_tagline', 'Artisan Multilingual Assistant')}
              </p>
            </div>
          </div>

          {/* Live Waveform & Pulsing Mic Circle */}
          <div className="my-6 text-center space-y-4">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              {/* Outer pulsing ripples */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-[#E8B84B] animate-ping opacity-40" />
                  <div className="absolute -inset-2 rounded-full border border-[#B5451B] animate-pulse opacity-30" />
                </>
              )}

              <button
                onClick={() => {
                  if (isListening) {
                    stopListeningAndProcess();
                  } else {
                    startListening();
                  }
                }}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isListening
                    ? 'bg-[#B5451B] text-white scale-105'
                    : 'bg-[#22331E] text-[#E8B84B] hover:scale-105 active:scale-95'
                }`}
                title={isListening ? 'Tap to process command' : 'Tap to start listening'}
              >
                <span className="material-symbols-outlined text-4xl">
                  {isListening ? 'graphic_eq' : 'mic'}
                </span>
              </button>
            </div>

            {/* Waveform visualizer bars */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 h-8">
                {[12, 24, 32, 16, 28, 20, 36, 14, 22].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#B5451B] rounded-full wave-bar"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Transcript / Feedback */}
            <div className="min-h-[44px] flex flex-col items-center justify-center px-4">
              {transcript ? (
                <p className="font-serif text-sm font-semibold italic text-[#B5451B]">
                  "{transcript}"
                </p>
              ) : (
                <p className="text-xs opacity-75 font-sans">
                  {isListening
                    ? t('listening', 'Listening to your command...')
                    : t('speak_hint', 'Tap mic or select a quick voice command below')}
                </p>
              )}

              {feedbackMessage && (
                <p className="text-xs text-[#2E4638] font-bold mt-1 animate-fade-in">
                  ✓ {feedbackMessage}
                </p>
              )}
            </div>
          </div>

          {/* Quick Voice Command Chips */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B5451B]">
              Quick Commands:
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto no-scrollbar">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playTap();
                    item.action();
                  }}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                    isDark
                      ? 'bg-[#121411] border-[#2D3A2B] hover:bg-[#222720]'
                      : 'bg-white border-[#22331E]/10 hover:bg-[#EFE4CF]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#B5451B]">
                    {item.icon}
                  </span>
                  <div className="truncate">
                    <p className="font-serif font-bold text-xs truncate">
                      {item.text}
                    </p>
                    <p className="text-[10px] opacity-65 truncate">
                      {item.actionDesc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
