import type { TimezoneListProps } from "../../types/timezone";
import { TimezoneCard } from "./TimezoneCard";

export const TimezoneList = ({ settings, onRemove }: TimezoneListProps) => {
  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <TimezoneCard key={setting.id} setting={setting} onRemove={onRemove} />
      ))}
    </div>
  );
};
