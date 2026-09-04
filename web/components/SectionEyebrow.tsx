interface SectionEyebrowProps {
  children: React.ReactNode;
  variant?: "light" | "dark";
}

const ESTILOS = {
  light:
    "border-[var(--color-teal)]/30 bg-[var(--color-teal)]/10 text-[var(--color-teal-dark)]",
  dark: "border-white/15 bg-white/5 text-[var(--color-teal)] backdrop-blur",
};

export default function SectionEyebrow({ children, variant = "light" }: SectionEyebrowProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${ESTILOS[variant]}`}
    >
      {children}
    </span>
  );
}
