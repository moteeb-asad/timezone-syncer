import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  // Dark text on coral: white on coral is only 2.8:1
  primary: "bg-coral text-ink shadow-card hover:bg-coral-hover",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
};

export const Button = ({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
};
