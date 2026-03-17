import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipPortalProps {
  visible: boolean;
  content: React.ReactNode;
  position: { top: number; left: number };
}

export const TooltipPortal = ({
  visible,
  content,
  position,
}: TooltipPortalProps) => {
  const tooltipRoot = useRef<Element | null>(null);

  useEffect(() => {
    if (!tooltipRoot.current) {
      let el = document.getElementById("tooltip-root");
      if (!el) {
        el = document.createElement("div");
        el.id = "tooltip-root";
        document.body.appendChild(el);
      }
      tooltipRoot.current = el;
    }
  }, []);

  if (!visible || !tooltipRoot.current) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
        // pointerEvents: "none", // Remove for debugging
      }}
      className="max-w-[220px] px-3 py-2 bg-slate-900 text-white text-xs text-center leading-snug rounded shadow-lg transition-opacity"
    >
      {content}
    </div>,
    tooltipRoot.current
  );
};
