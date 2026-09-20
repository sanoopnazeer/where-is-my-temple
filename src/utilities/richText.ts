import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

type RichTextValue = { root: unknown } & Record<string, unknown>

/** Short plain-text excerpt from a richText field, for card previews. */
export function excerpt(data: RichTextValue | null | undefined, maxLength = 120): string | undefined {
  if (!data) return undefined

  const text = convertLexicalToPlaintext({
    data: data as Parameters<typeof convertLexicalToPlaintext>[0]['data'],
  })
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return undefined

  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}
