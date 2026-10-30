import type { SVGProps } from "react";

/** Theme icons, redrawn from the Empire theme. Decorative by default. */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg aria-hidden focusable={false} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {children}
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon width={8} height={6} viewBox="0 0 8 6" {...props}>
      <path
        d="M4 4.5 7 1.5M4 4.5 1 1.5"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="square"
      />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon width={6} height={10} viewBox="0 0 6 10" {...props}>
      <path d="M1 1l4 4-4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon width={6} height={10} viewBox="0 0 6 10" {...props}>
      <path d="M5 1 1 5l4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon width={21} height={21} viewBox="0 0 21 21" {...props}>
      <path
        d="M19.5 19.5l-5.1-5.1m1.8-4.9a7.2 7.2 0 1 1-14.4 0 7.2 7.2 0 0 1 14.4 0Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon width={21} height={24} viewBox="0 0 21 24" {...props}>
      <path
        d="M1.5 23v-2.6a6.6 6.6 0 0 1 6.6-6.6h4.8a6.6 6.6 0 0 1 6.6 6.6V23M15.5 6.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"
        stroke="currentColor"
        strokeWidth={2}
      />
    </Icon>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <Icon width={26} height={24} viewBox="0 0 26 24" {...props}>
      <path
        d="M1 1.5h3.4l2.9 13.6a2 2 0 0 0 2 1.6h10.8a2 2 0 0 0 2-1.5L24.5 6H5.6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <circle cx={10} cy={21.5} r={1.5} fill="currentColor" />
      <circle cx={20} cy={21.5} r={1.5} fill="currentColor" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon width={22} height={18} viewBox="0 0 22 18" {...props}>
      <path d="M0 1h22M0 9h22M0 17h22" stroke="currentColor" strokeWidth={2} />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon width={16} height={16} viewBox="0 0 16 16" {...props}>
      <path d="M1 1l14 14M15 1 1 15" stroke="currentColor" strokeWidth={2} />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon width={12} height={12} viewBox="0 0 12 12" {...props}>
      <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth={1.5} />
    </Icon>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <Icon width={12} height={12} viewBox="0 0 12 12" {...props}>
      <path d="M0 6h12" stroke="currentColor" strokeWidth={1.5} />
    </Icon>
  );
}

export function PackageIcon(props: IconProps) {
  return (
    <Icon width={22} height={22} viewBox="0 0 22 22" {...props}>
      <path
        d="M11 1 2 5.5v11L11 21l9-4.5v-11L11 1Zm0 0v0M2 5.5l9 4.5m0 0 9-4.5M11 10v11M6.5 3.25l9 4.5"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function EnvelopeIcon(props: IconProps) {
  return (
    <Icon width={22} height={16} viewBox="0 0 22 16" {...props}>
      <path
        d="M1 1h20v14H1V1Zm0 0 10 8 10-8M1 15l7-6.5M21 15l-7-6.5"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
    </Icon>
  );
}
