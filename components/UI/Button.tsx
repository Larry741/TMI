import Image from "next/legacy/image";
import { ReactNode } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import RotatingLines from "./loader";

import styles from "./Button.module.scss";

export const NavigationButton = ({
  backArrow,
  nextArrow
}: {
  backArrow: String;
  nextArrow: String;
}) => {
  let props = {};

  return (
    <div className={styles.navigationButton}>
      <button
        aria-label="Go left"
        className={`${styles.nav_button} ${backArrow}`}>
        <FaAngleLeft size={20} />
      </button>
      <button
        aria-label="Go right"
        className={`${styles.nav_button} ${nextArrow}`}>
        <FaAngleRight size={20} />
      </button>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  withBg?: boolean;
  showLoader?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Button = ({
  children,
  withBg = true,
  showLoader = false,
  className,
  onClick,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`${className} ${withBg && styles.bg} ${
        styles.button
      } size_14 bold `}
      onClick={onClick}
      {...props}>
      <RotatingLines width={"23"} strokeColor="white" visible={showLoader} />
      {children}
    </button>
  );
};

export default Button;
