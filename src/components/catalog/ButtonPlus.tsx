"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import styles from "./ButtonPlus.module.css";

export interface ButtonPlusProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** 'dark' (white text, for dark backgrounds) | 'light' (navy text, for light backgrounds) */
  variant?: "dark" | "light";
  "aria-label"?: string;
}

function ArrowUpRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="block">
      <path
        d="M2.2 11.8 11.8 2.2M11.8 2.2H4.4M11.8 2.2v7.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ButtonPlus({
  children,
  href,
  onClick,
  className,
  type = "button",
  disabled,
  variant = "dark",
  "aria-label": ariaLabel,
}: ButtonPlusProps) {
  const dark = variant !== "light";

  const classes = `${styles.button} group relative inline-flex max-w-full min-h-[44px] cursor-pointer items-center gap-3 py-2.5 font-raleway text-base font-semibold leading-none tracking-[0.02em] lowercase select-none no-underline transition-all duration-300 ease-out active:duration-100 disabled:pointer-events-none disabled:opacity-50 sm:text-lg ${
    dark
      ? "text-white focus-visible:outline-white/70"
      : "text-[#0a3547] focus-visible:outline-[#0a3547]/70"
  } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
    className ?? ""
  }`;

  const content = (
    <>
      <span className={`${styles.label} relative pb-0.5`}>
        {children}
        <span aria-hidden="true" className={`${styles.underline} absolute bottom-0 left-0 h-px w-full bg-current`} />
      </span>
      <span className={`${styles.arrow} relative`}>
        <ArrowUpRightIcon />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} aria-disabled={disabled} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={classes}>
      {content}
    </button>
  );
}

export default ButtonPlus;
