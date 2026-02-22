import { useEffect, useState } from "react";

export interface ToastProps {
  message: string;
  isVisible: boolean;
  onConfirm?: () => void;
  onDismiss?: () => void;
  confirmLabel?: string;
  dismissLabel?: string;
  duration?: number;
}

/**
 * Simple toast notification component
 * Displays at the bottom center of the screen
 */
export const Toast = ({
  message,
  isVisible,
  onConfirm,
  onDismiss,
  confirmLabel = "Yes",
  dismissLabel = "Later",
  duration = 0, // 0 = stay until user interacts
}: ToastProps) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);

    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-slate-900 text-white rounded-lg shadow-xl p-4 max-w-md flex flex-col sm:flex-row items-center gap-3">
        <p className="text-sm font-medium text-center sm:text-left flex-1">
          {message}
        </p>
        <div className="flex gap-2">
          {onDismiss && (
            <button
              onClick={() => {
                setShow(false);
                onDismiss();
              }}
              className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors rounded-md hover:bg-slate-800"
            >
              {dismissLabel}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={() => {
                setShow(false);
                onConfirm();
              }}
              className="px-4 py-1.5 text-sm font-bold bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
