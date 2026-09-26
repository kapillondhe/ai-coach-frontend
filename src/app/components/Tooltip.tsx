interface TooltipProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Wraps a trigger element with a CSS-only tooltip shown on hover/focus. */
export const Tooltip = ({ label, children, className }: TooltipProps) => (
  <span className={`group relative inline-flex ${className ?? ""}`}>
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-surface opacity-0 shadow-md transition-opacity duration-100 group-hover:opacity-100 group-focus-within:opacity-100"
    >
      {label}
    </span>
  </span>
);
