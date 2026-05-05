import { useId } from 'react';
import { type ChatCardColor } from '@/components';
import { cn } from '@/lib';

type Props = {
  color: ChatCardColor;
  className?: string;
};

type ColorConfig = {
  gradientStart: string;
  gradientEnd: string;
  shadowR: number;
  shadowG: number;
  shadowB: number;
};

const COLOR_CONFIG: Record<ChatCardColor, ColorConfig> = {
  teal:    { gradientStart: '#468D8D', gradientEnd: '#086767', shadowR: 0.0314, shadowG: 0.4039, shadowB: 0.4039 },
  magenta: { gradientStart: '#853965', gradientEnd: '#60193D', shadowR: 0.3765, shadowG: 0.0941, shadowB: 0.2392 },
  yellow:  { gradientStart: '#A47950', gradientEnd: '#864c16', shadowR: 0.5255, shadowG: 0.2980, shadowB: 0.0863 },
  sky:     { gradientStart: '#5C92A4', gradientEnd: '#256d85', shadowR: 0.1451, shadowG: 0.4275, shadowB: 0.5216 },
  green:   { gradientStart: '#6A8547', gradientEnd: '#385c0a', shadowR: 0.2196, shadowG: 0.3608, shadowB: 0.0392 },
  purple:  { gradientStart: '#6C6EA6', gradientEnd: '#3b3d88', shadowR: 0.2314, shadowG: 0.2392, shadowB: 0.5333 },
  blue:    { gradientStart: '#657EAC', gradientEnd: '#325390', shadowR: 0.1961, shadowG: 0.3255, shadowB: 0.5647 },
};

export const BookmarkCheckIcon = ({ color, className }: Props) => {
  const uid = useId();
  const { gradientStart, gradientEnd, shadowR, shadowG, shadowB } = COLOR_CONFIG[color];

  const gradientId = `bmck-grad-${uid}`;
  const filterId = `bmck-filter-${uid}`;
  
  return (
    <svg
      viewBox="16 16 20 22"
      overflow="visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="52"
          height="53.7854"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 ${shadowR} 0 0 0 0 ${shadowG} 0 0 0 0 ${shadowB} 0 0 0 0.24 0`}
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient id={gradientId} x1="26" y1="16" x2="26" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientStart} />
          <stop offset="1" stopColor={gradientEnd} />
        </linearGradient>
      </defs>
      <g filter={`url(#${filterId})`}>
        <path
          d="M16 35.7829V19C16 17.3431 17.3431 16 19 16H33C34.6569 16 36 17.3431 36 19V35.7829C36 37.2651 34.4442 38.2323 33.115 37.5764L26.885 34.5023C26.3271 34.227 25.6729 34.227 25.115 34.5023L18.885 37.5764C17.5558 38.2323 16 37.2651 16 35.7829Z"
          fill={`url(#${gradientId})`}
        />
      </g>
      <path
        d="M29.0946 22.0702C29.6082 21.5686 30.4309 21.5782 30.9325 22.0917C31.4341 22.6053 31.4245 23.4279 30.911 23.9296L25.7909 28.9296C25.2858 29.4228 24.4796 29.4228 23.9745 28.9296L21.0946 26.1171C20.5811 25.6154 20.5716 24.7928 21.0731 24.2792C21.5748 23.7657 22.3974 23.7561 22.911 24.2577L24.8827 26.1825L29.0946 22.0702Z"
        fill="white"
        fillOpacity="0.82"
      />
    </svg>
  );
};
