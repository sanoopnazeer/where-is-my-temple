/*
 * Fixed transit types for Temples.transitPoints[].type. The select stores the
 * value; `en`/`ml` are the plain names (admin dropdown) and `heading` is the
 * phrase shown on the public page ("By Rail" / "റെയിൽ മാർഗ്ഗം").
 */
export const TRANSIT_TYPES = [
  { value: 'road', en: 'Road', ml: 'റോഡ്', heading: { en: 'By Road', ml: 'റോഡ് മാർഗ്ഗം' } },
  { value: 'bus', en: 'Bus', ml: 'ബസ്', heading: { en: 'By Bus', ml: 'ബസ് മാർഗ്ഗം' } },
  { value: 'rail', en: 'Rail', ml: 'റെയിൽ', heading: { en: 'By Rail', ml: 'റെയിൽ മാർഗ്ഗം' } },
  { value: 'air', en: 'Air', ml: 'വിമാനം', heading: { en: 'By Air', ml: 'വിമാന മാർഗ്ഗം' } },
  { value: 'metro', en: 'Metro', ml: 'മെട്രോ', heading: { en: 'By Metro', ml: 'മെട്രോ മാർഗ്ഗം' } },
] as const

export type TransitType = (typeof TRANSIT_TYPES)[number]['value']
