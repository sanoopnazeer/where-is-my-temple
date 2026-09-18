export type TempleLocale = 'en' | 'ml'

export function resolveLocale(lang: string | string[] | undefined): TempleLocale {
  return lang === 'ml' ? 'ml' : 'en'
}
