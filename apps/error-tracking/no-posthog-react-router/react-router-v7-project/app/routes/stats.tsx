import { Navigate } from 'react-router'
import { useAuth } from '~/context/AuthContext'
import { getAllUsers, getCurrentUser, getAvatarUrl } from '~/lib/utils/auth'
import type { Route } from './+types/stats'

export default function Stats() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const currentUser = getCurrentUser() || user
  const allUsers = getAllUsers()
  
  // Sort users by points for leaderboard
  const leaderboard = [...allUsers]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10)

  const userRank = leaderboard.findIndex((u) => u.id === currentUser.id) + 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">📊 Your Stats</h1>

        {/* Personal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl font-bold text-indigo-600 mb-2">
              {currentUser.claimedCountries.length}
            </div>
            <div className="text-gray-600">Countries Claimed</div>
            <div className="text-sm text-gray-500 mt-1">
              {((currentUser.claimedCountries.length / 195) * 100).toFixed(1)}% of the world
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl font-bold text-red-500 mb-2">
              {currentUser.likedCountries.length}
            </div>
            <div className="text-gray-600">Countries Liked</div>
            <div className="text-sm text-gray-500 mt-1">❤️ Your favorites</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-4xl font-bold text-yellow-500 mb-2">
              {currentUser.totalPoints}
            </div>
            <div className="text-gray-600">Total Points</div>
            <div className="text-sm text-gray-500 mt-1">
              Rank: #{userRank || 'Unranked'}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🏆 Leaderboard</h2>
          <div className="space-y-3">
            {leaderboard.map((u, index) => {
              const isCurrentUser = u.id === currentUser.id
              return (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isCurrentUser
                      ? 'bg-indigo-50 border-2 border-indigo-300'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-400 w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <img
                    src={getAvatarUrl(u.username)}
                    alt={u.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {u.username}
                      {isCurrentUser && <span className="ml-2 text-indigo-600">(You)</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {u.claimedCountries.length} claimed • {u.totalPoints} points
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-yellow-500">
                    {u.totalPoints}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fun Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Fun Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
              <div className="text-3xl mb-2">🌍</div>
              <div className="text-xl font-bold text-gray-900">
                {currentUser.visitedCountries.length} Countries Visited
              </div>
              <div className="text-sm text-gray-600 mt-1">
                (Fake passport stamps collected!)
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-xl font-bold text-gray-900">
                {currentUser.achievements.length} Achievements Unlocked
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Keep exploring to unlock more!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

