import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import "../styles/TimeInput.css";

interface TimeInputProps {
  value: string;
  onChange: (newTime: string) => void;
  className?: string;
}

const TimeInput = ({ value, onChange, className = "" }: TimeInputProps) => {
  return (
    <div className={className}>
      <TimePicker
        value={value}
        onChange={(newTime) => onChange(newTime || value)}
        format="hh:mm a"
        clearIcon={null}
        hourPlaceholder="hh"
        minutePlaceholder="mm"
        amPmAriaLabel="Select AM/PM"
        className="w-full position-absolute right-[10px]"
        disableClock
      />
    </div>
  );
};

export default TimeInput;
