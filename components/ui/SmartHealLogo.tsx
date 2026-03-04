import React from 'react';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface SmartHealLogoProps {
  /** Overall size (width & height) */
  size?: number;
}

/**
 * SmartHeal official logomark – stylised running-person "R" on a red rounded square.
 * Uses the exact SVG paths from the official brand asset.
 */
export function SmartHealLogo({ size = 32 }: SmartHealLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessibilityLabel="SmartHeal logo">
      <Rect width="48" height="48" rx="8" fill="#EF4444" />
      <Circle cx="29.5" cy="12.5" r="2.5" fill="white" />
      <Path
        d="M18 19C18 19 20 19 22 19C23 19 24 19 24.5 18L26.5 15H29.5C29.5 15 28.5 18 28 20C27.5 21.5 26.5 22 25 22H23L21.5 25L24.5 30L26 32H22.5L19 26.5L17.5 31H13.5L16.5 24L18 19Z"
        fill="white"
      />
      <Path
        d="M27.5 21.5L31 23.5L33 27L29.5 25.5L27.5 21.5Z"
        fill="white"
      />
    </Svg>
  );
}
