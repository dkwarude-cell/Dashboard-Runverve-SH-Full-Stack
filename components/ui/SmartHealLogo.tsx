import React from 'react';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SmartHealLogoProps {
  /** Overall size (width & height) */
  size?: number;
}

/**
 * SmartHeal professional logomark – medical cross silhouette with a heartbeat
 * pulse cutting through it, on a gradient red rounded-square.
 * Clean, scalable, works from 20px to 120px.
 */
export function SmartHealLogo({ size = 32 }: SmartHealLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" accessibilityLabel="SmartHeal logo">
      <Defs>
        <LinearGradient id="bgGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#d4183d" />
          <Stop offset="1" stopColor="#9b1030" />
        </LinearGradient>
      </Defs>

      {/* Background rounded square */}
      <Rect width="64" height="64" rx="14" fill="url(#bgGrad)" />

      {/* Medical cross — solid white, centred */}
      <Path
        d="M24 12h16v16h12v8H40v16H24V36H12v-8h12V12z"
        fill="white"
        opacity={0.25}
      />

      {/* Heartbeat / ECG pulse — bold & clean across the middle */}
      <Path
        d="M8 34h12l3-10 4 20 4-22 4 18 3-6h2l4 0h12"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
