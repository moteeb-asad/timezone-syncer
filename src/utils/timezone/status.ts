import { WORKING_HOURS } from "../../types/timezone";

export const getWorkingHoursStatus = (
  timeString: string
): "working" | "early" | "late" => {
  const [time, period] = timeString.split(" ");
  const [hours] = time.split(":").map(Number);

  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 += 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  if (hour24 >= WORKING_HOURS.start && hour24 < WORKING_HOURS.end) {
    return "working";
  }
  if (hour24 < WORKING_HOURS.start) {
    return "early";
  }
  return "late";
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "early":
      return "wb_twilight";
    case "working":
      return "work";
    case "late":
      return "bedtime";
    default:
      return "schedule";
  }
};

export const getStatusStyles = (status: string) => {
  switch (status) {
    case "early":
      return {
        badge: "bg-amber-50 text-amber-700",
        bar: "bg-amber-400",
      };
    case "working":
      return {
        badge: "bg-emerald-50 text-emerald-700",
        bar: "bg-emerald-400",
      };
    case "late":
      return {
        badge: "bg-indigo-50 text-indigo-700",
        bar: "bg-indigo-400",
      };
    default:
      return {
        badge: "bg-slate-50 text-slate-700",
        bar: "bg-slate-400",
      };
  }
};

export const generateTimeOptions = (): string[] => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeString);
    }
  }
  return times;
};
