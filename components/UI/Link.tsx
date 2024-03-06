import NextLink from "next/link";

import styles from "./Link.module.scss";

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: any;
  font?: number;
}

const Link = ({ children, className, href, font, ...props }: ButtonProps) => {
  return (
    <NextLink
      href={href}
      className={`${styles.link} ${className}`}
      {...props}
      style={{ fontSize: font }}>
      {children}
    </NextLink>
  );
};

export default Link;
