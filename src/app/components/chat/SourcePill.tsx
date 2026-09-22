import { Icon } from "../Icon";

export const SourcePill = ({ label }: { label: string }) => (
  <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11.5px] font-semibold text-ink-muted">
    <Icon name="source" className="h-3 w-3" aria-hidden="true" />
    {label}
  </span>
);
