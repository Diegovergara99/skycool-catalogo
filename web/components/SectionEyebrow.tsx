interface SectionEyebrowProps {
  children: React.ReactNode;
}

export default function SectionEyebrow({ children }: SectionEyebrowProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-teal-dark)]">
      {children}
    </span>
  );
}
