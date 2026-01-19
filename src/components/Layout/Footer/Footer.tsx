import { Link, type LinkProps } from '../../Link/Link';
import './Footer.css';

export interface FooterProps {
  links: LinkProps[];
}

export const Footer = ({ links }: FooterProps) => {
  return (
    <footer className="footer">
      <div className="flex container">
        {links.map((link, index) => (
          <Link
            key={`${link.path}-${index}`}
            {...link}
            variant="footer"
            ariaLabel={link.ariaLabel}
          />
        ))}
      </div>
    </footer>
  );
};
