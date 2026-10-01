import Form from 'next/form'

import { SearchIcon } from '@/components/icons/TempleIcons'
import { MAX_SEARCH_LENGTH } from '@/utilities/search'
import styles from './SearchForm.module.css'

/**
 * The designs' hero search bar (pill input + "Explore" button; stacked on
 * mobile), shared by the Home and District heroes and the search page.
 * A plain GET form: submitting navigates to `action?q=…`, so results are
 * server-rendered and the URL is shareable — no client-side search state.
 */
export function SearchForm({
  action,
  defaultValue = '',
  label,
}: {
  action: string
  defaultValue?: string
  label: string
}) {
  return (
    <Form action={action} role="search" className={styles.searchBar}>
      <label className={styles.searchField}>
        <SearchIcon className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search for Temples, Poojas, or Locations"
          aria-label={label}
          maxLength={MAX_SEARCH_LENGTH}
          className={styles.searchInput}
        />
      </label>
      <button type="submit" className={styles.exploreButton}>
        Explore
      </button>
    </Form>
  )
}
