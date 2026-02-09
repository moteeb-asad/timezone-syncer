import { useState, useEffect } from "react";
import Select from "react-select";
import type { StylesConfig, GroupBase } from "react-select";
import type { TimezoneOption, TimezoneSelectProps } from "../../types/timezone";
import { getAllTimezones } from "../../utils/timezone";
import * as flags from "country-flag-icons/react/3x2";

const TimezoneSelect = ({ value, onChange }: TimezoneSelectProps) => {
  const [options, setOptions] = useState<TimezoneOption[]>([]);

  // Load options only once when component mounts
  useEffect(() => {
    setOptions(getAllTimezones());
  }, []);

  // Handle value format synchronization separately
  useEffect(() => {
    if (!value || options.length === 0) return;

    const matchingOption = options.find((opt) => opt.value === value.value);

    // Only update if we found a matching option that's different from current value
    if (
      matchingOption &&
      JSON.stringify(matchingOption) !== JSON.stringify(value)
    ) {
      onChange(matchingOption);
    }
  }, [value, options]);

  const FlagIcon = ({ countryCode }: { countryCode: string }) => {
    const FlagComponent = (flags as any)[countryCode];

    if (!FlagComponent) {
      return <span className="text-lg">🌐</span>;
    }

    return <FlagComponent className="w-5 h-4" />;
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
      backgroundColor: "#f8fafc",
      border: "none",
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
    <div className="flex-[1.5] relative">
      <Select<TimezoneOption, false, GroupBase<TimezoneOption>>
        options={options}
        value={value}
        onChange={onChange}
        styles={customStyles}
        placeholder="Select a timezone..."
        isClearable={true}
        isSearchable={true}
        formatOptionLabel={(option: TimezoneOption) => (
          <div className="flex items-center text-sm font-semibold">
            <span className="mr-2 flex items-center ">
              <FlagIcon countryCode={option.countryCode} />
            </span>
            <span>{option.label}</span>
          </div>
        )}
      />
    </div>
  );
};

export default TimezoneSelect;
