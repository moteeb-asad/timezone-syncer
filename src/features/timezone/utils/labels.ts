import ISO31661 from "iso-3166-1-alpha-2";

// Mapping of timezone names to ISO country codes
const timezoneCountryMap: Record<string, string> = {
  // North America
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
  "America/Denver": "US",
  "America/Phoenix": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Mexico_City": "MX",

  // South America
  "America/Sao_Paulo": "BR",
  "America/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Lima": "PE",
  "America/Bogota": "CO",

  // Europe
  "Europe/London": "GB",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Rome": "IT",
  "Europe/Madrid": "ES",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Vienna": "AT",
  "Europe/Moscow": "RU",
  "Europe/Istanbul": "TR",

  // Asia
  "Asia/Tokyo": "JP",
  "Asia/Shanghai": "CN",
  "Asia/Singapore": "SG",
  "Asia/Dubai": "AE",
  "Asia/Hong_Kong": "HK",
  "Asia/Seoul": "KR",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Bangkok": "TH",
  "Asia/Manila": "PH",
  "Asia/Jakarta": "ID",

  // Oceania
  "Pacific/Auckland": "NZ",
  "Pacific/Fiji": "FJ",
  "Pacific/Guam": "GU",
  "Pacific/Honolulu": "US",
  "Pacific/Samoa": "WS",
  "Pacific/Tahiti": "PF",
  "Pacific/Noumea": "NC",
  "Pacific/Port_Moresby": "PG",
  "Pacific/Guadalcanal": "SB",
  "Pacific/Pago_Pago": "AS",
  "Pacific/Midway": "UM",
  "Pacific/Wake": "UM",
  "Pacific/Niue": "NU",
  "Pacific/Rarotonga": "CK",

  // Australia
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Australia/Adelaide": "AU",

  // Africa
  "Africa/Cairo": "EG",
  "Africa/Lagos": "NG",
  "Africa/Johannesburg": "ZA",
  "Africa/Nairobi": "KE",
  "Africa/Casablanca": "MA",
};

export const formatTimezoneLabel = (name: string): string => {
  const parts = name.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");
  return city;
};

export const getCountryCode = (timezoneName: string): string => {
  if (timezoneCountryMap[timezoneName]) {
    return timezoneCountryMap[timezoneName];
  }

  const [region, city] = timezoneName.split("/");

  if (region === "America" || region === "Pacific") {
    const usLocations = ["Hawaii", "Alaska", "Guam", "Samoa", "Wake", "Midway"];
    if (usLocations.some((loc) => city?.includes(loc))) {
      return "US";
    }
  }

  switch (region) {
    case "America":
      return "US";
    case "Europe":
      return "EU";
    case "Asia":
    case "Africa":
      return "UN";
    case "Australia":
    case "Pacific":
      return "AU";
    default:
      return "UN";
  }
};

export const getTimezoneFlag = (name: string): string => {
  const countryCode = getCountryCode(name);
  const countryName = ISO31661.getCountry(countryCode);
  return countryName ? `${countryCode}` : "UN";
};
