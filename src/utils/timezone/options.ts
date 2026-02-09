import { getTimeZones, type TimeZone as TzdbTimeZone } from "@vvo/tzdb";
import { type Timezone, type TimezoneOption } from "../../types/timezone";
import { formatTimezoneLabel, getCountryCode } from "./labels";

export const timezoneToOption = (tz: Timezone): TimezoneOption => ({
  value: tz.name,
  label: formatTimezoneLabel(tz.name),
  offset: 0,
  countryCode: getCountryCode(tz.name),
});

export const optionToTimezone = (option: TimezoneOption): Timezone => ({
  id: option.value.toLowerCase().replace("/", "-"),
  name: option.value,
  displayName: option.label,
  countryCode: option.countryCode,
});

export const getAllTimezones = (): TimezoneOption[] => {
  const timezones = getTimeZones();
  return timezones.map((tz: TzdbTimeZone) => ({
    value: tz.name,
    label: formatTimezoneLabel(tz.name),
    offset: tz.rawOffsetInMinutes,
    countryCode: getCountryCode(tz.name),
  }));
};
