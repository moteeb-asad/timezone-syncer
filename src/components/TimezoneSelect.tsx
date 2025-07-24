import { useState, useEffect } from "react";
import Select from "react-select";
import type { StylesConfig, GroupBase } from "react-select";
import type { TimezoneOption } from "../types/timezone";
import { getAllTimezones } from "../utils/timezoneUtils";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

interface TimezoneSelectProps {
  value?: TimezoneOption | null;
  onChange: (option: TimezoneOption | null) => void;
  className?: string;
  setBaseTimezone?: (option: TimezoneOption | null) => void;
}

const TimezoneSelect = ({
  value,
  onChange,
  className = "",
}: TimezoneSelectProps) => {
  const [options, setOptions] = useState<TimezoneOption[]>([]);

  useEffect(() => {
    setOptions(getAllTimezones());
  }, []);

  const getFlag = (countryCode: string) => {
    try {
      return getUnicodeFlagIcon(countryCode);
    } catch {
      return "🌐"; // Fallback to globe emoji if country code is invalid
    }
  };

  const customStyles: StylesConfig<
    TimezoneOption,
    false,
    GroupBase<TimezoneOption>
  > = {
    control: (provided) => ({
      ...provided,
      height: "38px",
      borderRadius: "0.5rem",
      backgroundColor: "white",
      borderColor: "#E5E7EB",
      "&:hover": {
        borderColor: "#D1D5DB",
      },
      "&:focus-within": {
        borderColor: "var(--primary-color, #ff6154)",
        boxShadow: "0 0 0 1px var(--primary-color, #ff6154)",
      },
    }),
    option: (provided, { isSelected, isFocused }) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      padding: "8px 12px",
      cursor: "pointer",
      backgroundColor: isSelected
        ? "var(--primary-color, #ff6154)"
        : isFocused
        ? "var(--primary-light, #fff4ed)"
        : "white",
      color: isSelected ? "white" : "#374151",
    }),
    singleValue: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  return (
    <Select<TimezoneOption, false, GroupBase<TimezoneOption>>
      className={className}
      options={options}
      value={value}
      onChange={onChange}
      styles={customStyles}
      placeholder="Select a timezone..."
      isClearable={true}
      isSearchable={true}
      formatOptionLabel={(option: TimezoneOption) => (
        <div className="flex items-center">
          <span
            className="mr-2"
            role="img"
            aria-label={`Flag for ${option.label}`}
          >
            {getFlag(option.countryCode)}
          </span>
          <span>{option.label}</span>
        </div>
      )}
    />
  );
};

export default TimezoneSelect;
