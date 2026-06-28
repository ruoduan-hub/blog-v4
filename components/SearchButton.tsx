'use client'

import { useSearch } from '@/components/search/SearchProvider'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import siteMetadata from '@/data/siteMetadata'

const SearchButton = () => {
  const { openSearch } = useSearch()

  if (siteMetadata.search?.provider === 'kbar') {
    return (
      <Button aria-label="Search" onClick={openSearch} size="icon-lg" type="button" variant="ghost">
        <Search
          aria-hidden="true"
          className="group-hover/button:text-primary-500 dark:group-hover/button:text-primary-400 text-gray-900 transition-colors dark:text-gray-100"
          strokeWidth={1.5}
        />
        <span className="sr-only">Search</span>
      </Button>
    )
  }

  return null
}

export default SearchButton
