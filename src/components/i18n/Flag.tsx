import type { Locale } from "@/i18n/config";

/** Round flag for a language, drawn inline so it needs no image request. */
export function Flag({ locale, size = 22 }: { locale: Locale; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false}>
      <clipPath id={`flag-${locale}`}>
        <circle cx={12} cy={12} r={12} />
      </clipPath>
      <g clipPath={`url(#flag-${locale})`}>{FLAGS[locale]}</g>
    </svg>
  );
}

const FLAGS: Record<Locale, React.ReactNode> = {
  de: (
    <>
      <rect width={24} height={8} fill="#000" />
      <rect y={8} width={24} height={8} fill="#dd0000" />
      <rect y={16} width={24} height={8} fill="#ffce00" />
    </>
  ),
  en: (
    <>
      <rect width={24} height={24} fill="#012169" />
      <path d="M0 0l24 24M24 0L0 24" stroke="#fff" strokeWidth={5} />
      <path d="M0 0l24 24M24 0L0 24" stroke="#c8102e" strokeWidth={2} />
      <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth={7} />
      <path d="M12 0v24M0 12h24" stroke="#c8102e" strokeWidth={4} />
    </>
  ),
  fr: (
    <>
      <rect width={8} height={24} fill="#002395" />
      <rect x={8} width={8} height={24} fill="#fff" />
      <rect x={16} width={8} height={24} fill="#ed2939" />
    </>
  ),
  it: (
    <>
      <rect width={8} height={24} fill="#009246" />
      <rect x={8} width={8} height={24} fill="#fff" />
      <rect x={16} width={8} height={24} fill="#ce2b37" />
    </>
  ),
};
