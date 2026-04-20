import { useState, useEffect, useRef } from "react";
import type { TimeInputProps } from "../types";

const TimeInput = ({ value, onChange }: TimeInputProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Parse initial hour and minute from value (format: "HH:mm")
  const [hour, setHour] = useState(() => {
    const [h] = value.split(":");
    const hourNum = parseInt(h, 10);
    return hourNum > 12 ? hourNum - 12 : hourNum;
  });

  const [minute, setMinute] = useState(() => {
    const [, m] = value.split(":");
    return parseInt(m, 10);
  });

  const [period, setPeriod] = useState(() => {
    const [h] = value.split(":");
    return parseInt(h, 10) >= 12 ? "PM" : "AM";
  });

  // Format time for display
  const displayTime = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;

  // Helper to compute 24-hour time string
  const getTimeString = (h: number, m: number, p: string) => {
    const hour24 = p === "PM" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
    return `${hour24.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  return (
    <div className={`flex-1 relative `} ref={dropdownRef}>
      {/* Input display */}
      <input
        type="text"
        readOnly
        value={displayTime}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-sm font-semibold border-none bg-slate-50 rounded-[0.5rem] focus:ring-1 focus:ring-primary-accent px-3 py-2 outline-none"
      />

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 grid grid-cols-3 gap-2">
            {/* Hours */}
            <div className="border-r border-gray-200">
              <div className="text-xs text-gray-500 mb-1 text-center">Hour</div>
              <div className="max-h-40 overflow-y-auto">
                {hours.map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setHour(h);
                      onChange(getTimeString(h, minute, period));
                    }}
                    className={`w-full px-2 py-1 text-left hover:bg-gray-100 rounded ${
                      hour === h ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {h.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="border-r border-gray-200">
              <div className="text-xs text-gray-500 mb-1 text-center">
                Minute
              </div>
              <div className="max-h-40 overflow-y-auto">
                {minutes.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMinute(m);
                      onChange(getTimeString(hour, m, period));
                    }}
                    className={`w-full px-2 py-1 text-left hover:bg-gray-100 rounded ${
                      minute === m ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div>
              <div className="text-xs text-gray-500 mb-1 text-center">
                Period
              </div>
              <div>
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPeriod(p);
                      onChange(getTimeString(hour, minute, p));
                    }}
                    className={`w-full px-2 py-1 text-left hover:bg-gray-100 rounded ${
                      period === p ? "bg-primary/10 text-primary" : ""
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput;
