/** Server-rendered JSON-LD `<script>` (no client JS). `<` is escaped so CMS
 * text can never close the script element early. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
