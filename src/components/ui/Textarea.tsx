import { cn } from "@/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={cn(
          "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary outline-none resize-none",
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
