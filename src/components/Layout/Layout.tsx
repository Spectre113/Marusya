import { Footer, type FooterProps } from './Footer/Footer';
import { Header } from './Header/Header';
import { type HeaderProps } from './Header/Header.types';

export interface LayoutProps {
  header: HeaderProps;
  children: React.ReactNode;
  footer: FooterProps;
}

export const Layout = ({ header, children, footer }: LayoutProps) => {
  return (
    <>
      <Header {...header} />
      <main className="main">{children}</main>
      <Footer {...footer} />
    </>
  );
};
