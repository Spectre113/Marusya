import { Footer, type FooterProps } from './Footer/Footer';
import { Header, type HeaderProps } from './Header/Header';

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
