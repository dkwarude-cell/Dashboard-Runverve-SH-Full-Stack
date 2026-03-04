import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Breakpoints } from '@/constants/theme';

export function useResponsive() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;
  const height = dimensions.height;

  return {
    width,
    height,
    isMobile: width < Breakpoints.md,
    isTablet: width >= Breakpoints.md && width < Breakpoints.lg,
    isDesktop: width >= Breakpoints.lg,
    isLargeDesktop: width >= Breakpoints.xl,
    isWeb: Platform.OS === 'web',
    // Grid column helpers
    columns: width < Breakpoints.md ? 1 : width < Breakpoints.lg ? 2 : width < Breakpoints.xl ? 3 : 4,
  };
}
