import { Link, Navigate } from 'react-router'
import { useAuth } from '~/context/AuthContext'
import { getCurrentUser, getAvatarUrl } from '~/lib/utils/auth'
import type { Route } from './+types/profile'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const currentUser = getCurrentUser() || user

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={getAvatarUrl(currentUser.username)}
              alt={currentUser.username}
              className="w-32 h-32 rounded-full border-4 border-indigo-500"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentUser.username}
              </h1>
              <p className="text-gray-600 mb-4">{currentUser.email}</p>
              
              <div className="flex gap-6 justify-center md:justify-start mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">
                    {currentUser.claimedCountries.length}
                  </div>
                  <div className="text-sm text-gray-600">Claimed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {currentUser.likedCountries.length}
                  </div>
                  <div className="text-sm text-gray-600">Liked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {currentUser.visitedCountries.length}
                  </div>
                  <div className="text-sm text-gray-600">Visited</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {currentUser.totalPoints}
                  </div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-start">
                <Link
                  to="/stats"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  View Stats
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Achievements</h2>
          {currentUser.achievements.length === 0 ? (
            <p className="text-gray-500">No achievements yet. Start claiming countries!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentUser.achievements.map((achievement: string, index: number) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3"
                >
                  <span className="text-3xl">{achievement.split(' ')[0]}</span>
                  <span className="font-semibold text-gray-800">
                    {achievement.substring(achievement.indexOf(' ') + 1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claimed Countries */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            👑 Your Claimed Countries ({currentUser.claimedCountries.length})
          </h2>
          {currentUser.claimedCountries.length === 0 ? (
            <p className="text-gray-500 mb-4">
              You haven't claimed any countries yet. Go to{' '}
              <Link to="/countries" className="text-indigo-600 hover:underline">
                Countries
              </Link>{' '}
              to start claiming!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentUser.claimedCountries.map((country: string) => (
                <Link
                  key={country}
                  to={`/countries/${country}`}
                  className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 text-center hover:bg-yellow-100 transition"
                >
                  <span className="text-lg">👑</span>
                  <div className="text-sm font-medium text-gray-800 mt-1">{country}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

