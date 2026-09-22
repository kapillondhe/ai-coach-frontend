import { Icon } from "../Icon";

export const GroundingPill = ({ label }: { label: string }) => (
  <button
    type="button"
    className="inline-flex min-h-7 items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11.5px] font-bold text-accent"
  >
    <Icon name="grounding" className="h-3 w-3" aria-hidden="true" />
    {label}
  </button>
);
