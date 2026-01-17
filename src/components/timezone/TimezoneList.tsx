import type { TimezoneSetting } from "../../types/timezone";
import { TimezoneCard } from "./TimezoneCard";

interface TimezoneListProps {
  settings: TimezoneSetting[];
  onRemove: (id: string) => void;
}

export const TimezoneList = ({ settings, onRemove }: TimezoneListProps) => {
  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <TimezoneCard key={setting.id} setting={setting} onRemove={onRemove} />
      ))}
    </div>
  );
};
