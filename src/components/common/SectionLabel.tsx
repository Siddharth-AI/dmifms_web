import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  variant?: "blue" | "emerald" | "amber" | "light";
  className?: string;
}

export default function SectionLabel({
  label,
  variant = "blue",
  className,
}: SectionLabelProps) {
  const variants = {
    blue: "bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20",
    emerald: "bg-[#10B981]/10 text-[#059669] border-[#10B981]/20",
    amber: "bg-[#F59E0B]/10 text-[#D97706] border-[#F59E0B]/20",
    light: "bg-white/15 text-white border-white/25",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border",
        variants[variant],
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        variant === "blue" ? "bg-[#1E3A8A]" :
        variant === "emerald" ? "bg-[#10B981]" :
        variant === "amber" ? "bg-[#F59E0B]" : "bg-white"
      )} />
      {label}
    </span>
  );
}
