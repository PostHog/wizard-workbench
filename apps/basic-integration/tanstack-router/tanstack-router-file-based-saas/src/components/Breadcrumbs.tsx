import { isMatch, Link, useMatches } from '@tanstack/react-router'

export const Breadcrumbs = () => {
  const matches = useMatches()

  if (matches.some((match) => match.status === 'pending')) return null

  const matchesWithCrumbs = matches.filter((match) =>
    isMatch(match, 'loaderData.crumb'),
  )

  if (matchesWithCrumbs.length === 0) return null

  return (
    <nav className="hidden md:block">
      <ul className="flex items-center text-sm">
        {matchesWithCrumbs.map((match, i) => (
          <li key={match.fullPath} className="flex items-center">
            {i > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            <Link
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              from={match.fullPath}
            >
              {match.loaderData?.crumb}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
