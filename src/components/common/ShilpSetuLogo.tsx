import React from 'react';

interface ShilpSetuLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  withTagline?: boolean;
  className?: string;
  isDark?: boolean;
}

export const ShilpSetuLogo: React.FC<ShilpSetuLogoProps> = ({
  size = 'md',
  withText = false,
  withTagline = false,
  className = '',
  isDark = false,
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official ShilpSetu Circular Emblem */}
      <div
        className={`${sizeMap[size]} shrink-0 rounded-full relative p-0.5 shadow-md flex items-center justify-center overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #FAF4E8 0%, #F4ECDE 100%)',
          border: '1.5px solid #E8B84B',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Outer Mandala Ring */}
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="#E8B84B"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            opacity="0.6"
          />

          {/* Golden Bird at Top Apex */}
          <path
            d="M 57 20 Q 60 14, 65 17 Q 69 19, 64 23 Q 61 24, 57 20 Z"
            fill="#D49E35"
          />
          <path
            d="M 64 18 Q 70 17, 72 20 Q 68 22, 64 21 Z"
            fill="#E8B84B"
          />
          <circle cx="60" cy="18" r="1" fill="#FFFFFF" />

          {/* Left Artisan Hand (Terracotta Rust Henna) */}
          <path
            d="M 32 38 C 22 48, 20 66, 26 80 C 30 89, 40 98, 52 102 C 44 95, 38 85, 36 74 C 34 63, 38 52, 48 44 C 53 40, 58 37, 60 36 C 54 36, 44 34, 32 38 Z"
            fill="url(#terracottaGrad)"
          />
          {/* Terracotta Hand Folk Details */}
          <circle cx="34" cy="56" r="1.5" fill="#FFE5D9" opacity="0.8" />
          <circle cx="31" cy="66" r="1.5" fill="#FFE5D9" opacity="0.8" />
          <circle cx="34" cy="76" r="1.5" fill="#FFE5D9" opacity="0.8" />
          <path
            d="M 38 50 Q 44 58, 42 66"
            stroke="#FFE5D9"
            strokeWidth="1"
            strokeDasharray="1 2"
            opacity="0.7"
          />

          {/* Right Artisan Hand (Sage Forest Green Henna / Paisley) */}
          <path
            d="M 88 38 C 98 48, 100 66, 94 80 C 90 89, 80 98, 68 102 C 76 95, 82 85, 84 74 C 86 63, 82 52, 72 44 C 67 40, 62 37, 60 36 C 66 36, 76 34, 88 38 Z"
            fill="url(#sageGrad)"
          />
          {/* Sage Hand Henna Floral Details */}
          <circle cx="86" cy="56" r="1.5" fill="#E2F0D9" opacity="0.8" />
          <circle cx="89" cy="66" r="1.5" fill="#E2F0D9" opacity="0.8" />
          <circle cx="86" cy="76" r="1.5" fill="#E2F0D9" opacity="0.8" />
          <path
            d="M 82 50 Q 76 58, 78 66"
            stroke="#E2F0D9"
            strokeWidth="1"
            strokeDasharray="1 2"
            opacity="0.7"
          />

          {/* Bottom Woven Loom / Terraced Fields Pattern */}
          <path
            d="M 36 78 Q 60 88, 84 78 Q 78 96, 60 98 Q 42 96, 36 78 Z"
            fill="url(#loomGrad)"
          />
          <path
            d="M 40 82 Q 60 90, 80 82"
            stroke="#22331E"
            strokeWidth="1.2"
          />
          <path
            d="M 44 87 Q 60 94, 76 87"
            stroke="#22331E"
            strokeWidth="1"
          />
          <path
            d="M 50 92 Q 60 96, 70 92"
            stroke="#22331E"
            strokeWidth="0.8"
          />

          {/* Center Golden Concentric Potter Wheel / Sun Vortex */}
          <path
            d="M 60 60 m -18, 0 a 18,18 0 1,0 36,0 a 18,18 0 1,0 -36,0"
            stroke="#E8B84B"
            strokeWidth="1"
            strokeDasharray="3 2"
            opacity="0.85"
          />
          <path
            d="M 60 60 m -12, 0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0"
            stroke="#D49E35"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Inner Golden Spiral */}
          <path
            d="M 60 60 Q 63 56, 66 60 Q 69 66, 61 67 Q 53 66, 54 57 Q 56 49, 66 50 Q 75 52, 74 65 Q 73 74, 60 74"
            stroke="#B5451B"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="60" cy="60" r="2.5" fill="#B5451B" />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="terracottaGrad"
              x1="20"
              y1="34"
              x2="60"
              y2="102"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D45B2E" />
              <stop offset="0.6" stopColor="#B5451B" />
              <stop offset="1" stopColor="#872E0E" />
            </linearGradient>
            <linearGradient
              id="sageGrad"
              x1="100"
              y1="34"
              x2="60"
              y2="102"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C8F62" />
              <stop offset="0.6" stopColor="#3C5E35" />
              <stop offset="1" stopColor="#22331E" />
            </linearGradient>
            <linearGradient
              id="loomGrad"
              x1="36"
              y1="78"
              x2="84"
              y2="98"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B8D0AB" />
              <stop offset="0.5" stopColor="#82A676" />
              <stop offset="1" stopColor="#4D7043" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Optional Typography Brand Block */}
      {withText && (
        <div className="flex flex-col text-left leading-none">
          <span
            className={`font-serif font-bold text-lg tracking-wide ${
              isDark ? 'text-[#F4ECDE]' : 'text-[#22331E]'
            }`}
          >
            SHILPSETU
          </span>
          {withTagline ? (
            <span className="font-serif italic text-[10px] text-[#B5451B] font-semibold mt-0.5 tracking-tight">
              CONNECTING INDIA'S ARTISANS
            </span>
          ) : (
            <span className="font-serif italic text-[10px] text-[#B5451B] font-medium mt-0.5">
              "Har Haath Ki Kahani"
            </span>
          )}
        </div>
      )}
    </div>
  );
};
