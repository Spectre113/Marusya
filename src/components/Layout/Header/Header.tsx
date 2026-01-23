import { useDevice } from '../../../hooks/useDevice';
import { HeaderDesktop } from './Header.desktop';
import { HeaderMobile } from './Header.mobile';
import type { HeaderProps } from './Header.types';

export const Header = (props: HeaderProps) => {
  const { isMobile } = useDevice();

  return isMobile ? <HeaderMobile {...props} /> : <HeaderDesktop {...props} />;
};
