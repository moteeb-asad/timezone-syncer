import { useState, useEffect, useRef } from "react";

interface TimeInputProps {
  value: string;
  onChange: (newTime: string) => void;
  className?: string;
}

const TimeInput = ({ value, onChange, className = "" }: TimeInputProps) => {
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

  // Update parent when time changes
  useEffect(() => {
    const hour24 =
      period === "PM" ? (hour === 12 ? 12 : hour + 12) : hour === 12 ? 0 : hour;

    const timeString = `${hour24.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    // Only call onChange if the value has actually changed
    if (timeString !== value) {
      onChange(timeString);
    }
  }, [hour, minute, period, value]);

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
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input display */}
      <input
        type="text"
        readOnly
        value={displayTime}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full cursor-pointer bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
