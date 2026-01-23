import { useEffect, useState } from 'react';

export const useDevice = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return {
    isMobile: width < 1440,
    isSmallScreen: width <= 768,
    width,
  };
};
