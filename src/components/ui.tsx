import * as React from "react";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { UploadCloud, X } from "lucide-react";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-card border border-border rounded-xl p-6 shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("text-[11px] font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2", className)}>
    <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(247,147,26,0.8)]" />
    {children}
  </div>
);

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'lightning', size?: 'default' | 'lg' | 'sm' }>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-accent text-black hover:bg-[#ff9f20] hover:-translate-y-px shadow-[0_4px_14px_0_rgba(247,147,26,0.39)] hover:shadow-[0_6px_20px_rgba(247,147,26,0.23)]': variant === 'primary',
            'bg-surface text-text border border-border hover:border-muted hover:bg-zinc-800': variant === 'secondary',
            'bg-lightning text-black hover:bg-[#ffe033] shadow-[0_4px_14px_0_rgba(255,215,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.23)]': variant === 'lightning',
            'px-6 py-3 text-sm': size === 'default',
            'px-8 py-4 text-base': size === 'lg',
            'px-4 py-2 text-xs': size === 'sm',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm transition-colors placeholder:text-zinc-500 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("block text-[11px] font-bold text-muted mb-1.5 uppercase tracking-wider", className)}
    {...props}
  />
));
Label.displayName = "Label";

export const FileInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { hint?: string }>(({ className, hint, ...props }, ref) => (
  <div className={cn("relative flex items-center justify-center w-full h-24 rounded-lg border-2 border-dashed border-border bg-surface hover:border-accent hover:bg-accent/5 transition-colors cursor-pointer group", className)}>
    <input
      type="file"
      accept="image/png, image/jpeg, image/gif"
      ref={ref}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      {...props}
    />
    <div className="text-center pointer-events-none flex flex-col items-center">
      <UploadCloud className="w-6 h-6 text-muted group-hover:text-accent mb-2 transition-colors" />
      <div className="text-xs font-bold text-muted group-hover:text-text transition-colors">Upload PNG, JPG, or GIF</div>
      <div className="text-[10px] text-muted mt-1">{hint || "Max size: 5MB"}</div>
    </div>
  </div>
));
FileInput.displayName = "FileInput";

export const FormGroup = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-4.5", className)}>
    {children}
  </div>
);

export const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text transition-colors">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const InfoTooltip = ({ content }: { content: string }) => (
  <div className="group relative inline-block ml-1.5 align-middle">
    <div className="p-0.5 rounded-full hover:bg-accent/20 cursor-help transition-colors">
      <svg className="w-3 h-3 text-muted group-hover:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
    </div>
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-zinc-900 border border-border rounded-lg text-[10px] leading-tight text-text opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-[100]">
      {content}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-8 border-transparent border-b-zinc-900" />
    </div>
  </div>
);
