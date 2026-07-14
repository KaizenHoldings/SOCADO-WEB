"use client";

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

export interface ButtonLightProps {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  /** Fully rounded pill shape instead of the default rounded-xl corners. */
  pill?: boolean;
}

function ArrowIcon() {
  return (
    <svg
      className="shrink-0 -translate-x-2 text-[#37738d] transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:text-[#0a3547] group-active:scale-90"
      width="26"
      height="14"
      viewBox="0 0 26 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 7h23M18 1l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ButtonLight({
  children,
  href,
  onClick,
  className,
  type = "button",
  disabled,
  pill,
}: ButtonLightProps) {
  const classes = `group relative inline-flex max-w-full min-h-[56px] cursor-pointer items-center justify-center gap-5 ${
    pill ? "rounded-full" : "rounded-xl"
  } border border-[#0a3547]/10 bg-[#f2eae6] px-7 py-4 font-raleway shadow-[0_2px_6px_rgba(10,53,71,0.15)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#37738d]/40 hover:bg-white hover:shadow-[0_14px_34px_-8px_rgba(55,115,141,0.25)] active:translate-y-0 active:scale-100 disabled:pointer-events-none disabled:opacity-50 sm:px-10 sm:py-5 ${
    className ?? ""
  }`;

  const label = (
    <span className="relative text-[13px] font-medium tracking-[1px] text-[#0a3547] transition-all duration-500 ease-out after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#0a3547] after:transition-transform after:duration-[250ms] after:ease-out group-hover:tracking-[1.5px] group-hover:after:origin-bottom-left group-hover:after:scale-x-100 sm:text-[15px] sm:tracking-[1.5px]">
      {children}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {label}
        <ArrowIcon />
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {label}
      <ArrowIcon />
    </button>
  );
}

export default ButtonLight;
