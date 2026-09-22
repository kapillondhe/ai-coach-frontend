export const ICONS = {
  chat: "/icons/chat.svg",
  plan: "/icons/plan.svg",
  dashboard: "/icons/dashboard.svg",
  profile: "/icons/profile.svg",
  send: "/icons/send.svg",
  grounding: "/icons/grounding.svg",
  source: "/icons/source.svg",
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

export const Icon = ({ name, className, ...rest }: IconProps) => {
  const url = ICONS[name];
  return (
    <span
      role="img"
      className={`inline-block bg-current ${className ?? ""}`}
      style={{
        maskImage: `url(${url})`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskImage: `url(${url})`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
      }}
      {...rest}
    />
  );
};
